import Image from 'next/image';
import { FC } from 'react';

import UnderlineLink from '@/components/links/UnderlineLink';

const MobileCallout: FC = () => {
  return (
    <div className='bg-primary-100 py-3 md:hidden'>
      <div className='flex justify-center text-sm mb-1'>
        <span className='mr-1'>Buy</span>
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
        <span className='mr-1'>HYPE</span>
        <UnderlineLink
          dotted={false}
          href='https://app.hyperliquid.xyz/join/AK194'
        >
          on Hyperliquid
        </UnderlineLink>
        <div className='w-5 inline-block'>
          <Image
            src='/images/blob.gif'
            width={64}
            height={64}
            priority
            alt='HYPE'
          />
        </div>
      </div>
      <div className='text-xs text-center text-gray-600'>
        This referral link gives you 4% discount on your trading fees.
      </div>
    </div>
  );
};

export default MobileCallout;
