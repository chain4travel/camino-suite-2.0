import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import Modal from './Modal';
import { ModalProps } from './types';
import Typography from '../Typography';
import CamBtn from '../CamBtn';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof Modal>;

interface ModalDemoProps extends Partial<ModalProps> {
  size?: ModalProps['size'];
}

const ModalDemo = ({ size = 'md', children, ...props }: ModalDemoProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <CamBtn
        variant="secondary"
        onClick={() => setIsOpen(true)}
      >
        {props.title ? props.title : 'Open Modal'}
      </CamBtn>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size={size}
        {...props}
      >
        {children}
      </Modal>
    </div>
  );
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col w-full h-full gap-4 p-8 rounded-lg dark:bg-slate-950">
      <div className="flex flex-col gap-4">
        <Typography variant="h1">Modal sizes</Typography>
        <div className="flex flex-wrap gap-4">
          <ModalDemo title="Default Modal">
            <p>
              A wonderful serenity has taken possession of my entire soul, like
              these sweet mornings of spring which I enjoy with my whole heart.
            </p>
          </ModalDemo>
          <ModalDemo title="Small Modal" size="sm">
            <p>
              A wonderful serenity has taken possession of my entire soul, like
              these sweet mornings of spring which I enjoy with my whole heart.
            </p>
          </ModalDemo>
          <ModalDemo title="Large Modal" size="lg">
            <p>
              A wonderful serenity has taken possession of my entire soul, like
              these sweet mornings of spring which I enjoy with my whole heart.
            </p>
          </ModalDemo>
          <ModalDemo title="Extra Large Modal" size="xl">
            <p>
              A wonderful serenity has taken possession of my entire soul, like
              these sweet mornings of spring which I enjoy with my whole heart.
            </p>
          </ModalDemo>
          <ModalDemo title="Full Modal" size="full">
            <p>
              A wonderful serenity has taken possession of my entire soul, like
              these sweet mornings of spring which I enjoy with my whole heart.
            </p>
          </ModalDemo>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Typography variant="h1">Modal without close button</Typography>
        <ModalDemo title="Open Modal" showCloseButton={false}>
          <p>
            A wonderful serenity has taken possession of my entire soul, like
            these sweet mornings of spring which I enjoy with my whole heart.
          </p>
        </ModalDemo>
      </div>
      <div className="flex flex-col gap-4">
        <Typography variant="h1">Modal with custom close button</Typography>
        <ModalDemo title="Open Modal" showCloseButton={false}>
          <p>
            A wonderful serenity has taken possession of my entire soul, like
            these sweet mornings of spring which I enjoy with my whole heart.
          </p>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => null}
              className="px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-primary-600"
            >
              Custom Button
            </button>
          </div>
        </ModalDemo>
      </div>
      <div className="flex flex-col gap-4">
        <Typography variant="h1">Modal with Long Content</Typography>
        <ModalDemo title="Long Content">
          {Array.from({ length: 10 }).map((_, i) => (
            <p key={i} className="mb-4">
              A wonderful serenity has taken possession of my entire soul, like
              these sweet mornings of spring which I enjoy with my whole heart.
            </p>
          ))}
        </ModalDemo>
      </div>
      <div className="flex flex-col gap-4">
        <Typography variant="h1">Clean Modal</Typography>
        <ModalDemo showCloseButton={false}>
          <p>
            A wonderful serenity has taken possession of my entire soul, like
            these sweet mornings of spring which I enjoy with my whole heart.
          </p>
        </ModalDemo>
      </div>
    </div>
  ),
};

// export const Default: Story = {
//   render: () => (
//     <ModalDemo title="Example Modal">
//       <p>
//         A wonderful serenity has taken possession of my entire soul, like these
//         sweet mornings of spring which I enjoy with my whole heart.
//       </p>
//     </ModalDemo>
//   ),
// };

// export const Sizes: Story = {
//   render: () => (
//     <div className="flex flex-wrap gap-4">
//       {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((size) => (
//         <ModalDemo
//           key={size}
//           size={size}
//           title={`${size.toUpperCase()} Modal`}
//         >
//           <p>This is a {size} sized modal.</p>
//         </ModalDemo>
//       ))}
//     </div>
//   ),
// };

// export const WithoutTitle: Story = {
//   render: () => (
//     <ModalDemo>
//       <p>Modal without a title bar, but with close button.</p>
//     </ModalDemo>
//   ),
// };

// export const WithoutCloseButton: Story = {
//   render: () => (
//     <ModalDemo title="No Close Button" showCloseButton={false}>
//       <p>Modal without close button in header.</p>
//       <div className="flex justify-end mt-4">
//         <button
//           type="button"
//           onClick={() => null}
//           className="px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-primary-600"
//         >
//           Custom Close Button
//         </button>
//       </div>
//     </ModalDemo>
//   ),
// };

// export const LongContent: Story = {
//   render: () => (
//     <ModalDemo title="Scrollable Content">
//       {Array.from({ length: 10 }).map((_, i) => (
//         <p key={i} className="mb-4">
//           A wonderful serenity has taken possession of my entire soul, like these
//           sweet mornings of spring which I enjoy with my whole heart.
//         </p>
//       ))}
//     </ModalDemo>
//   ),
// };

// export const CleanModal: Story = {
//   render: () => (
//     <ModalDemo showCloseButton={false}>
//       <p>
//         A wonderful serenity has taken possession of my entire soul, like these
//         sweet mornings of spring which I enjoy with my whole heart.
//       </p>
//     </ModalDemo>
//   ),
// };
