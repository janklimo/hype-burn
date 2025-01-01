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
import { FOUNDATION_STAKED_AMOUNT } from '@/utils/token';

const SERIES_NAMES = {
  CIRCULATING_OTHER: 'Circulating Supply: Other',
  CIRCULATING_STAKED: 'Circulating Supply: Staked',
  CIRCULATING_ASSISTANCE: 'Circulating Supply: Assistance Fund',
  BURN_TRADING_FEES: 'Burn From Trading Fees',
  NON_CIRCULATING_EMISSIONS: 'Non Circulating Supply: Future Emissions',
  NON_CIRCULATING_OTHER: 'Non Circulating Supply: Other',
} as const;

const colors = [
  '#98FCE4',
  '#c0fff0',
  '#9afdff',
  '#f69318',
  '#2a4d46',
  '#163832',
];

const theme: AgChartTheme = {
  palette: {
    fills: colors,
    strokes: colors,
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
): { title: string; content: string } => {
  const value = params.datum.displayAmount;
  const amount = `${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} HYPE`;

  // Determine title color based on segment
  const isDarkTitle = [
    SERIES_NAMES.CIRCULATING_OTHER,
    SERIES_NAMES.CIRCULATING_STAKED,
    SERIES_NAMES.CIRCULATING_ASSISTANCE,
  ].includes(params.datum.asset);
  const titleStyle = isDarkTitle ? 'color: #03251F;' : '';

  // Special handling for staked balance to show both shares
  if (params.datum.asset === SERIES_NAMES.CIRCULATING_STAKED) {
    const shareOfTotal = `${(value / 1_000_000_000).toLocaleString('en-US', {
      style: 'percent',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })}`;

    const shareOfCirculating = `${(
      value / params.datum.circulatingSupply
    ).toLocaleString('en-US', {
      style: 'percent',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })}`;

    return {
      title: `<b style="${titleStyle}">${params.datum.asset}</b>`,
      content: `<div><b>Amount</b>: ${amount}</div>
                <div><b>Share of Circulating</b>: ${shareOfCirculating}</div>
                <div><b>Share of Total</b>: ${shareOfTotal}</div>`,
    };
  }

  // Default handling for other segments
  const share = `${(value / 1_000_000_000).toLocaleString('en-US', {
    style: 'percent',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })}`;

  return {
    title: `<b style="${titleStyle}">${params.datum.asset}</b>`,
    content: `<div><b>Amount</b>: ${amount}</div>
              <div><b>Share</b>: ${share}</div>`,
  };
};

interface Props {
  tokenInfo: ReturnType<typeof useTokenInfo>['tokenInfo'];
  assistanceFundBalance: number;
  stakedBalance: number;
}

const Chart: FC<Props> = ({
  tokenInfo,
  assistanceFundBalance,
  stakedBalance,
}) => {
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
  const futureEmissions = parseFloat(tokenInfo.futureEmissions);

  // Calculate minimum segment size for better visibility
  const minVisiblePercentage = 0.25;
  const minSegmentSize = (totalSupply * minVisiblePercentage) / 100;

  const stakedSupply = stakedBalance - FOUNDATION_STAKED_AMOUNT;

  const otherCirculatingSupply =
    circulatingSupply - assistanceFundBalance - stakedSupply;

  type Segment = {
    asset: string;
    amount: number;
    displayAmount: number;
    radius: number;
    circulatingSupply?: number;
  };

  const series: Segment[] = [
    {
      asset: SERIES_NAMES.CIRCULATING_OTHER,
      amount: otherCirculatingSupply,
      radius: 1,
      displayAmount: otherCirculatingSupply,
    },
    {
      asset: SERIES_NAMES.CIRCULATING_STAKED,
      amount: stakedSupply,
      radius: 1,
      displayAmount: stakedSupply,
      circulatingSupply,
    },
    {
      asset: SERIES_NAMES.CIRCULATING_ASSISTANCE,
      amount: assistanceFundBalance,
      radius: 1,
      displayAmount: assistanceFundBalance,
    },
    {
      asset: SERIES_NAMES.BURN_TRADING_FEES,
      amount: Math.max(burntAmount, minSegmentSize),
      radius: 1,
      displayAmount: burntAmount,
    },
    {
      asset: SERIES_NAMES.NON_CIRCULATING_EMISSIONS,
      amount: futureEmissions,
      radius: 1,
      displayAmount: futureEmissions,
    },
    {
      asset: SERIES_NAMES.NON_CIRCULATING_OTHER,
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
      renderer: tooltipContent,
    },
    listeners: {
      nodeClick: (event) => {
        const { datum } = event;

        if (datum.asset === SERIES_NAMES.CIRCULATING_ASSISTANCE) {
          window.open(
            'https://hypurrscan.io/address/0xfefefefefefefefefefefefefefefefefefefefe',
            '_blank',
          );
        } else if (datum.asset === SERIES_NAMES.CIRCULATING_STAKED) {
          window.open('https://app.hyperliquid.xyz/staking', '_blank');
        }
      },
    },
  };

  const chartOptions: AgChartOptions = {
    data: series,
    width: isMobile ? 320 : 1120,
    height: isMobile ? 500 : 560,
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
      spacing: 25,
      maxWidth: isMobile ? 350 : 1000,
      position: 'bottom',
      item: {
        paddingX: 24,
        paddingY: 8,
        label: { color: '#bcc4c2' },
      },
    },
  };

  return <AgCharts options={chartOptions} />;
};

export default Chart;
