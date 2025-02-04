import { LineSeriesType, StackOrderType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/internals';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import React from 'react';
import { Dosage } from '../../../types';
import { ZippedDosage } from '../../types';

type Props = {
  dosages: Dosage[],
};

const GraphComponent = ({ dosages }: Props) => {
  const zipped = zipTogetherTimeValues(dosages);
  const amounts = Object.keys(zipped[0]).filter(k => k !== 'timestamp' && k !== 'amount-total');
  const [xMax, xMin, yMax, yMin] = getGraphEdges(zipped, amounts);

  const series: MakeOptional<LineSeriesType, 'type'>[] = [
    {
      color: '#121212',
      dataKey: 'amount-total',
      showMark: false,
      valueFormatter: v => 'Total: ' + v?.toFixed(yMax > 4 ? 1 : 3),
    },
    ...amounts.map(amountId => ({
      area: true,
      dataKey: amountId,
      showMark: false,
      stack: 'timestamp',
      stackOrder: 'reverse' as StackOrderType,
      valueFormatter: v => v?.toFixed(yMax > 4 ? 1 : 3),
    })),
  ];

  if (yMax > 4) {
    zipped.map(zip => amounts.forEach(amount => {
      if (zip[amount] < 0.1) delete zip[amount];
    }));
  }

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
      series={series}
      height={300}
    />
  );
};

const getGraphEdges = (zipped: ZippedDosage[], amounts: string[]) => {
  const yMax = amounts.reduce((p, c) => zipped[0][c] + p, 0);
  const yMin = yMax > 4 ? 1 : 0.001;
  const xMin = zipped[0].timestamp;

  const minIndex = yMax > 4
    ? zipped.findIndex(zip => amounts.reduce((p, c) => (zip[c] || 0) + p, 0) < 1)
    : zipped.length - 1;

  const xMax = zipped[minIndex].timestamp;

  return [xMax, xMin, yMax, yMin];
};



const zipTogetherTimeValues = (dosages: Dosage[], now=Date.now()) => {
  const nowMinute = now - (now % 60000);
  const combinedTimeVals: ZippedDosage[] = [];

  for (let dosage of dosages) {
    const startIndex = dosage.timeValues.findIndex(tv => tv.timestamp === nowMinute);
    if (startIndex === -1) continue;
    const timeValuesSlice = dosage.timeValues.slice(startIndex);

    for (let x = 0; x < timeValuesSlice.length; x++) {
      const currTimeValue = timeValuesSlice[x];
      let combined = combinedTimeVals[x];
      if (!combined) {
        combined = { 'amount-total': 0, timestamp: currTimeValue.timestamp };
        combinedTimeVals.push(combined);
      }

      combined[`amount-${dosage.id}`] = currTimeValue.amount;
    }
  }

  combinedTimeVals.forEach(timeVal => {
    const amounts = Object.keys(timeVal).filter(k => k !== 'timestamp' && k !== 'amount-total');
    let total = 0;

    for (let amount of amounts) {
      total += (timeVal[amount] || 0);
    }

    timeVal['amount-total'] = total;
  });

  return combinedTimeVals;
};

export default GraphComponent;
