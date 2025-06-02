'use client';

import { Slider, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  AgBarSeriesOptions,
  AgCartesianChartOptions,
  AgPieSeriesOptions,
  AgPolarChartOptions,
} from 'ag-charts-community';
import { AgCharts } from 'ag-charts-react';
import { FC, useEffect, useState } from 'react';

import ChartSkeleton from '@/components/ChartSkeleton';

import { apiHost } from '@/constant/config';

const barSeriesOptions: AgBarSeriesOptions = {
  type: 'bar' as const,
  xKey: 'builder',
  yKey: 'revenue',
  yName: 'Revenue',
  fill: '#51D2C1',
  tooltip: {
    renderer: ({ datum, yName }) => {
      const value = datum.revenue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return {
        title: `<b>${yName}</b> <small>(${datum.builder})</small>`,
        content: value,
      };
    },
  },
};

const pieSeriesOptions: AgPieSeriesOptions = {
  type: 'pie',
  angleKey: 'revenue',
  legendItemKey: 'builder',
  fills: [
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
  ],
  strokeWidth: 0,
  tooltip: {
    renderer: ({ datum, angleKey }) => {
      const value = datum[angleKey].toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return {
        title: `<b>${datum.builder}</b>`,
        content: value,
      };
    },
  },
};

interface BuilderData {
  builder: string;
  revenue: number;
}

interface DailyData {
  date: string;
  data: BuilderData[];
}

interface Response {
  data: DailyData[];
  metadata: {
    next: number | null;
  };
}

const PrettoSlider = styled(Slider)({
  color: '#51D2C1',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
    backgroundColor: '#51D2C1',
  },
  '& .MuiSlider-rail': {
    opacity: 1,
    backgroundColor: '#51D2C1',
  },
  '& .MuiSlider-thumb': {
    height: 18,
    width: 18,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: '#51D2C1',
    padding: '4px 12px',
    borderRadius: '6px',
    width: 'auto',
    height: 'auto',
    left: '50%',
    transform: 'translate(-50%, -110%)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(-50%, -110%)',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  },
  '& .MuiSlider-markLabel': {
    top: 28,
    fontSize: 12,
    color: '#9CA3AF',
    whiteSpace: 'nowrap',
  },
});

const PrettoSwitch = styled(Switch)({
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      color: '#51D2C1',
      '& + .MuiSwitch-track': {
        backgroundColor: '#51D2C1',
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#51D2C1',
    opacity: 0.5,
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#fff',
    border: '2px solid #51D2C1',
  },
});

const Top: FC = () => {
  const [allData, setAllData] = useState<DailyData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBarChart, setIsBarChart] = useState<boolean>(true);

  const path = '/builder_codes_snapshots/top';

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        let nextUrl: string | null = `${apiHost}${path}`;
        const fetchedData: DailyData[] = [];

        while (nextUrl) {
          const response = await fetch(nextUrl);
          const jsonData: Response = await response.json();
          fetchedData.push(...jsonData.data);
          nextUrl =
            jsonData.metadata.next !== null
              ? `${apiHost}${path}?page=${jsonData.metadata.next}`
              : null;
        }

        setAllData(fetchedData);
        // Set initial selected index to the last entry
        setSelectedIndex(fetchedData.length - 1);
      } catch (error) {
        console.error('Error fetching totals data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Get the selected data point for rendering
  const currentData = allData[selectedIndex];

  // Generate marks with labels for the slider (only first and last, full date with year)
  const marks =
    allData.length > 0
      ? [
          {
            value: 0,
            label: allData[0].date
              ? new Date(allData[0].date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '',
          },
          {
            value: allData.length - 1,
            label: allData[allData.length - 1].date
              ? new Date(allData[allData.length - 1].date).toLocaleDateString(
                  'en-US',
                  { year: 'numeric', month: 'short', day: 'numeric' },
                )
              : '',
          },
        ]
      : [];

  const barChartOptions: AgCartesianChartOptions = {
    title: {
      text: `Builder Codes: Top 20`,
    },
    subtitle: {
      text: `Top 20 builders by revenue (${currentData?.date || ''})`,
      spacing: 40,
    },
    data: currentData?.data,
    series: [barSeriesOptions],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: 'Builder',
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
        keys: ['revenue'],
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

  const pieChartOptions: AgPolarChartOptions = {
    title: {
      text: `Builder Codes: Top 20`,
    },
    subtitle: {
      text: `Top 20 builders by revenue (${currentData?.date || ''})`,
      spacing: 40,
    },
    data: currentData?.data,
    series: [pieSeriesOptions],
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
      <ChartSkeleton className='h-[628px]' message='Loading chart data...' />
    );
  }

  return (
    <div className='bg-input-background'>
      <div className='flex justify-end px-4'>
        <div className='flex items-center gap-1'>
          <span className='text-xs text-hlGray'>Bar chart</span>
          <PrettoSwitch
            checked={!isBarChart}
            onChange={(e) => setIsBarChart(!e.target.checked)}
            disableRipple
          />
          <span className='text-xs text-hlGray'>Pie chart</span>
        </div>
      </div>
      <AgCharts options={isBarChart ? barChartOptions : pieChartOptions} />
      <div className='h-[90px] px-4 flex flex-col items-center'>
        <h3 className='text-sm text-hlGray mb-1 text-center'>
          Choose a date to view data
        </h3>
        <div className='w-1/3'>
          <PrettoSlider
            value={selectedIndex}
            onChange={(_, value) => setSelectedIndex(value as number)}
            aria-label='Date slider'
            valueLabelDisplay='auto'
            step={1}
            marks={marks}
            min={0}
            max={Math.max(0, allData.length - 1)}
            valueLabelFormat={(value) => allData[value]?.date || ''}
          />
        </div>
      </div>
    </div>
  );
};

export default Top;
