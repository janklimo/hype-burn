'use client';

import dynamic from 'next/dynamic';
import { FC, useEffect, useRef, useState } from 'react';

import Skeleton from '@/components/Skeleton';

import { usePriceRevenueData } from '@/app/hooks/use-price-revenue-data';

// Dynamic import to avoid SSR issues with Highcharts
const HighchartsReact = dynamic(() => import('highcharts-react-official'), {
  ssr: false,
});

const PriceRevenueChart: FC = () => {
  const chartRef = useRef(null);
  const { data, isLoading } = usePriceRevenueData();
  const [Highcharts, setHighcharts] = useState<
    typeof import('highcharts/highstock') | null
  >(null);

  useEffect(() => {
    import('highcharts/highstock').then((mod) =>
      setHighcharts(() => mod.default),
    );
  }, []);

  if (isLoading || !data || !Highcharts) {
    return <Skeleton className='h-96 w-full' />;
  }

  // Transform data for Highcharts format
  const priceData: [number, number][] = data
    .filter((d) => d.price !== null)
    .map((d) => [new Date(d.date).getTime(), d.price as number]);

  const revenue7dData: [number, number][] = data
    .filter((d) => d.revenue7dMA !== null)
    .map((d) => [new Date(d.date).getTime(), d.revenue7dMA as number]);

  const revenue30dData: [number, number][] = data
    .filter((d) => d.revenue30dMA !== null)
    .map((d) => [new Date(d.date).getTime(), d.revenue30dMA as number]);

  const revenue90dData: [number, number][] = data
    .filter((d) => d.revenue90dMA !== null)
    .map((d) => [new Date(d.date).getTime(), d.revenue90dMA as number]);

  const options: Highcharts.Options = {
    chart: {
      styledMode: false,
      height: 500,
      backgroundColor: '#0f1a1f',
      spacing: [30, 25, 20, 25],
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
      backgroundColor: '#1f2937',
      borderColor: '#374151',
      style: {
        color: '#9ca3af',
      },
      headerFormat:
        '<div style="font-size: 12px; font-weight: bold; color: #e5e7eb; margin-bottom: 8px;">{point.key}</div><br/>',
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
      text: 'HYPE Price vs Revenue Moving Averages',
      style: {
        color: '#e5e7eb',
        fontSize: '18px',
      },
    },

    subtitle: {
      text: 'Daily close price and 7/30/90-day MA of total protocol revenue',
      style: {
        color: '#9ca3af',
        fontSize: '12px',
      },
    },

    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
        lineWidth: 2,
        boostThreshold: 0,
        turboThreshold: 0,
      },
      line: {
        lineWidth: 2,
      },
    },

    xAxis: {
      type: 'datetime',
      crosshair: {
        width: 1,
        dashStyle: 'Dash',
        color: '#9ca3af',
      },
      labels: {
        style: {
          color: '#9ca3af',
        },
      },
      lineColor: '#374151',
      tickColor: '#374151',
    },

    yAxis: [
      {
        title: {
          text: 'HYPE Price ($)',
          margin: 16,
          style: {
            color: '#9ca3af',
          },
        },
        labels: {
          style: {
            color: '#9ca3af',
          },
          formatter: function () {
            return '$' + this.value;
          },
        },
        gridLineColor: '#374151',
        gridLineDashStyle: 'Dash',
        opposite: false,
      },
      {
        title: {
          text: 'Revenue MA ($)',
          margin: 16,
          style: {
            color: '#9ca3af',
          },
        },
        labels: {
          style: {
            color: '#9ca3af',
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
        color: '#9ca3af',
      },
      itemHoverStyle: {
        color: '#e5e7eb',
      },
    },

    series: [
      {
        type: 'line',
        id: 'hype-price',
        name: 'HYPE Price',
        data: priceData,
        yAxis: 0,
        color: '#98FCE4',
        lineWidth: 2,
        visible: true,
        showInLegend: true,
        legendSymbol: 'lineMarker',
        tooltip: {
          valueDecimals: 2,
          valuePrefix: '$',
        },
      },
      {
        type: 'line',
        name: '7-Day Revenue MA',
        data: revenue7dData,
        yAxis: 1,
        color: '#9b59b6',
        tooltip: {
          valueDecimals: 0,
          valuePrefix: '$',
        },
      },
      {
        type: 'line',
        name: '30-Day Revenue MA',
        data: revenue30dData,
        yAxis: 1,
        color: '#f69318',
        tooltip: {
          valueDecimals: 0,
          valuePrefix: '$',
        },
      },
      {
        type: 'line',
        name: '90-Day Revenue MA',
        data: revenue90dData,
        yAxis: 1,
        color: '#e74c3c',
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
