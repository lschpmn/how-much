import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import React from 'react';
import { Dosage } from '../../../types';

type Props = {
  dosages: Dosage[],
};

const GraphComponent = ({ dosages }: Props) => {
  const zipped = zipTogetherTimeValues(dosages);
  const amounts = Object.keys(zipped[0]).filter(k => k !== 'timestamp');
  const [xMax, xMin, yMax, yMin] = getGraphEdges(zipped, amounts);

  return (
    <LineChart
      grid={{ horizontal: true, vertical: true }}
      dataset={zipped}
      xAxis={[{
        dataKey: 'timestamp',
        max: xMax,
        min: xMin,
        valueFormatter: value => dayjs(value).format('hh:mma'),
      }]}
      yAxis={[{ max: yMax, min: yMin }]}
      series={amounts.map(amountId => ({
        area: true,
        dataKey: amountId,
        showMark: false,
        stack: 'timestamp',
        stackOrder: 'ascending',
      }))}
      height={300}
    />
  );
};

const getGraphEdges = (zipped: ZippedDosages, amounts: string[]) => {
  const yMax = amounts.reduce((p, c) => zipped[0][c] + p, 0);
  const yMin = yMax > 2 ? 1 : 0.001
  const xMin = zipped[0].timestamp;

  const minIndex = yMax > 2
    ? zipped.findIndex(zip => amounts.reduce((p, c) => (zip[c] || 0) + p, 0) < 1)
    : zipped.length - 1;

  const xMax = zipped[minIndex].timestamp;

  return [xMax, xMin, yMax, yMin];
};

type ZippedDosages = ({ timestamp: number } & { [key in `amount-${string}`]: number })[];

const zipTogetherTimeValues = (dosages: Dosage[], now=Date.now()) => {
  const nowMinute = now - (now % 60000);
  const combinedTimeVals: ZippedDosages = [];

  for (let dosage of dosages) {
    const startIndex = dosage.timeValues.findIndex(tv => tv.timestamp === nowMinute);
    if (startIndex === -1) continue;
    const timeValuesSlice = dosage.timeValues.slice(startIndex);

    for (let x = 0;x < timeValuesSlice.length;x++) {
      const currTimeValue = timeValuesSlice[x];
      let combined = combinedTimeVals[x];
      if (!combined) {
        combined = { timestamp: currTimeValue.timestamp };
        combinedTimeVals.push(combined);
      }

      combined[`amount-${dosage.id}`] = currTimeValue.amount;
    }
  }

  return combinedTimeVals;
};

export default GraphComponent;
