import { Middleware, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Extended error interface for actions with potential errors
interface ActionWithError extends AnyAction {
  error?: Error | string;
  payload?: {
    error?: Error | string;
    message?: string;
  };
}

// Track errors that occur in reducers or during dispatched actions
export const errorTrackingMiddleware: Middleware =
  (store) => (next) => (action) => {
    // First send the action to the next middleware
    const result = next(action);

    // Check if the action contains an error
    const errorAction = action as ActionWithError;

    if (
      errorAction.error ||
      (errorAction.payload &&
        (errorAction.payload.error || errorAction.payload.message))
    ) {
      // Log or send to error tracking service
      const errorDetails = {
        actionType: errorAction.type,
        error:
          errorAction.error ||
          errorAction.payload?.error ||
          errorAction.payload?.message,
      };

      // In production, you would send to a service like Sentry
      if (process.env['NODE_ENV'] === 'production') {
        // Example: send to error tracking service
        // errorTrackingService.captureException(errorDetails);
        console.error('Redux Action Error:', errorDetails);
      } else {
        // In development, just log to console
        console.error('Redux Action Error:', errorDetails);
      }
    }

    return result;
  };
