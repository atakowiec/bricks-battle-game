import { useContext } from 'react';
import { SocketContext } from './socketContext.tsx';

export default function useSocket() {
  return useContext(SocketContext)!;
}