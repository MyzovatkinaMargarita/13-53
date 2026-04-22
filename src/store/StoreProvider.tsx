// урок 41
import { createContext, ReactNode } from "react";
import { rootStore, type RootStoreType } from "./rootStore";

export const StoreContext = createContext<RootStoreType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>;
}
