import { useMemo, useRef, useState } from "react";
import { api } from "../services/api.js";
import { useToast } from "../context/ToastContext.jsx";
import { CATEGORIES, FREQUENCIES, REMINDER_OPTIONS, DEFAULT_REMINDER_DAYS } from "../constants.js";
import { addBillingCycle, today, toISODate } from "../utils/format.js";
import Modal from "./Modal.jsx";

// Add / edit subscription modal. Creates via POST /api/subscriptions,
// updates via PUT /api/subscriptions/{id}. Field errors from the
// backend's validation response are shown inline.

const EMPTY_FORM = () => ({
  name: "",
  category: "ENTERTAINMENT",
  amount: "",
  billingFrequency: "MONTHLY",
  startDate: toISODate(today()),
  nextRenewalDate: addBillingCycle(toISODate(today()), "MONTHLY"),
  paymentMethod: "",
  reminderDays: String(DEFAULT_REMINDER_DAYS),
  notes: "",
});

function fromSubscription(subscription) {
  return {
    name: subscription.name,
    category: subscription.category,
    amount: String(subscription.amount),
    billingFrequency: subscription.billingFrequency,
    startDate: subscription.startDate,
    nextRenewalDate: subscription.nextRenewalDate,
    paymentMethod: subscription.paymentMethod || "",
    reminderDays: String(subscription.reminderDays),
    notes: subscription.notes || "",
  };
}

export default function SubscriptionForm({ subscription, onClose, onSaved }) {
  const toast = useToast();
  const isEdit = Boolean(subscription);
  const [form, setForm] = useState(() => (isEdit ? fromSubscription(subscription) : EMPTY_FORM()));
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  // Suggest the next renewal automatically (start date + one cycle)
  // until the user edits that field by hand.
  const renewalTouched = useRef(isEdit);

  function setField(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (!renewalTouched.current && (field === "startDate" || field === "billingFrequency")) {
        next.nextRenewalDate = addBillingCycle(next.startDate, next.billingFrequency) || next.nextRenewalDate;
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(values) {
    const next = {};
    if (!values.name.trim()) next.name = "Service name is required";
    const amount = Number(values.amount);
    if (values.amount === "" || Number.isNaN(amount)) next.amount = "Amount is required";
    else if (amount <= 0) next.amount = "Amount must be greater than 0";
    if (!values.startDate) next.startDate = "Start date is required";
    if (!values.nextRenewalDate) next.nextRenewalDate = "Next renewal date is required";
    else if (values.nextRenewalDate < values.startDate) {
      next.nextRenewalDate = "Renewal cannot be before the start date";
    }
    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const clientErrors = validate(form);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category,
      amount: Number(form.amount),
      billingFrequency: form.billingFrequency,
      startDate: form.startDate,
      nextRenewalDate: form.nextRenewalDate,
      paymentMethod: form.paymentMethod.trim() || null,
      reminderDays: Number(form.reminderDays),
      notes: form.notes.trim() || null,
    };

    setBusy(true);
    try {
      const saved = isEdit
        ? await api.updateSubscription(subscription.id, payload)
        : await api.createSubscription(payload);
      toast.success(isEdit ? `${saved.name} updated` : `${saved.name} added to your subscriptions`);
      onSaved?.(saved);
      onClose();
    } catch (error) {
      if (error.details) setErrors(error.details);
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  const categoryOptions = useMemo(() => Object.entries(CATEGORIES), []);

  return (
    <Modal
      title={isEdit ? `Edit ${subscription.name}` : "Add a subscription"}
      subtitle={isEdit ? "Update the details of this recurring payment." : "Track a service you pay for — Subscript does the math."}
      onClose={onClose}
      wide
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-field form-span">
            <label htmlFor="sub-name">Service name *</label>
            <input
              id="sub-name"
              type="text"
              maxLength={100}
              placeholder="e.g. Netflix"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className={errors.name ? "input-invalid" : ""}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="sub-category">Category *</label>
            <select id="sub-category" value={form.category} onChange={(e) => setField("category", e.target.value)}>
              {categoryOptions.map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="sub-amount">Amount (₹) *</label>
            <input
              id="sub-amount"
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              placeholder="e.g. 649"
              value={form.amount}
              onChange={(e) => setField("amount", e.target.value)}
              className={errors.amount ? "input-invalid" : ""}
            />
            {errors.amount && <span className="field-error">{errors.amount}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="sub-frequency">Billing frequency *</label>
            <select id="sub-frequency" value={form.billingFrequency} onChange={(e) => setField("billingFrequency", e.target.value)}>
              {Object.entries(FREQUENCIES).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="sub-reminder">Remind me</label>
            <select id="sub-reminder" value={form.reminderDays} onChange={(e) => setField("reminderDays", e.target.value)}>
              {REMINDER_OPTIONS.map((days) => (
                <option key={days} value={days}>{days} day{days > 1 ? "s" : ""} before renewal</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="sub-start">Start date *</label>
            <input
              id="sub-start"
              type="date"
              value={form.startDate}
              onChange={(e) => setField("startDate", e.target.value)}
              className={errors.startDate ? "input-invalid" : ""}
            />
            {errors.startDate && <span className="field-error">{errors.startDate}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="sub-renewal">Next renewal date *</label>
            <input
              id="sub-renewal"
              type="date"
              value={form.nextRenewalDate}
              onChange={(e) => { renewalTouched.current = true; setField("nextRenewalDate", e.target.value); }}
              className={errors.nextRenewalDate ? "input-invalid" : ""}
            />
            {errors.nextRenewalDate && <span className="field-error">{errors.nextRenewalDate}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field form-span">
            <label htmlFor="sub-payment">Payment method <span className="optional">optional</span></label>
            <input
              id="sub-payment"
              type="text"
              maxLength={50}
              placeholder="e.g. UPI, Credit Card"
              value={form.paymentMethod}
              onChange={(e) => setField("paymentMethod", e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field form-span">
            <label htmlFor="sub-notes">Notes <span className="optional">optional</span></label>
            <textarea
              id="sub-notes"
              rows={3}
              maxLength={500}
              placeholder="Anything worth remembering about this subscription"
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : isEdit ? "Save changes" : "Add subscription"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
