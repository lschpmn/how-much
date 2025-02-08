import { Typography, useTheme } from '@mui/material';
import { LineSeriesType, StackOrderType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/internals';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import React from 'react';
import { Dosage } from '../../../types';
import { getNowMinute } from '../../lib/utils';
import { CombinedDosage } from '../../types';

type Props = {
  dosages: Dosage[],
};

const GraphComponent = ({ dosages }: Props) => {
  const theme = useTheme();
  const combinedTimeValObj = calculateCombinedTimeVals(dosages);
  const nowMinute = getNowMinute();

  if (!combinedTimeValObj[nowMinute])
    return <Typography color="textPrimary" style={{ textAlign: 'center' }} variant="h3">No Remaining Amount</Typography>;

  const combinedTimeVals = Object.values(combinedTimeValObj).sort((a, b) => a.timestamp - b.timestamp);
  const nowTimeVal = combinedTimeValObj[nowMinute];
  const amounts = Object.keys(nowTimeVal).filter(k => k !== 'timestamp' && k !== 'amount-total');
  const [xMax, xMin, yMax, yMin] = getGraphEdges(combinedTimeVals.filter(d => d.timestamp >= nowMinute), amounts);

  if (yMax > 4) {
    combinedTimeVals.map(combinedTimeVal => amounts.forEach(amount => {
      if (combinedTimeVal[amount] < 0.1) delete combinedTimeVal[amount];
    }));
  }

  return (
    <LineChart
      grid={{ horizontal: true, vertical: true }}
      dataset={combinedTimeVals}
      xAxis={[{
        dataKey: 'timestamp',
        max: xMax,
        min: xMin,
        valueFormatter: value => dayjs(value).format('hh:mma'),
      }]}
      yAxis={[{ max: yMax, min: yMin }]}
      series={getSeries(amounts, yMax, dosages.length, theme.palette.primary.main, theme.palette.secondary.main)}
      height={300}
    />
  );
};

const getSeries = (amounts: string[], yMax: number, length: number, primaryColor: string,
                   secondaryColor: string): MakeOptional<LineSeriesType, 'type'>[] => [
  {
    color: '#121212',
    dataKey: 'amount-total',
    showMark: false,
    valueFormatter: v => 'Total: ' + v?.toFixed(yMax > 4 ? 1 : 3),
  },
  ...amounts.map((amountId, i) => ({
    area: true,
    color: length % 2 === 0
      ? (i % 2 === 0 ? primaryColor : secondaryColor)
      : (i % 2 === 0 ? secondaryColor : primaryColor),
    dataKey: amountId,
    showMark: false,
    stack: 'timestamp',
    stackOrder: 'reverse' as StackOrderType,
    valueFormatter: v => v?.toFixed(yMax > 4 ? 1 : 3),
  })),
];

const getGraphEdges = (combinedTimeVals: CombinedDosage[], amounts: string[]) => {
  const yMax = amounts.reduce((p, c) => combinedTimeVals[0][c] + p, 0);
  const yMin = yMax > 4 ? 1 : 0.001;
  const xMin = combinedTimeVals[0].timestamp;

  const minIndex = yMax > 4
    ? combinedTimeVals.findIndex(zip => amounts.reduce((p, c) => (zip[c] || 0) + p, 0) < 1)
    : combinedTimeVals.length - 1;

  const xMax = combinedTimeVals[minIndex].timestamp;

  return [xMax, xMin, yMax, yMin];
};

const calculateCombinedTimeVals = (dosages: Dosage[]): { [timestamp: number]: CombinedDosage } => {
  const timeValObj: { [timestamp: number]: CombinedDosage } = {};

  for (let dosage of dosages) {
    for (let timeVal of dosage.timeValues) {
      let currTimeValue = timeValObj[timeVal.timestamp];
      if (!currTimeValue) {
        currTimeValue = { 'amount-total': 0, timestamp: timeVal.timestamp };
        timeValObj[timeVal.timestamp] = currTimeValue;
      }

      currTimeValue[`amount-${dosage.id}`] = timeVal.amount;
      currTimeValue['amount-total'] += timeVal.amount;
    }
  }

  return timeValObj;
};

export default GraphComponent;
