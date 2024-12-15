import { styled } from '@mui/material';
import React from 'react';
import AddButton from './components/AddButton';
import ListContainer from './components/ListContainer';

const App = () => {

  return (
    <Container>
      <AddButton/>

      <ListContainer/>
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
