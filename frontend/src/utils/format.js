// Formatting and date helpers. The backend returns plain numbers and
// ISO date strings ("2026-11-20"); everything user-facing is built here.

/** ₹ with Indian digit grouping (₹1,49,999). Decimals shown only when they exist. */
export function formatINR(value, options = {}) {
  const number = Number(value) || 0;
  const hasCents = Math.round(number * 100) % 100 !== 0;
  const { compact = false } = options;
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: compact ? "compact" : "standard",
    minimumFractionDigits: compact || !hasCents ? 0 : 2,
    maximumFractionDigits: compact ? 1 : 2,
  });
  return formatter.format(number);
}

/** Parse "YYYY-MM-DD" as a LOCAL date (new Date(iso) would treat it as UTC). */
export function parseISODate(iso) {
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function today() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Whole days from today until the given ISO date (negative = past). */
export function daysUntil(iso) {
  const target = parseISODate(iso);
  if (!target) return 0;
  return Math.round((target - today()) / 86400000);
}

/** "20 Nov 2026" */
export function formatDate(iso) {
  const date = parseISODate(iso);
  if (!date) return "—";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** "20 Nov" (year only when it differs from the current year) */
export function formatDateShort(iso) {
  const date = parseISODate(iso);
  if (!date) return "—";
  const sameYear = date.getFullYear() === today().getFullYear();
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

/** Human countdown for a renewal: "Due today", "in 3 days", "4 days overdue". */
export function relativeDue(iso) {
  const days = daysUntil(iso);
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days > 1) return `in ${days} days`;
  if (days === -1) return "1 day overdue";
  return `${Math.abs(days)} days overdue`;
}

/** Add one billing cycle to a date; used to suggest the next renewal date. */
export function addBillingCycle(iso, frequency) {
  const date = parseISODate(iso);
  if (!date) return null;
  switch (frequency) {
    case "WEEKLY": return toISODate(addDays(date, 7));
    case "MONTHLY": {
      const next = new Date(date);
      next.setMonth(next.getMonth() + 1);
      return toISODate(next);
    }
    case "QUARTERLY": {
      const next = new Date(date);
      next.setMonth(next.getMonth() + 3);
      return toISODate(next);
    }
    case "YEARLY": {
      const next = new Date(date);
      next.setFullYear(next.getFullYear() + 1);
      return toISODate(next);
    }
    default: return iso;
  }
}

/** "November 2026" for the calendar heading. */
export function monthLabel(year, monthIndex) {
  return new Date(year, monthIndex, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export function percent(value, decimals = 0) {
  return `${Number(value).toFixed(decimals)}%`;
}
