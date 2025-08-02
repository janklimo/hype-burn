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

const ReferrerCodesChart: FC = () => {
  const [data, setData] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(ENDPOINT);
        const json: ReferrerCodesResponse = await res.json();
        setData(json.users);
      } catch (e) {
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const options: AgCartesianChartOptions = {
    title: { text: 'Top Referrer Codes by User Count' },
    subtitle: { text: 'Codes that referred the most users', spacing: 40 },
    data,
    series: [
      {
        type: 'bar',
        xKey: 'code',
        yKey: 'amount',
        yName: 'Users Referred',
        fill: '#51D2C1',
        tooltip: {
          renderer: ({ datum }) => ({
            title: `<b>${datum.code}</b>`,
            content: `${datum.amount.toLocaleString()} users`,
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
        title: { text: 'Users', color: '#9ca3af' },
        label: {
          formatter: (params) => params.value.toLocaleString(),
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
