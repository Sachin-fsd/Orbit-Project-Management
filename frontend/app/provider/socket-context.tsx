import { createContext, useContext } from "react";
import { io as clientIo, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api-v1", "") || "http://localhost:5000";

export const socket = clientIo(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

const SocketContext = createContext<Socket>(socket);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => (
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);

export const useSocket = () => useContext(SocketContext);