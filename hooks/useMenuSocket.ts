import { useSnackbar } from "notistack";
import { useEffect } from "react";

import { useSocketConnection } from "./useSocketConnection";

import { menuSocket } from "@/app/socket";

import { useMenuStore } from "@/providers/menu-store-provider";

import { getErrorMessage } from "@/utils/errors";

export const useMenuSocket = (storeId: string) => {
  const { menus, isLoading, setMenu } = useMenuStore((state) => state);
  const { enqueueSnackbar } = useSnackbar();
  const { isConnected, transport } = useSocketConnection(menuSocket);

  useEffect(() => {
    if (!isConnected) return;

    const initMenus = async () => {
      setMenu({ isLoading: true });

      try {
        const response = await menuSocket
          .timeout(5000)
          .emitWithAck("findAllMenus", storeId);

        setMenu({ menus: response });
      } catch (error) {
        setMenu({ menus: [] });
        enqueueSnackbar(getErrorMessage(error), { variant: "error" });
      } finally {
        setMenu({ isLoading: false });
      }
    };

    initMenus();
  }, [enqueueSnackbar, isConnected, setMenu, storeId]);

  return { isConnected, isLoading, menus, transport };
};
