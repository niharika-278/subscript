import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";
import { formatINR, formatDate } from "../utils/format.js";
import { CATEGORIES } from "../constants.js";
import StatCard from "../components/StatCard.jsx";
import Icon from "../components/Icon.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ReminderPanel from "../components/ReminderPanel.jsx";
import BudgetProgress from "../components/BudgetProgress.jsx";
import SubscriptionForm from "../components/SubscriptionForm.jsx";
import SubscriptionDetails from "../components/SubscriptionDetails.jsx";
import ConfirmationModal from "../components/ConfirmationModal.jsx";
import { useToast } from "../context/ToastContext.jsx";

// Dashboard: headline stats, budget progress, reminders and upcoming renewals.
// All numbers come from GET /api/dashboard, recomputed live from the database.

export default function Dashboard() {
  const toast = useToast();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [detailsSub, setDetailsSub] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const data = await api.getDashboard();
      setDashboard(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Reminder / renewal rows are summaries; the details modal needs the
  // full record, so we fetch it by id.
  async function openDetails(id) {
    try {
      setDetailsSub(await api.getSubscription(id));
    } catch (error) {
      toast.error(error.message);
    }
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

  if (loading) return <Loader label="Crunching your numbers…" />;
  if (!dashboard) {
    return (
      <EmptyState
        icon="power"
        title="Dashboard unavailable"
        message="The backend could not be reached. Start the Spring Boot server and refresh."
        action={<Link className="btn btn-primary" to="/dashboard">Retry</Link>}
      />
    );
  }

  const isEmpty = dashboard.totalActiveSubscriptions === 0
    && !dashboard.reminders.length
    && !dashboard.upcomingRenewals.length;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Your subscription picture</h2>
          <p className="page-sub">Live numbers from your subscription book — refresh and they're current.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add subscription</button>
      </div>

      {isEmpty ? (
        <div className="card">
          <EmptyState
            icon="receipt"
            title="No subscriptions yet"
            message="Add the services you pay for and Subscript will build your monthly picture, reminders and budget insights automatically."
            action={<button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>Add your first subscription</button>}
          />
        </div>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard
              label="Active subscriptions"
              value={dashboard.totalActiveSubscriptions}
              accent="green" icon="receipt"
            />
            <StatCard
              label="Monthly spend"
              value={formatINR(dashboard.monthlySpend)}
              accent="blue" icon="calendar"
            />
            <StatCard
              label="Projected annual spend"
              value={formatINR(dashboard.annualSpend)}
              accent="violet" icon="trending-up"
            />
            <StatCard
              label="Average subscription"
              value={formatINR(dashboard.averageMonthlyCost)}
              accent="amber" icon="gauge"
            />
          </div>

          <div className="dash-columns">
            <section className="card">
              <div className="card-head">
                <h3>Budget pulse</h3>
                <Link to="/budget" className="card-link">Manage budget →</Link>
              </div>
              <BudgetProgress budget={dashboard.budgetStatus} compact />
            </section>

            <section className="card">
              <div className="card-head">
                <h3>Reminders</h3>
                <span className="panel-count">{dashboard.reminders.length}</span>
              </div>
              <ReminderPanel reminders={dashboard.reminders} onOpen={(reminder) => openDetails(reminder.id)} />
            </section>
          </div>

          <section className="card">
            <div className="card-head">
              <h3>Upcoming renewals</h3>
              <span className="card-sub">{dashboard.upcomingRenewalsCount} due in the next 30 days</span>
            </div>
            {dashboard.upcomingRenewals.length === 0 ? (
              <EmptyState icon="calendar-check" title="Nothing due soon" message="No renewals scheduled in the next 30 days." />
            ) : (
              <ul className="renewal-list">
                {dashboard.upcomingRenewals.map((renewal) => {
                  const category = CATEGORIES[renewal.category] || CATEGORIES.OTHER;
                  return (
                    <li key={renewal.id}>
                      <button type="button" className="renewal-item" onClick={() => openDetails(renewal.id)}>
                        <span className="cat-chip" style={{ background: `${category.color}1A`, color: category.color }}>
                          <Icon name={category.icon} size={19} />
                        </span>
                        <div className="renewal-body">
                          <strong>{renewal.name}</strong>
                          <span>{formatDate(renewal.nextRenewalDate)} · {renewal.billingFrequency.toLowerCase()}</span>
                        </div>
                        <span className="renewal-amount">{formatINR(renewal.amount)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}

      {showForm && (
        <SubscriptionForm
          onClose={() => setShowForm(false)}
          onSaved={() => { load(); }}
        />
      )}

      {detailsSub && (
        <SubscriptionDetails
          subscription={detailsSub}
          onClose={() => setDetailsSub(null)}
          onEdit={() => { setShowForm(true); setDetailsSub(null); }}
          onStatusChange={handleStatusChange}
          onDelete={(sub) => { setDetailsSub(null); setConfirmDelete(sub); }}
        />
      )}

      {confirmDelete && (
        <ConfirmationModal
          title={`Delete ${confirmDelete.name}?`}
          message="This permanently removes the subscription and its history from your database. This cannot be undone."
          confirmLabel="Delete forever"
          busy={busy}
          onConfirm={handleDelete}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
