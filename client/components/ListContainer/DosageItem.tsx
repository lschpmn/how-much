import { Delete as DeleteIcon } from '@mui/icons-material';
import { Button, IconButton, LinearProgress, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dosage, Type } from '../../../types';
import { deleteDosageSendServer } from '../../lib/reducer';
import { constructRemainingStr, useAction } from '../../lib/utils';
import { CombinedDosagesObj, State } from '../../types';

type Props = {
  dosage: Dosage,
  now: number,
};

const DosageItem = ({ dosage, now }: Props) => {
  const combinedDosagesObj: CombinedDosagesObj = useSelector((state: State) => state.dosages.combinedDosagesObj, isEqual);
  const type: Type = useSelector((state: State) => state.dosages.typeObj[state.dosages.currentTypeId], isEqual);
  const [showDeleteIcon, setShowDeleteIcon] = useState(true);
  const deleteDosageAction = useAction(deleteDosageSendServer);
  const currentAmount = combinedDosagesObj[now]?.[`amount-${dosage.id}`] || 0;
  let itemTotal: string;

  if (currentAmount > 1 || currentAmount === 0) itemTotal = ''+Math.round(currentAmount);
  else itemTotal = currentAmount.toFixed(3)

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
        <Typography>{itemTotal} / {dosage.amount}</Typography>

        {showDeleteIcon ? (
          <IconButton onClick={() => setShowDeleteIcon(false)}>
            <DeleteIcon fontSize="small" color="error"/>
          </IconButton>
        ) : (
          <span>
            <Typography component="span">Are you sure?</Typography>
            <Button color="error" onClick={() => deleteDosageAction(dosage.id)}>Yes</Button>
            <Button color="success" onClick={() => setShowDeleteIcon(true)}>No</Button>
          </span>
        )}

      </div>
      <Typography style={{ padding: '0.5rem 0 1rem 0' }}>
        {dayjs(dosage.timestamp).format('h:mm A')}
        {currentAmount > 1 && ' - ' + constructRemainingStr(currentAmount, type.halfLife)}
      </Typography>
      <LinearProgress variant="determinate" value={(currentAmount / dosage.amount) * 100}/>
    </Paper>
  );
};

export default DosageItem;
