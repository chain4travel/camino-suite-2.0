import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';

import { Fragment } from 'react';
import Icon from '@mdi/react';
import Typography from '../Typography';
import { clsx } from 'clsx';
import { mdiClose } from '@mdi/js';
import { useTranslation } from 'react-i18next';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  children: React.ReactNode;
}

const Drawer = ({ isOpen, onClose, theme, children }: DrawerProps) => {
  const { t } = useTranslation();
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="w-screen max-w-[22rem] pointer-events-auto">
                  <div className={clsx(
                    'flex h-full flex-col overflow-y-scroll py-6 shadow-xl',
                    theme === 'light' ? 'bg-white' : 'bg-slate-950'
                  )}>
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-base font-semibold leading-6">
                          <Typography variant="h6">{t('common.menu')}</Typography>
                        </DialogTitle>
                        <div className="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            className="relative rounded-md text-slate-950 dark:text-slate-100 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <Icon path={mdiClose} size={1}  />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-1 px-4 mt-6 sm:px-6">
                      <div className="flex flex-col gap-6">
                        {children}
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Drawer;
