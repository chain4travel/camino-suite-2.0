import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { RootState } from '../store';

interface ExampleState {
  value: number;
}

const initialState: ExampleState = {
  value: 0,
};

export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      const hydrateAction = action as PayloadAction<RootState>;
      console.log('HYDRATE', state, hydrateAction.payload);
      return {
        ...state,
        ...hydrateAction.payload.example,
      };
    });
  },
});

export const { increment, decrement, incrementByAmount } = exampleSlice.actions;

export const selectExampleValue = (state: RootState) => state.example.value;

export default exampleSlice.reducer;
