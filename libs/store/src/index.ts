// libs/store/src/index.ts
// Export core store functionality
export * from './lib/store';
export * from './lib/hooks';

// Export all slice actions and reducers
export * from './lib/slices/counterSlice';
export * from './lib/slices/apiSlice';

// Export middleware
export * from './lib/middleware/logger';
export * from './lib/middleware/error-tracking';

// Export components
export { StoreProvider } from './lib/providers/StoreProvider';

// Export TypeScript types
export type { RootState, AppStore, AppDispatch } from './lib/store';
