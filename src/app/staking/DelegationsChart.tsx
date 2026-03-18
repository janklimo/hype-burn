import {
  AgBarSeriesOptions,
  AgCartesianChartOptions,
} from 'ag-charts-community';
import { AgCharts } from 'ag-charts-react';
import { FC, useMemo } from 'react';

import { DelegationRow } from '@/app/hooks/use-delegations-table';

const MAX_LABEL_LENGTH = 14;

const trimLabel = (label: string) =>
  label.length > MAX_LABEL_LENGTH
    ? `${label.slice(0, MAX_LABEL_LENGTH)}...`
    : label;

const formatStake = (value: number) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);

interface DelegationsChartProps {
  rows: DelegationRow[];
}

const DelegationsChart: FC<DelegationsChartProps> = ({ rows }) => {
  const chartData = useMemo(
    () =>
      [...rows]
        .sort((a, b) => b.total - a.total)
        .map((r) => ({
          validator: r.name,
          foundation: r.foundation,
          labs: r.labs,
          community: r.community,
        })),
    [rows],
  );

  const options: AgCartesianChartOptions = {
    data: chartData,
    series: [
      {
        type: 'bar',
        xKey: 'validator',
        yKey: 'foundation',
        yName: 'Foundation',
        stacked: true,
        fill: '#F59E0B',
        tooltip: {
          renderer: ({ datum }) => ({
            title: `<b>${datum.validator}</b>`,
            content: `Foundation: ${formatStake(datum.foundation)} HYPE`,
          }),
        },
      } as AgBarSeriesOptions,
      {
        type: 'bar',
        xKey: 'validator',
        yKey: 'labs',
        yName: 'Labs',
        stacked: true,
        fill: '#7B61FF',
        tooltip: {
          renderer: ({ datum }) => ({
            title: `<b>${datum.validator}</b>`,
            content: `Labs: ${formatStake(datum.labs)} HYPE`,
          }),
        },
      } as AgBarSeriesOptions,
      {
        type: 'bar',
        xKey: 'validator',
        yKey: 'community',
        yName: 'Community',
        stacked: true,
        fill: '#51D2C1',
        tooltip: {
          renderer: ({ datum }) => ({
            title: `<b>${datum.validator}</b>`,
            content: `Community: ${formatStake(datum.community)} HYPE`,
          }),
        },
      } as AgBarSeriesOptions,
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        label: {
          rotation: -45,
          formatter: ({ value }) => trimLabel(value),
        },
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Stake (HYPE)',
          color: '#9ca3af',
        },
        label: {
          formatter: (params) => formatStake(params.value),
        },
        min: 0,
      },
    ],
    height: 500,
    background: { fill: '#0f1a1f' },
    padding: { top: 30, right: 25, bottom: 30, left: 30 },
    theme: 'ag-default-dark' as const,
  };

  if (chartData.length === 0) {
    return (
      <div className='h-[500px] flex items-center justify-center bg-input-background mb-8'>
        <p className='text-gray-400'>No data available</p>
      </div>
    );
  }

  return (
    <div className='bg-input-background mb-8'>
      <AgCharts options={options} />
    </div>
  );
};

export default DelegationsChart;
