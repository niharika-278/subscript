import { CATEGORIES } from "../constants.js";
import { parseISODate, toISODate, today } from "../utils/format.js";

// Month grid (Monday-first) for the renewal calendar.
// eventsByDate maps "YYYY-MM-DD" -> subscriptions renewing that day.
//
// Visual states per the product spec:
//   - upcoming renewal  -> tinted category chip
//   - due today         -> solid coral chip
//   - overdue (past)    -> dashed coral chip
//   - several renewals  -> "+N more" indicator

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_CHIPS = 2;

function buildCells(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const offset = (firstOfMonth.getDay() + 6) % 7; // days since Monday
  const start = new Date(year, month, 1 - offset);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    cells.push({
      iso: toISODate(date),
      day: date.getDate(),
      inMonth: date.getMonth() === month,
    });
  }
  return cells;
}

export default function CalendarGrid({ year, month, eventsByDate, selectedDate, onSelectDate, onOpenSubscription }) {
  const cells = buildCells(year, month);
  const nowISO = toISODate(today());

  return (
    <div className="calendar">
      <div className="calendar-weekdays">
        {WEEKDAYS.map((weekday) => <span key={weekday}>{weekday}</span>)}
      </div>

      <div className="calendar-grid">
        {cells.map((cell) => {
          const events = eventsByDate[cell.iso] || [];
          const isToday = cell.iso === nowISO;
          const isSelected = cell.iso === selectedDate;
          const visible = events.slice(0, MAX_CHIPS);
          const hidden = events.length - visible.length;

          return (
            <button
              key={cell.iso}
              type="button"
              onClick={() => onSelectDate(cell.iso)}
              className={[
                "calendar-cell",
                cell.inMonth ? "" : "cell-out",
                isToday ? "cell-today" : "",
                isSelected ? "cell-selected" : "",
                events.length ? "cell-has-events" : "",
              ].join(" ")}
            >
              <span className="cell-day">{cell.day}</span>

              <span className="cell-chips">
                {visible.map((sub) => {
                  const category = CATEGORIES[sub.category] || CATEGORIES.OTHER;
                  const state = cell.iso === nowISO ? "due-today" : cell.iso < nowISO ? "overdue" : "upcoming";
                  return (
                    <span
                      key={sub.id}
                      role="button"
                      tabIndex={0}
                      className={`cell-chip chip-${state}`}
                      style={{ "--chip-color": category.color }}
                      onClick={(event) => { event.stopPropagation(); onOpenSubscription(sub); }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.stopPropagation();
                          onOpenSubscription(sub);
                        }
                      }}
                      title={`${sub.name} · ${cell.iso}`}
                    >
                      <span className="cell-chip-dot" />
                      {sub.name}
                    </span>
                  );
                })}
                {hidden > 0 && <span className="cell-more">+{hidden} more</span>}
              </span>
            </button>
          );
        })}
      </div>

      <div className="calendar-legend">
        <span><i className="legend-dot legend-today" /> Today</span>
        <span><i className="legend-dot legend-renewal" /> Renewal</span>
        <span><i className="legend-dot legend-due" /> Due today</span>
        <span><i className="legend-dot legend-overdue" /> Overdue</span>
      </div>
    </div>
  );
}
