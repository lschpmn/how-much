import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../types';

const TopBar = () => {
  const dosages = useSelector((state: State) => state.dosages.map(d => d.currentAmount));

  const total = dosages.reduce((t, c) => t + c, 0);

  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h4">Total: {total < 10 ? total.toFixed(1) : Math.round(total)}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;