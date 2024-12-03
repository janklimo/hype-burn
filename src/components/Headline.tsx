import Image from 'next/image';
import { FC } from 'react';

const Headline: FC = () => {
  return (
    <div className='md:mt-3 mb-8'>
      <div className='flex justify-center mt-2 mb-5'>
        <div className='w-10'>
          <Image
            src='/images/blob_green.gif'
            width={64}
            height={64}
            priority
            alt='HYPE'
          />
        </div>
      </div>
      <h1 className='text-white text-5xl mb-3'>
        <span className='font-serif font-extralight'>HYPE</span>
        <span className='font-serif italic font-thin'>Burn</span>
        <div className='w-8 inline-block ml-2'>
          <Image
            src='/images/fire.svg'
            width={64}
            height={64}
            priority
            alt='HYPE'
          />
        </div>
      </h1>
      <p className='text-hlGray mb-3'>
        HYPE is hyper sound money ⚡🔊 Max supply is fixed and transaction fees
        are automatically burned.
      </p>
    </div>
  );
};

export default Headline;
