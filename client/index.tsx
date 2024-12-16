import { createTheme, ThemeProvider } from '@mui/material';
import { deepPurple, green } from '@mui/material/colors';
import { configureStore } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { loggingMiddleware, socketMiddleware } from './lib/middleware';
import { dosagesReducer } from './lib/reducer';
import customParseFormat  from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const store = configureStore({
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([ loggingMiddleware, socketMiddleware ]),
  reducer: {
    dosages: dosagesReducer,
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: green.A700,
    },
    secondary: {
      main: deepPurple['500'],
    },
    mode: 'dark',
  },
});

const root = createRoot(document.getElementById('react'));
root.render((
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App/>
    </ThemeProvider>
  </Provider>
));
