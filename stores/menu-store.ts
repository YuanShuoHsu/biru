import { createStore } from "zustand/vanilla";

import { menuSocket } from "@/app/socket";

import { type Menu } from "@/types/menu";

type MenuState = {
  isLoading: boolean;
  menus: Menu[];
};

type MenuActions = {
  fetchMenus: (storeId: string) => void;
  setMenus: (menus: Menu[]) => void;
};

export type MenuStore = MenuState & MenuActions;

export const defaultInitState: MenuState = {
  isLoading: false,
  menus: [],
};

export const createMenuStore = (initState: MenuState = defaultInitState) => {
  return createStore<MenuStore>()((set) => ({
    ...initState,
    fetchMenus: (storeId: string) => {
      set({ isLoading: true });
      const targetId = storeId || "48c533dc-97fd-404b-b435-5692f03cb123";

      menuSocket.emit("findAllMenus", targetId, (res: Menu[]) => {
        set({ menus: res, isLoading: false });
      });
    },
    setMenus: (menus) => set({ menus }),
  }));
};
