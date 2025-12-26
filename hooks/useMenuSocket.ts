import { useEffect, useState } from "react";

import { useSocket } from "./useSocket";

import { type Menu } from "@/types/menu";

export const useMenuSocket = () => {
  const [menus, setMenus] = useState<Menu[]>([]);

  const { socket, isConnected, transport } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    socket.emit("findAllMenus", {}, (res: Menu[]) => {
      console.log("Fetched menus:", res);
      setMenus(res);
    });
  }, [isConnected, socket]);

  return { menus, isConnected, transport };
};
