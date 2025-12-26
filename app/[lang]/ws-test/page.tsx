"use client";

import { useMenuSocket } from "@/hooks/useMenuSocket";

const WsTestPage = () => {
  const { menus, isConnected, transport } = useMenuSocket();

  return (
    <div style={{ padding: 20 }}>
      <h1>WebSocket Test</h1>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <ul>
        {menus.map((menu) => (
          <li key={menu.id}>{JSON.stringify(menu)}</li>
        ))}
      </ul>
    </div>
  );
};

export default WsTestPage;
