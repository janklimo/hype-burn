import { useWindowSize } from '@uidotdev/usehooks';
import {
  AgChartOptions,
  AgChartTheme,
  AgDonutSeriesOptions,
  AgSeriesTooltipRendererParams,
} from 'ag-charts-community';
import { AgCharts } from 'ag-charts-react';
import { Segment } from 'next/dist/server/app-render/types';
import { FC } from 'react';

import Skeleton from '@/components/Skeleton';

import useTokenInfo from '@/app/hooks/use-token-info';

const theme: AgChartTheme = {
  palette: {
    fills: ['#98FCE4', '#65b09a', '#f69318', '#163832'], // Added color for Assistance Fund
    strokes: ['#98FCE4', '#65b09a', '#f69318', '#163832'],
  },
};

const sumBalances = (balances: [string, string][]): number => {
  return balances.reduce((sum, [_, balanceStr]) => {
    const balance = parseFloat(balanceStr);
    return sum + balance;
  }, 0);
};

const tooltipContent = (
  params: AgSeriesTooltipRendererParams<Segment>,
): string => {
  const value = params.datum.displayAmount;
  const amount = `${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} HYPE`;
  const share = `${(value / 1_000_000_000).toLocaleString('en-US', {
    style: 'percent',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })}`;

  return `<div><b>Amount</b>: ${amount}</div>
          <div><b>Share</b>: ${share}</div>`;
};

interface Props {
  tokenInfo: ReturnType<typeof useTokenInfo>['tokenInfo'];
  assistanceFundBalance: number;
}

const Chart: FC<Props> = ({ tokenInfo, assistanceFundBalance }) => {
  const { width } = useWindowSize();
  const isMobile = Number(width) <= 768;

  if (!tokenInfo)
    return <Skeleton className='h-96 w-80 md:h-[35rem] md:w-[70rem]' />;

  const circulatingSupply = parseFloat(tokenInfo.circulatingSupply);
  const totalSupply = parseFloat(tokenInfo.totalSupply);
  const burntAmount = 1_000_000_000 - totalSupply;
  const nonCirculatingSupply = sumBalances(
    tokenInfo.nonCirculatingUserBalances,
  );

  // Calculate minimum segment size for better visibility
  const minVisiblePercentage = 0.25;
  const minSegmentSize = (totalSupply * minVisiblePercentage) / 100;

  const otherCirculatingSupply = circulatingSupply - assistanceFundBalance;

  type Segment = {
    asset: string;
    amount: number;
    displayAmount: number;
    radius: number;
  };

  const series: Segment[] = [
    {
      asset: 'Other Circulating Supply',
      amount: otherCirculatingSupply,
      radius: 1,
      displayAmount: otherCirculatingSupply,
    },
    {
      asset: 'Assistance Fund',
      amount: assistanceFundBalance,
      radius: 1,
      displayAmount: assistanceFundBalance,
    },
    {
      asset: 'Burn From Trading Fees',
      amount: Math.max(burntAmount, minSegmentSize),
      radius: 1,
      displayAmount: burntAmount,
    },
    {
      asset: 'Non Circulating Supply',
      amount: nonCirculatingSupply,
      radius: 1,
      displayAmount: nonCirculatingSupply,
    },
  ];

  const seriesOptions: AgDonutSeriesOptions = {
    type: 'donut',
    calloutLabelKey: 'asset',
    angleKey: 'amount',
    innerRadiusRatio: 0.7,
    calloutLabel: { enabled: false },
    radiusKey: 'radius',
    tooltip: {
      renderer: (params) => ({
        title: `<b>${params.datum.asset}</b>`,
        content: tooltipContent(params),
      }),
    },
    listeners: {
      nodeClick: (event) => {
        const { datum } = event;

        if (datum.asset === 'Assistance Fund') {
          window.open(
            'https://hypurrscan.io/address/0xfefefefefefefefefefefefefefefefefefefefe',
            '_blank',
          );
        }
      },
    },
  };

  const chartOptions: AgChartOptions = {
    data: series,
    width: isMobile ? 320 : 1120,
    height: isMobile ? 384 : 560,
    theme,
    background: {
      fill: '#03251F',
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    series: [seriesOptions],
    legend: {
      spacing: 10,
      maxWidth: 350,
      item: {
        paddingX: 32,
        paddingY: 8,
        label: {
          color: '#bcc4c2',
        },
      },
    },
  };

  return <AgCharts options={chartOptions} />;
};

export default Chart;
