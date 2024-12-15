import { Button, Modal, Paper, TextField, Typography } from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import { Dosage } from '../../types';
import { addDosageSendServer } from '../lib/reducer';
import { useAction } from '../lib/utils';

const AddButton = () => {
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const addDosageAction = useAction(addDosageSendServer);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = +e.target.value;
    if (val > 0) setAmount(val);
    else setAmount(0);
  };

  const submit = () => {
    const dosage = {
      amount: amount,
      timestamp: Date.now(),
    } as Dosage;

    addDosageAction(dosage);
    setOpen(false);
  };

  return (
    <span>
      <Button
        onClick={() => setOpen(true)}
        style={{
          bottom: 0,
          position: 'absolute',
          width: '100%',
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
            flexDirection: 'column',
            padding: '2rem',
          }}
        >
          <TextField
            onChange={onChange}
            label="Amount"
            value={amount}
          />
          <Button
            color="secondary"
            onClick={submit}
            style={{
              marginTop: '2rem',
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

export default AddButton;