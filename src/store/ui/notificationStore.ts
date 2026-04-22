// урок 45
import { makeAutoObservable } from "mobx";

type NotificationTone = "success" | "error" | "info" | "warning";

type Notification = {
  id: number;
  message: string;
  tone: NotificationTone;
};

export class NotificationStore {
  list: Notification[] = [];
  private nextId = 1;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  push(message: string, options?: { tone?: NotificationTone; duration?: number }) {
    const tone = options?.tone ?? "info";
    const id = this.nextId++;
    const notification: Notification = { id, message, tone };
    this.list.push(notification);

    const duration = options?.duration ?? 3000;
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: number) {
    this.list = this.list.filter((n) => n.id !== id);
  }

  clear() {
    this.list = [];
  }
}
