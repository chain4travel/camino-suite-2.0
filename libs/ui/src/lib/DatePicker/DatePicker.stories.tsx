import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';
import { addDays, subDays, addMonths } from 'date-fns';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date();

// Basic Examples
export const Default: Story = {
  args: {
    label: 'Select Date',
    placeholder: 'Choose a date',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Select Date',
    value: today,
    description: 'Pre-selected date example',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Validation End Date',
    description: 'Your CAM tokens will be bonded until this date.',
    value: today,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Select Date',
    value: today,
    disabled: true,
    description: 'This date picker is disabled',
  },
};

// Range Selection Examples
export const WithRange: Story = {
  args: {
    label: 'Date Range',
    placeholder: 'Select date range',
    showRange: true,
    startDate: subDays(today, 7),
    endDate: today,
    description: 'Simple date range selection',
  },
};

export const DoubleCalendarRange: Story = {
  args: {
    label: 'Date Range',
    placeholder: 'Select date range',
    showRange: true,
    variant: 'double',
    description: 'Two-month view for easier range selection',
  },
};

// Constraint Examples
export const WithMaxEndDate: Story = {
  args: {
    label: 'Future Date Selection',
    placeholder: 'Select a date',
    maxEndDate: addDays(today, 30),
    description: 'You can only select dates within the next 30 days',
  },
};

export const WithMinStartDate: Story = {
  args: {
    label: 'Future Date Selection',
    placeholder: 'Select a date',
    minStartDate: today,
    description: 'You can only select dates from today onwards',
  },
};

export const WithDateConstraints: Story = {
  args: {
    label: 'Constrained Range',
    placeholder: 'Select date range',
    showRange: true,
    minStartDate: subDays(today, 7),
    maxEndDate: addDays(today, 30),
    description: 'Select dates between last week and next month',
    variant: 'double',
  },
};

// Duration Examples
export const WithDuration: Story = {
  args: {
    label: 'Travel Duration',
    placeholder: 'Select dates',
    showRange: true,
    duration: ['1 week', '2 weeks', '1 month'],
    selectedDuration: '1 week',
    description: 'Select dates and duration',
    onDurationChange: (duration) => {
      console.log(duration);
    },
  },
};

// Apply Button Examples
export const WithApplyButton: Story = {
  args: {
    label: 'Single Date',
    placeholder: 'Select a date',
    showApply: true,
    description: 'Click apply to confirm selection',
  },
};

export const WithRangeAndApply: Story = {
  args: {
    label: 'Date Range with Apply',
    placeholder: 'Select dates',
    showRange: true,
    showApply: true,
    duration: ['1 week', '2 weeks', '1 month'],
    selectedDuration: '1 week',
    variant: 'double',
    description: 'Select range and click apply to confirm',
  },
};

// Full Featured Example
export const FullFeatured: Story = {
  args: {
    label: 'Travel Period',
    description: 'Plan your trip by selecting dates and duration',
    placeholder: 'Select travel dates',
    showRange: true,
    showApply: true,
    duration: ['1 week', '2 weeks', '1 month', '3 months'],
    selectedDuration: '1 week',
    variant: 'double',
    minStartDate: today,
    maxEndDate: addMonths(today, 6),
    startDate: addDays(today, 7),
    endDate: addDays(today, 14),
  },
}; 