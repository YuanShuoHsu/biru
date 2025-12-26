// https://socket.io/how-to/use-with-nextjs

"use client";

import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_NEST_URL, {
  transports: ["websocket"],
});
