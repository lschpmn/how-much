import { Button, Paper, styled } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dosage } from '../../../types';
import { setGraphTimes } from '../../lib/utils';
import { State } from '../../types';
import DosageItem from './DosageItem';

const ListContainer = () => {
  const [showAll, setShowAll] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const dosages: Dosage[] = useSelector((state: State) => state.dosages, isEqual);

  const filteredDosages = dosages.filter(d => showAll || d.currentAmount > 0.5).slice(0, 100);

  const total = dosages.reduce((t, d) => t + (d.currentAmount || 0), 0);
  const graphVals = dosages[0] && setGraphTimes(total, Date.now());

  return (
    <div style={{ margin: '3.5rem 0 2rem 0' }}>
      <Paper style={{ margin: '2rem', padding: '1.5rem' }} variant="outlined">
        <StyleButton color="inherit" onClick={() => setShowAll(!showAll)} variant="outlined">
          {showAll ? 'Showing All' : 'Showing Active'}
        </StyleButton>
        <StyleButton color="inherit" onClick={() => setShowGraph(!showGraph)} variant="outlined">
          {showGraph ? 'Show Graph' : 'Hide Graph'}
        </StyleButton>
      </Paper>

      {showGraph && graphVals && total > 1 && (
        <LineChart
          grid={{ horizontal: true, vertical: true }}
          dataset={graphVals}
          xAxis={[{
            dataKey: 'timestamp',
            valueFormatter: value => dayjs(value).format('hh:mma'),
          }]}
          series={[{ area: true, dataKey: 'amount', showMark: false }]}
          height={300}
        />
      )}

      {filteredDosages.map(dosage => (
        <DosageItem key={dosage.id} id={dosage.id}/>
      ))}
    </div>
  );
};

const StyleButton = styled(Button)`
    margin: 0 0.5rem;
`;

export default ListContainer;
