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

import { useFoundationDelegations } from '@/app/hooks/use-foundation-delegations';
import { usePerpDexsStake } from '@/app/hooks/use-perp-dexs-stake';
import useTokenInfo from '@/app/hooks/use-token-info';

const SERIES_NAMES = {
  CIRCULATING_OTHER: 'Circulating Supply: Other',
  CIRCULATING_STAKED: 'Circulating Supply: Staked',
  CIRCULATING_PERP_DEXS: 'Circulating Supply: HIP-3 Builder Stakes',
  BURN_TRADING_FEES: 'Burn: Trading Fees',
  NON_CIRCULATING_EMISSIONS: 'Non Circulating Supply: Future Emissions',
  NON_CIRCULATING_ASSISTANCE: 'Non Circulating Supply: Assistance Fund',
  NON_CIRCULATING_OTHER: 'Non Circulating Supply: Other',
} as const;

const colors = [
  '#98FCE4', // Circulating Supply: Other
  '#c0fff0', // Circulating Supply: Staked
  '#faf3dd', // Circulating Supply: HIP-3 Builder Stakes
  '#f69318', // Burn: Trading Fees
  '#2a4d46', // Non Circulating Supply: Future Emissions
  '#fab866', // Non Circulating Supply: Assistance Fund
  '#163832', // Non Circulating Supply: Other
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
    SERIES_NAMES.CIRCULATING_PERP_DEXS,
    SERIES_NAMES.NON_CIRCULATING_ASSISTANCE,
  ].includes(params.datum.asset);
  const titleStyle = isDarkTitle ? 'color: #03251F;' : '';

  if (
    [
      SERIES_NAMES.CIRCULATING_OTHER,
      SERIES_NAMES.CIRCULATING_STAKED,
      SERIES_NAMES.CIRCULATING_PERP_DEXS,
    ].includes(params.datum.asset)
  ) {
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
  stakedBalance: number;
  burntEVMBalance: number;
}

const Chart: FC<Props> = ({ tokenInfo, stakedBalance, burntEVMBalance }) => {
  const { width } = useWindowSize();
  const isMobile = Number(width) <= 768;
  const { foundationDelegations } = useFoundationDelegations();
  const { perpDexsStake } = usePerpDexsStake();

  if (!tokenInfo)
    return <Skeleton className='h-96 w-80 md:h-[35rem] md:w-[70rem]' />;

  const circulatingSupply = parseFloat(tokenInfo.circulatingSupply);
  const totalSupply = parseFloat(tokenInfo.totalSupply);
  const burntAmount = 1_000_000_000 - totalSupply + burntEVMBalance;
  const totalNonCirculatingSupply = sumBalances(
    tokenInfo.nonCirculatingUserBalances,
  );
  const { assistanceFundBalance } = tokenInfo;
  // Assistance fund is now part of nonCirculatingUserBalances, subtract it for "Other"
  const nonCirculatingOther = totalNonCirculatingSupply - assistanceFundBalance;
  const futureEmissions = parseFloat(tokenInfo.futureEmissions);

  // Calculate minimum segment size for better visibility
  const minVisiblePercentage = 0.25;
  const minSegmentSize = (totalSupply * minVisiblePercentage) / 100;

  const stakedSupply = stakedBalance - foundationDelegations - perpDexsStake;

  // Subtract burntEVMBalance to avoid double counting (also counted in burn segment)
  const otherCirculatingSupply =
    circulatingSupply - stakedSupply - perpDexsStake - burntEVMBalance;

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
      circulatingSupply,
    },
    {
      asset: SERIES_NAMES.CIRCULATING_STAKED,
      amount: stakedSupply,
      radius: 1,
      displayAmount: stakedSupply,
      circulatingSupply,
    },
    {
      asset: SERIES_NAMES.CIRCULATING_PERP_DEXS,
      amount: Math.max(perpDexsStake, minSegmentSize),
      radius: 1,
      displayAmount: perpDexsStake,
      circulatingSupply,
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
      asset: SERIES_NAMES.NON_CIRCULATING_ASSISTANCE,
      amount: assistanceFundBalance,
      radius: 1,
      displayAmount: assistanceFundBalance,
    },
    {
      asset: SERIES_NAMES.NON_CIRCULATING_OTHER,
      amount: nonCirculatingOther,
      radius: 1,
      displayAmount: nonCirculatingOther,
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
    // Only enable click listeners on desktop to avoid touch event issues on mobile
    ...(isMobile
      ? {}
      : {
          listeners: {
            nodeClick: (event) => {
              const { datum } = event;

              if (datum.asset === SERIES_NAMES.NON_CIRCULATING_ASSISTANCE) {
                window.open(
                  'https://hypurrscan.io/address/0xfefefefefefefefefefefefefefefefefefefefe',
                  '_blank',
                );
              } else if (datum.asset === SERIES_NAMES.CIRCULATING_STAKED) {
                window.open('https://app.hyperliquid.xyz/staking', '_blank');
              }
            },
          },
        }),
  };

  const chartOptions: AgChartOptions = {
    data: series,
    width: isMobile ? 320 : 1120,
    height: isMobile ? 610 : 560,
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
