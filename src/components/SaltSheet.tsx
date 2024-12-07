import Image from 'next/image';
import { FC, useState } from 'react';

import UnderlineLink from '@/components/links/UnderlineLink';
import Modal from '@/components/Modal';

import useHypeData from '@/app/hooks/use-hype-data';

interface Props {
  data: ReturnType<typeof useHypeData>;
}

const SaltSheet: FC<Props> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className='bg-hl-dark'>
      <h2 className='text-white text-base mb-3'>HYPE airdrop salt sheet</h2>
      <div className='w-14 inline-block mb-2'>
        <Image
          src='/images/salt/smugness.png'
          width={315}
          height={350}
          alt='Smugness'
        />
      </div>
      <p className='text-hlGray text-sm mb-3'>
        <span className='font-bold'>Current level</span>:{' '}
        <span className='text-white'>Smugness</span>
      </p>
      <p className='text-white text-sm'>
        <UnderlineLink
          href='#'
          className='mr-2'
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
        >
          Full HYPE salt sheet
        </UnderlineLink>
      </p>
      <Modal
        open={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        hypePrice={parseFloat(data?.markPx ?? '0')}
      />
    </div>
  );
};

export default SaltSheet;
