import { FC, useEffect, useState } from 'react';

import HypeCard from '@/components/HypeCard';
import PeerCard from '@/components/PeerCard';
import Skeleton from '@/components/Skeleton';

import useHypeData from '@/app/hooks/use-hype-data';
import { apiHost } from '@/constant/config';
import { pointToHypeRatio } from '@/constant/constants';

import { PeersData } from '@/types/responses';

type Sort = 'market_cap' | 'fdv';

const processCoinData = (
  coins: PeersData,
  sort: Sort,
) => {
  const hypeCoin = coins.find((coin) => coin.symbol === 'HYPE');
  if (!hypeCoin) return [];

  const circulatingSupply = hypeCoin.circulating_supply;
  const totalSupply = hypeCoin.total_supply;
  const hypeValue = sort === 'fdv' ? hypeCoin.fdv : hypeCoin.market_cap;
  const peerCoins = coins.filter((coin) => coin.symbol !== 'HYPE');
  const allCoins = [
    {
      symbol: '$800/pt',
      // markPrice * 5.35 = 800
      fdv: (800 / pointToHypeRatio) * totalSupply,
      market_cap: (800 / pointToHypeRatio) * circulatingSupply,
      url: 'https://x.com/crypto_adair/status/1806748433593577833',
      image_url: '/images/crypto_adair.jpg',
    },
    ...peerCoins,
  ];

  return allCoins
    .sort((a, b) => a[sort] - b[sort])
    .map((coin) => ({
      key: coin.symbol,
      symbol: coin.symbol,
      price: (sort === 'fdv' ? coin.fdv : coin.market_cap) / (sort === 'fdv' ? totalSupply : circulatingSupply),
      multiple: (sort === 'fdv' ? coin.fdv : coin.market_cap) / hypeValue,
      url: coin.url,
      image_url: coin.image_url,
    }));
};

interface Props {
  data: ReturnType<typeof useHypeData>;
}

const Peers: FC<Props> = ({ data }) => {
  const [coins, setCoins] = useState<PeersData>([]);
  const [sort, setSort] = useState<Sort>('market_cap');

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

  return (
    <div>
      <h2 className='md:flex items-center justify-center text-white text-base mb-6'>
        <span className='block md:inline mr-2'>Price of</span>
        <HypeCard price={markPrice} />
        <div className='block md:flex items-center'>
          <span>with the</span>
          <select
            id='sort'
            name='sort'
            className='mx-2 inline-block bg-white/5 rounded-md border border-hl-light py-1.5 pl-3 pr-10 text-gray-300 ring-0 focus:ring-1 focus:border-hl-primary focus:ring-hl-primary sm:text-sm sm:leading-6'
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
          >
            <option value='market_cap'>Market cap</option>
            <option value='fdv'>FDV</option>
          </select>
          <span>of ...</span>
        </div>
      </h2>
      <section className='flex justify-center items-center flex-wrap'>
        {processCoinData(coins, sort).map((coinData) => (
          <PeerCard
            key={coinData.key}
            symbol={coinData.symbol}
            price={coinData.price}
            multiple={coinData.multiple}
            url={coinData.url}
            image_url={coinData.image_url}
          />
        ))}
      </section>
    </div>
  );
};

export default Peers;
