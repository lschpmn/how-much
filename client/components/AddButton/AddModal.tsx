import { Button, Modal, Paper } from '@mui/material';
import React, { useState } from 'react';
import { Dosage } from '../../../types';
import { addDosageSendServer } from '../../lib/reducer';
import { getRndStr, useAction } from '../../lib/utils';
import SetAmount from './SetAmount';
import SetTimestamp from './SetTimestamp';

type Props = {
  isOpen: boolean,
  setOpen: (open: boolean) => void,
};

const AddModal = ({ isOpen, setOpen }: Props) => {
  const [amount, setAmount] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const addDosageAction = useAction(addDosageSendServer);

  const submit = () => {
    const dosage = {
      amount,
      id: getRndStr(),
      timestamp,
    } as Dosage;

    addDosageAction(dosage);
    setOpen(false);
  };

  return (
    <Modal
      open={isOpen}
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
        <SetAmount amount={amount} setAmount={setAmount}/>
        <SetTimestamp isOpen={isOpen} setTimestamp={setTimestamp}/>
        <Button
          color="secondary"
          disabled={amount <= 0}
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

export default AddModal;