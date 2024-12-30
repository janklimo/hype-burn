import Image from 'next/image';
import { FC } from 'react';

const StakeButton: FC = () => {
  return (
    <a
      href='https://app.hyperliquid.xyz/staking'
      className='inline-flex items-center bg-beige text-sm text-yellow-900 px-3 py-2 hover:bg-beige-hover transition-all duration-300 rounded-md'
      target='_blank'
      rel='noopener noreferrer'
    >
      <span className='mr-1'>Stake</span>
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
      <span className='mr-1'>HYPE with</span>
      <div className='w-8 inline-block mr-1'>
        <Image
          src='/images/node-logo.png'
          width={64}
          height={64}
          priority
          alt='HYPE'
        />
      </div>
      <span>PurrposefulNode</span>
    </a>
  );
};

export default StakeButton;
