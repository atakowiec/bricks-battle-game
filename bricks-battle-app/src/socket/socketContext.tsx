import { createContext, ReactNode, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/Socket.ts';

export const SocketContext = createContext<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket : Socket<ServerToClientEvents, ClientToServerEvents> = useMemo(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    return socket;
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};