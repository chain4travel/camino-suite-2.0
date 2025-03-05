import { Middleware } from '@reduxjs/toolkit';

// Type-safe middleware using proper typing
export const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  if (process.env['NODE_ENV'] !== 'production') {
    // console.group(`Action: ${action.type}`);
    console.log('Current state:', store.getState());
    console.log('Action:', action);
    const result = next(action);
    console.log('New state:', store.getState());
    console.groupEnd();
    return result;
  }

  return next(action);
};
