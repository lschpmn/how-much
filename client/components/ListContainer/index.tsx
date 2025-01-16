import { Button, Paper } from '@mui/material';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dosage } from '../../../types';
import { State } from '../../types';
import DosageItem from './DosageItem';

const ListContainer = () => {
  const [showAll, setShowAll] = useState(false);
  const dosages: Dosage[] = useSelector((state: State) => state.dosages, isEqual);

  const filteredDosages = dosages.filter(d => showAll || d.currentAmount > 0.5).slice(0, 100);

  return (
    <div style={{ margin: '3.5rem 0 2rem 0' }}>
      <Paper style={{ margin: '2rem', padding: '1.5rem' }} variant="outlined">
        <Button color="inherit" onClick={() => setShowAll(!showAll)} variant="outlined">
          {showAll ? 'Showing All' : 'Showing Active'}
        </Button>
      </Paper>

      {filteredDosages.map(dosage => (
        <DosageItem key={dosage.id} id={dosage.id}/>
      ))}
    </div>
  );
};

export default ListContainer;
