import { useWindowSize } from '@uidotdev/usehooks';
import {
  AgChartOptions,
  AgChartTheme,
  AgDonutSeriesOptions,
} from 'ag-charts-community';
import { AgCharts } from 'ag-charts-react';
import { FC } from 'react';

import Skeleton from '@/components/Skeleton';

import useTokenInfo from '@/app/hooks/use-token-info';

const theme: AgChartTheme = {
  palette: {
    fills: ['#98FCE4', '#f69318', '#163832'],
    strokes: ['#98FCE4', '#f69318', '#163832'],
  },
};

const sumBalances = (balances: [string, string][]): number => {
  return balances.reduce((sum, [_, balanceStr]) => {
    const balance = parseFloat(balanceStr);
    return sum + balance;
  }, 0);
};

interface Props {
  tokenInfo: ReturnType<typeof useTokenInfo>['tokenInfo'];
}

const Chart: FC<Props> = ({ tokenInfo }) => {
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
  const minVisiblePercentage = 0.2;
  const minSegmentSize = (totalSupply * minVisiblePercentage) / 100;

  const series = [
    {
      asset: 'Circulating Supply',
      amount: circulatingSupply,
      radius: 1,
      displayAmount: circulatingSupply, // Original amount for tooltip
    },
    {
      asset: 'Burn From Trading Fees',
      amount: Math.max(burntAmount, minSegmentSize), // Ensure minimum visible size
      radius: 1.4,
      displayAmount: burntAmount, // Original amount for tooltip
    },
    {
      asset: 'Non Circulating Supply',
      amount: nonCirculatingSupply,
      radius: 1,
      displayAmount: nonCirculatingSupply, // Original amount for tooltip
    },
  ];

  const seriesOptions: AgDonutSeriesOptions = {
    type: 'donut',
    calloutLabelKey: 'asset',
    angleKey: 'amount',
    innerRadiusRatio: 0.7,
    calloutLabel: {
      enabled: true,
      minAngle: 20, // Only show labels for segments larger than 20 degrees
      offset: 10,
      color: '#bcc4c2',
    },
    radiusKey: 'radius',
    innerLabels: [
      {
        text: 'Total Supply',
        fontWeight: 'bold',
        color: '#bcc4c2',
        spacing: 10,
      },
      {
        text: totalSupply.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        spacing: 4,
        fontSize: isMobile ? 18 : 24,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        color: '#98FCE4',
      },
      {
        text: 'HYPE',
        spacing: 8,
        fontSize: isMobile ? 16 : 22,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        color: '#98FCE4',
      },
    ],
    tooltip: {
      renderer: (params) => ({
        title: params.datum.asset,
        content: `${params.datum.displayAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} HYPE`,
      }),
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
        marker: {
          size: 15,
          strokeWidth: 2,
        },
        label: {
          color: '#bcc4c2',
        },
      },
    },
  };

  return <AgCharts options={chartOptions} />;
};

export default Chart;
