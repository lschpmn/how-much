import { styled } from '@mui/material';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App = () => {

  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>Hello world</div>}/>
        </Routes>
      </BrowserRouter>
    </Container>
  );
};

const Container = styled('div')`
  background-color: ${props => props.theme.palette.background.default};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
`;

export default App;
