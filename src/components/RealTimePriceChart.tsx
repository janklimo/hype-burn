'use client';

import ChartStreaming from '@robloche/chartjs-plugin-streaming';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

import { Balances } from '@/app/hooks/use-assistance-fund-balances';

const chartAreaBackgroundColor = {
  id: 'chartAreaBackgroundColor',
  beforeDraw(chart: any, args: any, options: { color: any }) {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartStreaming,
  chartAreaBackgroundColor,
);

interface Props {
  balances: Balances;
  markPrice: number;
  orderPrice: number;
}

const RealTimePriceChart: FC<Props> = ({ balances, markPrice, orderPrice }) => {
  const timeframe = 3 * 60 * 1000;

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 20,
      },
      animation: {
        duration: 750,
        easing: 'easeInOutQuart' as const,
      },
      interaction: {
        intersect: false,
        mode: 'nearest' as const,
        axis: 'x' as const,
      },
      plugins: {
        chartAreaBackgroundColor: {
          color: '#0E1A1E',
        },
        legend: {
          position: 'top' as const,
          labels: {
            color: '#ccc',
          },
        },
        streaming: {
          duration: timeframe,
          ttl: timeframe * 1.4,
          refresh: 1000,
          delay: 2000,
          frameRate: 30,
          onRefresh: (chart: any) => {
            chart.data.datasets[0].data.push({
              x: Date.now(),
              y: balances.USDC,
            });
            chart.data.datasets[1].data.push({
              x: Date.now(),
              y: orderPrice,
            });
            chart.data.datasets[2].data.push({
              x: Date.now(),
              y: markPrice,
            });
          },
        },
      },
      scales: {
        x: {
          type: 'realtime' as const,
          realtime: {
            duration: timeframe,
            ttl: timeframe * 1.4,
            delay: 1000,
            pause: false,
          },
          time: {
            displayFormats: {
              millisecond: 'HH:mm:ss.SSS',
              second: 'HH:mm:ss',
              minute: 'HH:mm',
              hour: 'HH:mm',
              day: 'MM/dd',
              week: 'MM/dd',
              month: 'MM/yy',
              quarter: 'MM/yy',
              year: 'yyyy',
            },
          },
          ticks: {
            color: '#ccc',
            maxRotation: 0,
            font: {
              size: 10,
            },
          },
          grid: {
            color: '#333',
          },
          borderDash: [5, 5],
        },
        y: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          title: {
            display: true,
            text: 'Price',
          },
          min: Math.round((markPrice - 0.5) * 10) / 10,
          max: Math.round((markPrice + 0.5) * 10) / 10,
          ticks: {
            color: '#ccc',
            callback: (value: string | number) => {
              if (typeof value === 'number') return value.toFixed(3);
              return value;
            },
          },
          grid: {
            color: '#333',
          },
          borderDash: [5, 5],
        },
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          title: {
            display: true,
            text: 'USDC Balance',
          },
          ticks: {
            color: '#ccc',
          },
          min: 0,
          max: Math.max(
            25_000,
            Math.round((balances.USDC * 1.8) / 1000) * 1000,
          ),
          grid: {
            color: '#333',
            drawOnChartArea: false,
          },
          borderDash: [5, 5],
        },
      },
    }),
    [timeframe, balances, markPrice, orderPrice],
  );

  const data = useMemo(
    () => ({
      datasets: [
        {
          label: 'USDC Balance',
          data: [],
          borderColor: '#f7a35c',
          borderWidth: 1,
          backgroundColor: 'rgba(247, 163, 92, 0.5)',
          tension: 0.4,
          yAxisID: 'y1',
          order: 1,
          pointRadius: 0,
        },
        {
          label: 'Limit Order Price',
          data: [],
          borderDash: [5, 5],
          borderColor: '#FF4081',
          backgroundColor: 'rgba(255, 64, 129, 0.5)',
          borderWidth: 1,
          tension: 0.4,
          yAxisID: 'y',
          pointRadius: 0,
        },
        {
          label: 'HYPE Price',
          data: [],
          borderColor: 'rgb(151, 253, 228)',
          backgroundColor: 'rgba(151, 253, 228, 0.5)',
          borderWidth: 2,
          tension: 0.4,
          yAxisID: 'y',
          pointRadius: 0,
        },
      ],
    }),
    [],
  );

  return (
    <div className='h-[400px] w-full'>
      <Line options={options} data={data} />
    </div>
  );
};

export default RealTimePriceChart;
