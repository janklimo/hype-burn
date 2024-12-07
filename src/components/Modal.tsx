'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toPng } from 'html-to-image';
import Image from 'next/image';
import { FC, useCallback, useRef } from 'react';

interface Props {
  open: boolean;
  closeModal: () => void;
}

const levels = [
  {
    name: 'Smugness',
    title: 'Front-end Developer',
    department: 'Optimization',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    src: '/images/salt/smugness.png',
  },
  {
    name: 'Disbelief',
    title: 'Front-end Developer',
    department: 'Optimization',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    src: '/images/salt/disbelief.png',
  },
  {
    name: 'Panic',
    title: 'Front-end Developer',
    department: 'Optimization',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    src: '/images/salt/panic.png',
  },
  {
    name: 'Despair',
    title: 'Front-end Developer',
    department: 'Optimization',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    src: '/images/salt/despair.png',
  },
  {
    name: 'Doom',
    title: 'Front-end Developer',
    department: 'Optimization',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    src: '/images/salt/doom.png',
  },
];

function Example() {
  return (
    <div className='w-full overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-300'>
        <thead>
          <tr>
            <th
              scope='col'
              className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0'
            >
              Level
            </th>
            <th
              scope='col'
              className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
            >
              HYPE Price
            </th>
            <th
              scope='col'
              className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
            >
              Lambo Stack <br /> (2,000 HYPE)
            </th>
            <th
              scope='col'
              className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
            >
              Life Changing Money Stack <br /> (5,000 HYPE)
            </th>
            <th
              scope='col'
              className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
            >
              Gonna Make It Stack <br /> (25,000 HYPE)
            </th>
            <th
              scope='col'
              className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
            >
              Retirement Stack <br /> (100,000 HYPE)
            </th>
            <th
              scope='col'
              className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
            >
              Retire Your Bloodline Stack <br /> (1,000,000 HYPE)
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 bg-white'>
          {levels.map((level) => (
            <tr key={level.email}>
              <td className='whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0'>
                <div className='flex items-center'>
                  <div className='size-11 shrink-0'>
                    <Image
                      src={level.src}
                      width={315}
                      height={350}
                      alt='Smugness'
                    />
                  </div>
                  <div className='ml-4'>
                    <div className='font-medium text-gray-900'>
                      {level.name}
                    </div>
                    <div className='mt-1 text-gray-500'>{level.email}</div>
                  </div>
                </div>
              </td>
              <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                <div className='text-gray-900'>{level.title}</div>
                <div className='mt-1 text-gray-500'>{level.department}</div>
              </td>
              <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                <span className='inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
                  Active
                </span>
              </td>
              <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                {level.role}
              </td>
              <td className='relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Modal: FC<Props> = ({ open, closeModal }) => {
  const ref = useRef<HTMLDivElement>(null);

  const downloadImage = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (ref.current === null) {
        return;
      }

      toPng(ref.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'hype-salt-sheet.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [ref],
  );

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
            className='relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-10/12 sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'
          >
            <div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
              <button
                type='button'
                onClick={closeModal}
                className='rounded-md bg-white text-gray-400 hover:text-gray-500'
              >
                <span className='sr-only'>Close</span>
                <XMarkIcon aria-hidden='true' className='size-6' />
              </button>
            </div>
            <div className='sm:flex sm:items-start'>
              <div
                ref={ref}
                className='w-full bg-white mt-3 text-center sm:mt-0 sm:text-left p-2 sm:p-4'
              >
                <DialogTitle
                  as='h3'
                  className='text-center text-2xl font-semibold text-gray-900'
                >
                  HYPE Salt Sheet
                </DialogTitle>
                <div className='mt-2 overflow-x-auto'>
                  <Example />
                </div>
              </div>
            </div>
            <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
              <button
                type='button'
                onClick={downloadImage}
                className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
