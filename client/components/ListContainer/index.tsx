import { Button, Paper, styled } from '@mui/material';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dosage } from '../../../types';
import { State, ZippedDosage } from '../../types';
import DosageItem from './DosageItem';
import GraphComponent from './GraphComponent';

const ListContainer = () => {
  const [now, setNow] = useState(Date.now() - (Date.now() % 60000));
  const [showAll, setShowAll] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const dosages: Dosage[] = useSelector((state: State) => state.dosages, isEqual);

  const filteredDosages = dosages.filter(d => showAll || d.currentAmount > 0.5).slice(0, 100);
  //const timeVals = calculateTimeVals(dosages.slice(0, 100));
  const total = dosages.reduce((t, d) => t + (d.currentAmount || 0), 0);
  //console.log(timeVals.find(tv => tv.timestamp === now));

  return (
    <div style={{ margin: '3.5rem 0 2rem 0' }}>
      <Paper style={{ margin: '2rem', padding: '1.5rem' }} variant="outlined">
        <StyleButton color="inherit" onClick={() => setShowAll(!showAll)} variant="outlined">
          {showAll ? 'Showing All' : 'Showing Active'}
        </StyleButton>
        <StyleButton color="inherit" onClick={() => setShowGraph(!showGraph)} variant="outlined">
          {showGraph && total > 0.001 ? 'Showing Graph' : 'Hiding Graph'}
        </StyleButton>
      </Paper>

      {showGraph && total > 0.001 && (
        <GraphComponent dosages={dosages}/>
      )}

      {filteredDosages.map(dosage => (
        <DosageItem key={dosage.id} id={dosage.id}/>
      ))}
    </div>
  );
};

const calculateTimeVals = (dosages: Dosage[]) => {
  const timeValObj: { [timestamp: number]: ZippedDosage } = {};

  for (let dosage of dosages) {
    for (let timeVal of dosage.timeValues) {
      let currTimeValue = timeValObj[timeVal.timestamp];
      if (!currTimeValue) {
        currTimeValue = { 'amount-total': 0, timestamp: timeVal.timestamp };
        timeValObj[timeVal.timestamp] = currTimeValue;
      }

      currTimeValue[`amount-${dosage.id}`] = timeVal.amount;
    }
  }

  const series = Object.values(timeValObj).sort((a, b) => a.timestamp - b.timestamp);

  series.forEach(timeVal => {
    const amounts = Object.keys(timeVal).filter(k => k !== 'timestamp' && k !== 'amount-total');
    let total = 0;

    for (let amount of amounts) {
      total += (timeVal[amount] || 0);
    }

    timeVal['amount-total'] = total;
  });

  console.log(series);
  return series;
};

const StyleButton = styled(Button)`
    margin: 0.5rem;
`;

export default ListContainer;
