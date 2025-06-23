// libs/store/src/lib/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';

// Import reducers
import networkReducer from './slices/networkSlice';

// Import middleware
import { loggerMiddleware } from './middleware/logger';
import { errorTrackingMiddleware } from './middleware/error-tracking';

// Create root reducer with proper typing
const rootReducer = combineReducers({
  network: networkReducer,
  // Add more reducers as needed
});

// Types
export type RootState = ReturnType<typeof rootReducer>;

// Define our own PreloadedState type based on RootState
export type AppPreloadedState = Partial<RootState>;

// Create store factory function with enhanced TypeScript typing
export const createStore = (preloadedState?: AppPreloadedState) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      // Get the default middleware with the correct typing
      const defaultMiddleware = getDefaultMiddleware();

      // Add custom middleware based on environment
      if (process.env['NODE_ENV'] !== 'production') {
        return defaultMiddleware
          .concat(loggerMiddleware)
          .concat(errorTrackingMiddleware);
      }

      // In production, only use error tracking
      return defaultMiddleware.concat(errorTrackingMiddleware);
    },
    devTools: process.env['NODE_ENV'] !== 'production',
    preloadedState,
  });
};

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];

// Helper to create a properly typed store for testing
export const createTestStore = (preloadedState?: AppPreloadedState) => {
  return createStore(preloadedState);
};
