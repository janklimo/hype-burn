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

  const options: AgCartesianChartOptions = {
    title: {
      text: 'USDC on Hyperliquid',
    },
    subtitle: {
      text: 'USDC distribution across Arbitrum and HyperEVM',
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
          renderer: ({ datum, yName }) => {
            return {
              title: `<b>${yName}</b> <small>(${datum.date})</small>`,
              content: datum.builders,
            };
          },
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
      <ChartSkeleton className='h-[500px]' message='Loading USDC data...' />
    );
  }

  return (
    <div className='bg-input-background mb-8'>
      <AgCharts options={options} />
    </div>
  );
};

export default USDCChart;
