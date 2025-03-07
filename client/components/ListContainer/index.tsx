import { Button, Paper, styled } from '@mui/material';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dosage } from '../../../types';
import { CombinedDosagesObj, State } from '../../types';
import DosageItem from './DosageItem';
import GraphComponent from './GraphComponent';

type Props = {
  now: number,
};

const ListContainer = ({ now }: Props) => {
  const dosages: Dosage[] = useSelector((state: State) => state.dosages.dosages, isEqual);
  const combinedDosagesObj: CombinedDosagesObj = useSelector((state: State) => state.dosages.combinedDosagesObj, isEqual);
  const currentTypeId: string = useSelector((state: State) => state.dosages.currentTypeId);
  const [showGraph, setShowGraph] = useSearchParamBooleanValue('showGraph');
  const [showAll, setShowAll] = useSearchParamBooleanValue('showAll');
  const filteredDosages = dosages
    .filter(d => d.typeId === currentTypeId
      && (showAll || combinedDosagesObj[now]?.[`amount-${d.id}`] > 1))
    .slice(0, 100);

  return (
    <div style={{ margin: '3.5rem 0 2rem 0' }}>
      <Paper style={{ margin: '2rem', padding: '1.5rem' }} variant="outlined">
        <StyleButton color="inherit" onClick={() => setShowGraph(!showGraph)} variant="outlined">
          {showGraph ? 'Showing Graph' : 'Hiding Graph'}
        </StyleButton>
        <StyleButton color="inherit" onClick={() => setShowAll(!showAll)} variant="outlined">
          {showAll ? 'Showing All' : 'Showing Active'}
        </StyleButton>
      </Paper>

      {showGraph && (
        <GraphComponent
          combinedDosagesObj={combinedDosagesObj}
          currentTypeId={currentTypeId}
          dosageLength={dosages.length}
          showAll={showAll}
        />
      )}

      {filteredDosages.map(dosage => (
        <DosageItem key={dosage.id} dosage={dosage} now={now}/>
      ))}
    </div>
  );
};

const StyleButton = styled(Button)`
    margin: 0.5rem;
`;

const useSearchParamBooleanValue = (value: string): [boolean, (shouldShow: boolean) => void] => {
  const url = new URL(window.location.toString());
  const theValue = url.searchParams.get(value) === 'true';
  const [v, f] = useState(theValue);
  const setValue = (shouldShow: boolean) => {
    url.searchParams.set(value, shouldShow.toString());
    history.replaceState(null, '', url);
    f(!v); // just to kick the rerender
  };

  return [theValue, setValue];
};

export default ListContainer;
