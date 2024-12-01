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

  if (!tokenInfo)
    return <Skeleton className='h-96 w-80 md:h-[35rem] md:w-[70rem]' />;

  const circulatingSupply = parseFloat(tokenInfo.circulatingSupply);
  const totalSupply = parseFloat(tokenInfo.totalSupply);
  const burntAmount = 1_000_000_000 - totalSupply;

  const series = [
    { asset: 'Circulating Supply', amount: circulatingSupply, radius: 1 },
    {
      asset: 'Burn From Trading Fees',
      amount: burntAmount,
      radius: 1.4,
    },
    {
      asset: 'Non Circulating Supply',
      amount: sumBalances(tokenInfo.nonCirculatingUserBalances),
      radius: 1,
    },
  ];

  const seriesOptions: AgDonutSeriesOptions = {
    type: 'donut',
    calloutLabelKey: 'asset',
    angleKey: 'amount',
    innerRadiusRatio: 0.7,
    calloutLabel: {
      enabled: false,
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
        fontSize: Number(width) > 768 ? 24 : 18,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        color: '#98FCE4',
      },
      {
        text: 'HYPE',
        spacing: 8,
        fontSize: Number(width) > 768 ? 22 : 16,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        color: '#98FCE4',
      },
    ],
    tooltip: {
      renderer: (params) => ({
        title: params.datum.asset,
        content: `${params.datum.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PURR`,
      }),
    },
  };

  const chartOptions: AgChartOptions = {
    data: series,
    width: Number(width) > 768 ? 1120 : 320,
    height: Number(width) > 768 ? 560 : 384,
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
