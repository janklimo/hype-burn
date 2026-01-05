'use client';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { FC, useRef } from 'react';

import Skeleton from '@/components/Skeleton';

import { usePriceRevenueData } from '@/app/hooks/use-price-revenue-data';

const PriceRevenueChart: FC = () => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const { data, isLoading } = usePriceRevenueData();

  if (isLoading || !data) {
    return <Skeleton className='h-96 w-full' />;
  }

  // Transform data for Highcharts format
  const priceData: [number, number][] = data
    .filter((d) => d.price !== null)
    .map((d) => [new Date(d.date).getTime(), d.price as number]);

  const revenueData: [number, number][] = data
    .filter((d) => d.revenue30dMA !== null)
    .map((d) => [new Date(d.date).getTime(), d.revenue30dMA as number]);

  const options: Highcharts.Options = {
    chart: {
      styledMode: false,
      height: 450,
      backgroundColor: '#03251F',
      zooming: {
        mouseWheel: false,
      },
    },

    credits: {
      enabled: false,
    },

    tooltip: {
      shared: true,
      split: false,
      xDateFormat: '%b %e, %Y',
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
      text: 'HYPE Price vs 30-Day Revenue Moving Average',
      style: {
        color: '#98FCE4',
        fontSize: '18px',
      },
    },

    subtitle: {
      text: 'Daily close price and 30-day MA of total protocol revenue',
      style: {
        color: '#bcc4c2',
        fontSize: '12px',
      },
    },

    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },

    xAxis: {
      type: 'datetime',
      crosshair: {
        width: 1,
        dashStyle: 'Dash',
        color: '#98FCE4',
      },
      labels: {
        style: {
          color: '#bcc4c2',
        },
      },
      lineColor: '#2a4d46',
      tickColor: '#2a4d46',
    },

    yAxis: [
      {
        title: {
          text: 'HYPE Price ($)',
          style: {
            color: '#98FCE4',
          },
        },
        labels: {
          style: {
            color: '#98FCE4',
          },
          formatter: function () {
            return '$' + this.value;
          },
        },
        gridLineColor: '#2a4d46',
        gridLineDashStyle: 'Dash',
        opposite: false,
      },
      {
        title: {
          text: '30-Day Revenue MA ($)',
          style: {
            color: '#f69318',
          },
        },
        labels: {
          style: {
            color: '#f69318',
          },
          formatter: function () {
            const value = this.value as number;
            if (value >= 1_000_000)
              return '$' + (value / 1_000_000).toFixed(1) + 'M';
            if (value >= 1_000) return '$' + (value / 1_000).toFixed(0) + 'K';
            return '$' + value;
          },
        },
        gridLineWidth: 0,
        opposite: true,
      },
    ],

    legend: {
      enabled: true,
      itemStyle: {
        color: '#bcc4c2',
      },
      itemHoverStyle: {
        color: '#98FCE4',
      },
    },

    series: [
      {
        type: 'line',
        name: 'HYPE Price',
        data: priceData,
        yAxis: 0,
        color: '#98FCE4',
        tooltip: {
          valueDecimals: 2,
          valuePrefix: '$',
        },
      },
      {
        type: 'line',
        name: '30-Day Revenue MA',
        data: revenueData,
        yAxis: 1,
        color: '#f69318',
        tooltip: {
          valueDecimals: 0,
          valuePrefix: '$',
        },
      },
    ],
  };

  return (
    <div className='w-full'>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType='stockChart'
        options={options}
        ref={chartRef}
      />
    </div>
  );
};

export default PriceRevenueChart;
