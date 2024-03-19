import { createContext, ReactNode, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/Socket.ts';
import useNotifications from '../hooks/useNotifications.ts';

export const SocketContext = createContext<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { addNotification } = useNotifications();

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = useMemo(() => {
    const socket = io('http://localhost:3000', {
      autoConnect: false,
      withCredentials: true,
      transports: ['websocket'],
    });

    socket.on('exception', (error) => addNotification(error, 'error'));

    return socket;
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};