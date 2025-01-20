import { useEffect, useState } from 'react';

interface Balance {
  coin: string;
  token: number;
  total: string;
  hold: string;
  entryNtl: string;
}

interface SpotState {
  balances: Balance[];
}

interface WebData {
  spotState: SpotState;
}

interface MessageData {
  channel: string;
  data: WebData;
}

export interface Balances {
  USDC: number;
  HYPE: number;
}

const useAssistanceFundBalances = () => {
  const [balances, setBalances] = useState<Balances>({
    USDC: 0,
    HYPE: 0,
  });

  useEffect(() => {
    const socket = new WebSocket('wss://api.hyperliquid.xyz/ws');

    // Listen for the connection to open and send the message
    socket.addEventListener('open', () => {
      // Send the message to the server
      socket.send(
        JSON.stringify({
          method: 'subscribe',
          subscription: {
            type: 'webData2',
            user: '0xfefefefefefefefefefefefefefefefefefefefe',
          },
        }),
      );
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
      const messageData: MessageData = JSON.parse(event.data);

      if (messageData.channel === 'webData2') {
        const rawBalances = messageData.data.spotState.balances;
        const usdcBalance = rawBalances.find(
          (balance) => balance.coin === 'USDC',
        );
        const hypeBalance = rawBalances.find(
          (balance) => balance.coin === 'HYPE',
        );

        setBalances({
          USDC: parseFloat(usdcBalance?.total || '0'),
          HYPE: parseFloat(hypeBalance?.total || '0'),
        });
      }
    });

    // Handle any errors that occur
    socket.addEventListener('error', (error) => {
      console.error('WebSocket Error: ', error);
    });

    // Clean up function
    return () => {
      socket.close();
    };
  }, []);

  return balances;
};

export default useAssistanceFundBalances;
