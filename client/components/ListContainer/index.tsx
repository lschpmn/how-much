import { Button, Paper, styled } from '@mui/material';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dosage } from '../../../types';
import { State } from '../../types';
import DosageItem from './DosageItem';
import GraphComponent from './GraphComponent';

const ListContainer = () => {
  const [showAll, setShowAll] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const dosages: Dosage[] = useSelector((state: State) => state.dosages, isEqual);

  const filteredDosages = dosages.filter(d => showAll || d.currentAmount > 0.5).slice(0, 100);

  const total = dosages.reduce((t, d) => t + (d.currentAmount || 0), 0);

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

const StyleButton = styled(Button)`
    margin: 0.5rem;
`;

export default ListContainer;
