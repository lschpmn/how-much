import { Button, Modal, Paper, styled, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Dosage } from '../../../types';
import { addDosageSendServer } from '../../lib/reducer';
import { getRndStr, useAction } from '../../lib/utils';
import SetAmount from './SetAmount';

type Props = {
  open: boolean,
  setOpen: (open: boolean) => void,
};

const AddModal = ({ open, setOpen }: Props) => {
  const [isAM, setIsAM] = useState(true);
  const [isDisabled, setDisabled] = useState(true);
  const [amount, setAmount] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const addDosageAction = useAction(addDosageSendServer);

  const submit = () => {
    const now = dayjs(`${hour} ${minute} ${isAM ? 'AM' : 'PM'}`, 'h m A');

    const dosage = {
      amount: amount,
      id: getRndStr(),
      timestamp: +now,
    } as Dosage;

    addDosageAction(dosage);
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      const now = dayjs();
      setHour(+now.format('h'));
      setMinute(now.minute());
      setIsAM(now.hour() < 12);
      setAmount(0);
    }
  }, [open]);

  useEffect(() => {
    const checks = [
      amount > 0,
      hour > 0 && hour < 13,
      minute > -1 && minute < 60
    ];

    setDisabled(!checks.every(a => a));
  }, [hour, minute, amount]);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        style={{
          display: 'flex',
          gap: '2rem',
          flexDirection: 'column',
          padding: '2rem',
        }}
      >
        <SetAmount amount={amount} setAmount={setAmount} />
        <div style={{ margin: '0 auto' }}>
          <Typography style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Time
          </Typography>

          <StyledTextField size="small" value={hour}
                           onChange={e => setHour(+e.target.value || 0)}
                           variant="standard"/> :
          <StyledTextField size="small" onChange={e => setMinute(+e.target.value || 0)}
                           value={minute < 10 ? `0${minute}` : minute}
                           variant="standard"/>

          <Button color="inherit" onClick={() => setIsAM(!isAM)}>{isAM ? 'AM' : 'PM'}</Button>
        </div>
        <Button
          color="secondary"
          disabled={isDisabled}
          onClick={submit}
          style={{
            width: '100%',
          }}
          variant="outlined"
        >
          Submit
        </Button>
      </Paper>
    </Modal>
  );
};

const StyledTextField = styled(TextField)`
    width: 2rem;

    input {
        text-align: center;
    }
`;

export default AddModal;