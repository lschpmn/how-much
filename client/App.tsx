import { styled } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AddButton from './components/AddButton';
import ListContainer from './components/ListContainer';
import TopBar from './components/TopBar';
import { useNow } from './lib/utils';
import { State } from './types';

const App = () => {
  const halfLife = useSelector(({ dosages }: State) => dosages.typeObj?.[dosages.currentTypeId]?.halfLife);
  const [now, updateNow] = useNow(halfLife);

  useEffect(() => {
    // restart needed to fix MUI Charts memory leak
    let timerId = setTimeout(() => {
      const currentUrl: URL = new URL(window.location.toString());
      window.location.assign(`http://${currentUrl.hostname}:${+currentUrl.port}/${currentUrl.search}`);
    }, 30 * 60 * 1000);

    const intervalId = setInterval(updateNow, 5 * 1000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timerId);
    }
  }, [halfLife]);

  return (
    <Container>
      <TopBar now={now}/>

      <AddButton/>

      <ListContainer now={now}/>
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
