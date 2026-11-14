import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";
import { formatINR, formatDate, monthLabel, today, toISODate } from "../utils/format.js";
import { CATEGORIES, FREQUENCIES } from "../constants.js";
import Icon from "../components/Icon.jsx";
import CalendarGrid from "../components/CalendarGrid.jsx";
import SubscriptionDetails from "../components/SubscriptionDetails.jsx";
import SubscriptionForm from "../components/SubscriptionForm.jsx";
import ConfirmationModal from "../components/ConfirmationModal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Loader from "../components/Loader.jsx";
import { useToast } from "../context/ToastContext.jsx";

// Renewal calendar: monthly grid fed by real renewal dates, plus a
// side panel listing the renewals of the selected date.

export default function CalendarPage() {
  const toast = useToast();
  const now = today();

  const [subscriptions, setSubscriptions] = useState(null);
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(toISODate(now));
  const [detailsSub, setDetailsSub] = useState(null);
  const [editingSub, setEditingSub] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      setSubscriptions(await api.listSubscriptions());
    } catch (error) {
      toast.error(error.message);
      setSubscriptions([]);
    }
  }

  useEffect(() => { load(); }, []);

  // Only active subscriptions have live renewals; group them by ISO date.
  const eventsByDate = useMemo(() => {
    const map = {};
    (subscriptions || [])
      .filter((sub) => sub.status === "ACTIVE")
      .forEach((sub) => {
        (map[sub.nextRenewalDate] = map[sub.nextRenewalDate] || []).push(sub);
      });
    return map;
  }, [subscriptions]);

  function goToday() {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDate(toISODate(now));
  }

  async function openDetails(id) {
    try {
      setDetailsSub(await api.getSubscription(id));
    } catch (error) {
      toast.error(error.message);
    }
  }

  function shiftMonth(delta) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  async function handleStatusChange(subscription, status) {
    try {
      await api.updateSubscriptionStatus(subscription.id, status);
      toast.success(status === "PAUSED" ? `${subscription.name} paused` : `${subscription.name} is active again`);
      setDetailsSub(null);
      load();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await api.deleteSubscription(confirmDelete.id);
      toast.success(`${confirmDelete.name} deleted`);
      setConfirmDelete(null);
      setDetailsSub(null);
      load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  if (subscriptions === null) return <Loader label="Loading calendar…" />;

  const selectedEvents = eventsByDate[selectedDate] || [];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Renewal calendar</h2>
          <p className="page-sub">Every renewal of an active subscription, on the day it hits your wallet.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={goToday}>Today</button>
      </div>

      <div className="calendar-layout">
        <section className="card calendar-card">
          <div className="calendar-nav">
            <button type="button" className="icon-btn" onClick={() => shiftMonth(-1)} aria-label="Previous month">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 6-6 6 6 6" /></svg>
            </button>
            <h3 className="calendar-heading">{monthLabel(viewYear, viewMonth)}</h3>
            <button type="button" className="icon-btn" onClick={() => shiftMonth(1)} aria-label="Next month">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m10 6 6 6-6 6" /></svg>
            </button>
          </div>

          <CalendarGrid
            year={viewYear}
            month={viewMonth}
            eventsByDate={eventsByDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onOpenSubscription={(sub) => openDetails(sub.id)}
          />
        </section>

        <aside className="calendar-side">
          <div className="card">
            <div className="card-head">
              <h3>{formatDate(selectedDate)}</h3>
              <span className="panel-count">{selectedEvents.length}</span>
            </div>
            {selectedEvents.length === 0 ? (
              <EmptyState icon="moon" title="Nothing renews" message="No renewals are scheduled for this date." />
            ) : (
              <ul className="renewal-list">
                {selectedEvents.map((sub) => {
                  const category = CATEGORIES[sub.category] || CATEGORIES.OTHER;
                  const frequency = FREQUENCIES[sub.billingFrequency] || { label: sub.billingFrequency };
                  return (
                    <li key={sub.id}>
                      <button type="button" className="renewal-item" onClick={() => openDetails(sub.id)}>
                        <span className="cat-chip" style={{ background: `${category.color}1A`, color: category.color }}>
                          <Icon name={category.icon} size={19} />
                        </span>
                        <div className="renewal-body">
                          <strong>{sub.name}</strong>
                          <span>{frequency.label} renewal</span>
                        </div>
                        <span className="renewal-amount">{formatINR(sub.amount)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="card calendar-tip">
            <h4><Icon name="lightbulb" size={16} strokeWidth={2} /> Tip</h4>
            <p>Click any coloured chip to open the subscription. Solid chips fall due today; dashed chips are overdue.</p>
          </div>
        </aside>
      </div>

      {detailsSub && (
        <SubscriptionDetails
          subscription={detailsSub}
          onClose={() => setDetailsSub(null)}
          onEdit={() => { setEditingSub(detailsSub); setDetailsSub(null); }}
          onStatusChange={handleStatusChange}
          onDelete={(sub) => { setDetailsSub(null); setConfirmDelete(sub); }}
        />
      )}

      {editingSub && (
        <SubscriptionForm
          subscription={editingSub}
          onClose={() => setEditingSub(null)}
          onSaved={load}
        />
      )}

      {confirmDelete && (
        <ConfirmationModal
          title={`Delete ${confirmDelete.name}?`}
          message="This permanently removes the subscription from your database. This cannot be undone."
          confirmLabel="Delete forever"
          busy={busy}
          onConfirm={handleDelete}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
