import { useEffect } from "react";

import { useSocket } from "./useSocket";

import { useMenuStore } from "@/providers/menu-store-provider";

export const useMenuSocket = (storeId: string) => {
  const { isConnected, transport } = useSocket();

  const { menus, isLoading, fetchMenus } = useMenuStore((state) => state);

  useEffect(() => {
    if (!isConnected) return;
    if (!storeId) return;

    fetchMenus(storeId);
  }, [fetchMenus, isConnected, storeId]);

  return { isConnected, isLoading, menus, transport };
};
