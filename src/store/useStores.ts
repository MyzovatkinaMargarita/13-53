// урок 41
import { useContext } from "react";
import { StoreContext } from "./StoreProvider";

export function useStores() {
  const stores = useContext(StoreContext);
  if (!stores) {
    throw new Error("StoreProvider не подключён. Оберни приложение в <StoreProvider>.");
  }
  return stores;
}
