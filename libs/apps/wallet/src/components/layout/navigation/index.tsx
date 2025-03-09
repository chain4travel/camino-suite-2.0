import { WALLET_NAV_ITEMS } from '@camino/data';
import { Tabs } from '@camino/ui';
import { usePathname, useRouter } from 'next/navigation';

export const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab =
    WALLET_NAV_ITEMS.find(
      (item) =>
        pathname === item.href ||
        (item.href === '/wallet' &&
          pathname.startsWith('/wallet') &&
          pathname.split('/').length === 2)
    )?.id || WALLET_NAV_ITEMS[0].id;

  return (
    <div className="w-full border-b border-slate-700 dark:bg-slate-950 bg-white px-4 pt-2">
      <div className="container mx-auto max-w-container overflow-x-auto">
        <Tabs
          tabs={WALLET_NAV_ITEMS}
          activeTab={activeTab}
          onChange={(tabId) => {
            const tab = WALLET_NAV_ITEMS.find((item) => item.id === tabId);
            if (tab) {
              router.push(tab.href);
            }
          }}
          className="border-b-0 min-w-fit"
        />
      </div>
    </div>
  );
};
