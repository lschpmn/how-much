import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import React from 'react';
import { setGraphTimes } from '../../lib/utils';

type Props = {
  total: number,
};

const GraphComponent = ({ total }: Props) => {
  const graphVals = setGraphTimes(total, Date.now());
  const axis = total > 2 ? 1 : 0.05;
  console.log('length', graphVals.length);
  console.log('graphs', graphVals);

  return (
    <LineChart
      grid={{ horizontal: true, vertical: true }}
      dataset={graphVals}
      xAxis={[{
        dataKey: 'timestamp',
        max: graphVals.find(gv => gv['amount-test1'] < axis)?.timestamp,
        min: graphVals[0].timestamp,
        valueFormatter: value => dayjs(value).format('hh:mma'),
      }]}
      yAxis={[{ max: total, min: axis }]}
      series={[
        {
          area: true,
          dataKey: 'amount-test1',
          showMark: false,
          stack: 'timestamp',
        },
        /*{
          area: true,
          dataKey: 'amount-test2',
          showMark: false,
          stack: 'timestamp',
        },*/
      ]}
      height={300}
    />
  );
};

export default GraphComponent;
