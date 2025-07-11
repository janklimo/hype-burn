import Image from 'next/image';
import { FC } from 'react';

import UnderlineLink from '@/components/links/UnderlineLink';

const MobileCallout: FC = () => {
  return (
    <div className='bg-primary-100 py-3 md:hidden'>
      <div className='flex justify-center text-sm mb-1'>
        <span className='mr-1'>Support me by</span>
        <UnderlineLink
          dotted={false}
          href='https://app.hyperliquid.xyz/join/AK194'
        >
          using my referral code on Hyperliquid
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
        It's free and it gives you a 4% discount on your trading fees.
      </div>
    </div>
  );
};

export default MobileCallout;
