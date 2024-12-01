import Image from 'next/image';
import { FC } from 'react';

const Headline: FC = () => {
  return (
    <>
      <h1 className='text-white text-5xl my-8'>
        <span className='font-serif font-extralight'>HYPE</span>
        <span className='font-serif italic font-thin'>Burn</span>
        <div className='w-8 inline-block ml-2'>
          <Image
            src='/images/fire.svg'
            width={64}
            height={64}
            priority
            alt='PURR'
          />
        </div>
      </h1>
      <p className='text-hlGray mb-3'>
        HYPE is hyper sound money ⚡🔊 Total supply is fixed and transaction
        fees are automatically burned.
      </p>
    </>
  );
};

export default Headline;
