import { FC, useEffect, useState } from 'react';

import HypeCard from '@/components/HypeCard';
import PeerCard from '@/components/PeerCard';
import Skeleton from '@/components/Skeleton';

import useHypeData from '@/app/hooks/use-hype-data';
import useTokenInfo from '@/app/hooks/use-token-info';
import { apiHost } from '@/constant/config';
import { pointToHypeRatio } from '@/constant/constants';

import { PeersData } from '@/types/responses';

interface Props {
  data: ReturnType<typeof useHypeData>;
  tokenInfo: ReturnType<typeof useTokenInfo>['tokenInfo'];
}

const Peers: FC<Props> = ({ data, tokenInfo }) => {
  const [coins, setCoins] = useState<PeersData>([]);

  useEffect(() => {
    fetch(`${apiHost}/peers?coin=hype`)
      .then<PeersData>((resp) => resp.json())
      .then((data) => {
        setCoins(data);
      })
      .catch(() => console.error('Failed to fetch peer coins.'));
  }, []);

  if (!data || !coins.length || !tokenInfo)
    return <Skeleton className='flex w-full h-40' />;

  const markPrice = parseFloat(data.markPx);
  const totalSupply = parseFloat(tokenInfo.totalSupply);
  const hypeMarketCap = markPrice * totalSupply;
  const pointValue = markPrice * pointToHypeRatio;

  return (
    <div>
      <h2 className='md:flex items-center justify-center text-white text-base mb-6'>
        <span className='block md:inline mr-2'>Price of</span>
        <HypeCard price={markPrice} />
        <span className='block md:inline'>with the market cap of ...</span>
      </h2>
      <section className='flex justify-center items-center flex-wrap'>
        {coins.map((coin) => {
          const isAdair = coin.symbol === '$800/pt';
          const imageUrl = isAdair
            ? '/images/crypto_adair.jpg'
            : coin.image_url;
          const price = isAdair
            ? 800 / pointToHypeRatio
            : coin.fdv / totalSupply;
          const multiple = isAdair
            ? 800 / pointValue
            : coin.fdv / hypeMarketCap;

          return (
            <PeerCard
              key={coin.symbol}
              symbol={coin.symbol}
              price={price}
              multiple={multiple}
              url={coin.url}
              image_url={imageUrl}
            />
          );
        })}
      </section>
    </div>
  );
};

export default Peers;
