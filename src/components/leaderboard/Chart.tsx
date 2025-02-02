'use client';

import { AgChartTheme } from '@ag-grid-community/core';
import {
  AgBarSeriesOptions,
  AgCartesianAxisOptions,
  AgLineSeriesOptions,
} from 'ag-charts-community';
import { AgCharts } from 'ag-charts-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';

import { trimAddress } from '@/lib/formatters';

import Button from '@/components/buttons/Button';

import useAddressFromURL from '@/app/hooks/use-address-from-url';
import useHypeData from '@/app/hooks/use-hype-data';
import { apiHost } from '@/constant/config';
import { useAddressStore } from '@/state/stores';

import { UserSnapshotData } from '@/types/responses';

const purrValue = (
  userData: UserSnapshotData | undefined,
  wsData: ReturnType<typeof useHypeData>,
): string => {
  if (!userData) return '...';
  if (!wsData) return '...';

  const value = userData.balance * parseFloat(wsData.markPx);

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const colors = [
  '#51D2C1', // Hyperliquid green
  '#F69318', // Hyperliquid gold
  '#FFD93D', // Bright yellow
  '#FF8C42', // Orange
  '#6A0572', // Deep purple
  '#4E9F3D', // Forest green
  '#F038FF', // Bright pink
  '#465775', // Steel blue
  '#D63AF9', // Vibrant purple
  '#7F8C8D', // Concrete gray
  '#00A8E8', // Azure blue
  '#9B59B6', // Amethyst purple
  '#2ECC71', // Emerald green
  '#E74C3C', // Crimson red
  '#3498DB', // Dodger blue
  '#1ABC9C', // Turquoise
  '#F1C40F', // Sunflower yellow
  '#34495E', // Wet asphalt
  '#16A085', // Green sea
  '#FFA500', // Classic orange
];

const theme: AgChartTheme = {
  palette: {
    fills: colors,
    strokes: colors,
  },
};

const barSeriesOptions: AgBarSeriesOptions = {
  type: 'bar',
  xKey: 'date',
  yKey: 'balance',
  yName: 'HYPE Balance',
  highlightStyle: {
    item: {
      stroke: '#4fc6b6',
      fill: '#98FCE4',
      fillOpacity: 0.3,
    },
  },
  tooltip: {
    renderer: ({ datum, yName }) => {
      const value = `${datum.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} HYPE`;

      return {
        title: `<b>${yName}</b> <small>(${datum.date})</small>`,
        content: value,
      };
    },
  },
};

const axes: AgCartesianAxisOptions[] = [
  {
    type: 'category',
    position: 'bottom',
    label: {
      color: '#9ca3af',
      rotation: -30,
    },
    interval: {
      minSpacing: 30,
    },
  },
  // Use left axis for `balance` series
  {
    type: 'number',
    position: 'left',
    keys: ['balance'],
    title: {
      text: 'HYPE Balance',
      color: '#9ca3af',
    },
    // Format the label applied to this axis
    label: {
      color: '#9ca3af',
      formatter: (params) => parseFloat(params.value).toLocaleString(),
    },
    gridLine: {
      style: [
        {
          stroke: 'rgba(255, 255, 255, 0.2)',
          lineDash: [4, 2],
        },
      ],
    },
  },
  // Use right axis for 'rank' series
  {
    type: 'number',
    position: 'right',
    keys: ['rank'],
    reverse: true,
    title: {
      text: 'Rank',
      color: '#9ca3af',
    },
    gridLine: {
      style: [
        {
          stroke: 'rgba(255, 255, 255, 0.2)',
          lineDash: [4, 2],
        },
      ],
    },
    label: {
      color: '#9ca3af',
      formatter: (params) => '#' + params.value,
    },
  },
];

const lineSeriesOptions: AgLineSeriesOptions = {
  type: 'line',
  xKey: 'date',
  yKey: 'rank',
  yName: 'Rank',
  tooltip: {
    renderer: ({ datum, yName }) => {
      const value = datum.rank;

      return {
        title: `<b>${yName}</b> <small>(${datum.date})</small>`,
        content: value,
      };
    },
  },
};

const Chart = () => {
  const address = useAddressStore((state) => state.address);
  const setAddress = useAddressStore((state) => state.setAddress);
  const { addressParam, setAddressParam } = useAddressFromURL();
  const [data, setData] = useState<UserSnapshotData | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [currentAddress, setCurrentAddress] = useState<string | undefined>('');
  const wsData = useHypeData();

  const targetAddress = address || addressParam;

  useEffect(() => {
    if (targetAddress) setCurrentAddress(targetAddress);
  }, [targetAddress]);

  useEffect(() => {
    const fetchData = async () => {
      if (!targetAddress) return;

      setIsFetching(true);
      setIsFailed(false);

      fetch(`${apiHost}/users/${targetAddress}?coin=hype`)
        .then<UserSnapshotData>((resp) => resp.json())
        .then((data) => {
          setData(data);
          setIsFailed(false);
        })
        .catch(() => setIsFailed(true))
        .finally(() => setIsFetching(false));
    };

    fetchData();
  }, [targetAddress]);

  const isReady = targetAddress && !isFailed && !isFetching;

  return (
    <div>
      <h2 className='text-white text-lg mb-6 text-center'>Address lookup 🔎</h2>
      <div className='flex justify-center mb-8'>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setAddress(currentAddress as string);
            setAddressParam(currentAddress as string);
          }}
          className='flex w-full md:w-3/5'
        >
          <input
            className='inline grow bg-input-background rounded border-0 py-1.5 mr-2 text-white shadow-sm ring-1 ring-inset ring-input-border placeholder:text-gray-500 focus:ring-1 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6'
            placeholder='0x...'
            aria-describedby='address-required'
            value={currentAddress}
            onChange={(event) => setCurrentAddress(event.target.value)}
          />
          <Button
            type='submit'
            disabled={isFetching || currentAddress?.length === 0}
            isLoading={isFetching}
            variant='outline'
          >
            Search
          </Button>
        </form>
      </div>
      {isFailed && (
        <p className='text-hlGray text-center text-base mt-10'>Not found</p>
      )}
      {isReady && (
        <>
          <div className='flex mb-8'>
            <div className='w-full md:w-1/2'>
              <div className='flex flex-col justify-center h-full'>
                {data?.tag && (
                  <div className='text-center'>
                    <span className='bg-yellow-400 text-xs text-yellow-800 font-normal px-2 py-1 rounded-lg'>
                      {data?.tag}
                    </span>
                  </div>
                )}
                <p className='text-center text-white text-2xl font-bold mt-3 mb-1'>
                  {trimAddress(targetAddress)}{' '}
                </p>
                <p className='text-center text-xs text-hlGray mb-6'>
                  is HYPE holder
                </p>
                <p className='flex justify-center items-center text-center font-mono text-hl-primary text-4xl mb-4'>
                  #{data?.rank}
                </p>
                <p className='text-center text-white text-lg font-semibold mt-2 mb-1'>
                  HYPE value 🤑
                </p>
                <p className='text-accent text-center font-semibold text-sm'>
                  {purrValue(data, wsData)}
                </p>
                {data?.levels && data.levels.length > 0 && (
                  <>
                    <p className='text-center text-white text-lg font-semibold mt-5 mb-1'>
                      Level up 🔥
                    </p>
                    <p className='text-center text-xs text-hlGray mb-2'>
                      HYPE needed to reach ...
                    </p>
                    <div className='bg-hl-light p-2 mt-1 text-hlGray'>
                      <Marquee
                        pauseOnHover
                        gradient
                        gradientColor='#163832'
                        gradientWidth={18}
                      >
                        {data.levels.map((entry) => {
                          return (
                            <div
                              key={entry.amount}
                              className='flex items-center'
                            >
                              <p className='text-hlGray text-sm mr-3'>
                                {entry.level}:
                              </p>
                              <p className='text-accent text-sm font-mono'>
                                {entry.amount.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{' '}
                                HYPE
                              </p>
                              <p className='text-gray-500 mx-3'>/</p>
                            </div>
                          );
                        })}
                      </Marquee>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className='w-1/2 hidden md:block'>
              <Image
                src='/images/purr.gif'
                width={498}
                height={374}
                priority
                unoptimized
                alt='PURR'
                title='The hoodie stays on'
                className='w-full'
              />
            </div>
          </div>
          <AgCharts
            options={{
              theme,
              height: 700,
              background: { fill: '#0f1a1f' },
              title: {
                text: `Stats for ${trimAddress(targetAddress)}`,
                color: 'white',
                spacing: 40,
              },
              padding: {
                top: 40,
                right: 25,
                bottom: 40,
                left: 25,
              },
              data: data?.snapshots,
              series: [barSeriesOptions, lineSeriesOptions],
              axes,
              legend: {
                position: 'bottom',
                item: {
                  label: {
                    color: '#9ca3af',
                  },
                },
              },
            }}
          />
        </>
      )}
    </div>
  );
};

export default Chart;
