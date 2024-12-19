import { Delete as DeleteIcon } from '@mui/icons-material';
import { Button, IconButton, LinearProgress, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dosage } from '../../../types';
import { deleteDosageSendServer } from '../../lib/reducer';
import { useAction } from '../../lib/utils';
import { State } from '../../types';

const DosageItem = ({ id }: { id: string }) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(true);
  const dosage: Dosage = useSelector((state: State) => state.dosages.find(d => d.id === id), isEqual);
  const deleteDosageAction = useAction(deleteDosageSendServer);

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
        <Typography>{Math.round(dosage.currentAmount)} / {dosage.amount}</Typography>
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
      <Typography style={{ padding: '0.5rem 0 1rem 0' }}>{dayjs(dosage.timestamp).format('h:mm A ddd')}</Typography>
      <LinearProgress variant="determinate" value={(dosage.currentAmount / dosage.amount) * 100}/>
    </Paper>
  );
};

export default DosageItem;
