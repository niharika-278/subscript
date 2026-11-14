import { CATEGORIES, FREQUENCIES } from "../constants.js";
import { formatINR, formatDate, relativeDue, daysUntil } from "../utils/format.js";
import StatusBadge from "./StatusBadge.jsx";
import Icon from "./Icon.jsx";
import Modal from "./Modal.jsx";

// Read-only subscription details, opened from the calendar or a card.
// Carries the same contextual actions as the card.

export default function SubscriptionDetails({ subscription, onClose, onEdit, onStatusChange, onDelete }) {
  const category = CATEGORIES[subscription.category] || CATEGORIES.OTHER;
  const frequency = FREQUENCIES[subscription.billingFrequency] || { label: subscription.billingFrequency, per: "" };
  const isActive = subscription.status === "ACTIVE";
  const days = daysUntil(subscription.nextRenewalDate);

  return (
    <Modal title={subscription.name} subtitle={`${category.label} · ${frequency.label}`} onClose={onClose}>
      <div className="details-hero" style={{ background: `${category.color}14` }}>
        <span className="details-icon" style={{ background: `${category.color}2E`, color: category.color }}>
          <Icon name={category.icon} size={26} strokeWidth={1.7} />
        </span>
        <div>
          <div className="details-amount">{formatINR(subscription.amount)}<span> {frequency.per}</span></div>
          <div className="details-equiv">
            ≈ {formatINR(subscription.monthlyEquivalent)} per month · {formatINR(subscription.monthlyEquivalent * 12, { compact: false })} per year
          </div>
        </div>
        <StatusBadge status={subscription.status} />
      </div>

      <dl className="details-grid">
        <div><dt>Next renewal</dt><dd>{formatDate(subscription.nextRenewalDate)}</dd></div>
        <div>
          <dt>Countdown</dt>
          <dd>
            <span className={`due-chip due-${days < 0 && isActive ? "overdue" : days === 0 && isActive ? "today" : days <= 7 && isActive ? "soon" : "later"}`}>
              {isActive ? relativeDue(subscription.nextRenewalDate) : frequency.label}
            </span>
          </dd>
        </div>
        <div><dt>Started on</dt><dd>{formatDate(subscription.startDate)}</dd></div>
        <div><dt>Payment method</dt><dd>{subscription.paymentMethod || "—"}</dd></div>
        <div><dt>Reminder</dt><dd>{subscription.reminderDays} day{subscription.reminderDays > 1 ? "s" : ""} before</dd></div>
        <div><dt>Last updated</dt><dd>{new Date(subscription.updatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</dd></div>
      </dl>

      {subscription.notes && <p className="details-notes">{subscription.notes}</p>}

      <div className="modal-actions">
        <button type="button" className="btn btn-ghost btn-danger-text" onClick={() => onDelete?.(subscription)}>Delete</button>
        {subscription.status !== "CANCELLED" && (
          isActive ? (
            <button type="button" className="btn btn-ghost" onClick={() => onStatusChange?.(subscription, "PAUSED")}>Pause</button>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={() => onStatusChange?.(subscription, "ACTIVE")}>Resume</button>
          )
        )}
        {subscription.status !== "CANCELLED" && (
          <button type="button" className="btn btn-dark" onClick={() => onStatusChange?.(subscription, "CANCELLED")}>Cancel subscription</button>
        )}
        <button type="button" className="btn btn-primary" onClick={() => onEdit?.(subscription)}>Edit</button>
      </div>
    </Modal>
  );
}
