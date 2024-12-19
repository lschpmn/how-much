import { Button, Paper } from '@mui/material';
import { isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Dosage } from '../../../types';
import { updateDosageAmounts } from '../../lib/reducer';
import { useAction } from '../../lib/utils';
import { State } from '../../types';
import DosageItem from './DosageItem';

const ListContainer = () => {
  const [showAll, setShowAll] = useState(false);
  const dosages: Dosage[] = useSelector((state: State) => state.dosages, isEqual);
  const updateDosageAmountsAction = useAction(updateDosageAmounts);
  const interval = useRef(null);

  const filteredDosages = dosages.filter(d => showAll || Math.round(d.currentAmount) > 0);

  useEffect(() => {
    if (interval.current) clearInterval(interval.current);

    interval.current = setInterval(updateDosageAmountsAction, 15 * 1000);

    updateDosageAmountsAction();
  }, [dosages.length]);

  return (
    <div style={{ marginTop: '5rem' }}>
      <Paper style={{ margin: '2rem', padding: '1.5rem' }} variant="outlined">
        <Button color="inherit" onClick={() => setShowAll(!showAll)} variant="outlined">
          {showAll ? 'Show All' : 'Show Active'}
        </Button>
      </Paper>

      {filteredDosages.map(dosage => (
        <DosageItem key={dosage.id} id={dosage.id}/>
      ))}
    </div>
  );
};

export default ListContainer;
