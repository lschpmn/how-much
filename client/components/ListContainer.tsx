import { Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dosage } from '../../types';
import { State } from '../types';

const ListContainer = () => {
  const dosages: Dosage[] = useSelector((state: State) => state.dosages, isEqual);

  const calculateHalfLife = (dosage: Dosage) =>
    dosage.amount * Math.pow( 0.5, (Date.now() - dosage.timestamp) / (30 * 60 * 1000));

  return (
    <div>
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
          <Typography>Left: {calculateHalfLife(dosage)}</Typography>
        </Paper>
      ))}
    </div>
  );
};

export default ListContainer;
