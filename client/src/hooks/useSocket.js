import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { API_URL } from '../utils/api';

export const useSocket = (token) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;
    
    // Connect to WS with auth token
    const newSocket = io(API_URL.replace('/api', ''), {
      auth: { token }
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [token]);

  return socket;
};
