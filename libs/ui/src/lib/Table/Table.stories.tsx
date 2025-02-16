import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './index';
import { Typography, CamBadge } from '../..';
import { Icon } from '@mdi/react';
import { mdiCube, mdiArrowRight } from '@mdi/js';
import clsx from 'clsx';

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full h-full bg-slate-950 rounded-xl ">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table<ExampleData>>;

export default meta;

interface ExampleData extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  balance: number;
}

interface TransactionData extends Record<string, unknown> {
  blockId: string;
  time: string;
  txCount: string;
  hash: string;
  amount: string;
}

const columns = [
  {
    key: 'name',
    header: 'Name',
    render: (row: ExampleData) => (
      <Typography variant="body1" className="font-medium">
        {row.name}
      </Typography>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    render: (row: ExampleData) => (
      <Typography variant="body1" className="font-medium">
        {row.email}
      </Typography>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    align: 'center' as const,
    render: (row: ExampleData) => (
      <CamBadge
        variant={
          row.status === 'active'
            ? 'positive'
            : row.status === 'pending'
            ? 'warning'
            : 'negative'
        }
        text={row.status}
      />
    ),
  },
  {
    key: 'balance',
    header: 'Balance',
    align: 'right' as const,
    render: (row: ExampleData) => (
      <Typography variant="body2" className="font-medium">
        ${row.balance.toLocaleString()}
      </Typography>
    ),
  },
];

const data: ExampleData[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    balance: 1234.56,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'inactive',
    balance: 789.12,
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'pending',
    balance: 432.89,
  },
];

const transactionColumns = [
  {
    key: 'blockId',
    width: 'w-32',
    render: (row: TransactionData) => (
      <div className="flex items-center gap-2">
        <Icon path={mdiCube} size={0.9} className="text-slate-400" />
        <Typography variant="body2" className="font-medium">
          {row.blockId}
        </Typography>
      </div>
    ),
  },
  {
    key: 'time',
    width: 'w-36',
    render: (row: TransactionData) => (
      <Typography variant="body2" className="text-slate-500">
        {row.time}
      </Typography>
    ),
  },
  {
    key: 'txCount',
    width: 'w-24',
    align: 'center' as const,
    render: (row: TransactionData) => (
      <Typography variant="body2">{row.txCount} txs</Typography>
    ),
  },
  {
    key: 'hash',
    render: (row: TransactionData) => (
      <Typography
        variant="body2"
        className="font-mono text-blue-500 hover:text-blue-600"
      >
        {row.hash}
      </Typography>
    ),
  },
  {
    key: 'amount',
    width: 'w-32',
    align: 'right' as const,
    render: (row: TransactionData) => (
      <Typography variant="body2" className="font-medium">
        {row.amount}
      </Typography>
    ),
  },
  {
    key: 'actions',
    width: 'w-12',
    align: 'right' as const,
    render: () => <Icon path={mdiArrowRight} size={0.9} className="text-slate-400" />,
  },
];

const transactionData: TransactionData[] = [
  {
    blockId: '6233',
    time: '24 mins ago',
    txCount: '1',
    hash: '0×3431e0c52f4320029ec7592b0c873...',
    amount: '53 392',
  },
  {
    blockId: '6233',
    time: '40 mins ago',
    txCount: '1',
    hash: '0×3431e0c52f4320029ec7592b0c873...',
    amount: '53 392',
  },
  {
    blockId: '6233',
    time: '7 mins ago',
    txCount: '1',
    hash: '0×3c2fb04794feeb9932612b0c8737...',
    amount: '53 392',
  },
  {
    blockId: '6233',
    time: '7 mins ago',
    txCount: '0',
    hash: '0×3431e0c52f4320029ec7592b0c873...',
    amount: '53 392',
  },
];

const transactionMeta = {
  ...meta,
  component: Table<TransactionData>,
} satisfies Meta<typeof Table<TransactionData>>;

export const Default: StoryObj<typeof meta> = {
  args: {
    columns,
    data,
  },
};

export const NoHeader: StoryObj<typeof meta> = {
  args: {
    columns: columns.map(({ header, ...rest }) => rest),
    data,
    showHeader: false,
  },
};

export const Empty: StoryObj<typeof meta> = {
  args: {
    columns,
    data: [],
    emptyMessage: 'No records found',
  },
};

export const WithRowClick: StoryObj<typeof meta> = {
  args: {
    columns,
    data,
    onRowClick: (row: ExampleData) => alert(`Clicked row: ${row.name}`),
  },
};

export const Transactions: StoryObj<typeof transactionMeta> = {
  args: {
    columns: transactionColumns,
    data: transactionData,
    showHeader: false,
    className: 'bg-transparent dark:bg-transparent',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
