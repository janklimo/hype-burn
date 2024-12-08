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
import { FC, ReactNode, useCallback, useRef } from 'react';

import { classNames } from '@/lib/utils';

interface PriceLevel {
  price: number;
  lamboStack: number;
  lifeChangingStack: number;
  gonnaMakeItStack: number;
  retirementStack: number;
  bloodlineStack: number;
}

interface Level {
  name: string;
  description: string;
  src: string;
  prices: PriceLevel[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const levels: Level[] = [
  {
    name: 'Smugness',
    description: 'ez money, will sell now and rebuy lower after whales dump',
    src: '/images/salt/smugness.png',
    prices: [
      {
        price: 1,
        lamboStack: 2000,
        lifeChangingStack: 5000,
        gonnaMakeItStack: 25000,
        retirementStack: 100000,
        bloodlineStack: 1000000,
      },
      {
        price: 2,
        lamboStack: 4000,
        lifeChangingStack: 10000,
        gonnaMakeItStack: 50000,
        retirementStack: 200000,
        bloodlineStack: 2000000,
      },
      {
        price: 2.5,
        lamboStack: 5000,
        lifeChangingStack: 12500,
        gonnaMakeItStack: 62500,
        retirementStack: 250000,
        bloodlineStack: 2500000,
      },
      {
        price: 3,
        lamboStack: 6000,
        lifeChangingStack: 15000,
        gonnaMakeItStack: 75000,
        retirementStack: 300000,
        bloodlineStack: 3000000,
      },
    ],
  },
  {
    name: 'Disbelief',
    description: 'wtf, why is the price not dumping yet??',
    src: '/images/salt/disbelief.png',
    prices: [
      {
        price: 4,
        lamboStack: 8000,
        lifeChangingStack: 20000,
        gonnaMakeItStack: 100000,
        retirementStack: 400000,
        bloodlineStack: 4000000,
      },
      {
        price: 5,
        lamboStack: 10000,
        lifeChangingStack: 25000,
        gonnaMakeItStack: 125000,
        retirementStack: 500000,
        bloodlineStack: 5000000,
      },
      {
        price: 6,
        lamboStack: 12000,
        lifeChangingStack: 30000,
        gonnaMakeItStack: 150000,
        retirementStack: 600000,
        bloodlineStack: 6000000,
      },
      {
        price: 7,
        lamboStack: 14000,
        lifeChangingStack: 35000,
        gonnaMakeItStack: 175000,
        retirementStack: 700000,
        bloodlineStack: 7000000,
      },
    ],
  },
  {
    name: 'Panic',
    description: 'WHY IS IT STILL GOING UP?????',
    src: '/images/salt/panic.png',
    prices: [
      {
        price: 8,
        lamboStack: 16000,
        lifeChangingStack: 40000,
        gonnaMakeItStack: 200000,
        retirementStack: 800000,
        bloodlineStack: 8000000,
      },
      {
        price: 9,
        lamboStack: 18000,
        lifeChangingStack: 45000,
        gonnaMakeItStack: 225000,
        retirementStack: 900000,
        bloodlineStack: 9000000,
      },
      {
        price: 10,
        lamboStack: 20000,
        lifeChangingStack: 50000,
        gonnaMakeItStack: 250000,
        retirementStack: 1000000,
        bloodlineStack: 10000000,
      },
      {
        price: 15,
        lamboStack: 30000,
        lifeChangingStack: 75000,
        gonnaMakeItStack: 375000,
        retirementStack: 1500000,
        bloodlineStack: 15000000,
      },
    ],
  },
  {
    name: 'Despair',
    description: 'OH GOD OH NO OH NO',
    src: '/images/salt/despair.png',
    prices: [
      {
        price: 20,
        lamboStack: 40000,
        lifeChangingStack: 100000,
        gonnaMakeItStack: 500000,
        retirementStack: 2000000,
        bloodlineStack: 20000000,
      },
      {
        price: 30,
        lamboStack: 60000,
        lifeChangingStack: 150000,
        gonnaMakeItStack: 750000,
        retirementStack: 3000000,
        bloodlineStack: 30000000,
      },
      {
        price: 40,
        lamboStack: 80000,
        lifeChangingStack: 200000,
        gonnaMakeItStack: 1000000,
        retirementStack: 4000000,
        bloodlineStack: 40000000,
      },
      {
        price: 50,
        lamboStack: 100000,
        lifeChangingStack: 250000,
        gonnaMakeItStack: 1250000,
        retirementStack: 5000000,
        bloodlineStack: 50000000,
      },
    ],
  },
  {
    name: 'Doom',
    description: 'WTF DID I DO',
    src: '/images/salt/doom.png',
    prices: [
      {
        price: 60,
        lamboStack: 120000,
        lifeChangingStack: 300000,
        gonnaMakeItStack: 1500000,
        retirementStack: 6000000,
        bloodlineStack: 60000000,
      },
      {
        price: 70,
        lamboStack: 140000,
        lifeChangingStack: 350000,
        gonnaMakeItStack: 1750000,
        retirementStack: 7000000,
        bloodlineStack: 70000000,
      },
      {
        price: 80,
        lamboStack: 160000,
        lifeChangingStack: 400000,
        gonnaMakeItStack: 2000000,
        retirementStack: 8000000,
        bloodlineStack: 80000000,
      },
      {
        price: 100,
        lamboStack: 200000,
        lifeChangingStack: 500000,
        gonnaMakeItStack: 2500000,
        retirementStack: 10000000,
        bloodlineStack: 100000000,
      },
    ],
  },
];

const getPriceColor = (
  levelIndex: number,
  priceIndex: number,
  totalLevels: number,
  totalPrices: number,
) => {
  // Calculate overall progress through all levels and prices
  const progress =
    (levelIndex * totalPrices + priceIndex) / (totalLevels * totalPrices);

  if (progress < 0.2) {
    return 'bg-green-50 text-green-700 ring-green-600/20';
  } else if (progress < 0.4) {
    return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
  } else if (progress < 0.6) {
    return 'bg-orange-50 text-orange-700 ring-orange-600/20';
  } else if (progress < 0.8) {
    return 'bg-rose-50 text-rose-700 ring-rose-600/20';
  } else {
    return 'bg-red-50 text-red-700 ring-red-600/20';
  }
};

interface CellProps {
  hypePrice: number;
  value: number;
  children: ReactNode;
}

const StrikeThroughTableCell: FC<CellProps> = ({
  value,
  hypePrice,
  children,
}) => {
  const isCrossed = hypePrice > value;

  return (
    <td
      className={classNames(
        'relative whitespace-nowrap px-3 py-1 text-sm',
        isCrossed ? 'text-gray-500' : 'text-gray-900',
      )}
    >
      {children}
      {isCrossed && (
        <div className='absolute inset-0'>
          <div className='absolute top-1/2 left-0 right-0 h-0.5 bg-red-400' />
        </div>
      )}
    </td>
  );
};

const Table: FC<{ hypePrice: number }> = ({ hypePrice }) => {
  const maxPrices = Math.max(...levels.map((level) => level.prices.length));

  return (
    <div className='w-full overflow-x-auto'>
      <table className='w-full table-fixed divide-y divide-gray-300'>
        <thead>
          <tr>
            <th
              scope='col'
              className='w-72 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0'
            >
              Level
            </th>
            <th
              scope='col'
              className='w-32 whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
            >
              HYPE Price
            </th>
            <th
              scope='col'
              className='whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
            >
              Lambo Stack
              <br />
              (2,000 HYPE)
            </th>
            <th
              scope='col'
              className='whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
            >
              Life Changing Money Stack
              <br />
              (5,000 HYPE)
            </th>
            <th
              scope='col'
              className='whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
            >
              Gonna Make It Stack
              <br />
              (25,000 HYPE)
            </th>
            <th
              scope='col'
              className='whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
            >
              Retirement Stack
              <br />
              (100,000 HYPE)
            </th>
            <th
              scope='col'
              className='whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
            >
              Retire Your Bloodline Stack
              <br />
              (1,000,000 HYPE)
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 bg-white'>
          {levels.flatMap((level, levelIndex) =>
            level.prices.map((price, priceIndex) => (
              <tr key={`${level.name}-${price.price}`}>
                {priceIndex === 0 && (
                  <td
                    className='py-5 pl-4 pr-3 text-sm sm:pl-0'
                    rowSpan={level.prices.length}
                  >
                    <div className='flex items-center'>
                      <div className='size-16 shrink-0'>
                        <Image
                          src={level.src}
                          width={315}
                          height={350}
                          alt={level.name}
                          className='size-16'
                        />
                      </div>
                      <div className='ml-4'>
                        <div className='font-medium text-gray-900 text-lg'>
                          {level.name}
                        </div>
                        <div className='mt-1 text-sm text-gray-500'>
                          {level.description}
                        </div>
                      </div>
                    </div>
                  </td>
                )}
                <StrikeThroughTableCell
                  hypePrice={hypePrice}
                  value={price.price}
                >
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getPriceColor(levelIndex, priceIndex, levels.length, maxPrices)}`}
                  >
                    ${price.price.toFixed(2)}
                  </span>
                </StrikeThroughTableCell>
                <StrikeThroughTableCell
                  hypePrice={hypePrice}
                  value={price.price}
                >
                  {formatCurrency(price.lamboStack)}
                </StrikeThroughTableCell>
                <StrikeThroughTableCell
                  hypePrice={hypePrice}
                  value={price.price}
                >
                  {formatCurrency(price.lifeChangingStack)}
                </StrikeThroughTableCell>
                <StrikeThroughTableCell
                  hypePrice={hypePrice}
                  value={price.price}
                >
                  {formatCurrency(price.gonnaMakeItStack)}
                </StrikeThroughTableCell>
                <StrikeThroughTableCell
                  hypePrice={hypePrice}
                  value={price.price}
                >
                  {formatCurrency(price.retirementStack)}
                </StrikeThroughTableCell>
                <StrikeThroughTableCell
                  hypePrice={hypePrice}
                  value={price.price}
                >
                  {formatCurrency(price.bloodlineStack)}
                </StrikeThroughTableCell>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
};

interface Props {
  open: boolean;
  closeModal: () => void;
  hypePrice: number;
}

const Modal: FC<Props> = ({ open, closeModal, hypePrice }) => {
  const ref = useRef<HTMLDivElement>(null);

  const downloadImage = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (ref.current === null) {
        return;
      }

      toPng(ref.current, { cacheBust: true, includeQueryParams: true })
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
                  <Table hypePrice={hypePrice} />
                  <div className='flex justify-end items-center text-hl-primary text-right mt-3'>
                    <div className='w-4 inline-block mr-1'>
                      <Image
                        src='/images/fire.svg'
                        width={64}
                        height={64}
                        priority
                        alt='HYPE'
                      />
                    </div>
                    <span className='font-bold'>hypeburn.fun</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex justify-center'>
              <button
                onClick={downloadImage}
                className='inline-flex items-center bg-hl-primary text-sm px-4 py-3 hover:bg-accent transition-all rounded-md'
              >
                Download
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
