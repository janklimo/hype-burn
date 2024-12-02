import { FC, useEffect, useState } from 'react';

import HypeCard from '@/components/HypeCard';
import PeerCard from '@/components/PeerCard';
import Skeleton from '@/components/Skeleton';

import useWebSocketData from '@/app/hooks/use-websocket-data';
import { apiHost } from '@/constant/config';

import { PeersData } from '@/types/responses';

interface Props {
  data: ReturnType<typeof useWebSocketData>;
}

const Peers: FC<Props> = ({ data }) => {
  const [coins, setCoins] = useState<PeersData>([]);

  useEffect(() => {
    fetch(`${apiHost}/peers?coin=hype`)
      .then<PeersData>((resp) => resp.json())
      .then((data) => {
        setCoins(data);
      })
      .catch(() => console.error('Failed to fetch peer coins.'));
  }, []);

  if (!data || !coins.length) return <Skeleton className='flex w-full h-40' />;

  const markPrice = parseFloat(data.markPx);
  const supply = parseFloat(data.circulatingSupply);
  const purrMarketCap = markPrice * supply;

  return (
    <div>
      <h2 className='md:flex items-center justify-center text-white text-base mb-6'>
        <span className='block md:inline mr-2'>Price of</span>
        <HypeCard price={markPrice} />
        <span className='block md:inline'>with the market cap of ...</span>
      </h2>
      <section className='flex justify-center items-center flex-wrap'>
        {coins.map((coin) => (
          <PeerCard
            key={coin.symbol}
            symbol={coin.symbol}
            price={coin.market_cap / supply}
            multiple={coin.market_cap / purrMarketCap}
            url={coin.url}
            image_url={coin.image_url}
          />
        ))}
      </section>
    </div>
  );
};

export default Peers;
