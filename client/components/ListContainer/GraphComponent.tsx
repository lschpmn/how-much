import { Palette, Typography, useTheme } from '@mui/material';
import { LineSeriesType, StackOrderType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/internals';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Dosage } from '../../../types';
import { getNowMinute } from '../../lib/utils';
import { CombinedDosage, CombinedDosagesObj, State } from '../../types';

type Props = {
  dosageLength: number,
  showAll: boolean,
};

const GraphComponent = ({ dosageLength, showAll }: Props) => {
  const combinedDosagesObj: CombinedDosagesObj = useSelector((state: State) => state.dosages.combinedDosagesObj, isEqual);
  const hasLoaded = useSelector((state: State) => !!state.dosages.dosages.length);
  const theme = useTheme();
  const nowMinute = getNowMinute();

  const combinedDosages = useMemo(() => {
    let combinedDosages = Object.values(combinedDosagesObj)
      .filter(dosage => dosage.timestamp % 60000 === 0)
      .sort((a, b) => a.timestamp - b.timestamp);

    if (combinedDosages.length > 1440) {
      // if there's more than a day of dosages, reduces to once every five minutes
      combinedDosages = combinedDosages.filter(dosage => dosage.timestamp % 300000 === 0);
    }

    return combinedDosages;
  }, [dosageLength]);

  if (!combinedDosagesObj[nowMinute]) {
    return (
      <Typography color="textPrimary" style={{ textAlign: 'center' }} variant="h3">
        {hasLoaded ? 'No Remaining Amount': 'LOADING'}
      </Typography>
    );
  }

  const amounts = Object.keys(combinedDosagesObj[nowMinute]).filter(k => k !== 'timestamp' && k !== 'amount-total');
  const [xMax, xMin, yMax, yMin] = getGraphEdges(combinedDosages.filter(d => d.timestamp >= nowMinute), showAll);

  return (
    <span style={{ userSelect: 'none' }}>
      <LineChart
        grid={{ horizontal: true, vertical: true }}
        dataset={combinedDosages}
        xAxis={[{
          dataKey: 'timestamp',
          max: xMax,
          min: xMin,
          valueFormatter: value => dayjs(value).format('hh:mma'),
        }]}
        yAxis={[{ max: yMax, min: yMin }]}
        series={getSeries(amounts, yMax > 4 && !showAll, dosageLength, theme.palette)}
        height={300}
      />
    </span>
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
      ? v >= 0.5 ? v?.toFixed(1) : null
      : v?.toFixed(3),
  })),
];

const getGraphEdges = (combinedDosages: CombinedDosage[], showAll: boolean) => {
  const yMax = combinedDosages[0]['amount-total'];
  const yMin = yMax > 4 && !showAll ? 1 : 0.01;
  const xMin = combinedDosages[0].timestamp;

  const maxIndex = yMax > 4 && !showAll
    ? combinedDosages.findIndex(zip => zip['amount-total'] <= 1)
    : combinedDosages.length - 1;

  const xMax = combinedDosages[maxIndex].timestamp;

  return [xMax, xMin, yMax, yMin];
};

export default GraphComponent;
