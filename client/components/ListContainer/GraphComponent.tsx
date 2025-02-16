import { Palette, Typography, useTheme } from '@mui/material';
import { LineSeriesType, StackOrderType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/internals';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Dosage } from '../../../types';
import { getNowMinute } from '../../lib/utils';
import { CombinedDosage } from '../../types';

type Props = {
  dosages: Dosage[],
};

const GraphComponent = ({ dosages }: Props) => {
  const theme = useTheme();
  const nowMinute = getNowMinute();

  const [combinedTimeValObj, combinedTimeVals] = useMemo(() => {
    const combinedTimeValObj = calculateCombinedTimeVals(dosages);
    const combinedTimeVals = Object.values(combinedTimeValObj).sort((a, b) => a.timestamp - b.timestamp);

    return [combinedTimeValObj, combinedTimeVals];
  }, [dosages.length]);

  if (!combinedTimeValObj[nowMinute]) {
    return (
      <Typography color="textPrimary" style={{ textAlign: 'center' }} variant="h3">
        {dosages.length === 0 ? 'LOADING' : 'No Remaining Amount'}
      </Typography>
    );
  }

  const nowTimeVal = combinedTimeValObj[nowMinute];
  const amounts = Object.keys(nowTimeVal).filter(k => k !== 'timestamp' && k !== 'amount-total');
  const [xMax, xMin, yMax, yMin] = getGraphEdges(combinedTimeVals.filter(d => d.timestamp >= nowMinute), amounts);

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
      series={getSeries(amounts, yMax > 4, dosages.length, theme.palette)}
      height={300}
    />
  );
};

const getSeries = (amounts: string[], bigMode: boolean, length: number,
                   palette: Palette): MakeOptional<LineSeriesType, 'type'>[] => [
  {
    color: '#121212',
    dataKey: 'amount-total',
    showMark: false,
    valueFormatter: v => 'Total: ' + v?.toFixed(bigMode ? 1 : 3),
  },
  ...amounts.map((amountId, i) => ({
    area: true,
    color: length % 2 === 0
      ? (i % 2 === 0 ? palette.primary.main : palette.secondary.main)
      : (i % 2 === 0 ? palette.secondary.main : palette.primary.main),
    dataKey: amountId,
    showMark: false,
    stack: 'timestamp',
    stackOrder: 'reverse' as StackOrderType,
    valueFormatter: v => bigMode
      ? v > 0.1 ? v?.toFixed(1) : null
      : v?.toFixed(3),
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
