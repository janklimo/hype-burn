'use client';

import { FC, useState } from 'react';

import UnderlineLink from '@/components/links/UnderlineLink';
import TradeCallout from '@/components/TradeCallout';
import VideoModal from '@/components/VideoModal';

import IndividualBuilders from '@/app/builders/IndividualBuilders';
import Top from '@/app/builders/Top';
import Totals from '@/app/builders/Totals';

const Builders: FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const openVideoModal = () => setIsVideoModalOpen(true);
  const closeVideoModal = () => setIsVideoModalOpen(false);

  return (
    <main>
      <section className='bg-hl-dark p-3 md:p-4'>
        <h2 className='text-white text-lg mb-3 text-center'>
          Builder Revenues
        </h2>
        <p className='text-white text-sm text-center'>
          You can hide/show any chart series by{' '}
          <UnderlineLink
            href='#'
            className='mr-2'
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              openVideoModal();
            }}
          >
            clicking on the legend
          </UnderlineLink>
        </p>
        <div className='flex justify-center items-center flex-col mb-8'>
          <div className='relative w-full max-w-5xl'>
            <div id='charts' className='mt-8 mb-16 flex flex-col gap-8'>
              <Totals />
              <Top />
              <IndividualBuilders />
            </div>
            <TradeCallout />
          </div>
        </div>
      </section>

      <VideoModal
        open={isVideoModalOpen}
        closeModal={closeVideoModal}
        videoSrc='/images/series-toggle-demo.mp4'
        title='Series Toggle'
      />
    </main>
  );
};

export default Builders;
