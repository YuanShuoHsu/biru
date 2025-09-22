"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

type CreateEventPayload = { name: string };
type CreateEventAck = unknown;
type FindAllEventsAck = unknown;

export default function WsTestPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket: Socket = io("https://stage-api.birucoffee.com", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setMessages((prev) => [...prev, `✅ Connected: ${socket.id}`]);

      const payload: CreateEventPayload = { name: "latte" };
      socket.emit("createEvent", payload, (res: CreateEventAck) => {
        setMessages((prev) => [
          ...prev,
          `createEvent -> ${JSON.stringify(res)}`,
        ]);
      });

      socket.emit("findAllEvents", null, (res: FindAllEventsAck) => {
        setMessages((prev) => [
          ...prev,
          `findAllEvents -> ${JSON.stringify(res)}`,
        ]);
      });
    });

    socket.on("disconnect", () => {
      setMessages((prev) => [...prev, "❌ Disconnected"]);
    });

    socket.on("connect_error", (err: Error) => {
      setMessages((prev) => [...prev, `⚠️ Connect error: ${err.message}`]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const ping = () => {
    socketRef.current?.emit("ping", null, (res: unknown) => {
      setMessages((prev) => [...prev, `ping -> ${JSON.stringify(res)}`]);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>WebSocket Test</h1>
      <button onClick={ping} style={{ marginBottom: 12 }}>
        Ping
      </button>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
