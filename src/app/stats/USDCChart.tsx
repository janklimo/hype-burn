'use client';

import {
  AgBarSeriesOptions,
  AgCartesianChartOptions,
  AgLineSeriesOptions,
} from 'ag-charts-community';
import { AgCharts } from 'ag-charts-react';
import { FC, useEffect, useState } from 'react';

import ChartSkeleton from '@/components/ChartSkeleton';

const ENDPOINT = 'https://yprjg.hatchboxapp.com/api/v1/usdc_snapshots';

interface USDCSnapshot {
  arbitrum: number;
  hyperevm: number;
  total: number;
  date: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const USDCChart: FC = () => {
  const [data, setData] = useState<USDCSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(ENDPOINT);
        const json: USDCSnapshot[] = await res.json();
        // Sort by date to ensure proper chronological order
        const sortedData = json.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
        setData(sortedData);
      } catch (e) {
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = data.map((snapshot) => ({
    date: formatDate(snapshot.date),
    arbitrum: snapshot.arbitrum,
    hyperevm: snapshot.hyperevm,
    total: snapshot.total,
  }));

  // Calculate migration progress from latest data
  const latestData = data[data.length - 1];
  const migrationProgress = latestData
    ? latestData.hyperevm / latestData.total
    : 0;

  const options: AgCartesianChartOptions = {
    title: {
      text: 'Arbitrum vs HyperEVM',
      spacing: 40,
    },
    data: chartData,
    series: [
      {
        type: 'bar',
        xKey: 'date',
        yKey: 'arbitrum',
        yName: 'Arbitrum USDC',
        fill: '#9AFEFF',
        tooltip: {
          renderer: ({ datum }) => ({
            title: `<span style="color: #03251F;"><b>${datum.date}</b></span>`,
            content: `<span style="color: #03251F;">Arbitrum: ${formatCurrency(datum.arbitrum)}</span>`,
          }),
        },
      } as AgBarSeriesOptions,
      {
        type: 'bar',
        xKey: 'date',
        yKey: 'hyperevm',
        yName: 'HyperEVM USDC',
        fill: '#51D2C1',
        tooltip: {
          renderer: ({ datum }) => ({
            title: `<span style="color: #03251F;"><b>${datum.date}</b></span>`,
            content: `<span style="color: #03251F;">HyperEVM: ${formatCurrency(datum.hyperevm)}</span>`,
          }),
        },
      } as AgBarSeriesOptions,
      {
        type: 'line',
        xKey: 'date',
        yKey: 'total',
        yName: 'Total USDC',
        stroke: '#F69318',
        strokeWidth: 3,
        marker: {
          enabled: true,
          fill: '#F69318',
          stroke: '#F69318',
        },
        tooltip: {
          renderer: ({ datum }) => ({
            title: `<span><b>${datum.date}</b></span>`,
            content: `<span style="color: #03251F;">Total: ${formatCurrency(datum.total)}</span>`,
          }),
        },
      } as AgLineSeriesOptions,
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'Date', color: '#9ca3af' },
        label: {
          rotation: -45,
        },
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'USDC Amount', color: '#9ca3af' },
        label: {
          formatter: (params) => {
            const value = params.value / 1_000_000_000;
            return `$${value.toFixed(1)}B`;
          },
        },
      },
    ],
    height: 500,
    background: { fill: '#0f1a1f' },
    padding: { top: 30, right: 25, bottom: 20, left: 25 },
    theme: 'ag-default-dark' as const,
  };

  if (isLoading) {
    return (
      <ChartSkeleton className='h-[660px]' message='Loading USDC data...' />
    );
  }

  return (
    <>
      <div className='p-6 pb-4 mb-4'>
        <p className='text-hlGray text-sm text-center mb-4'>
          <span className='font-bold text-accent'>
            {formatCurrency(latestData?.hyperevm || 0)}
          </span>{' '}
          of{' '}
          <span className='font-bold text-accent'>
            {formatCurrency(latestData?.total || 0)}
          </span>{' '}
          USDC migrated to HyperEVM –{' '}
          <span className='font-bold text-accent'>
            {migrationProgress.toLocaleString(undefined, {
              style: 'percent',
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </span>{' '}
          complete
        </p>
        <div className='flex justify-center'>
          <div className='w-4/5 max-w-2xl'>
            <div className='rounded-full bg-hl-light'>
              <div
                style={{
                  width: `${(Math.min(migrationProgress, 1) * 100).toFixed(1)}%`,
                }}
                className='h-3 rounded-full bg-accent'
              />
            </div>
            <div className='mt-2 grid grid-cols-2 text-xs font-medium text-gray-400'>
              <div className='text-left'>0%</div>
              <div className='text-right'>100%</div>
            </div>
          </div>
        </div>
      </div>

      <AgCharts options={options} />
    </>
  );
};

export default USDCChart;
