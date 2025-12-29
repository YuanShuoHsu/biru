"use client";

import { useState } from "react";

import { useMenuSocket } from "@/hooks/useMenuSocket";

const WsTestPage = () => {
  const [storeId, setStoreId] = useState("");

  const { isLoading, isConnected, menus, transport } = useMenuSocket(storeId);

  return (
    <div>
      <h1>WebSocket Test</h1>
      <div style={{ marginBottom: 20 }}>
        <label>
          Store ID:{" "}
          <input
            type="text"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            placeholder="Enter Store ID"
            style={{ padding: "4px 8px", border: "1px solid #ccc" }}
          />
        </label>
      </div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      {isLoading ? (
        <p>Loading menus...</p>
      ) : (
        <ul>
          {menus.map((menu) => (
            <li key={menu.id}>{JSON.stringify(menu)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WsTestPage;
