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

const HALF_LIFE = 30 * 60 * 1000;
const TARGET_RATIO = 0.5;

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
      <Typography style={{ padding: '0.5rem 0 1rem 0' }}>
        {dayjs(dosage.timestamp).format('h:mm A ddd')}
        {dosage.currentAmount > 0.5 && constructRemainingStr(dosage)}
      </Typography>
      <LinearProgress variant="determinate" value={(dosage.currentAmount / dosage.amount) * 100}/>
    </Paper>
  );
};

function constructRemainingStr(dosage: Dosage) {
  const ratio = TARGET_RATIO / dosage.currentAmount;
  const halfLives = Math.log10(ratio) / Math.log10(0.5);
  const time = halfLives * HALF_LIFE;
  const minutes = Math.floor(time / (60 * 1000)) % 60;
  const hours = Math.floor(time / (60 * 60 * 1000));
  let returnStr = ' - ';

  hours && (returnStr += `${hours}h `);
  minutes && (returnStr += `${minutes}m `);
  (hours === 0 && minutes === 0) && (returnStr += 'a few seconds ');

  return returnStr + 'remaining';
}

export default DosageItem;
