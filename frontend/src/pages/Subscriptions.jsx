import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";
import { CATEGORIES, STATUSES } from "../constants.js";
import SubscriptionCard from "../components/SubscriptionCard.jsx";
import SubscriptionForm from "../components/SubscriptionForm.jsx";
import SubscriptionDetails from "../components/SubscriptionDetails.jsx";
import ConfirmationModal from "../components/ConfirmationModal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Loader from "../components/Loader.jsx";
import { useToast } from "../context/ToastContext.jsx";

// Full subscription book: search, filter, sort, status actions and
// delete-with-confirmation. Every change round-trips to the backend.

const SORT_OPTIONS = [
  { value: "nextRenewalDate:asc", label: "Renewal: soonest first" },
  { value: "nextRenewalDate:desc", label: "Renewal: latest first" },
  { value: "amount:desc", label: "Price: high to low" },
  { value: "amount:asc", label: "Price: low to high" },
  { value: "name:asc", label: "Name: A to Z" },
  { value: "name:desc", label: "Name: Z to A" },
];

export default function Subscriptions() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [subscriptions, setSubscriptions] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({ search: "", category: "", status: "", sort: "nextRenewalDate", direction: "asc" });
  const [showForm, setShowForm] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [detailsSub, setDetailsSub] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (activeFilters) => {
    try {
      const data = await api.listSubscriptions(activeFilters);
      setSubscriptions(data);
    } catch (error) {
      toast.error(error.message);
      setSubscriptions([]);
    }
  }, [toast]);

  // "?add=1" (from the sidebar / topbar buttons) opens the form once.
  useEffect(() => {
    if (searchParams.get("add")) {
      setShowForm(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Debounced reload whenever a filter changes; the backend does the
  // searching, filtering and sorting (GET /api/subscriptions?...).
  useEffect(() => {
    const timer = setTimeout(() => load(filters), 220);
    return () => clearTimeout(timer);
  }, [filters, load]);

  function setFilter(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function handleSortChange(event) {
    const [sort, direction] = event.target.value.split(":");
    setFilters((prev) => ({ ...prev, sort, direction }));
  }

  async function handleStatusChange(subscription, status) {
    if (status === "CANCELLED") { setConfirmCancel(subscription); return; }
    try {
      await api.updateSubscriptionStatus(subscription.id, status);
      toast.success(status === "PAUSED" ? `${subscription.name} paused` : `${subscription.name} is active again`);
      setDetailsSub(null);
      load(filters);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleCancelConfirm() {
    setBusy(true);
    try {
      await api.updateSubscriptionStatus(confirmCancel.id, "CANCELLED");
      toast.info(`${confirmCancel.name} marked as cancelled — it no longer counts towards your spend`);
      setConfirmCancel(null);
      setDetailsSub(null);
      load(filters);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await api.deleteSubscription(confirmDelete.id);
      toast.success(`${confirmDelete.name} deleted`);
      setConfirmDelete(null);
      setDetailsSub(null);
      load(filters);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function openDetails(id) {
    try {
      setDetailsSub(await api.getSubscription(id));
    } catch (error) {
      toast.error(error.message);
    }
  }

  const hasFilters = filters.search || filters.category || filters.status;
  const sortValue = `${filters.sort}:${filters.direction}`;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Your subscription book</h2>
          <p className="page-sub">Search, filter and manage every recurring payment in one place.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add subscription</button>
      </div>

      <div className="toolbar card">
        <div className="toolbar-search">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            placeholder="Search by name…"
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setFilter("search", e.target.value); }}
          />
        </div>
        <select value={filters.category} onChange={(e) => setFilter("category", e.target.value)} aria-label="Filter by category">
          <option value="">All categories</option>
          {Object.entries(CATEGORIES).map(([key, meta]) => (
            <option key={key} value={key}>{meta.label}</option>
          ))}
        </select>
        <select value={filters.status} onChange={(e) => setFilter("status", e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {Object.entries(STATUSES).map(([key, meta]) => (
            <option key={key} value={key}>{meta.label}</option>
          ))}
        </select>
        <select value={sortValue} onChange={handleSortChange} aria-label="Sort subscriptions">
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {hasFilters && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => { setSearchInput(""); setFilters({ search: "", category: "", status: "", sort: filters.sort, direction: filters.direction }); }}
          >
            Clear filters
          </button>
        )}
      </div>

      {subscriptions === null ? (
        <Loader label="Loading subscriptions…" />
      ) : subscriptions.length === 0 ? (
        <div className="card">
          {hasFilters ? (
            <EmptyState
              icon="search"
              title="No matches"
              message="No subscriptions match your search and filters. Try different keywords or clear the filters."
            />
          ) : (
            <EmptyState
              icon="receipt"
              title="No subscriptions yet"
              message="Add your first subscription — Netflix, Spotify, the gym — and watch your monthly picture appear."
              action={<button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>Add subscription</button>}
            />
          )}
        </div>
      ) : (
        <>
          <p className="result-count">{subscriptions.length} subscription{subscriptions.length === 1 ? "" : "s"}</p>
          <div className="sub-grid">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onOpen={openDetails}
                onEdit={(sub) => { setEditingSub(sub); }}
                onStatusChange={handleStatusChange}
                onDelete={setConfirmDelete}
              />
            ))}
          </div>
        </>
      )}

      {showForm && (
        <SubscriptionForm
          onClose={() => setShowForm(false)}
          onSaved={() => load(filters)}
        />
      )}

      {editingSub && (
        <SubscriptionForm
          subscription={editingSub}
          onClose={() => setEditingSub(null)}
          onSaved={() => load(filters)}
        />
      )}

      {detailsSub && (
        <SubscriptionDetails
          subscription={detailsSub}
          onClose={() => setDetailsSub(null)}
          onEdit={() => { setEditingSub(detailsSub); setDetailsSub(null); }}
          onStatusChange={handleStatusChange}
          onDelete={(sub) => { setDetailsSub(null); setConfirmDelete(sub); }}
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

      {confirmCancel && (
        <ConfirmationModal
          title={`Cancel ${confirmCancel.name}?`}
          message="Cancelled subscriptions stay in your book for reference but stop counting towards spending, reminders and the budget."
          confirmLabel="Mark as cancelled"
          busy={busy}
          onConfirm={handleCancelConfirm}
          onClose={() => setConfirmCancel(null)}
        />
      )}
    </div>
  );
}
