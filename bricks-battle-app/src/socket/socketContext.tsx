import { createContext, ReactNode, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/Socket.ts';
import useNotifications from '../hooks/useNotifications.ts';
import { GamePacket } from '@shared/Game.ts';
import { useDispatch } from 'react-redux';
import { gameActions } from '../store/gameSlice.ts';
import { AppDispatch } from '../store';

export const SocketContext = createContext<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { addNotification } = useNotifications();
  const dispatch = useDispatch<AppDispatch>();

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = useMemo(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3000', {
      autoConnect: false,
      withCredentials: true,
      transports: ['websocket'],
    });

    socket.on('exception', (error) => addNotification(error, 'error'));

    socket.on('notification', (message) => addNotification(message, 'info'));

    socket.on('set_game', (game: GamePacket) => dispatch(gameActions.setGame(game)));

    socket.on('game_update', (game: GamePacket) => dispatch(gameActions.updateGame(game)));

    return socket;
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};