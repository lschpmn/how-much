import { Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import AddModal from './AddModal';

const AddButton = () => {
  const [open, setOpen] = useState(false);

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
      <AddModal open={open} setOpen={setOpen}/>
    </span>
  );
};

export default AddButton;