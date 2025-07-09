import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
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
        <AddIcon/>
      </Button>
      <AddModal isOpen={isOpen} setIsOpen={setIsOpen}/>
    </span>
  );
};

export default AddButton;