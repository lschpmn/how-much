import { AppBar, Toolbar, Typography } from '@mui/material';
import { isEqual } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { CombinedDosagesObj, State } from '../types';

type Props = {
  now: number,
};

const TopBar = ({ now }: Props) => {
  const combinedDosagesObj: CombinedDosagesObj = useSelector((state: State) => state.dosages.combinedDosagesObj, isEqual);

  const total = combinedDosagesObj[now]?.[`amount-total`] || 0;

  return (
    <AppBar>
      <Toolbar style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4">Total: {total < 9.95 ? total.toFixed(1) : Math.round(total)}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;