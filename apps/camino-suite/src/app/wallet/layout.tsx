import { WalletLayout } from '@camino/wallet';
import { ProtectRoute } from '../../components/ProtectRoute';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectRoute>
      <WalletLayout>{children}</WalletLayout>
    </ProtectRoute>
  );
}
