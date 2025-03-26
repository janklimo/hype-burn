import { ResponsiveHeatMap } from '@nivo/heatmap';

const data = [
  {
    id: 'Japan',
    data: [
      {
        x: 'Train',
        y: 14381,
      },
      {
        x: 'Subway',
        y: 69277,
      },
      {
        x: 'Bus',
        y: -29405,
      },
      {
        x: 'Car',
        y: 72410,
      },
      {
        x: 'Boat',
        y: 44730,
      },
      {
        x: 'Moto',
        y: 77451,
      },
      {
        x: 'Moped',
        y: -13678,
      },
      {
        x: 'Bicycle',
        y: -87746,
      },
      {
        x: 'Others',
        y: 98491,
      },
    ],
  },
  {
    id: 'France',
    data: [
      {
        x: 'Train',
        y: 61322,
      },
      {
        x: 'Subway',
        y: -38631,
      },
      {
        x: 'Bus',
        y: -43877,
      },
      {
        x: 'Car',
        y: 55636,
      },
      {
        x: 'Boat',
        y: -91974,
      },
      {
        x: 'Moto',
        y: 47885,
      },
      {
        x: 'Moped',
        y: 29321,
      },
      {
        x: 'Bicycle',
        y: 78996,
      },
      {
        x: 'Others',
        y: 5612,
      },
    ],
  },
  {
    id: 'US',
    data: [
      {
        x: 'Train',
        y: -12437,
      },
      {
        x: 'Subway',
        y: 19619,
      },
      {
        x: 'Bus',
        y: -88635,
      },
      {
        x: 'Car',
        y: -93885,
      },
      {
        x: 'Boat',
        y: 22480,
      },
      {
        x: 'Moto',
        y: -55636,
      },
      {
        x: 'Moped',
        y: 52865,
      },
      {
        x: 'Bicycle',
        y: 59736,
      },
      {
        x: 'Others',
        y: 43676,
      },
    ],
  },
  {
    id: 'Germany',
    data: [
      {
        x: 'Train',
        y: 33319,
      },
      {
        x: 'Subway',
        y: 15495,
      },
      {
        x: 'Bus',
        y: -42093,
      },
      {
        x: 'Car',
        y: -98942,
      },
      {
        x: 'Boat',
        y: -71838,
      },
      {
        x: 'Moto',
        y: 21217,
      },
      {
        x: 'Moped',
        y: -80300,
      },
      {
        x: 'Bicycle',
        y: -27411,
      },
      {
        x: 'Others',
        y: -4106,
      },
    ],
  },
  {
    id: 'Norway',
    data: [
      {
        x: 'Train',
        y: -53806,
      },
      {
        x: 'Subway',
        y: 50132,
      },
      {
        x: 'Bus',
        y: 901,
      },
      {
        x: 'Car',
        y: 14352,
      },
      {
        x: 'Boat',
        y: -30586,
      },
      {
        x: 'Moto',
        y: -38517,
      },
      {
        x: 'Moped',
        y: 55157,
      },
      {
        x: 'Bicycle',
        y: 72251,
      },
      {
        x: 'Others',
        y: -14017,
      },
    ],
  },
  {
    id: 'Iceland',
    data: [
      {
        x: 'Train',
        y: 17218,
      },
      {
        x: 'Subway',
        y: -94725,
      },
      {
        x: 'Bus',
        y: -67553,
      },
      {
        x: 'Car',
        y: 12367,
      },
      {
        x: 'Boat',
        y: 29020,
      },
      {
        x: 'Moto',
        y: 9490,
      },
      {
        x: 'Moped',
        y: -1517,
      },
      {
        x: 'Bicycle',
        y: -66763,
      },
      {
        x: 'Others',
        y: 7115,
      },
    ],
  },
  {
    id: 'UK',
    data: [
      {
        x: 'Train',
        y: -91243,
      },
      {
        x: 'Subway',
        y: 17759,
      },
      {
        x: 'Bus',
        y: -80292,
      },
      {
        x: 'Car',
        y: 53883,
      },
      {
        x: 'Boat',
        y: -41313,
      },
      {
        x: 'Moto',
        y: -72041,
      },
      {
        x: 'Moped',
        y: 16402,
      },
      {
        x: 'Bicycle',
        y: 77199,
      },
      {
        x: 'Others',
        y: -33215,
      },
    ],
  },
  {
    id: 'Vietnam',
    data: [
      {
        x: 'Train',
        y: 33738,
      },
      {
        x: 'Subway',
        y: 24527,
      },
      {
        x: 'Bus',
        y: -11137,
      },
      {
        x: 'Car',
        y: -12463,
      },
      {
        x: 'Boat',
        y: 88558,
      },
      {
        x: 'Moto',
        y: 94503,
      },
      {
        x: 'Moped',
        y: -29017,
      },
      {
        x: 'Bicycle',
        y: -96755,
      },
      {
        x: 'Others',
        y: -61051,
      },
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
    margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
    valueFormat='>-.2s'
    axisBottom={null}
    axisTop={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: '',
      legendOffset: 46,
      truncateTickAt: 0,
    }}
    axisRight={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'country',
      legendPosition: 'middle',
      legendOffset: 70,
      truncateTickAt: 0,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'country',
      legendPosition: 'middle',
      legendOffset: -72,
      truncateTickAt: 0,
    }}
    colors={{
      type: 'diverging',
      scheme: 'greens',
      divergeAt: 0.5,
      minValue: -100000,
      maxValue: 100000,
    }}
    emptyColor='#555555'
    legends={[
      {
        anchor: 'bottom',
        translateX: 0,
        translateY: 30,
        length: 400,
        thickness: 8,
        direction: 'row',
        tickPosition: 'after',
        tickSize: 3,
        tickSpacing: 4,
        tickOverlap: false,
        tickFormat: '>-.2s',
        titleAlign: 'start',
        titleOffset: 4,
      },
    ]}
  />
);

export default Heatmap;
