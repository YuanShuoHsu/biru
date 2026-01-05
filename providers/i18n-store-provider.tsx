import { type ReactNode, createContext, useContext, useState } from "react";
import { type StoreApi, useStore } from "zustand";

import { type I18nStore, createI18nStore } from "@/stores/i18n-store";

import type { I18nDict } from "@/types/i18n";

const I18nStoreContext = createContext<StoreApi<I18nStore> | undefined>(
  undefined,
);

interface I18nStoreProviderProps {
  children: ReactNode;
  dict: I18nDict;
}

export const I18nStoreProvider = ({
  children,
  dict,
}: I18nStoreProviderProps) => {
  const [store] = useState(() => createI18nStore({ dict }));

  return (
    <I18nStoreContext.Provider value={store}>
      {children}
    </I18nStoreContext.Provider>
  );
};

export const useI18nStore = <T,>(selector: (store: I18nStore) => T): T => {
  const i18nStoreContext = useContext(I18nStoreContext);

  if (!i18nStoreContext) {
    throw new Error(`useI18nStore must be used within I18nStoreProvider`);
  }

  return useStore(i18nStoreContext, selector);
};

export type { I18nDict };
