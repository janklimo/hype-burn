'use client';

import {
  AgBarSeriesOptions,
  AgCartesianChartOptions,
} from 'ag-charts-community';
import { AgCharts } from 'ag-charts-react';
import { FC, useEffect, useState } from 'react';

import ChartSkeleton from '@/components/ChartSkeleton';

import { apiHost } from '@/constant/config';

const ENDPOINT = `${apiHost}/builder_codes_snapshots/referrers`;

interface Entry {
  code: string;
  amount: number;
}

interface ReferrerCodesResponse {
  users: Entry[];
  fees: Entry[];
}

interface ReferrerCodesChartProps {
  mode: 'users' | 'fees';
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const ReferrerCodesChart: FC<ReferrerCodesChartProps> = ({ mode }) => {
  const [data, setData] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allData, setAllData] = useState<ReferrerCodesResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(ENDPOINT);
        const json: ReferrerCodesResponse = await res.json();
        setAllData(json);
        setData(json[mode]);
      } catch (e) {
        setAllData(null);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (allData) {
      setData(allData[mode]);
    }
  }, [mode, allData]);

  const isUsers = mode === 'users';

  const options: AgCartesianChartOptions = {
    title: {
      text: isUsers
        ? 'Top Referrer Codes by User Count'
        : 'Top Referrer Codes by Fees',
    },
    subtitle: {
      text: isUsers
        ? 'Codes that referred the most users'
        : 'Codes that earned the most fees',
      spacing: 40,
    },
    data,
    series: [
      {
        type: 'bar',
        xKey: 'code',
        yKey: 'amount',
        yName: isUsers ? 'Users Referred' : 'Fees Generated',
        fill: '#51D2C1',
        tooltip: {
          renderer: ({ datum }) => ({
            title: `<b>${datum.code}</b>`,
            content: isUsers
              ? `${datum.amount.toLocaleString()} users`
              : formatCurrency(datum.amount),
          }),
        },
      } as AgBarSeriesOptions,
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'Referrer Code', color: '#9ca3af' },
      },
      {
        type: 'number',
        position: 'left',
        title: { text: isUsers ? 'Users' : 'Fees', color: '#9ca3af' },
        label: {
          formatter: (params) =>
            isUsers
              ? params.value.toLocaleString()
              : formatCurrency(params.value),
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
      <ChartSkeleton
        className='h-[500px]'
        message='Loading referrer codes...'
      />
    );
  }

  return (
    <div className='bg-input-background mb-8'>
      <AgCharts options={options} />
    </div>
  );
};

export default ReferrerCodesChart;
