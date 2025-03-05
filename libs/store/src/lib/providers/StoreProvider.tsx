'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { createStore, AppStore, RootState } from '../store';

interface StoreProviderProps {
  children: React.ReactNode;
  initialState?: Partial<RootState>;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({
  children,
  initialState,
}) => {
  // Create store once
  const storeRef = React.useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = createStore(initialState);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
