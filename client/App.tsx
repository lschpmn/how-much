import { styled } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import AddButton from './components/AddButton';
import ListContainer from './components/ListContainer';
import TopBar from './components/TopBar';
import { updateDosageAmounts } from './lib/reducer';
import { useAction } from './lib/utils';

const App = () => {
  const updateDosageAmountsAction = useAction(updateDosageAmounts);
  const interval = useRef(null);

  useEffect(() => {
    if (interval.current) clearInterval(interval.current);

    interval.current = setInterval(updateDosageAmountsAction, 15 * 1000);
  }, []);

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
