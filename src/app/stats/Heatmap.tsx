import { ResponsiveHeatMap } from '@nivo/heatmap';
import { BasicTooltip } from '@nivo/tooltip';
import { useMemo, useState } from 'react';

import ChartSkeleton from '@/components/ChartSkeleton';

import useAssistanceFundBalances from '@/app/hooks/use-assistance-fund-balances';
import useEVMBalance from '@/app/hooks/use-evm-balance';
import useFees from '@/app/hooks/use-fees';
import { useFoundationDelegations } from '@/app/hooks/use-foundation-delegations';
import { useStakedBalance } from '@/app/hooks/use-staked-balance';
import useTokenInfo from '@/app/hooks/use-token-info';
import { calculateReadyForSaleSupply } from '@/utils/token';

import useHypeData from '../hooks/use-hype-data';
import EvmToggle from './EvmToggle';
import { SupplyBreakdown } from './SupplyBreakdown';

const generateHeatmapData = (
  markPrice: number,
  dailyRevenue: number,
  readyForSaleSupply: number,
) => {
  const baseRevenues = [
    '2000000',
    '3000000',
    '4000000',
    '5000000',
    '6000000',
    '7000000',
    '8000000',
    '9000000',
    '10000000',
  ];

  const revenues = [...baseRevenues, dailyRevenue.toString()].sort(
    (a, b) => Number(a) - Number(b),
  );

  // Generate price range from markPrice ± $5
  const prices = Array.from({ length: 11 }, (_, i) => {
    const price = markPrice - 5 + i;
    return price === markPrice ? markPrice : Math.floor(price);
  });

  // Generate data array with 11 rows (5 above, mark price, 5 below)
  // Reverse the prices array to show ascending values on the axis
  return prices.reverse().map((price) => ({
    id: price.toString(),
    data: revenues.map((revenue) => {
      const dailyRevenue = Number(revenue);
      const buybackAmount = dailyRevenue * 0.97; // 97% of revenue used for buyback
      const tokensBoughtPerDay = buybackAmount / price;
      const daysToBuyAll = readyForSaleSupply / tokensBoughtPerDay;
      const yearsToBuyAll = daysToBuyAll / 365;
      return {
        x: revenue,
        y: yearsToBuyAll,
      };
    }),
  }));
};

const labelTextColor = ({ color }: { color: string }) => {
  // get RGB numbers from string
  const [r, g, b] = color
    .replace(/[^\d,]/g, '')
    .split(',')
    .map(Number);

  // Calculate relative luminance
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#ffffff';
};

type Period = 'oneDay' | 'sevenDays' | 'thirtyDays';

const Heatmap = () => {
  const hypeData = useHypeData();
  const { fees } = useFees();
  const { tokenInfo } = useTokenInfo();
  const { stakedBalance } = useStakedBalance();
  const { evmBalance } = useEVMBalance();
  const assistanceFundBalances = useAssistanceFundBalances();
  const { foundationDelegations } = useFoundationDelegations();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('oneDay');
  const [excludeEvm, setExcludeEvm] = useState(false);

  const readyForSaleSupply = useMemo(() => {
    if (!tokenInfo || !assistanceFundBalances.HYPE) return 0;

    return calculateReadyForSaleSupply(
      parseFloat(tokenInfo.circulatingSupply),
      assistanceFundBalances.HYPE,
      stakedBalance,
      excludeEvm ? evmBalance : 0,
      foundationDelegations,
    );
  }, [
    tokenInfo,
    assistanceFundBalances.HYPE,
    stakedBalance,
    evmBalance,
    excludeEvm,
    foundationDelegations,
  ]);

  const data = useMemo(() => {
    if (
      !hypeData?.markPx ||
      !fees?.[selectedPeriod] ||
      !tokenInfo ||
      !assistanceFundBalances.HYPE
    )
      return null;
    const roundedMarkPrice = Number(parseFloat(hypeData.markPx).toFixed(1));
    return generateHeatmapData(
      roundedMarkPrice,
      fees[selectedPeriod],
      readyForSaleSupply,
    );
  }, [
    hypeData?.markPx,
    fees,
    selectedPeriod,
    readyForSaleSupply,
    assistanceFundBalances.HYPE,
    tokenInfo,
  ]);

  if (!data || !fees || !hypeData || !tokenInfo || !assistanceFundBalances.HYPE)
    return (
      <ChartSkeleton
        className='my-14 h-[600px]'
        message='Loading chart data...'
      />
    );

  return (
    <div className='relative w-full'>
      <h2 className='text-center text-xl font-semibold mb-4 text-gray-300'>
        Years to Buy Ready-for-Sale Supply
      </h2>
      <p className='text-center text-sm text-gray-400 mb-6'>
        The Assistance Fund uses 97% of revenue to buy back HYPE tokens. This
        chart shows how many years it would take to buy the ready-for-sale
        supply at different prices and daily revenues.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <div>
          <h3 className='text-base font-medium text-gray-300 mb-2'>
            Daily Revenue
          </h3>
          <p className='text-xs text-gray-400'>
            Assumed daily revenue of the protocol based on historical averages.
          </p>
          <div className='grid grid-cols-3 gap-2 mt-2'>
            <button
              onClick={() => setSelectedPeriod('oneDay')}
              className={`group relative flex flex-col items-start border border-hl-light cursor-pointer rounded-lg bg-white/5 py-2 px-3 text-white shadow-md transition focus:outline-none ${
                selectedPeriod === 'oneDay' &&
                'bg-primary-200/20 border-hl-primary'
              }`}
            >
              <span className='font-semibold text-white text-xs'>24h</span>
              <span className='font-normal text-gray-400 text-xs'>
                {fees.oneDay.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                })}
              </span>
            </button>
            <button
              onClick={() => setSelectedPeriod('sevenDays')}
              className={`group relative flex flex-col items-start border border-hl-light cursor-pointer rounded-lg bg-white/5 py-2 px-3 text-white shadow-md transition focus:outline-none ${
                selectedPeriod === 'sevenDays' &&
                'bg-primary-200/20 border-hl-primary'
              }`}
            >
              <span className='font-semibold text-white text-xs'>7d</span>
              <span className='font-normal text-gray-400 text-xs'>
                {fees.sevenDays.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                })}
              </span>
            </button>
            <button
              onClick={() => setSelectedPeriod('thirtyDays')}
              className={`group relative flex flex-col items-start border border-hl-light cursor-pointer rounded-lg bg-white/5 py-2 px-3 text-white shadow-md transition focus:outline-none ${
                selectedPeriod === 'thirtyDays' &&
                'bg-primary-200/20 border-hl-primary'
              }`}
            >
              <span className='font-semibold text-white text-xs'>30d</span>
              <span className='font-normal text-gray-400 text-xs'>
                {fees.thirtyDays.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                })}
              </span>
            </button>
          </div>
        </div>
        <div>
          <h3 className='text-base font-medium text-gray-300 mb-2'>HyperEVM</h3>
          <p className='text-xs text-gray-400 mb-4'>
            The Assistance Fund currently only buys HYPE from HyperCore spot
            market. Toggle to exclude HYPE bridged to HyperEVM from
            ready-for-sale supply calculations.
          </p>
          <EvmToggle enabled={excludeEvm} onChange={setExcludeEvm} />
        </div>
      </div>

      <p className='flex items-center justify-center text-center text-sm text-gray-400 mb-4'>
        Ready-for-sale supply:{' '}
        <span className='text-accent font-bold ml-2'>
          {readyForSaleSupply.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          HYPE
        </span>
        <SupplyBreakdown
          circulatingSupply={parseFloat(tokenInfo.circulatingSupply)}
          assistanceFundBalance={assistanceFundBalances.HYPE}
          stakedAmount={stakedBalance - foundationDelegations}
          evmAmount={excludeEvm ? evmBalance : 0}
        />
      </p>

      <div className='relative w-full h-[600px] mb-8'>
        <ResponsiveHeatMap
          data={data}
          animate={false}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#bcc4c2',
                },
              },
            },
            text: {
              fill: '#bcc4c2',
            },
            legends: {
              ticks: {
                text: {
                  fill: '#bcc4c2',
                },
              },
              title: {
                text: {
                  fill: '#bcc4c2',
                },
              },
            },
          }}
          margin={{ top: 20, bottom: 120, left: 90 }}
          valueFormat='>-.2f'
          tooltip={({ cell }) => (
            <BasicTooltip
              id={`$${(Number(cell.data.x) / 1_000_000).toFixed(2)}M daily revenue at $${cell.serieId}`}
              value={`${cell.formattedValue ?? ''} years`}
              enableChip={true}
              color={cell.color}
            />
          )}
          axisTop={null}
          axisRight={null}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Price',
            legendPosition: 'middle',
            legendOffset: -65,
            format: (value) => `$${Number(value).toFixed(1)}`,
            renderTick: ({ x, y, value }) => {
              const isCurrentPrice =
                Number(value) === Number(Number(hypeData.markPx).toFixed(1));
              return (
                <g transform={`translate(${x},${y})`} style={{ opacity: 1 }}>
                  <line
                    x1='0'
                    x2='-5'
                    y1='0'
                    y2='0'
                    style={{ stroke: 'rgb(119, 119, 119)', strokeWidth: 1 }}
                  />
                  <text
                    dominantBaseline='central'
                    textAnchor='end'
                    transform='translate(-10,0) rotate(0)'
                    style={{
                      fontFamily: 'sans-serif',
                      fontSize: '11px',
                      fill: isCurrentPrice ? '#98FCE4' : '#bcc4c2',
                    }}
                  >
                    $
                    {isCurrentPrice
                      ? Number(value).toFixed(1)
                      : Math.floor(value)}
                  </text>
                </g>
              );
            },
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Daily Revenue',
            legendPosition: 'middle',
            legendOffset: 45,
            format: (value) => `$${(Number(value) / 1_000_000).toFixed(2)}M`,
            renderTick: ({ x, y, value }) => (
              <g transform={`translate(${x},${y})`} style={{ opacity: 1 }}>
                <line
                  x1='0'
                  x2='0'
                  y1='0'
                  y2='5'
                  style={{ stroke: 'rgb(119, 119, 119)', strokeWidth: 1 }}
                />
                <text
                  dominantBaseline='text-before-edge'
                  textAnchor='middle'
                  transform='translate(0,10) rotate(0)'
                  style={{
                    fontFamily: 'sans-serif',
                    fontSize: '11px',
                    fill:
                      Number(value) === fees[selectedPeriod]
                        ? '#98FCE4'
                        : '#bcc4c2',
                  }}
                >
                  ${(Number(value) / 1_000_000).toFixed(2)}M
                </text>
              </g>
            ),
          }}
          colors={{
            type: 'diverging',
            divergeAt: 0.38,
            scheme: 'red_blue',
          }}
          emptyColor='#555555'
          labelTextColor={labelTextColor}
          legends={[
            {
              anchor: 'bottom',
              translateX: 0,
              translateY: 100,
              length: 400,
              thickness: 20,
              direction: 'row',
              tickPosition: 'after',
              tickSize: 3,
              tickSpacing: 4,
              tickOverlap: false,
              titleAlign: 'start',
              titleOffset: 4,
              title: 'Years to Buy Ready-for-Sale Supply',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Heatmap;
