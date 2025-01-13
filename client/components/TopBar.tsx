import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { constructRemainingStr } from '../lib/utils';
import { State } from '../types';

const TopBar = () => {
  const dosages = useSelector((state: State) => state.dosages.map(d => d.currentAmount));

  const total = dosages.reduce((t, c) => t + c, 0);

  return (
    <AppBar>
      <Toolbar style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4">Total: {total < 9.95 ? total.toFixed(1) : Math.round(total)}</Typography>
        <Remaining remaining={total}/>
      </Toolbar>
    </AppBar>
  );
};

const Remaining = ({ remaining }: { remaining: number }) => {
  if (remaining > 4.95) {
    return <Typography>{constructRemainingStr(remaining, 4.95)} until 5</Typography>
  } else if (remaining > 0.05) {
    return <Typography>{constructRemainingStr(remaining, 0.05)} until 0</Typography>
  } else {
    return "";
  }
};

export default TopBar;