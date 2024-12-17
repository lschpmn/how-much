import { LinearProgress, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Dosage } from '../../types';
import { updateDosageAmounts } from '../lib/reducer';
import { useAction } from '../lib/utils';
import { State } from '../types';

const ListContainer = () => {
  const dosages: Dosage[] = useSelector((state: State) => state.dosages, isEqual);
  const updateDosageAmountsAction = useAction(updateDosageAmounts);
  const interval = useRef(null);

  useEffect(() => {
    if (interval.current) clearInterval(interval.current);

    interval.current = setInterval(updateDosageAmountsAction, 10 * 1000);

    updateDosageAmountsAction();
  }, [dosages]);

  return (
    <div style={{ marginTop: '3rem' }}>
      {dosages.map((dosage, i) => (
        <Paper
          key={i}
          elevation={6}
          style={{
            margin: '2rem',
            padding: '1rem',
          }}
        >
          <Typography>Amount: {dosage.amount}</Typography>
          <Typography>Taken: {dayjs(dosage.timestamp).format('M/D/YY - h:mm A')}</Typography>
          <Typography>Left: {Math.round(dosage.currentAmount)}</Typography>
          <LinearProgress variant="determinate" value={(dosage.currentAmount / dosage.amount) * 100} />
        </Paper>
      ))}
    </div>
  );
};

export default ListContainer;
