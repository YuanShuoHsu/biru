import { createStore } from "zustand/vanilla";

import { socket } from "@/app/socket";

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
      socket.emit("findAllMenus", storeId, (res: Menu[]) => {
        console.log("Fetched menus via Store:", res);
        set({ menus: res, isLoading: false });
      });
    },
    setMenus: (menus) => set({ menus }),
  }));
};
