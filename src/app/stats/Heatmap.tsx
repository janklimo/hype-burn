import { ResponsiveHeatMap } from '@nivo/heatmap';

const labelTextColor = ({ color }: { color: string }) => {
  // get RGB numbers from string
  const [r, g, b] = color
    .replace(/[^\d,]/g, '')
    .split(',')
    .map(Number);

  // Calculate relative luminance
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#ffffff';
};

const data = [
  {
    id: '15',
    data: [
      { x: '1000000', y: 5.14 },
      { x: '1250000', y: 4.11 },
      { x: '1500000', y: 3.42 },
      { x: '1750000', y: 2.94 },
      { x: '2000000', y: 2.57 },
      { x: '2250000', y: 2.28 },
      { x: '2500000', y: 2.05 },
      { x: '2750000', y: 1.87 },
      { x: '3000000', y: 1.71 },
    ],
  },
  {
    id: '14',
    data: [
      { x: '1000000', y: 4.79 },
      { x: '1250000', y: 3.84 },
      { x: '1500000', y: 3.2 },
      { x: '1750000', y: 2.74 },
      { x: '2000000', y: 2.4 },
      { x: '2250000', y: 2.13 },
      { x: '2500000', y: 1.92 },
      { x: '2750000', y: 1.74 },
      { x: '3000000', y: 1.6 },
    ],
  },
  {
    id: '13',
    data: [
      { x: '1000000', y: 4.45 },
      { x: '1250000', y: 3.56 },
      { x: '1500000', y: 2.97 },
      { x: '1750000', y: 2.54 },
      { x: '2000000', y: 2.23 },
      { x: '2250000', y: 1.98 },
      { x: '2500000', y: 1.78 },
      { x: '2750000', y: 1.62 },
      { x: '3000000', y: 1.48 },
    ],
  },
  {
    id: '12',
    data: [
      { x: '1000000', y: 4.11 },
      { x: '1250000', y: 3.29 },
      { x: '1500000', y: 2.74 },
      { x: '1750000', y: 2.35 },
      { x: '2000000', y: 2.05 },
      { x: '2250000', y: 1.83 },
      { x: '2500000', y: 1.64 },
      { x: '2750000', y: 1.49 },
      { x: '3000000', y: 1.37 },
    ],
  },
  {
    id: '11',
    data: [
      { x: '1000000', y: 3.77 },
      { x: '1250000', y: 3.01 },
      { x: '1500000', y: 2.51 },
      { x: '1750000', y: 2.15 },
      { x: '2000000', y: 1.88 },
      { x: '2250000', y: 1.67 },
      { x: '2500000', y: 1.51 },
      { x: '2750000', y: 1.37 },
      { x: '3000000', y: 1.26 },
    ],
  },
  {
    id: '10',
    data: [
      { x: '1000000', y: 3.42 },
      { x: '1250000', y: 2.74 },
      { x: '1500000', y: 2.28 },
      { x: '1750000', y: 1.96 },
      { x: '2000000', y: 1.71 },
      { x: '2250000', y: 1.52 },
      { x: '2500000', y: 1.37 },
      { x: '2750000', y: 1.25 },
      { x: '3000000', y: 1.14 },
    ],
  },
  {
    id: '9',
    data: [
      { x: '1000000', y: 3.08 },
      { x: '1250000', y: 2.47 },
      { x: '1500000', y: 2.05 },
      { x: '1750000', y: 1.76 },
      { x: '2000000', y: 1.54 },
      { x: '2250000', y: 1.37 },
      { x: '2500000', y: 1.23 },
      { x: '2750000', y: 1.12 },
      { x: '3000000', y: 1.03 },
    ],
  },
  {
    id: '8',
    data: [
      { x: '1000000', y: 2.74 },
      { x: '1250000', y: 2.19 },
      { x: '1500000', y: 1.83 },
      { x: '1750000', y: 1.57 },
      { x: '2000000', y: 1.37 },
      { x: '2250000', y: 1.22 },
      { x: '2500000', y: 1.1 },
      { x: '2750000', y: 1.0 },
      { x: '3000000', y: 0.91 },
    ],
  },
  {
    id: '7',
    data: [
      { x: '1000000', y: 2.4 },
      { x: '1250000', y: 1.92 },
      { x: '1500000', y: 1.6 },
      { x: '1750000', y: 1.37 },
      { x: '2000000', y: 1.2 },
      { x: '2250000', y: 1.07 },
      { x: '2500000', y: 0.96 },
      { x: '2750000', y: 0.87 },
      { x: '3000000', y: 0.8 },
    ],
  },
  {
    id: '6',
    data: [
      { x: '1000000', y: 2.05 },
      { x: '1250000', y: 1.64 },
      { x: '1500000', y: 1.37 },
      { x: '1750000', y: 1.17 },
      { x: '2000000', y: 1.03 },
      { x: '2250000', y: 0.91 },
      { x: '2500000', y: 0.82 },
      { x: '2750000', y: 0.75 },
      { x: '3000000', y: 0.68 },
    ],
  },
];

const Heatmap = () => (
  <ResponsiveHeatMap
    data={data}
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
    margin={{ top: 60, right: 90, bottom: 120, left: 90 }}
    valueFormat='>-.2f'
    axisTop={null}
    axisRight={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Price',
      legendPosition: 'middle',
      legendOffset: 45,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Price',
      legendPosition: 'middle',
      legendOffset: -45,
    }}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Daily Revenue',
      legendPosition: 'middle',
      legendOffset: 45,
    }}
    colors={{
      type: 'diverging',
      divergeAt: 0.45,
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
);

export default Heatmap;
