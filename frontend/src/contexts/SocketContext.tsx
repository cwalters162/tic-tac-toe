import { createContext } from "react";

export const socket = new WebSocket("ws://localhost:162");
export const SocketContext = createContext(socket);
