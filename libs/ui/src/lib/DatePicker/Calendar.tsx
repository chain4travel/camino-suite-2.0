'use client';

import { useState } from 'react';
import Typography from '../Typography';
import CamBtn from '../CamBtn';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfWeek,
  isWithinInterval,
  isBefore,
  addDays,
} from 'date-fns';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import Icon from '@mdi/react';
import clsx from 'clsx';

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  startDate?: Date;
  endDate?: Date;
  onRangeChange?: (start: Date, end: Date) => void;
  showRange?: boolean;
  currentMonth?: Date;
  onMonthChange?: (date: Date) => void;
  variant?: 'single' | 'double';
  isLeftCalendar?: boolean;
  isRightCalendar?: boolean;
  onHoverDate?: (date: Date | null) => void;
  hoverDate?: Date | null;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  selecting?: boolean;
  onRangeSelect?: (date: Date) => void;
  maxEndDate?: Date;
  minStartDate?: Date;
}

export const Calendar = ({
  value,
  onChange,
  startDate: initialStartDate,
  endDate: initialEndDate,
  onRangeChange,
  showRange = false,
  currentMonth: controlledMonth,
  onMonthChange,
  variant = 'single',
  isLeftCalendar,
  isRightCalendar,
  onHoverDate,
  hoverDate,
  rangeStart,
  rangeEnd,
  selecting,
  onRangeSelect,
  maxEndDate,
  minStartDate,
}: CalendarProps) => {
  const [internalMonth, setInternalMonth] = useState(value || new Date());
  const currentMonth = controlledMonth || internalMonth;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStartDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEndDate = endOfMonth(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStartDate,
    end: calendarEndDate,
  });

  const weeks: Date[][] = [];
  let week: Date[] = [];

  days.forEach((day) => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });

  if (week.length > 0) {
    const remainingDays = 7 - week.length;
    const lastDay = week[week.length - 1];
    for (let i = 1; i <= remainingDays; i++) {
      week.push(addDays(lastDay, i));
    }
    weeks.push(week);
  }

  const handleDayClick = (day: Date) => {
    if (!showRange) {
      onChange?.(day);
      return;
    }
    onRangeSelect?.(day);
  };

  const isInRange = (day: Date) => {
    if (!showRange || !rangeStart) return false;

    if (selecting && hoverDate) {
      const start = isBefore(hoverDate, rangeStart) ? hoverDate : rangeStart;
      const end = isBefore(hoverDate, rangeStart) ? rangeStart : hoverDate;
      return isWithinInterval(day, { start, end });
    }

    if (rangeEnd) {
      return isWithinInterval(day, { start: rangeStart, end: rangeEnd });
    }

    return false;
  };

  const handleDayHover = (day: Date) => {
    if (selecting && onHoverDate) {
      onHoverDate(day);
    }
  };

  const isStartDate = (day: Date) => rangeStart && isSameDay(day, rangeStart);
  const isEndDate = (day: Date) => rangeEnd && isSameDay(day, rangeEnd);

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handleMonthChange = (date: Date) => {
    if (onMonthChange) {
      onMonthChange(date);
    } else {
      setInternalMonth(date);
    }
  };

  const isCurrentMonth = (day: Date) => {
    return format(day, 'MMM') === format(currentMonth, 'MMM');
  };

  const isDisabled = (day: Date) => {
    if (!isCurrentMonth(day)) {
      return true;
    }
    if (maxEndDate && isBefore(maxEndDate, day)) {
      return true;
    }
    if (minStartDate && isBefore(day, minStartDate)) {
      return true;
    }
    return false;
  };

  return (
    <div className="w-full p-2 lg:p-4">
      <div className="flex items-center justify-between mb-4">
        {(!isRightCalendar || variant === 'single') && (
          <CamBtn
            variant="transparent"
            className="!p-2"
            onClick={() => handleMonthChange(subMonths(currentMonth, 1))}
          >
            <Icon path={mdiChevronLeft} size={1} />
          </CamBtn>
        )}
        <Typography variant="h6">
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        {(!isLeftCalendar || variant === 'single') && (
          <CamBtn
            variant="transparent"
            className="!p-2"
            onClick={() => handleMonthChange(addMonths(currentMonth, 1))}
          >
            <Icon path={mdiChevronRight} size={1} />
          </CamBtn>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center">
            <Typography variant="caption" className="text-slate-400">
              {day}
            </Typography>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <div
              key={day.toString()}
              className={`text-center p-2 rounded-lg ${
                !isCurrentMonth(day)
                  ? 'invisible'
                  : isDisabled(day)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              } ${
                isStartDate(day)
                  ? 'bg-blue-500 rounded-r-none'
                  : isEndDate(day)
                  ? 'bg-blue-500 rounded-l-none'
                  : isInRange(day)
                  ? 'bg-blue-500/20'
                  : 'hover:bg-blue-500/20'
              }`}
              onClick={() => !isDisabled(day) && handleDayClick(day)}
              onMouseEnter={() => !isDisabled(day) && handleDayHover(day)}
              onMouseLeave={() => onHoverDate?.(null)}
            >
              <Typography
                className={clsx({
                  'text-white': isStartDate(day) || isEndDate(day),
                })}
              >
                {format(day, 'd')}
              </Typography>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
