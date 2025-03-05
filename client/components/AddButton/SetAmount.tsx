import { TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../types';

type Props = {
  amount: number,
  setAmount: (amount: number) => void,
};

const SetAmount = ({ amount, setAmount }: Props) => {
  const currentTypeId: string = useSelector((state: State) => state.dosages.currentTypeId);
  const [position, setPosition] = useState(0);
  const presets = presetsObj[currentTypeId] || [];

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = +e.target.value;
    if (val > 0) setAmount(val);
    else setAmount(0);
  };

  const buttonClicked = (position: number, value: number) => {
    setPosition(position);
    setAmount(value);
  };

  useEffect(() => {
    setAmount(presets[0].value);
  }, []);

  return (
    <div>
      <ToggleButtonGroup color="primary" value={position} style={{ marginBottom: '1rem', display: 'block' }}>
        {presets.map((p, i) => (
          <ToggleButton key={i} onChange={() => buttonClicked(i, p.value)} value={i}>{p.label}</ToggleButton>
        ))}
        <ToggleButton onChange={() => buttonClicked(-1, 0)} value={-1}>Custom</ToggleButton>
      </ToggleButtonGroup>
      {position === -1 && <TextField
        label="Amount"
        onChange={onChange}
        value={amount}
      />}
    </div>
  );
};

const presetsObj: { [id: string]: { label: string, value: number }[] } = {
  'aaaaaaaa': [
    { label: 'Medium', value: 25 },
    { label: 'Large', value: 100 },
  ],
  'bbbbbbbb': [
    { label: 'Medium', value: 34 },
  ],
};

export default SetAmount;