// Shared recurring date calculator for edge functions.
// Day format: 1=Sun, 2=Mon, ..., 7=Sat (matches the app's stored weekly_days).

export type RecurrenceType = 1 | 2 | 3; // 1=daily, 2=weekly, 3=monthly
export type EndType = "end_date" | "end_after_type";

export interface RecurringOrderLike {
  meeting_date: string;
  meeting_time?: string | null;
  is_recurring?: boolean | null;
  recurrence_type?: number | null;
  repeat_interval?: number | null;
  weekly_days?: number[] | null;
  monthly_day?: number | null;
  monthly_week?: number | null;
  end_type?: string | null;
  recurrence_end_date?: string | null;
  recurrence_count?: number | null;
  total_days?: number | null;
}

const MS_DAY = 24 * 60 * 60 * 1000;

function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * MS_DAY);
}

function addWeeks(d: Date, n: number): Date {
  return addDays(d, n * 7);
}

function addMonths(d: Date, n: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}

function isAfter(a: Date, b: Date): boolean {
  return a.getTime() > b.getTime();
}

function isBefore(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime();
}

/**
 * Returns all recurring session dates for an order, mirroring the logic in
 * src/utils/recurringCalculation.ts so customer preview, admin view, invitation
 * text, and Rapatin payload all agree.
 */
export function getRecurringDates(order: RecurringOrderLike): Date[] {
  const startDate = new Date(order.meeting_date);
  if (!order.is_recurring || !order.total_days || order.total_days <= 1) {
    return [startDate];
  }

  const recurrenceType = (order.recurrence_type || 1) as RecurrenceType;
  const repeatInterval = order.repeat_interval || 1;
  const endType = (order.end_type as EndType | null) || null;
  const endAfterCount = order.recurrence_count || undefined;
  const endDate = order.recurrence_end_date ? new Date(order.recurrence_end_date) : undefined;
  const weeklyDays = order.weekly_days || undefined;
  const monthlyDay = order.monthly_day || undefined;
  const monthlyWeek = order.monthly_week || undefined;

  const MAX = 365;
  const dates: Date[] = [];

  if (endType !== "end_after_type" && endType !== "end_date") {
    // Legacy fallback: just step by interval
    for (let i = 0; i < (order.total_days || 1); i++) {
      if (recurrenceType === 1) dates.push(addDays(startDate, i * repeatInterval));
      else if (recurrenceType === 2) dates.push(addWeeks(startDate, i * repeatInterval));
      else if (recurrenceType === 3) dates.push(addMonths(startDate, i * repeatInterval));
    }
    return dates;
  }

  if (recurrenceType === 1) {
    if (endType === "end_after_type" && endAfterCount) {
      let cur = new Date(startDate);
      for (let i = 0; i < endAfterCount && dates.length < MAX; i++) {
        dates.push(new Date(cur));
        cur = addDays(cur, repeatInterval);
      }
    } else if (endType === "end_date" && endDate) {
      let cur = new Date(startDate);
      while (!isAfter(cur, endDate) && dates.length < MAX) {
        dates.push(new Date(cur));
        cur = addDays(cur, repeatInterval);
      }
    }
  } else if (recurrenceType === 2) {
    // Weekly with selected weekdays
    const days = weeklyDays && weeklyDays.length > 0
      ? [...weeklyDays].sort((a, b) => a - b)
      : [startDate.getDay() + 1]; // fallback: start date's weekday

    if (endType === "end_after_type" && endAfterCount) {
      let weekStart = new Date(startDate);
      let count = 0;
      let safety = 0;
      while (count < endAfterCount && dates.length < MAX && safety < 200) {
        for (const day of days) {
          if (count >= endAfterCount) break;
          const targetJsDay = day - 1;
          const diff = targetJsDay - weekStart.getDay();
          const candidate = addDays(weekStart, diff);
          if (isBefore(candidate, startDate)) continue;
          dates.push(candidate);
          count++;
        }
        weekStart = addWeeks(weekStart, repeatInterval);
        safety++;
      }
    } else if (endType === "end_date" && endDate) {
      let weekStart = new Date(startDate);
      let safety = 0;
      while (!isAfter(weekStart, addWeeks(endDate, 1)) && dates.length < MAX && safety < 200) {
        for (const day of days) {
          const targetJsDay = day - 1;
          const diff = targetJsDay - weekStart.getDay();
          const candidate = addDays(weekStart, diff);
          if (isBefore(candidate, startDate)) continue;
          if (isAfter(candidate, endDate)) continue;
          dates.push(candidate);
        }
        weekStart = addWeeks(weekStart, repeatInterval);
        safety++;
      }
    }
  } else if (recurrenceType === 3) {
    // Monthly
    const computeTarget = (monthAnchor: Date): Date => {
      if (monthlyDay) {
        const d = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), Math.min(monthlyDay, 28));
        return d;
      }
      if (monthlyWeek) {
        const dayOfWeek = startDate.getDay();
        const firstOfMonth = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), 1);
        const diff = (dayOfWeek - firstOfMonth.getDay() + 7) % 7;
        const first = addDays(firstOfMonth, diff);
        if (monthlyWeek === 5) {
          let last = first;
          while (true) {
            const next = addDays(last, 7);
            if (next.getMonth() !== monthAnchor.getMonth()) break;
            last = next;
          }
          return last;
        }
        return addDays(first, (monthlyWeek - 1) * 7);
      }
      return monthAnchor;
    };

    if (endType === "end_after_type" && endAfterCount) {
      let cur = new Date(startDate);
      for (let i = 0; i < endAfterCount && dates.length < MAX; i++) {
        const target = computeTarget(cur);
        if (!isBefore(target, startDate) || i === 0) {
          dates.push(target);
        } else {
          i--;
        }
        cur = addMonths(cur, repeatInterval);
      }
    } else if (endType === "end_date" && endDate) {
      let cur = new Date(startDate);
      let safety = 0;
      while (!isAfter(cur, addMonths(endDate, 1)) && dates.length < MAX && safety < 200) {
        const target = computeTarget(cur);
        if (!isBefore(target, startDate) && !isAfter(target, endDate)) {
          dates.push(target);
        }
        cur = addMonths(cur, repeatInterval);
        safety++;
      }
    }
  }

  return dates;
}

/**
 * Format date for Zoom-style invitation line, e.g. "Jun 09, 2026 09:00 AM Jakarta"
 */
export function formatInvitationLine(date: Date, time: string): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const [hStr, mStr] = (time || "00:00").split(":");
  const h = parseInt(hStr || "0", 10);
  const m = (mStr || "00").padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = String(h % 12 || 12).padStart(2, "0");
  return `${month} ${day}, ${year} ${h12}:${m} ${ampm} Jakarta`;
}

/**
 * Format date in Indonesian, e.g. "Selasa, 9 Juni 2026"
 */
export function formatIndoDate(date: Date): string {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
