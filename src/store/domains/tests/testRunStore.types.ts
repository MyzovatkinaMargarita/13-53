// урок 51
import type { AttemptReviewDto, TestResponse } from "../../../api/data-contracts";
import type { AnswersMap } from "../../types";

export interface TestRunStoreState {
  testId: number | null;
  attemptId: number | null;
  test: TestResponse | null;
  allQuestions: any[];
  answers: AnswersMap;
  review: AttemptReviewDto | null;
  detail: any | null;
  loadState: "loading" | "ready" | "error";
  loadError: string;
  showResult: boolean;
  timeLeftSec: number;
}

export type SubmitResult =
  | { mode: "inline-review" }
  | {
      mode: "navigate-result";
      earned: number;
      max: number;
      timeSec: number;
      attemptsLeft: number | null;
    };
