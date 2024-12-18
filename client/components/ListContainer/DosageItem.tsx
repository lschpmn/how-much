import { Delete as DeleteIcon } from '@mui/icons-material';
import { Button, IconButton, LinearProgress, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteDosageSendServer } from '../../lib/reducer';
import { useAction } from '../../lib/utils';
import { State } from '../../types';

const DosageItem = ({ id }: { id: string }) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(true);
  const dosage = useSelector((state: State) => state.dosages.find(d => d.id === id), isEqual);
  const deleteDosageAction = useAction(deleteDosageSendServer);

  return (
    <Paper
      key={dosage.id}
      elevation={6}
      style={{
        margin: '2rem',
        padding: '1rem',
      }}
    >
      <Typography style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Amount: {dosage.amount}</span>
        {showDeleteIcon ? (
          <IconButton onClick={() => setShowDeleteIcon(false)}>
            <DeleteIcon fontSize="small" color="error"/>
          </IconButton>
        ) : (
          <Typography>
            Are you sure?
            <Button color="error" onClick={() => deleteDosageAction(id)}>Yes</Button>
            <Button color="success" onClick={() => setShowDeleteIcon(true)}>No</Button>
          </Typography>
        )}

      </Typography>
      <Typography>Taken: {dayjs(dosage.timestamp).format('M/D/YY - h:mm A')}</Typography>
      <Typography>Left: {Math.round(dosage.currentAmount)}</Typography>
      <LinearProgress variant="determinate" value={(dosage.currentAmount / dosage.amount) * 100}/>
    </Paper>
  );
};

export default DosageItem;
