import { configureStore } from '@reduxjs/toolkit';
import CounterReducer from './counter/slice';

export const store = configureStore({
  reducer: {
    couunter: CounterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
