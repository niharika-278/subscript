import { STATUSES } from "../constants.js";

// Small status chip: Active (lime), Paused (tangerine), Cancelled (muted).

export default function StatusBadge({ status }) {
  const meta = STATUSES[status] || { label: status };
  return (
    <span className={`status-badge status-${String(status).toLowerCase()}`}>
      <span className="status-dot" />
      {meta.label}
    </span>
  );
}
