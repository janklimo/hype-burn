import { useEffect, useState } from 'react';

interface Order {
  coin: string;
  side: string;
  limitPx: string;
  sz: string;
  oid: number;
  timestamp: number;
  origSz: string;
  cloid?: string;
}

const useOrderData = (user: string) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;

    const socket = new WebSocket('wss://api.hyperliquid.xyz/ws');

    socket.addEventListener('open', () => {
      socket.send(
        JSON.stringify({
          method: 'subscribe',
          subscription: { type: 'webData2', user },
        }),
      );
    });

    socket.addEventListener('message', (event) => {
      const messageData = JSON.parse(event.data);

      if (messageData.channel === 'webData2' && messageData.data.openOrders) {
        setOrders(messageData.data.openOrders);
      }
    });

    socket.addEventListener('error', (error) => {
      console.error('WebSocket Error (Order Data): ', error);
    });

    return () => {
      socket.close();
    };
  }, [user]);

  return orders;
};

export default useOrderData;
