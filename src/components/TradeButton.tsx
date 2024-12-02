import Image from 'next/image';
import { FC } from 'react';

const TradeButton: FC = () => {
  return (
    <a
      href='https://app.hyperliquid.xyz/join/AK194'
      className='inline-flex items-center bg-hl-primary text-sm px-4 py-3 hover:bg-accent transition-all rounded-md'
      target='_blank'
      rel='noopener noreferrer'
    >
      <span className='mr-1'>Trade</span>
      <div className='w-5 inline-block mr-1'>
        <Image
          src='/images/hype.png'
          width={64}
          height={64}
          priority
          alt='HYPE'
          className='rounded-full'
        />
      </div>
      <span className='mr-1'>HYPE on Hyperliquid</span>
      <div className='w-5 inline-block'>
        <Image
          src='/images/blob.gif'
          width={64}
          height={64}
          priority
          alt='HYPE'
        />
      </div>
    </a>
  );
};

export default TradeButton;
