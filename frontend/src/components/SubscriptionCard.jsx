import { CATEGORIES, FREQUENCIES } from "../constants.js";
import { formatINR, formatDate, relativeDue, parseISODate, today } from "../utils/format.js";
import StatusBadge from "./StatusBadge.jsx";
import Icon from "./Icon.jsx";

// One subscription tile with contextual status actions.

export default function SubscriptionCard({ subscription, onOpen, onEdit, onStatusChange, onDelete }) {
  const category = CATEGORIES[subscription.category] || CATEGORIES.OTHER;
  const frequency = FREQUENCIES[subscription.billingFrequency] || { per: "" };
  const isActive = subscription.status === "ACTIVE";

  return (
    <article
      className={`sub-card sub-card-${String(subscription.status).toLowerCase()}`}
      onClick={(event) => {
        if (!event.target.closest("button")) onOpen?.(subscription);
      }}
    >
      <div className="sub-card-top">
        <span className="cat-chip" style={{ background: `${category.color}1A`, color: category.color }}>
          <Icon name={category.icon} size={19} />
        </span>
        <div className="sub-card-name">
          <h3>{subscription.name}</h3>
          <span className="sub-card-category" style={{ color: category.color }}>{category.label}</span>
        </div>
        <StatusBadge status={subscription.status} />
      </div>

      <div className="sub-card-amount">
        <span className="amount-value">{formatINR(subscription.amount)}</span>
        <span className="amount-per">{frequency.per}</span>
      </div>

      <div className="sub-card-renewal">
        <div className="renewal-when">
          <Icon name="calendar" size={15} strokeWidth={2} />
          <span>{formatDate(subscription.nextRenewalDate)}</span>
        </div>
        <span className={`due-chip due-${dueClass(subscription)}`}>{relativeDue(subscription.nextRenewalDate)}</span>
      </div>

      <div className="sub-card-actions">
        <button type="button" className="btn btn-ghost btn-xs" onClick={() => onEdit?.(subscription)}>Edit</button>
        {subscription.status !== "CANCELLED" && (
          isActive ? (
            <button type="button" className="btn btn-ghost btn-xs" onClick={() => onStatusChange?.(subscription, "PAUSED")}>Pause</button>
          ) : (
            <button type="button" className="btn btn-ghost btn-xs" onClick={() => onStatusChange?.(subscription, "ACTIVE")}>Resume</button>
          )
        )}
        {subscription.status !== "CANCELLED" && (
          <button type="button" className="btn btn-ghost btn-xs" onClick={() => onStatusChange?.(subscription, "CANCELLED")}>Cancel</button>
        )}
        {subscription.status === "CANCELLED" && (
          <button type="button" className="btn btn-ghost btn-xs" onClick={() => onStatusChange?.(subscription, "ACTIVE")}>Reactivate</button>
        )}
        <button type="button" className="btn btn-ghost btn-xs btn-danger-text" onClick={() => onDelete?.(subscription)}>Delete</button>
      </div>
    </article>
  );
}

function dueClass(subscription) {
  if (subscription.status !== "ACTIVE") return "idle";
  const days = Math.round((parseISODate(subscription.nextRenewalDate) - today()) / 86400000);
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  if (days <= 7) return "soon";
  return "later";
}
