import { styled } from '@mui/material';
import { throttle } from 'lodash';
import React, { useEffect } from 'react';
import AddButton from './components/AddButton';
import ListContainer from './components/ListContainer';
import TopBar from './components/TopBar';
import { updateDosageAmounts } from './lib/reducer';
import { useAction } from './lib/utils';

const App = () => {
  const updateDosageAmountsAction = useAction(updateDosageAmounts);

  useEffect(() => {
    // restart needed to fix MUI Charts memory leak
    let timerId: NodeJS.Timeout;
    const restartTimer = throttle(() => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => window.location.reload(), 2 * 60 * 60 * 1000);
    }, 15 * 1000);

    window.addEventListener('mousemove', restartTimer);
    window.addEventListener('touchstart', restartTimer);

    const intervalId = setInterval(updateDosageAmountsAction, 15 * 1000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousemove', restartTimer);
      window.removeEventListener('touchstart', restartTimer);
    }
  }, []);

  return (
    <Container>
      <TopBar/>

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
