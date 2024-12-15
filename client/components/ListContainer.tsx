import { Paper, Typography } from '@mui/material';
import React from 'react';

const ListContainer = () => {

  const things = [
    'A: 5:00PM',
    'B: 5:30PM',
  ];

  return (
    <div>
      {things.map((thing, i) => (
        <Paper
          key={i}
          elevation={6}
          style={{
            margin: '2rem',
            padding: '1rem',
          }}
        >
          <Typography>{thing}</Typography>
        </Paper>
      ))}
    </div>
  );
};

export default ListContainer;
