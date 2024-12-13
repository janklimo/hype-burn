import { FC, useEffect, useState } from 'react';

import HypeCard from '@/components/HypeCard';
import PeerCard from '@/components/PeerCard';
import Skeleton from '@/components/Skeleton';

import useHypeData from '@/app/hooks/use-hype-data';
import useTokenInfo from '@/app/hooks/use-token-info';
import { apiHost } from '@/constant/config';
import { pointToHypeRatio } from '@/constant/constants';

import { PeersData } from '@/types/responses';

type Sort = 'market_cap' | 'fdv';
const processCoinData = (
  coins: PeersData,
  markPrice: number,
  circulatingSupply: number,
  totalSupply: number,
  sort: Sort,
) => {
  const hypeFdv = markPrice * totalSupply;

  const allCoins = [
    {
      symbol: '$800/pt',
      fdv: (800 / pointToHypeRatio) * totalSupply,
      market_cap: (800 / pointToHypeRatio) * circulatingSupply,
      url: 'https://x.com/crypto_adair/status/1806748433593577833',
      image_url: '/images/crypto_adair.jpg',
    },
    ...coins,
  ];

  return allCoins
    .sort((a, b) => a[sort] - b[sort])
    .map((coin) => ({
      key: coin.symbol,
      symbol: coin.symbol,
      price: coin.fdv / totalSupply,
      multiple: coin.fdv / hypeFdv,
      url: coin.url,
      image_url: coin.image_url,
    }));
};

interface Props {
  data: ReturnType<typeof useHypeData>;
  tokenInfo: ReturnType<typeof useTokenInfo>['tokenInfo'];
}

const Peers: FC<Props> = ({ data, tokenInfo }) => {
  const [coins, setCoins] = useState<PeersData>([]);
  const [sort, setSort] = useState<Sort>('fdv');

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
  const circulatingSupply = parseFloat(tokenInfo.circulatingSupply);
  const totalSupply = parseFloat(tokenInfo.totalSupply);

  return (
    <div>
      <h2 className='md:flex items-center justify-center text-white text-base mb-6'>
        <span className='block md:inline mr-2'>Price of</span>
        <HypeCard price={markPrice} />
        <span className='block md:inline'>with the FDV of ...</span>
      </h2>
      <section className='flex justify-center items-center flex-wrap'>
        {processCoinData(
          coins,
          markPrice,
          circulatingSupply,
          totalSupply,
          sort,
        ).map((coinData) => (
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
