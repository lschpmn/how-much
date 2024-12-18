import { isEqual } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { updateDosageAmounts } from '../../lib/reducer';
import { useAction } from '../../lib/utils';
import { State } from '../../types';
import DosageItem from './DosageItem';

const ListContainer = () => {
  const dosageIDs: string[] = useSelector((state: State) => state.dosages.map(d => d.id), isEqual);
  const updateDosageAmountsAction = useAction(updateDosageAmounts);
  const interval = useRef(null);

  useEffect(() => {
    if (interval.current) clearInterval(interval.current);

    interval.current = setInterval(updateDosageAmountsAction, 15 * 1000);

    updateDosageAmountsAction();
  }, [dosageIDs.length]);

  return (
    <div style={{ marginTop: '3rem' }}>
      {dosageIDs.map(id => (
        <DosageItem key={id} id={id}/>
      ))}
    </div>
  );
};

export default ListContainer;
