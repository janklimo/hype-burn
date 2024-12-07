import Image from 'next/image';
import { FC, useState } from 'react';

import UnderlineLink from '@/components/links/UnderlineLink';
import Modal from '@/components/Modal';

import useHypeData from '@/app/hooks/use-hype-data';
import Skeleton from '@/components/Skeleton';

interface Level {
  name: string;
  src: string;
  threshold: number;
}

const levels: Level[] = [
  { name: 'Smugness', src: '/images/salt/smugness.png', threshold: 4 },
  { name: 'Disbelief', src: '/images/salt/disbelief.png', threshold: 8 },
  { name: 'Panic', src: '/images/salt/panic.png', threshold: 20 },
  { name: 'Despair', src: '/images/salt/despair.png', threshold: 60 },
  { name: 'Doom', src: '/images/salt/doom.png', threshold: 100_000 },
];

const getCurrentLevel = (value: number): Level | undefined =>
  [...levels].find((level) => value <= level.threshold);

interface Props {
  data: ReturnType<typeof useHypeData>;
}

const SaltSheet: FC<Props> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const renderContent = () => {
    if (!data) {
      return <Skeleton className='h-20 w-20 mx-auto' />;
    }

    const level = getCurrentLevel(parseFloat(data.markPx));

    if (!level) return null;

    return (
      <div>
        <div className='w-14 inline-block mb-2'>
          <Image src={level.src} width={315} height={350} alt='Smugness' />
        </div>
        <p className='text-hlGray text-sm mb-3'>
          <span className='font-bold'>Current level</span>:{' '}
          <span className='text-white'>{level.name}</span>
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
      </div>
    );
  };

  return (
    <div className='bg-hl-dark'>
      <h2 className='text-white text-base mb-3'>HYPE airdrop salt sheet</h2>
      {renderContent()}
      <Modal
        open={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        hypePrice={parseFloat(data?.markPx ?? '0')}
      />
    </div>
  );
};

export default SaltSheet;
