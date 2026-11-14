// Shared label/icon/colour maps for the enums the backend sends as strings.
// Icons are names resolved by components/Icon.jsx (SVG set, no emoji).
// Palette: Charcoal #1E1E1C · Sand #D8CBB3 · Electric Blue #2F6BFF.

// Category colours: 9 categories on 6 hue families (blue, violet, green,
// amber, rose, stone) so charts read editorial instead of rainbow.
export const CATEGORIES = {
  ENTERTAINMENT: { label: "Entertainment", icon: "film",       color: "#2F6BFF" },
  MUSIC:         { label: "Music",         icon: "music",      color: "#8B5CF6" },
  GAMING:        { label: "Gaming",        icon: "gamepad",    color: "#4338CA" },
  CLOUD_STORAGE: { label: "Cloud Storage", icon: "cloud",      color: "#5E9BD6" },
  EDUCATION:     { label: "Education",     icon: "graduation", color: "#D97706" },
  PRODUCTIVITY:  { label: "Productivity",  icon: "bolt",       color: "#2E9E6B" },
  FITNESS:       { label: "Fitness",       icon: "dumbbell",   color: "#7FA32E" },
  LIFESTYLE:     { label: "Lifestyle",     icon: "leaf",       color: "#DB2777" },
  OTHER:         { label: "Other",         icon: "box",        color: "#8A8378" },
};

export const FREQUENCIES = {
  WEEKLY:     { label: "Weekly",     per: "/week",    perMonth: "/mo" },
  MONTHLY:    { label: "Monthly",    per: "/month",   perMonth: "/mo" },
  QUARTERLY:  { label: "Quarterly",  per: "/quarter", perMonth: "/mo" },
  YEARLY:     { label: "Yearly",     per: "/year",    perMonth: "/mo" },
};

export const STATUSES = {
  ACTIVE:    { label: "Active" },
  PAUSED:    { label: "Paused" },
  CANCELLED: { label: "Cancelled" },
};

export const BUDGET_STATES = {
  NO_BUDGET:   { label: "No budget set" },
  COMFORTABLE: { label: "Comfortable" },
  APPROACHING: { label: "Approaching limit" },
  OVER_BUDGET: { label: "Over budget" },
};

export const REMINDER_STATES = {
  OVERDUE:   { label: "Overdue" },
  DUE_TODAY: { label: "Due today" },
  UPCOMING:  { label: "Upcoming" },
};

// Reminder options offered in the subscription form (spec: 1 / 3 / 7 days).
export const REMINDER_OPTIONS = [1, 3, 7];
export const DEFAULT_REMINDER_DAYS = 3;
