'use client';

import {
  AgCartesianChartOptions,
  AgLineSeriesOptions,
} from 'ag-charts-community';
import { AgCharts } from 'ag-charts-react';
import { FC, useEffect, useState } from 'react';

import ChartSkeleton from '@/components/ChartSkeleton';

import { apiHost } from '@/constant/config';

interface IndividualData {
  date: string;
  [key: string]: string | number;
}

interface Response {
  data: {
    builders: string[];
    individual_data: IndividualData[];
  };
  metadata: {
    next: number | null;
  };
}

const IndividualBuilders: FC = () => {
  const [allData, setAllData] = useState<IndividualData[]>([]);
  const [builders, setBuilders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const path = '/builder_codes_snapshots/individual';

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        let nextUrl: string | null = `${apiHost}${path}`;
        const fetchedData: IndividualData[] = [];
        let fetchedBuilders: string[] = [];

        while (nextUrl) {
          const response = await fetch(nextUrl);
          const jsonData: Response = await response.json();

          if (fetchedBuilders.length === 0) {
            fetchedBuilders = jsonData.data.builders;
          }

          fetchedData.push(...jsonData.data.individual_data);
          nextUrl =
            jsonData.metadata.next !== null
              ? `${apiHost}${path}?page=${jsonData.metadata.next}`
              : null;
        }

        setAllData(fetchedData);
        setBuilders(fetchedBuilders);
      } catch (error) {
        console.error('Error fetching individual builders data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Create line series for each builder
  const series: AgLineSeriesOptions[] = builders.map((builder, index) => {
    const color = [
      '#51D2C1',
      '#4CAF50',
      '#2196F3',
      '#FFC107',
      '#FF5722',
      '#9C27B0',
      '#E91E63',
      '#00BCD4',
      '#8BC34A',
      '#FF9800',
      '#795548',
      '#607D8B',
      '#3F51B5',
      '#009688',
      '#673AB7',
      '#FFEB3B',
      '#CDDC39',
      '#FF4081',
      '#00E676',
      '#FF6E40',
    ][index % 20];

    return {
      type: 'line',
      xKey: 'date',
      yKey: builder,
      yName: builder,
      stroke: color,
      marker: {
        enabled: true,
        fill: color,
        stroke: color,
        size: 6,
      },
      tooltip: {
        renderer: ({ datum, yKey, yName }) => {
          const value = datum[yKey].toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          return {
            title: `<b>${yName}</b> <small>(${datum.date})</small>`,
            content: value,
          };
        },
      },
    };
  });

  const chartOptions: AgCartesianChartOptions = {
    title: {
      text: `Builder Codes: Individual Builders`,
    },
    subtitle: {
      text: `Revenue over time`,
      spacing: 40,
    },
    data: allData,
    series: series,
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: 'Date',
          color: '#9ca3af',
        },
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Revenue',
          color: '#9ca3af',
        },
        gridLine: {
          style: [
            {
              stroke: 'rgba(255, 255, 255, 0.2)',
              lineDash: [4, 2],
            },
          ],
        },
        label: {
          formatter: (params) => {
            const value = params.value;
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
              maximumFractionDigits: 1,
            }).format(value);
          },
        },
      },
    ],
    height: 500,
    background: { fill: '#0f1a1f' },
    padding: {
      top: 30,
      right: 25,
      bottom: 20,
      left: 25,
    },
    tooltip: {
      range: 'nearest',
    },
    theme: 'ag-default-dark' as const,
  };

  if (isLoading) {
    return (
      <ChartSkeleton className='h-[500px]' message='Loading chart data...' />
    );
  }

  return (
    <div className='bg-input-background'>
      <AgCharts options={chartOptions} />
    </div>
  );
};

export default IndividualBuilders;
