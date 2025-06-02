'use client';

import {
  AgBarSeriesOptions,
  AgCartesianChartOptions,
  AgLineSeriesOptions,
} from 'ag-charts-community';
import { AgCharts } from 'ag-charts-react';
import { FC, useEffect, useState } from 'react';

import ChartSkeleton from '@/components/ChartSkeleton';

import { apiHost } from '@/constant/config';

const barSeriesOptions: AgBarSeriesOptions = {
  type: 'bar' as const,
  xKey: 'date',
  yKey: 'revenue',
  yName: 'Revenue',
  fill: '#51D2C1',
  tooltip: {
    renderer: ({ datum, yName }) => {
      const value = datum.revenue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return {
        title: `<b>${yName}</b> <small>(${datum.date})</small>`,
        content: value,
      };
    },
  },
};

const lineSeriesOptions: AgLineSeriesOptions = {
  type: 'line' as const,
  xKey: 'date',
  yKey: 'builders',
  yName: 'Number of Active Builders',
  stroke: '#F69318',
  strokeWidth: 3,
  marker: {
    enabled: true,
    fill: '#F69318',
  },
  tooltip: {
    renderer: ({ datum, yName }) => {
      return {
        title: `<b>${yName}</b> <small>(${datum.date})</small>`,
        content: datum.builders,
      };
    },
  },
};

interface TotalsData {
  date: string;
  revenue: number;
  builders: number;
}

const Totals: FC = () => {
  const [data, setData] = useState<TotalsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiHost}/builder_codes_snapshots/totals`,
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching totals data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const options: AgCartesianChartOptions = {
    title: {
      text: 'Builder Codes: Totals',
    },
    subtitle: {
      text: 'Aggregated builder revenue vs total active builders (builder codes win non-zero collected builder fees)',
      spacing: 40,
    },
    data,
    series: [barSeriesOptions, lineSeriesOptions],
    axes: [
      {
        type: 'category',
        position: 'bottom',
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Revenue',
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
          formatter: (params) => {
            const value = params.value;
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
              maximumFractionDigits: 1,
            }).format(value);
          },
        },
        keys: ['revenue'],
      },
      {
        type: 'number',
        position: 'right',
        title: {
          text: 'Number of Active Builders',
          color: '#9ca3af',
        },
        gridLine: {
          enabled: false,
        },
        label: {
          formatter: (params) => {
            return Math.round(params.value).toString();
          },
        },
        keys: ['builders'],
      },
    ],
    height: 500,
    background: { fill: '#0f1a1f' },
    padding: {
      top: 30,
      right: 25,
      bottom: 20,
      left: 25,
    },
    theme: 'ag-default-dark' as const,
  };

  if (isLoading) {
    return (
      <ChartSkeleton className='h-[500px]' message='Loading chart data...' />
    );
  }

  return <AgCharts options={options} />;
};

export default Totals;
