import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import networkReducer from './slices/networkSlice';
// Example slice: Counter
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
    addBy: (state, action: PayloadAction<number>) => state + action.payload,
  },
});

export const { increment, decrement, addBy } = counterSlice.actions;

// Configure the store
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer, // Add more reducers here as needed
    network: networkReducer,
  },
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
