//урок 52
import { makeAutoObservable } from "mobx";
import type { NavigateFunction } from "react-router-dom";
import type { RootStore } from "../../store/rootStore";

export class TestRunPageVM {
  finishModalOpen = false;

  constructor(private root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get store() {
    return this.root.testRunStore;
  }

  get notification() {
    return this.root.notificationStore;
  }

  get finishText(): string {
    if (this.store.allAnswered) return "Хотите закончить тестирование?";
    return `Не все задания выполнены. Отвечено ${this.store.answeredCount} из ${this.store.totalCount}. Завершить тестирование?`;
  }

  init(testId: number) {
    this.store.start(testId);
  }

  openFinishModal() {
    if (this.store.showResult) return;
    this.finishModalOpen = true;
  }

  closeFinishModal() {
    this.finishModalOpen = false;
  }

  async requestFinish(navigate: NavigateFunction) {
    if (this.store.showResult) return;
    this.finishModalOpen = false;

    try {
      const res = await this.store.submit();

      if (res.mode === "navigate-result") {
        navigate(`/student/test/${this.store.testId}/result`, {
          replace: true,
          state: {
            earned: res.earned,
            max: res.max,
            timeSec: res.timeSec,
            attemptsLeft: res.attemptsLeft,
          },
        });
        return;
      }

    } catch (e: any) {
      const msg = e instanceof Error ? e.message : "Не удалось отправить ответы. Попробуйте ещё раз.";
      this.notification.push(msg, { tone: "error" });
    }
  }


  onTimerFinish(navigate: NavigateFunction) {
    if (!this.store.showResult) {
      void this.requestFinish(navigate);
    }
  }
}
