import { TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';

type Props = {
  amount: number,
  setAmount: (amount: number) => void,
};

const SetAmount = ({ amount, setAmount }: Props) => {
  const [preset, setPreset] = useState('small');

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = +e.target.value;
    if (val > 0) setAmount(val);
    else setAmount(0);
  };

  useEffect(() => {
    switch (preset) {
      case 'small':
        setAmount(10);
        break;
      case 'medium':
        setAmount(25);
        break;
      case 'large':
        setAmount(100);
        break;
      case 'custom':
        setAmount(0);
        break;
    }
  }, [preset]);

  return (
    <div>
      <ToggleButtonGroup color="primary" value={preset} style={{ marginBottom: '1rem', display: 'block' }}>
        <ToggleButton onChange={() => setPreset('small')} value="small">Small</ToggleButton>
        <ToggleButton onChange={() => setPreset('medium')} value="medium">Medium</ToggleButton>
        <ToggleButton onChange={() => setPreset('large')} value="large">Large</ToggleButton>
        <ToggleButton onChange={() => setPreset('custom')} value="custom">Custom</ToggleButton>
      </ToggleButtonGroup>
      {preset === 'custom' && <TextField
        label="Amount"
        onChange={onChange}
        value={amount}
      />}
    </div>
  );
};

export default SetAmount;