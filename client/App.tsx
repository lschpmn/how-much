import { styled } from '@mui/material';
import React from 'react';
import AddButton from './components/AddButton';
import ListContainer from './components/ListContainer';
import TopBar from './components/TopBar';

const App = () => {

  return (
    <Container>
      <TopBar />

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
