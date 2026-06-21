import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
const isProd = import.meta.env.PROD;
const PRODUCTION_SOCKET = 'https://quick-mart-q63b.onrender.com';
const API_URL = isProd ? PRODUCTION_SOCKET : (import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || PRODUCTION_SOCKET);

/**
 * Initialize Socket.io connection
 */
export function connectSocket(): Socket {
  if (socket) {
    return socket;
  }

  socket = io(`${API_URL}/orders`, {
    path: '/socket.io',
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
  });

  socket.on('connect', () => {
    console.log('Socket.io connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket.io disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket.io error:', error);
  });

  return socket;
}

/**
 * Get socket instance
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Disconnect socket
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Join order room for real-time tracking
 */
export function joinOrderRoom(orderId: string): void {
  if (!socket) {
    connectSocket();
  }

  socket?.emit('join_order_room', orderId);
}

/**
 * Leave order room
 */
export function leaveOrderRoom(orderId: string): void {
  socket?.emit('leave_order_room', orderId);
}

/**
 * Listen for order status updates
 */
export function onOrderStatusUpdate(
  callback: (data: { orderId: string; status: string; message?: string }) => void
): (() => void) | undefined {
  if (!socket) {
    connectSocket();
  }

  const listener = (data: any) => {
    callback(data);
  };

  socket?.on('order_status_changed', listener);

  // Return unsubscribe function
  return () => {
    socket?.off('order_status_changed', listener);
  };
}

/**
 * Listen for rider location updates
 */
export function onRiderLocationUpdate(
  callback: (data: {
    orderId: string;
    location: { lat: number; lng: number };
    speed?: number;
    timestamp: string;
  }) => void
): (() => void) | undefined {
  if (!socket) {
    connectSocket();
  }

  const listener = (data: any) => {
    callback(data);
  };

  socket?.on('rider_location_updated', listener);

  // Return unsubscribe function
  return () => {
    socket?.off('rider_location_updated', listener);
  };
}

/**
 * Listen for order confirmation
 */
export function onOrderConfirmed(
  callback: (data: { orderId: string; message?: string }) => void
): (() => void) | undefined {
  if (!socket) {
    connectSocket();
  }

  const listener = (data: any) => {
    callback(data);
  };

  socket?.on('order_confirmed', listener);

  // Return unsubscribe function
  return () => {
    socket?.off('order_confirmed', listener);
  };
}
