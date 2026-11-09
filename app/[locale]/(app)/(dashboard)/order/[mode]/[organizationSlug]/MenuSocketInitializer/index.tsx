"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

import { emitMenuWithAck, menuSocket } from "@/app/socket";

import { API_ORDER_MODE } from "@/constants/orderMode";

import { useSocketConnection } from "@/hooks/useSocketConnection";

import { useMenuStore } from "@/providers/menu-store-provider";

import type { OrderMenu } from "@/types/menus";
import type { RouteParams } from "@/types/routeParams";

import { getErrorMessage } from "@/utils/errors";
import { scopeMenuToMode } from "@/utils/menus";

interface MenuSocketInitializerProps {
  organizationId: string;
}

const MenuSocketInitializer = ({
  organizationId,
}: MenuSocketInitializerProps) => {
  const locale = useLocale();
  const { mode } = useParams<RouteParams<"mode">>();
  const apiMode = API_ORDER_MODE[mode];

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

        setMenu({ menu: response && scopeMenuToMode(response, apiMode) });
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
      menuSocket.emit("leaveOrderMenu", { organizationId });
    };
  }, [apiMode, enqueueSnackbar, isConnected, locale, organizationId, setMenu]);

  return null;
};

export default MenuSocketInitializer;
