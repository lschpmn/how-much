import { Button, Modal, Paper, styled, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Dosage } from '../../types';
import { addDosageSendServer } from '../lib/reducer';
import { getRndStr, useAction } from '../lib/utils';

const AddButton = () => {
  const [isAM, setIsAM] = useState(true);
  const [open, setOpen] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [amount, setAmount] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const addDosageAction = useAction(addDosageSendServer);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = +e.target.value;
    if (val > 0) setAmount(val);
    else setAmount(0);
  };

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
    <span>
      <Button
        onClick={() => setOpen(true)}
        style={{
          bottom: 0,
          position: 'absolute',
          width: '100%',
          zIndex: 10,
        }}
        variant="contained"
      >
        <Typography>+</Typography>
      </Button>
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
          <TextField
            onChange={onChange}
            label="Amount"
            value={amount}
          />
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
    </span>
  );
};

const StyledTextField = styled(TextField)`
    width: 2rem;

    input {
        text-align: center;
    }
`;

export default AddButton;