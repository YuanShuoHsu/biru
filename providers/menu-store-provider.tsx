"use client";

import { useParams } from "next/navigation";
import { type ReactNode, createContext, useContext, useState } from "react";
import { type StoreApi, useStore } from "zustand";

import { API_ORDER_MODE } from "@/constants/orderMode";

import { type MenuStore, createMenuStore } from "@/stores/menu-store";

import type { OrderMenu } from "@/types/menus";
import type { RouteParams } from "@/types/routeParams";

import { scopeMenuToMode } from "@/utils/menus";

const MenuStoreContext = createContext<StoreApi<MenuStore> | undefined>(
  undefined,
);

interface MenuStoreProviderProps {
  children: ReactNode;
  initialMenu: OrderMenu | null;
}

export const MenuStoreProvider = ({
  children,
  initialMenu,
}: MenuStoreProviderProps) => {
  const { mode } = useParams<RouteParams<"mode">>();

  const [store] = useState(() =>
    createMenuStore({
      isLoading: false,
      menu: initialMenu && scopeMenuToMode(initialMenu, API_ORDER_MODE[mode]),
    }),
  );

  return (
    <MenuStoreContext.Provider value={store}>
      {children}
    </MenuStoreContext.Provider>
  );
};

export const useMenuStore = <T,>(selector: (store: MenuStore) => T): T => {
  const menuStoreContext = useContext(MenuStoreContext);

  if (!menuStoreContext)
    throw new Error(`useMenuStore must be used within MenuStoreProvider`);

  return useStore(menuStoreContext, selector);
};
