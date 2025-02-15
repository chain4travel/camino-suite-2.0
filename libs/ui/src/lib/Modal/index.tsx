
'use client'

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useEffect } from 'react';

import Icon from '@mdi/react';
import { ModalProps } from './Modal.types';
import { mdiClose } from '@mdi/js';

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full max-h-full m-4'
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOutsideClick = true,
  className = '',
  ...props
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeOnOutsideClick ? onClose : () => void 0}
        {...props}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-slate-950 rounded-lg shadow-xl ${className}`}
              >
                {/* Header - Only show if there's a title */}
                {title && (
                  <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white font-inter">
                      {title}
                    </DialogTitle>
                    {showCloseButton && (
                      <button
                        type="button"
                        onClick={onClose}
                        className="p-1 transition-colors rounded-full text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
                        aria-label="Close modal"
                      >
                        <Icon path={mdiClose} size={1} />
                      </button>
                    )}
                  </div>
                )}

                {/* Content with close button if no title */}
                <div className="relative p-4 text-slate-700 dark:text-slate-300 font-inter">
                  {!title && showCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="absolute p-1 transition-colors rounded-full right-4 top-4 text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
                      aria-label="Close modal"
                    >
                      <Icon path={mdiClose} size={1} />
                    </button>
                  )}
                  {children}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
