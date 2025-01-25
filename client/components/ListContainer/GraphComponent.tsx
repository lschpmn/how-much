import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import React from 'react';
import { Dosage } from '../../../types';
import { setGraphTimes } from '../../lib/utils';

type Props = {
  dosages: Dosage[],
  total: number,
};

const GraphComponent = ({ dosages, total }: Props) => {
  const graphVals = setGraphTimes(total, Date.now());
  const axis = total > 2 ? 1 : 0.05;
  const zipped = zipTogetherTimeValues(dosages);
  const ids = Object.keys(zipped[0]).filter(p => p !== 'timestamp');

  return (
    <LineChart
      grid={{ horizontal: true, vertical: true }}
      dataset={zipped}
      xAxis={[{
        dataKey: 'timestamp',
        max: graphVals.find(gv => gv['amount-test1'] < axis)?.timestamp,
        min: graphVals[0].timestamp,
        valueFormatter: value => dayjs(value).format('hh:mma'),
      }]}
      yAxis={[{ max: total, min: axis }]}
      series={ids.map(id => ({
        area: true,
        dataKey: id,
        showMark: false,
        stack: 'timestamp',
        stackOrder: 'ascending'
      }))}
      height={300}
    />
  );
};

const zipTogetherTimeValues = (dosages: Dosage[], now=Date.now()) => {
  const nowMinute = now - (now % 60000);
  const combinedTimeVals: ({ timestamp: number } & { [key in `amount-${string}`]: number })[] = [];

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
