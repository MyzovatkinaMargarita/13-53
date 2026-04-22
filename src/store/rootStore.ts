// уроки 40-41
import { AuthStore } from "./domains/auth/authStore";
import { TestsCatalogStore } from "./domains/tests/testsCatalogStore";
import { TestRunStore } from "./domains/tests/testRunStore";
import { ModalStore } from "./ui/modalStore";
import { NotificationStore } from "./ui/notificationStore";

export class RootStore {
  authStore: AuthStore;
  testsCatalogStore: TestsCatalogStore;
  testRunStore: TestRunStore;
  modalStore: ModalStore;
  notificationStore: NotificationStore;

  constructor() {
    this.authStore = new AuthStore();
    this.testsCatalogStore = new TestsCatalogStore();
    this.testRunStore = new TestRunStore();
    this.modalStore = new ModalStore();
    this.notificationStore = new NotificationStore();
  }
}

export const rootStore = new RootStore();
export type RootStoreType = RootStore;
