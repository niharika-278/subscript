import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { formatINR, formatDate, relativeDue } from "../utils/format.js";
import { CATEGORIES } from "../constants.js";
import Icon from "./Icon.jsx";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/subscriptions": "Subscriptions",
  "/calendar": "Renewal Calendar",
  "/analytics": "Analytics",
  "/budget": "Budget",
};

// In-app topbar: page title on the left, reminder bell + quick add on the right.
// The bell loads reminders from GET /api/dashboard (re-derived on navigation).
export default function Navbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    api.getDashboard()
      .then((data) => { if (!cancelled) setReminders(data.reminders || []); })
      .catch(() => { /* bell stays quiet; pages surface backend errors */ });
    return () => { cancelled = true; };
  }, [location.pathname]);

  // Close the dropdown when clicking anywhere else
  useEffect(() => {
    function onDocClick(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) setPanelOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="icon-btn menu-btn" onClick={onMenuClick} aria-label="Toggle navigation">
          <Icon name="menu" size={20} strokeWidth={2} />
        </button>
        <h1 className="topbar-title">{PAGE_TITLES[location.pathname] || "Subscript"}</h1>
      </div>

      <div className="topbar-right">
        <div className="bell-wrap" ref={bellRef}>
          <button
            type="button"
            className={`icon-btn bell-btn ${reminders.length ? "bell-active" : ""}`}
            onClick={() => setPanelOpen((v) => !v)}
            aria-label="Reminders"
          >
            <Icon name="bell" size={20} />
            {reminders.length > 0 && <span className="bell-badge">{reminders.length}</span>}
          </button>

          {panelOpen && (
            <div className="bell-panel">
              <div className="bell-panel-head">
                <span className="panel-label">Reminders</span>
                <span className="panel-count">{reminders.length}</span>
              </div>
              {reminders.length === 0 ? (
                <p className="bell-empty">You're all caught up — no reminders due.</p>
              ) : (
                <ul className="bell-list">
                  {reminders.map((reminder) => (
                    <li key={reminder.id} className="bell-item">
                      <span className="bell-item-icon" style={{ background: `${CATEGORIES[reminder.category]?.color}1A`, color: CATEGORIES[reminder.category]?.color }}>
                        <Icon name={CATEGORIES[reminder.category]?.icon || "box"} size={16} />
                      </span>
                      <div className="bell-item-body">
                        <strong>{reminder.name}</strong>
                        <span>{formatDate(reminder.nextRenewalDate)} · {formatINR(reminder.amount)}</span>
                      </div>
                      <span className={`reminder-chip chip-${String(reminder.state).toLowerCase()}`}>
                        {reminder.state === "DUE_TODAY"
                          ? "Today"
                          : reminder.state === "OVERDUE"
                            ? "Overdue"
                            : relativeDue(reminder.nextRenewalDate)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <button type="button" className="bell-panel-link" onClick={() => { setPanelOpen(false); navigate("/calendar"); }}>
                Open renewal calendar →
              </button>
            </div>
          )}
        </div>

        <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate("/subscriptions?add=1")}>
          + New
        </button>
      </div>
    </header>
  );
}
