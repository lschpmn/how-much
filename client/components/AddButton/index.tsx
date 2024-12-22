import { Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import AddModal from './AddModal';

const AddButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span>
      <Button
        onClick={() => setIsOpen(true)}
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
      <AddModal isOpen={isOpen} setOpen={setIsOpen}/>
    </span>
  );
};

export default AddButton;