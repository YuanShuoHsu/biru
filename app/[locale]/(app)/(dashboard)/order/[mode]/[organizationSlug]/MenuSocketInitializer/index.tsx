"use client";

import { useLocale } from "next-intl";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

import { emitMenuWithAck, menuSocket } from "@/app/socket";

import { useSocketConnection } from "@/hooks/useSocketConnection";

import { useMenuStore } from "@/providers/menu-store-provider";

import type { OrderMenu } from "@/types/menus";

import { getErrorMessage } from "@/utils/errors";

interface MenuSocketInitializerProps {
  organizationId: string;
}

const MenuSocketInitializer = ({
  organizationId,
}: MenuSocketInitializerProps) => {
  const locale = useLocale();

  const { setMenu } = useMenuStore((state) => state);

  const { enqueueSnackbar } = useSnackbar();

  const { isConnected } = useSocketConnection(menuSocket);

  useEffect(() => {
    if (!isConnected) return;

    const initMenus = async () => {
      setMenu({ isLoading: true });

      try {
        const response = await emitMenuWithAck<OrderMenu | null>("orderMenu", {
          organizationId,
          lang: locale,
        });

        setMenu({ menu: response });
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: "error" });
      } finally {
        setMenu({ isLoading: false });
      }
    };

    initMenus();

    menuSocket.on("menuUpdated", initMenus);

    return () => {
      menuSocket.off("menuUpdated", initMenus);
    };
  }, [enqueueSnackbar, isConnected, locale, organizationId, setMenu]);

  return null;
};

export default MenuSocketInitializer;
