import { createStore } from "zustand/vanilla";

import type { OrderMenu } from "@/types/menus";

type MenuState = {
  menu: OrderMenu | null;
};

type MenuActions = {
  setMenu: (options: Partial<MenuState>) => void;
};

export type MenuStore = MenuState & MenuActions;

const defaultInitState: MenuState = {
  menu: null,
};

export const createMenuStore = (initState: MenuState = defaultInitState) => {
  return createStore<MenuStore>()((set) => ({
    ...initState,
    setMenu: (options) =>
      set((state) => ({
        ...state,
        ...options,
      })),
  }));
};
