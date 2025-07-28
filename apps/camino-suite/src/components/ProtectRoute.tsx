'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletStore } from '@camino/store';

interface ProtectRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectRoute: React.FC<ProtectRouteProps> = ({
  children,
  redirectTo = '/login',
}) => {
  const router = useRouter();
  const isAuth = useWalletStore((state) => state.isAuth);

  useEffect(() => {
    if (!isAuth) {
      const currentPath = window.location.pathname;
      router.replace(
        `${redirectTo}?returnUrl=${encodeURIComponent(currentPath)}`
      );
    }
  }, [isAuth, router, redirectTo]);

  // Don't render protected content if not authenticated
  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
};
