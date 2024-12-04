import Image from 'next/image';
import { FC } from 'react';

interface Props {
  price: number;
}

const HypeCard: FC<Props> = ({ price }) => {
  return (
    <a
      href='https://www.coingecko.com/en/coins/hyperliquid'
      target='_blank'
      rel='noopener noreferrer'
      className='inline-flex items-center cursor-newtab bg-hl-light py-1 px-2 rounded-2xl mr-2 my-1 md:my-0 hover:bg-primary-900 duration-200 transition-colors'
    >
      <div className='relative w-6 inline-block mr-1'>
        <Image
          src='https://coin-images.coingecko.com/coins/images/50882/large/hyperliquid.jpg?1729431300'
          width={64}
          height={64}
          priority
          className='rounded-full'
          alt='HYPE'
        />
      </div>
      <p className='text-hlGray mr-2 font-normal'>HYPE:</p>
      <p className='text-accent font-bold'>
        {price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        })}
      </p>
    </a>
  );
};

export default HypeCard;
