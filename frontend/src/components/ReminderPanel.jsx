import { CATEGORIES } from "../constants.js";
import { formatINR, formatDate, relativeDue } from "../utils/format.js";
import Icon from "./Icon.jsx";
import EmptyState from "./EmptyState.jsx";

// Dashboard reminder section: renewals inside each subscription's
// reminder window, plus anything overdue. States come from the backend.

export default function ReminderPanel({ reminders, onOpen }) {
  if (!reminders.length) {
    return (
      <EmptyState
        icon="sparkles"
        title="You're all caught up"
        message="No renewals inside any reminder window right now."
      />
    );
  }

  return (
    <ul className="reminder-list">
      {reminders.map((reminder) => {
        const category = CATEGORIES[reminder.category] || CATEGORIES.OTHER;
        return (
          <li key={reminder.id}>
            <button type="button" className="reminder-item" onClick={() => onOpen?.(reminder)}>
              <span className="cat-chip" style={{ background: `${category.color}1A`, color: category.color }}>
                <Icon name={category.icon} size={19} />
              </span>
              <div className="reminder-body">
                <strong>{reminder.name}</strong>
                <span>
                  {formatDate(reminder.nextRenewalDate)} · {formatINR(reminder.amount)}
                  {reminder.state === "UPCOMING" && ` · ${reminder.reminderDays}-day reminder`}
                </span>
              </div>
              <span className={`reminder-chip chip-${String(reminder.state).toLowerCase()}`}>
                {reminder.state === "DUE_TODAY" ? "Due today" : relativeDue(reminder.nextRenewalDate)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
