// libs/store/src/lib/slices/apiSlice.ts
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';

// Define types for our state
interface ApiState {
  data: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define initial state with TypeScript
const initialState: ApiState = {
  data: [],
  status: 'idle',
  error: null,
};

// Define return type for the API call
interface FetchApiResponse {
  data: any[];
}

// Create async thunk with proper TypeScript typing
export const fetchApiData = createAsyncThunk<
  FetchApiResponse, // Return type of the payload creator
  undefined, // First argument to the payload creator
  {
    rejectValue: string; // Type for the rejected action payload
  }
>('api/fetchData', async (_, { rejectWithValue }) => {
  try {
    // Replace with your actual API call
    const response = await fetch('/api/data');

    if (!response.ok) {
      return rejectWithValue('Server error');
    }

    return (await response.json()) as FetchApiResponse;
  } catch (error) {
    return rejectWithValue('Network error occurred');
  }
});

// Create the slice with TypeScript
const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    clearData: (state) => {
      state.data = [];
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchApiData.fulfilled,
        (state, action: PayloadAction<FetchApiResponse>) => {
          state.status = 'succeeded';
          state.data = action.payload.data;
        }
      )
      .addCase(fetchApiData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
      });
  },
});

export const { clearData } = apiSlice.actions;
export default apiSlice.reducer;
