import { createStore } from "zustand/vanilla";

import type { I18nDict } from "@/types/i18n";

type I18nState = {
  dict: I18nDict;
};

type I18nActions = {
  setDict: (dict: I18nDict) => void;
};

export type I18nStore = I18nState & I18nActions;

export const createI18nStore = (initState: I18nState) => {
  return createStore<I18nStore>()((set) => ({
    ...initState,
    setDict: (dict) => set({ dict }),
  }));
};
