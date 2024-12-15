import { Button, Modal, Paper, TextField, Typography } from '@mui/material';
import React, { ChangeEvent, useState } from 'react';

const AddButton = () => {
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = +e.target.value;
    if (val > 0) setAmount(val);
    else setAmount(0);
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