'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';

interface Props {
  open: boolean;
  closeModal: () => void;
  videoSrc: string;
  title?: string;
}

const VideoModal: FC<Props> = ({
  open,
  closeModal,
  videoSrc,
  title = 'Video Demo',
}) => {
  return (
    <Dialog open={open} onClose={closeModal} className='relative z-10'>
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-hl-light/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in backdrop-filter backdrop-blur-sm'
      />

      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <DialogPanel
            transition
            className='relative transform rounded-lg bg-hl-dark px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-4xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'
          >
            <div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
              <button
                type='button'
                onClick={closeModal}
                className='rounded-md bg-hl-dark text-gray-300 hover:text-gray-100'
              >
                <span className='sr-only'>Close</span>
                <XMarkIcon aria-hidden='true' className='size-6' />
              </button>
            </div>

            <div className='sm:flex sm:items-start'>
              <div className='w-full mt-3 text-center sm:mt-0 sm:text-left'>
                <DialogTitle
                  as='h3'
                  className='text-center text-xl font-semibold text-white mb-4'
                >
                  {title}
                </DialogTitle>

                <div className='flex justify-center'>
                  <video
                    controls
                    autoPlay
                    muted
                    loop
                    className='w-full max-w-2xl rounded-lg shadow-lg'
                  >
                    <source src={videoSrc} type='video/mp4' />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default VideoModal;
