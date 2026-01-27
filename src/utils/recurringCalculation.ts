import { addDays, addWeeks, addMonths, format, isBefore, isAfter, getDay, setDate, startOfMonth, getWeeksInMonth, setDay, differenceInDays } from 'date-fns';
import { id } from 'date-fns/locale';

export type RecurrenceType = 1 | 2 | 3; // 1=daily, 2=weekly, 3=monthly
export type EndType = 'end_date' | 'end_after_type';

export interface RecurringParams {
  startDate: Date;
  startTime: string;
  recurrenceType: RecurrenceType;
  repeatInterval: number;
  endType: EndType;
  endDate?: Date;
  endAfterCount?: number;
  weeklyDays?: number[]; // 1=Sun, 2=Mon, ..., 7=Sat
  monthlyDay?: number; // 1-31
  monthlyWeek?: number; // 1-5 (5=last)
}

export interface RecurringResult {
  totalDays: number;
  dates: Date[];
  formattedDates: string[];
}

// Map our day format (1=Sun, 2=Mon, ..., 7=Sat) to date-fns getDay (0=Sun, 1=Mon, ..., 6=Sat)
const mapDayToDateFns = (day: number): number => day - 1;
const mapDateFnsToDayFormat = (dateFnsDay: number): number => dateFnsDay + 1;

/**
 * Calculate recurring meeting dates based on parameters
 */
export function calculateRecurringDays(params: RecurringParams): RecurringResult {
  const dates: Date[] = [];
  const { 
    startDate, 
    recurrenceType, 
    repeatInterval, 
    endType, 
    endDate, 
    endAfterCount,
    weeklyDays,
    monthlyDay,
    monthlyWeek,
  } = params;

  // Max dates to prevent infinite loops
  const MAX_DATES = 365;

  if (recurrenceType === 1) {
    // DAILY recurrence
    if (endType === 'end_after_type' && endAfterCount) {
      // Generate exact number of occurrences
      let currentDate = new Date(startDate);
      for (let i = 0; i < endAfterCount && dates.length < MAX_DATES; i++) {
        dates.push(new Date(currentDate));
        currentDate = addDays(currentDate, repeatInterval);
      }
    } else if (endType === 'end_date' && endDate) {
      // Generate until end date (inclusive)
      let currentDate = new Date(startDate);
      while (!isAfter(currentDate, endDate) && dates.length < MAX_DATES) {
        dates.push(new Date(currentDate));
        currentDate = addDays(currentDate, repeatInterval);
      }
    }
  } else if (recurrenceType === 2) {
    // WEEKLY recurrence
    if (!weeklyDays || weeklyDays.length === 0) {
      // If no days selected, use start date's day
      const startDayOfWeek = mapDateFnsToDayFormat(getDay(startDate));
      return calculateRecurringDays({
        ...params,
        weeklyDays: [startDayOfWeek],
      });
    }

    const sortedDays = [...weeklyDays].sort((a, b) => a - b);
    
    if (endType === 'end_after_type' && endAfterCount) {
      let currentWeekStart = new Date(startDate);
      let count = 0;
      
      while (count < endAfterCount && dates.length < MAX_DATES) {
        for (const day of sortedDays) {
          if (count >= endAfterCount) break;
          
          const dateFnsDay = mapDayToDateFns(day);
          const dateInWeek = setDay(currentWeekStart, dateFnsDay, { weekStartsOn: 0 });
          
          // Skip if date is before start date
          if (isBefore(dateInWeek, startDate)) continue;
          
          dates.push(new Date(dateInWeek));
          count++;
        }
        currentWeekStart = addWeeks(currentWeekStart, repeatInterval);
      }
    } else if (endType === 'end_date' && endDate) {
      let currentWeekStart = new Date(startDate);
      
      while (!isAfter(currentWeekStart, addWeeks(endDate, 1)) && dates.length < MAX_DATES) {
        for (const day of sortedDays) {
          const dateFnsDay = mapDayToDateFns(day);
          const dateInWeek = setDay(currentWeekStart, dateFnsDay, { weekStartsOn: 0 });
          
          // Skip if date is before start date or after end date
          if (isBefore(dateInWeek, startDate)) continue;
          if (isAfter(dateInWeek, endDate)) continue;
          
          dates.push(new Date(dateInWeek));
        }
        currentWeekStart = addWeeks(currentWeekStart, repeatInterval);
      }
    }
  } else if (recurrenceType === 3) {
    // MONTHLY recurrence
    if (endType === 'end_after_type' && endAfterCount) {
      let currentMonth = new Date(startDate);
      
      for (let i = 0; i < endAfterCount && dates.length < MAX_DATES; i++) {
        let targetDate: Date;
        
        if (monthlyDay) {
          // Specific day of month
          const monthStart = startOfMonth(currentMonth);
          targetDate = setDate(monthStart, Math.min(monthlyDay, 28)); // Cap at 28 for safety
        } else if (monthlyWeek) {
          // Specific week of month (e.g., 2nd Monday)
          const dayOfWeek = getDay(startDate);
          targetDate = getNthWeekdayOfMonth(currentMonth, monthlyWeek, dayOfWeek);
        } else {
          targetDate = currentMonth;
        }
        
        // Skip if target date is before start date
        if (!isBefore(targetDate, startDate) || i === 0) {
          dates.push(new Date(targetDate));
        } else {
          // Don't count this as an occurrence
          i--;
        }
        
        currentMonth = addMonths(currentMonth, repeatInterval);
      }
    } else if (endType === 'end_date' && endDate) {
      let currentMonth = new Date(startDate);
      
      while (!isAfter(currentMonth, addMonths(endDate, 1)) && dates.length < MAX_DATES) {
        let targetDate: Date;
        
        if (monthlyDay) {
          const monthStart = startOfMonth(currentMonth);
          targetDate = setDate(monthStart, Math.min(monthlyDay, 28));
        } else if (monthlyWeek) {
          const dayOfWeek = getDay(startDate);
          targetDate = getNthWeekdayOfMonth(currentMonth, monthlyWeek, dayOfWeek);
        } else {
          targetDate = currentMonth;
        }
        
        if (!isBefore(targetDate, startDate) && !isAfter(targetDate, endDate)) {
          dates.push(new Date(targetDate));
        }
        
        currentMonth = addMonths(currentMonth, repeatInterval);
      }
    }
  }

  // Format dates for display
  const formattedDates = dates.map(date => 
    format(date, 'EEEE, d MMMM yyyy', { locale: id })
  );

  return {
    totalDays: dates.length,
    dates,
    formattedDates,
  };
}

/**
 * Get the nth weekday of a month
 * @param date - Any date in the target month
 * @param week - Week number (1-4, or 5 for last)
 * @param dayOfWeek - Day of week (0=Sun, 1=Mon, ..., 6=Sat)
 */
function getNthWeekdayOfMonth(date: Date, week: number, dayOfWeek: number): Date {
  const monthStart = startOfMonth(date);
  const firstDayOfWeek = setDay(monthStart, dayOfWeek, { weekStartsOn: 0 });
  
  // If the first occurrence is before the month starts, add a week
  const first = isBefore(firstDayOfWeek, monthStart) 
    ? addWeeks(firstDayOfWeek, 1) 
    : firstDayOfWeek;
  
  if (week === 5) {
    // Last occurrence of this weekday in the month
    let last = first;
    while (true) {
      const next = addWeeks(last, 1);
      if (next.getMonth() !== date.getMonth()) break;
      last = next;
    }
    return last;
  }
  
  return addWeeks(first, week - 1);
}

/**
 * Get recurrence type label in Indonesian
 */
export function getRecurrenceTypeLabel(type: RecurrenceType): string {
  switch (type) {
    case 1: return 'Harian';
    case 2: return 'Mingguan';
    case 3: return 'Bulanan';
  }
}

/**
 * Get day label in Indonesian
 */
export function getDayLabel(day: number): string {
  const labels: Record<number, string> = {
    1: 'Min',
    2: 'Sen',
    3: 'Sel',
    4: 'Rab',
    5: 'Kam',
    6: 'Jum',
    7: 'Sab',
  };
  return labels[day] || '';
}

/**
 * Get full day label in Indonesian
 */
export function getDayFullLabel(day: number): string {
  const labels: Record<number, string> = {
    1: 'Minggu',
    2: 'Senin',
    3: 'Selasa',
    4: 'Rabu',
    5: 'Kamis',
    6: 'Jumat',
    7: 'Sabtu',
  };
  return labels[day] || '';
}

/**
 * Get week ordinal label in Indonesian
 */
export function getWeekOrdinalLabel(week: number): string {
  const labels: Record<number, string> = {
    1: 'Pertama',
    2: 'Kedua',
    3: 'Ketiga',
    4: 'Keempat',
    5: 'Terakhir',
  };
  return labels[week] || '';
}

/**
 * Validate recurring parameters
 */
export function validateRecurringParams(params: Partial<RecurringParams>): string | null {
  if (!params.startDate) return 'Tanggal mulai harus diisi';
  if (!params.recurrenceType) return 'Tipe pengulangan harus dipilih';
  if (!params.repeatInterval || params.repeatInterval < 1) return 'Interval harus minimal 1';
  
  if (params.recurrenceType === 1 && params.repeatInterval > 99) {
    return 'Interval harian maksimal 99';
  }
  if (params.recurrenceType === 2 && params.repeatInterval > 50) {
    return 'Interval mingguan maksimal 50';
  }
  if (params.recurrenceType === 3 && params.repeatInterval > 10) {
    return 'Interval bulanan maksimal 10';
  }
  
  if (params.recurrenceType === 2 && (!params.weeklyDays || params.weeklyDays.length === 0)) {
    return 'Pilih minimal satu hari untuk pengulangan mingguan';
  }
  
  if (!params.endType) return 'Pilih cara mengakhiri pengulangan';
  
  if (params.endType === 'end_date') {
    if (!params.endDate) return 'Tanggal berakhir harus diisi';
    if (isBefore(params.endDate, params.startDate)) {
      return 'Tanggal berakhir tidak boleh sebelum tanggal mulai';
    }
  }
  
  if (params.endType === 'end_after_type') {
    if (!params.endAfterCount || params.endAfterCount < 2) {
      return 'Jumlah pertemuan minimal 2';
    }
    if (params.endAfterCount > 99) {
      return 'Jumlah pertemuan maksimal 99';
    }
  }
  
  return null;
}
