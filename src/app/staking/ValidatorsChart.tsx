'use client';

import {
  AgBarSeriesOptions,
  AgCartesianChartOptions,
} from 'ag-charts-community';
import { AgCharts } from 'ag-charts-react';
import { FC, useMemo } from 'react';

import ChartSkeleton from '@/components/ChartSkeleton';

import { DelegationCount, TotalStake } from '@/app/hooks/use-staking-snapshot';

interface ValidatorsChartProps {
  mode: 'stakers' | 'total';
  delegationsCount: DelegationCount[];
  totalStake: TotalStake[];
  validatorNames?: { [address: string]: string };
  isLoading: boolean;
}

const addressRegex = /^0x[a-fA-F0-9]+$/;

const trimAddress = (address: string) =>
  addressRegex.test(address)
    ? `${address.slice(0, 5)}...${address.slice(-4)}`
    : address;

const getDisplayName = (
  address: string,
  validatorNames?: { [address: string]: string },
) => {
  if (validatorNames && validatorNames[address]) {
    return validatorNames[address];
  }
  return trimAddress(address);
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);

const formatStake = (value: number) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value);

const ValidatorsChart: FC<ValidatorsChartProps> = ({
  mode,
  delegationsCount,
  totalStake,
  validatorNames,
  isLoading,
}) => {
  const chartData = useMemo(() => {
    if (mode === 'stakers') {
      return delegationsCount
        .map((item) => ({
          validator: getDisplayName(item.validator, validatorNames),
          amount: item.count,
          address: item.validator,
        }))
        .sort((a, b) => b.amount - a.amount);
    } else {
      return totalStake
        .map((item) => ({
          validator: getDisplayName(item.validator, validatorNames),
          amount: item.total,
          address: item.validator,
        }))
        .sort((a, b) => b.amount - a.amount);
    }
  }, [mode, delegationsCount, totalStake, validatorNames]);

  const isStakers = mode === 'stakers';

  const options: AgCartesianChartOptions = {
    title: {
      text: isStakers
        ? 'Top Validators by Stakers Count'
        : 'Top Validators by Total Stake',
    },
    subtitle: {
      text: isStakers
        ? 'Validators with the most individual stakers'
        : 'Validators with the highest total stake amount',
      spacing: 40,
    },
    data: chartData,
    series: [
      {
        type: 'bar',
        xKey: 'validator',
        yKey: 'amount',
        yName: isStakers ? 'Number of Stakers' : 'Total Stake (HYPE)',
        fill: '#51D2C1',
        tooltip: {
          renderer: ({ datum }) => ({
            title: `<b>${datum.validator}</b>`,
            content: isStakers
              ? `${formatNumber(datum.amount)} stakers`
              : `${formatStake(datum.amount)} HYPE`,
          }),
        },
      } as AgBarSeriesOptions,
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'Validator', color: '#9ca3af' },
        label: {
          rotation: -45,
        },
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: isStakers ? 'Stakers Count' : 'Total Stake (HYPE)',
          color: '#9ca3af',
        },
        label: {
          formatter: (params) =>
            isStakers ? formatNumber(params.value) : formatStake(params.value),
        },
      },
    ],
    height: 500,
    background: { fill: '#0f1a1f' },
    padding: { top: 30, right: 25, bottom: 30, left: 30 },
    theme: 'ag-default-dark' as const,
  };

  if (isLoading) {
    return (
      <ChartSkeleton
        className='h-[500px]'
        message='Loading validator statistics...'
      />
    );
  }

  if (chartData.length === 0) {
    return (
      <div className='h-[500px] flex items-center justify-center bg-input-background mb-8'>
        <p className='text-gray-400'>No validator data available</p>
      </div>
    );
  }

  return (
    <div className='bg-input-background mb-8'>
      <AgCharts options={options} />
    </div>
  );
};

export default ValidatorsChart;
