import { Button, styled, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

type Props = {
  isOpen: boolean,
  setTimestamp: (timestamp: number) => void,
};

const SetTimestamp = ({ isOpen, setTimestamp }: Props) => {
  const [isAM, setIsAM] = useState(true);
  const [isPristine, setIsPristine] = useState(true);
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const intervalRef = useRef(null);
  const wasOpenRef = useRef(false);

  const changeMinute = (e: ChangeEvent<HTMLInputElement>) => {
    isPristine && setIsPristine(false);
    const min = e.target.value;
    if (!(+min > -1)) return; //check is number

    const newMin = (minute + min).slice(-2);

    if (+newMin >= 60) setMinute(`0${newMin[1]}`);
    else setMinute(newMin);
  };

  const changeHour = (e: ChangeEvent<HTMLInputElement>) => {
    isPristine && setIsPristine(false);
    const h = e.target.value;
    if (!(+h > -1)) return; //check is number

    const newHour = (hour + h).slice(-2);

    if (+newHour > 12 || +newHour < 10) setHour(`${newHour[1]}`);
    else setHour(newHour);
  };

  useEffect(() => {
    if (!isPristine) {
      setTimestamp(+dayjs(`${hour} ${minute} ${isAM ? 'AM' : 'PM'}`, 'h mm A'));
    }
  }, [hour, minute]);

  useEffect(() => isOpen && setIsPristine(true), [isOpen]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const setTimesToNow = () => {
      const now = dayjs();
      setHour(now.format('h'));
      setMinute(now.format('mm'))
      setIsAM(now.hour() < 12);
      setTimestamp(+now);
    };

    if (isPristine) {
      setTimesToNow();
      intervalRef.current = setInterval(() => setTimesToNow(), 1000);
    }
  }, [isPristine]);

  return (
    <div style={{ margin: '0 auto' }}>
      <Typography style={{ textAlign: 'center', fontWeight: 'bold' }}>Time</Typography>

      <StyledTextField size="small" onChange={changeHour} value={hour} variant="standard"/>
      <Typography component="span"> : </Typography>
      <StyledTextField size="small" onChange={changeMinute} value={minute} variant="standard"/>

      <Button color="inherit" onClick={() => {
        if (isPristine) setIsPristine(false);
        setIsAM(!isAM);
      }}>
        {isAM ? 'AM' : 'PM'}
      </Button>
    </div>
  );
};

const StyledTextField = styled(TextField)`
    width: 2rem;

    input {
        text-align: center;
    }
`;

export default SetTimestamp;