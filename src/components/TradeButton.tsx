import Image from 'next/image';
import { FC } from 'react';

const TradeButton: FC = () => {
  return (
    <a
      href='https://app.hyperliquid.xyz/join/AK194'
      className='inline-flex items-center bg-hl-primary text-sm text-hl-dark px-4 py-3 hover:bg-accent transition-all duration-300 rounded-md'
      target='_blank'
      rel='noopener noreferrer'
    >
      <span className='mr-1'>Support me by using my</span>
      <div className='w-5 inline-block mr-1'>
        <Image
          src='/images/blob.gif'
          width={64}
          height={64}
          priority
          alt='HYPE'
        />
      </div>
      <span className='mr-1'>referral code</span>
    </a>
  );
};

export default TradeButton;
