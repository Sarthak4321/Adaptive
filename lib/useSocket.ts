import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (userId: string | undefined) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Initialize socket connection
    const s = io({
      path: '/api/socket',
      addTrailingSlash: false,
    });

    s.on('connect', () => {
      console.log('Socket: Client connected to signaling server:', s.id);
      setIsConnected(true);
      console.log('Socket: Emitting join for user:', userId);
      s.emit('join', userId);
    });

    s.on('disconnect', (reason) => {
      console.warn('Socket: Client disconnected:', reason);
      setIsConnected(false);
    });

    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [userId]);

  return { socket, isConnected };
};
