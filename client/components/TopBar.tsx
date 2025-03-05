import { AppBar, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { isEqual } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { TypesObj } from '../../types';
import { setCurrentDosageId } from '../lib/reducer';
import { useAction } from '../lib/utils';
import { CombinedDosagesObj, State } from '../types';

type Props = {
  now: number,
};

const TopBar = ({ now }: Props) => {
  const combinedDosagesObj: CombinedDosagesObj = useSelector((state: State) => state.dosages.combinedDosagesObj, isEqual);
  const currentTypeId = useSelector((state: State) => state.dosages.currentTypeId);
  const typesObj: TypesObj = useSelector((state: State) => state.dosages.typeObj, isEqual);
  const setCurrentDosageIdAction = useAction(setCurrentDosageId);
  const total = combinedDosagesObj[now]?.[`amount-total`] || 0;
  const types = Object.values(typesObj)?.sort((a, b) => a.position - b.position) || [];

  const changeDosageType = (_, position: number) => {
    setCurrentDosageIdAction(types[position].id);
  };

  return (
    <AppBar>
      <Toolbar style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4">Total: {total < 9.95 ? total.toFixed(1) : Math.round(total)}</Typography>

        <div style={{ width: '100%' }}>
          <Tabs onChange={changeDosageType} value={typesObj[currentTypeId]?.position || 0}>
            {types.map(type => (
              <Tab key={type.id} style={{ maxWidth: '100%', flex: 1 }} label={type.name}/>
            ))}
          </Tabs>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;