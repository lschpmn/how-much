import { Button } from '@mui/material';
import React from 'react';

const AddButton = () => {

  return (
    <Button
      style={{
        bottom: 0,
        position: 'absolute',
        width: '100%',
      }}
      variant="contained"
    >
      +
    </Button>
  );
};

export default AddButton;