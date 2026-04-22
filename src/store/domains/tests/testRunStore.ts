//уроки 50, 51, 52
import { makeAutoObservable, runInAction } from "mobx";
import { apiClient } from "../../../api/apiClient";
import type { TestResponse, StudentTestSummaryDto, AttemptReviewDto, TestResultDetailResponse } from "../../../api/data-contracts";
import type { AnswersMap, Question } from "../../../components/tests/QuestionBlock";
import type { SubmitResult } from "./testRunStore.types";
import { mapQuestionDto } from "./questionsMappers";

export class TestRunStore {

  testId: number | null = null;
  attemptId: number | null = null;
  test: TestResponse | null = null;
  allQuestions: Question[] = [];
  answers: AnswersMap = {};
  review: AttemptReviewDto | null = null;
  detail: TestResultDetailResponse | null = null;
  loadState: "loading" | "ready" | "error" = "loading";
  loadError = "";
  showResult = false;
  timeLeftSec = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }


  get durationSec(): number {
    const minutes = (this.test as any)?.durationMinutes;
    if (typeof minutes === "number" && Number.isFinite(minutes) && minutes > 0) {
      return Math.floor(minutes * 60);
    }
    return 600;
  }

  get spentSec(): number {
    return this.durationSec - this.timeLeftSec;
  }

  get questions(): Question[] {
    if (this.testId == null) return [];
    return this.allQuestions.filter((q) => q.testId === this.testId);
  }

  get answeredCount(): number {
    return Object.values(this.answers).filter((a) => {
      if (!a) return false;
      if (a.type === "single") return typeof a.value === "number";
      if (a.type === "multiple") return Array.isArray(a.value) && a.value.length > 0;
      if (a.type === "text") return typeof a.value === "string" && a.value.trim() !== "";
      return false;
    }).length;
  }

  get totalCount(): number {
    return this.questions.length;
  }

  get allAnswered(): boolean {
    return this.totalCount > 0 && this.answeredCount === this.totalCount;
  }

  get reviewByQuestionId() {
    const items = this.review?.items ?? [];
    return new Map(items.map((it) => [it.questionId!, it]));
  }

  get results() {
    const map = this.reviewByQuestionId;
    return this.questions.map((q) => {
      const it = map.get(q.id);
      return {
        earned: it?.earned ?? 0,
        max: it?.maxScore ?? q.score,
      };
    });
  }

  get totalScore(): number {
    return this.results.reduce((sum, r) => sum + r.earned, 0);
  }

  get maxScore(): number {
    return this.results.reduce((sum, r) => sum + r.max, 0);
  }

  
  setTimeLeftSec(value: number) {
    this.timeLeftSec = value;
  }

  setAnswer(questionId: number, value: string | string[] | number) {
    const prev = this.answers[questionId];
    if (!prev) return;
    this.answers = {
      ...this.answers,
      [questionId]: {
        ...prev,
        value,
      },
    };
  }

  reset() {
    this.testId = null;
    this.attemptId = null;
    this.test = null;
    this.allQuestions = [];
    this.answers = {};
    this.review = null;
    this.detail = null;
    this.loadState = "loading";
    this.loadError = "";
    this.showResult = false;
    this.timeLeftSec = 0;
  }

  async start(testId: number) {
    this.reset();
    this.testId = testId;
    this.loadState = "loading";
    this.loadError = "";

    try {

      const [testRes, questionsRes] = await Promise.all([
        apiClient.testsDetail(testId),
        apiClient.questionList({ testId }),
      ]);

      const test = testRes.data as TestResponse;
      const questionsDto = questionsRes.data ?? [];
      const mappedQuestions = questionsDto.map((q) => mapQuestionDto(q, testId));


      const initial: AnswersMap = {};
      for (const q of mappedQuestions) {
        initial[q.id] = {
          type: q.type,
          value: q.type === "multiple" ? [] : q.type === "text" ? "" : null,
        };
      }

      runInAction(() => {
        this.test = test;
        this.allQuestions = mappedQuestions;
        this.timeLeftSec = this.durationSec;
        this.answers = initial;
        this.loadState = "ready";
      });


      await this.ensureAttempt();
    } catch (e: any) {
      runInAction(() => {
        this.loadError = e?.response?.data?.message || e?.message || "Ошибка загрузки теста";
        this.loadState = "error";
      });
    }
  }


  private async ensureAttempt(): Promise<number> {
    if (this.testId == null) throw new Error("testId отсутствует");
    if (this.attemptId != null) return this.attemptId;

    const pickActiveFromSummary = async (): Promise<number | null> => {
      const summaryRes = await apiClient.studentTestsSummaryList();
      const summary = summaryRes.data as StudentTestSummaryDto[];
      const row = summary?.find((x) => x.testId === this.testId);
      if (!row || !row.hasActiveAttempt) return null;
      const id = row.activeAttemptId ?? null;
      return typeof id === "number" ? id : null;
    };


    const active = await pickActiveFromSummary();
    if (active != null) {
      runInAction(() => {
        this.attemptId = active;
      });
      return active;
    }


    try {
      await apiClient.attemptsCreate({ testId: this.testId });
    } catch (e: any) {
      const status = e?.response?.status;
      if (status !== 400 && status !== 409) throw e;
    }

  
    const afterCreate = await pickActiveFromSummary();
    if (afterCreate == null) {
      throw new Error("Не удалось получить activeAttemptId после начала попытки");
    }

    runInAction(() => {
      this.attemptId = afterCreate;
    });
    return afterCreate;
  }

  private async sendAllAnswers() {
    if (this.testId == null) throw new Error("testId отсутствует");
    const attemptId = await this.ensureAttempt();

    for (const q of this.questions) {
      const a = this.answers[q.id];
      if (!a) continue;

      if (a.type === "text") {
        const text = typeof a.value === "string" ? a.value : "";
        await apiClient.studentAnswersCreate({
          attemptId,
          questionId: q.id,
          userTextAnswers: text.trim() === "" ? null : text,
          userSelectedOptions: null,
        });
        continue;
      }

      if (a.type === "single") {
        const selected = typeof a.value === "number" ? [a.value] : [];
        await apiClient.studentAnswersCreate({
          attemptId,
          questionId: q.id,
          userSelectedOptions: selected,
          userTextAnswers: null,
        });
        continue;
      }


      const selected = Array.isArray(a.value) ? a.value : [];
      await apiClient.studentAnswersCreate({
        attemptId,
        questionId: q.id,
        userSelectedOptions: selected,
        userTextAnswers: null,
      });
    }
  }

  private async finishAttempt() {
    const attemptId = await this.ensureAttempt();
    await apiClient.attemptsUpdate({ id: attemptId });
  }

  private async fetchReview(): Promise<AttemptReviewDto> {
    const attemptId = await this.ensureAttempt();
    const res = await apiClient.attemptsReviewList(attemptId);
    const review = res.data as AttemptReviewDto;
    runInAction(() => {
      this.review = review;
    });
    return review;
  }

  private async fetchTestDetail(): Promise<TestResultDetailResponse> {
    if (this.testId == null) throw new Error("testId отсутствует");
    const res = await apiClient.testResultsTestDetail(this.testId);
    const detail = res.data as TestResultDetailResponse;
    runInAction(() => {
      this.detail = detail;
    });
    return detail;
  }


  

  async submit(): Promise<SubmitResult> {
    if (this.showResult) return { mode: "inline-review" };
    if (this.testId == null) throw new Error("testId отсутствует");

    await this.sendAllAnswers();
    await this.finishAttempt();

    const review = await this.fetchReview();

    if (review.canShowReview) {
      runInAction(() => {
        this.showResult = true;
      });
      return { mode: "inline-review" };
    }

    const detail = await this.fetchTestDetail();

    return {
      mode: "navigate-result",
      earned: review.score ?? 0,
      max: review.maxScore ?? detail.maxScore ?? 0,
      timeSec: this.spentSec,
      attemptsLeft: detail.attemptsLeft ?? null,
    };
  }
}
