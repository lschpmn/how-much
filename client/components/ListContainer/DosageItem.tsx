import { Delete as DeleteIcon } from '@mui/icons-material';
import { Button, IconButton, LinearProgress, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dosage } from '../../../types';
import { deleteDosageSendServer } from '../../lib/reducer';
import { constructRemainingStr, useAction } from '../../lib/utils';
import { CombinedDosagesObj, State } from '../../types';

type Props = {
  id: string,
  now: number,
};

const DosageItem = ({ id, now }: Props) => {
  const combinedDosagesObj: CombinedDosagesObj = useSelector((state: State) => state.dosages.combinedDosagesObj, isEqual);
  const dosage: Dosage = useSelector((state: State) => state.dosages.dosages.find(d => d.id === id), isEqual);
  const [showDeleteIcon, setShowDeleteIcon] = useState(true);
  const deleteDosageAction = useAction(deleteDosageSendServer);
  const currentAmount = combinedDosagesObj[now]?.[`amount-${id}`] || 0;

  return (
    <Paper
      key={dosage.id}
      elevation={6}
      style={{
        margin: '2rem',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography>{Math.round(currentAmount)} / {dosage.amount}</Typography>

        {showDeleteIcon ? (
          <IconButton onClick={() => setShowDeleteIcon(false)}>
            <DeleteIcon fontSize="small" color="error"/>
          </IconButton>
        ) : (
          <span>
            <Typography component="span">Are you sure?</Typography>
            <Button color="error" onClick={() => deleteDosageAction(id)}>Yes</Button>
            <Button color="success" onClick={() => setShowDeleteIcon(true)}>No</Button>
          </span>
        )}

      </div>
      <Typography style={{ padding: '0.5rem 0 1rem 0' }}>
        {dayjs(dosage.timestamp).format('h:mm A')}
        {currentAmount > 0.5 && ' - ' + constructRemainingStr(currentAmount)}
      </Typography>
      <LinearProgress variant="determinate" value={(currentAmount / dosage.amount) * 100}/>
    </Paper>
  );
};

export default DosageItem;
