// https://socket.io/how-to/use-with-nextjs

"use client";

import { useEffect, useState } from "react";

import { socket } from "@/app/socket";

import { type Menu } from "@/types/menu";

const WsTestPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });

      setMessages((prev) => [...prev, `✅ Connected: ${socket.id}`]);

      socket.emit("findAllMenus", {}, (res: Menu[]) => {
        console.log("findAllMenus data:", res);
        setMessages((prev) => [
          ...prev,
          `findAllMenus -> ${JSON.stringify(res)}`,
        ]);
      });
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setTransport("N/A");

      setMessages((prev) => [...prev, "❌ Disconnected"]);
    };

    if (socket.connected) onConnect();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Test</h1>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
};

export default WsTestPage;
