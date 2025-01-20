'use client';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import 'highcharts/modules/accessibility';
import 'highcharts/modules/price-indicator';
import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';

import { Balances } from '@/app/hooks/use-assistance-fund-balances';

interface Props {
  balances: Balances;
}

const AssistanceFundChart: FC<Props> = ({ balances }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [chartData, setChartData] = useState<{
    usdc: [number, number][];
    hype: [number, number][];
  }>({ usdc: [], hype: [] });

  useEffect(() => {
    if (balances) {
      const timestamp = Date.now();
      const usdcValue = balances.USDC;
      const hypeValue = balances.HYPE;

      if (usdcValue > 0 && hypeValue > 0) {
        setChartData((prev) => {
          const newData = {
            usdc: [...prev.usdc, [timestamp, usdcValue]].slice(-100) as [
              number,
              number,
            ][],
            hype: [...prev.hype, [timestamp, hypeValue]].slice(-100) as [
              number,
              number,
            ][],
          };
          return newData;
        });
      }
    }
  }, [balances]);

  const options: Highcharts.Options = {
    chart: {
      styledMode: true,
      height: 250,
      backgroundColor: 'transparent',
      zooming: {
        mouseWheel: false,
      },
      spacing: [10, 10, 30, 10], // [top, right, bottom, left] - adds more space at bottom
      marginTop: 10,
      marginBottom: 35,
    },

    credits: {
      enabled: false,
    },

    tooltip: {
      enabled: true,
      distance: 30,
      shadow: false,
      xDateFormat: '%H:%M:%S',
    },

    rangeSelector: {
      enabled: false,
    },

    navigator: {
      enabled: false,
    },

    scrollbar: {
      enabled: false,
    },

    title: {
      text: undefined,
    },

    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },

    xAxis: {
      visible: false,
      ordinal: false,
      overscroll: 10 * 1000,
    },

    yAxis: [
      {
        visible: true,
        minRange: 100,
        labels: {
          style: {
            color: '#525151',
            font: '12px Helvetica',
            fontWeight: 'bold',
          },
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject,
          ) {
            return (this.value as number).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            });
          },
        },
        gridLineWidth: 0,
        opposite: false,
      },
      {
        visible: true,
        minRange: 100,
        labels: {
          align: 'left',
          x: 8,
        },
        gridLineWidth: 0,
        opposite: true,
      },
    ],

    defs: {
      neon: {
        tagName: 'filter',
        attributes: {
          id: 'neon',
          opacity: 1.0,
        },
        children: [
          {
            tagName: 'feGaussianBlur',
            attributes: {
              result: 'coloredBlur',
              stdDeviation: 6,
            },
          },
          {
            tagName: 'feMerge',
            children: [
              {
                tagName: 'feMergeNode',
                attributes: {
                  in: 'coloredBlur',
                },
              },
              {
                tagName: 'feMergeNode',
                attributes: {
                  in: 'SourceGraphic',
                },
              },
            ],
          },
        ],
      },
    },

    series: [
      {
        type: 'line',
        name: 'USDC Balance',
        data: chartData.usdc,
        yAxis: 0,
        tooltip: {
          valueDecimals: 0,
        },
      },
      {
        type: 'line',
        name: 'HYPE Balance',
        data: chartData.hype,
        yAxis: 1,
        tooltip: {
          valueDecimals: 0,
        },
      },
    ],
  };

  return (
    <div id='container' className='mt-4 relative'>
      <div className='absolute z-10 left-6 top-11 -translate-y-[calc(100%+4px)]'>
        <div className='w-6 md:w-7'>
          <Image
            src='/images/usdc.svg'
            width={64}
            height={64}
            priority
            alt='USDC'
            className='rounded-full'
          />
        </div>
      </div>
      <div className='absolute z-10 right-6 top-11 -translate-y-[calc(100%+4px)]'>
        <div className='w-6 md:w-8'>
          <Image
            src='/images/hype.png'
            width={64}
            height={64}
            priority
            alt='HYPE'
            className='rounded-full'
          />
        </div>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType='stockChart'
        options={options}
        ref={chartRef}
      />
    </div>
  );
};

export default AssistanceFundChart;
