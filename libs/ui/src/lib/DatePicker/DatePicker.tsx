'use client';
import { useState, useEffect, useMemo } from 'react';
import Typography from '../Typography';
import { Calendar } from './Calendar';
import { format, addMonths, subMonths, isBefore, startOfMonth } from 'date-fns';
import Dropdown from '../Dropdown';
import CamBtn from '../CamBtn';
import { useTranslation } from 'react-i18next';
import { DropdownItem } from '../Dropdown/Dropdown.types';
import clsx from 'clsx';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  description?: string;
  duration?: string[];
  onDurationChange?: (duration: DropdownItem) => void;
  selectedDuration?: string;
  showApply?: boolean;
  onApply?: () => void;
  startDate?: Date;
  endDate?: Date;
  onRangeChange?: (start: Date, end: Date) => void;
  showRange?: boolean;
  variant?: 'single' | 'double';
  maxEndDate?: Date;
  minStartDate?: Date;
}

export const DatePicker = ({
  value: initialValue,
  onChange,
  label,
  placeholder = 'Select date',
  disabled,
  className = '',
  description,
  duration,
  onDurationChange,
  selectedDuration = '1 week',
  showApply,
  onApply,
  startDate: initialStartDate,
  endDate: initialEndDate,
  onRangeChange,
  showRange = false,
  variant = 'single',
  maxEndDate,
  minStartDate,
}: DatePickerProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [leftMonth, setLeftMonth] = useState(new Date());
  const rightMonth = addMonths(leftMonth, 1);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(
    initialStartDate || null
  );
  const [rangeEnd, setRangeEnd] = useState<Date | null>(initialEndDate || null);
  const [selecting, setSelecting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialValue || null
  );

  useEffect(() => {
    setRangeStart(initialStartDate || null);
    setRangeEnd(initialEndDate || null);
  }, [initialStartDate, initialEndDate]);

  useEffect(() => {
    setSelectedDate(initialValue || null);
  }, [initialValue]);

  const handleDateSelect = (day: Date) => {
    setSelectedDate(day);
    onChange?.(day);
    if (!showApply) {
      setIsOpen(false);
    }
  };

  const handleRangeSelect = (day: Date) => {
    if (!showRange) {
      if (maxEndDate && isBefore(maxEndDate, day)) {
        return;
      }
      if (minStartDate && isBefore(day, minStartDate)) {
        return;
      }
      handleDateSelect(day);
      return;
    }

    if (!selecting || !rangeStart) {
      if (minStartDate && isBefore(day, minStartDate)) {
        return;
      }
      setRangeStart(day);
      setRangeEnd(null);
      setSelecting(true);
      setLeftMonth(startOfMonth(day));
    } else {
      let newStart = rangeStart;
      let newEnd = day;

      if (isBefore(day, rangeStart)) {
        if (minStartDate && isBefore(day, minStartDate)) {
          return;
        }
        newStart = day;
        newEnd = rangeStart;
      }

      if (maxEndDate && isBefore(maxEndDate, newEnd)) {
        return;
      }

      setRangeStart(newStart);
      setRangeEnd(newEnd);
      setSelecting(false);
      onRangeChange?.(newStart, newEnd);

      if (!showApply) {
        setIsOpen(false);
      }
    }
  };

  const displayValue = useMemo(() => {
    if (!showRange) {
      return selectedDate
        ? format(selectedDate, 'MMM dd, yyyy, h:mm a')
        : placeholder;
    }

    if (rangeStart && rangeEnd) {
      return `${format(rangeStart, 'MMM dd, yyyy')} - ${format(
        rangeEnd,
        'MMM dd, yyyy'
      )}`;
    }

    if (rangeStart) {
      return `${format(rangeStart, 'MMM dd, yyyy')} - Select end date`;
    }

    return placeholder;
  }, [selectedDate, rangeStart, rangeEnd, showRange, placeholder]);

  const handleApply = () => {
    if (showRange && rangeStart && rangeEnd) {
      onApply?.();
    } else if (!showRange && selectedDate) {
      onChange?.(selectedDate);
      onApply?.();
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} data-testid="datepicker">
      {label && (
        <Typography variant="caption" className="mb-2">
          {label}
        </Typography>
      )}
      {description && (
        <Typography variant="caption" className="!text-slate-400 mb-2 block">
          {description}
        </Typography>
      )}
      <div
        role="button"
        className={clsx(
          'w-full bg-white dark:bg-gray-900 border rounded-xl px-2 lg:px-4 py-2 cursor-pointer',
          'border-gray-200 dark:border-gray-700',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20',
          'focus:border-blue-500 dark:focus:border-blue-500',
          {
            'opacity-50 cursor-not-allowed': disabled
          }
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        data-testid="datepicker-input"
      >
        <Typography>{displayValue}</Typography>
      </div>

      {isOpen && !disabled && (
        <div
          className={`absolute z-50 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl p-4 
            ${
              variant === 'double'
                ? 'w-full lg:min-w-[660px] max-w-[calc(100vw-2rem)]'
                : 'w-full lg:w-[330px]'
            }`}
          data-testid="datepicker-calendar"
        >
          <div className="flex flex-col lg:flex-row gap-4 divide-y lg:divide-x lg:divide-y-0 divide-gray-700">
            <div className={variant === 'double' ? 'flex-1' : 'w-full'}>
              <Calendar
                value={selectedDate || undefined}
                onChange={handleDateSelect}
                showRange={showRange}
                currentMonth={leftMonth}
                onMonthChange={setLeftMonth}
                variant={variant}
                isLeftCalendar={variant === 'double'}
                onHoverDate={setHoverDate}
                hoverDate={hoverDate}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                selecting={selecting}
                onRangeSelect={handleRangeSelect}
                maxEndDate={maxEndDate}
                minStartDate={minStartDate}
              />
            </div>
            {variant === 'double' && (
              <div className="flex-1">
                <Calendar
                  value={selectedDate || undefined}
                  onChange={handleDateSelect}
                  showRange={showRange}
                  currentMonth={rightMonth}
                  onMonthChange={(date) => setLeftMonth(subMonths(date, 1))}
                  variant={variant}
                  isRightCalendar
                  onHoverDate={setHoverDate}
                  hoverDate={hoverDate}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  selecting={selecting}
                  onRangeSelect={handleRangeSelect}
                  maxEndDate={maxEndDate}
                  minStartDate={minStartDate}
                />
              </div>
            )}
          </div>

          <div className="w-full flex flex-wrap gap-4 justify-between mt-4">
            {duration && duration.length > 0 && (
              <div className="w-full lg:w-fit flex flex-wrap justify-start gap-2 items-center">
                <Typography variant="caption" className="flex-1 text-slate-400">
                  {t('duration')} :
                </Typography>

                <Dropdown
                  items={duration.map((d) => ({ id: d, label: d, value: d }))}
                  trigger={selectedDuration || duration[0]}
                  onSelect={onDurationChange}
                  className="w-fit"
                />
              </div>
            )}
            {showApply && (
              // <div className="self-end w-fit">
              <CamBtn
                variant="primary"
                onClick={handleApply}
                className="w-full self-end  lg:w-fit"
                disabled={
                  (showRange && (!rangeStart || !rangeEnd)) ||
                  (!showRange && !selectedDate)
                }
              >
                {t('apply')}
              </CamBtn>
              // </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
