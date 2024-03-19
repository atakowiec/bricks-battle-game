import { createContext, ReactNode, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/Socket.ts';

export const SocketContext = createContext<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket : Socket<ServerToClientEvents, ClientToServerEvents> = useMemo(() => {
    return io('http://localhost:3000', {
      autoConnect: false,
      withCredentials: true,
      transports: ["websocket"]
    });
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};