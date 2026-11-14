import { NavLink, useNavigate } from "react-router-dom";
import Wordmark from "./Wordmark.jsx";
import Icon from "./Icon.jsx";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "grid" },
  { to: "/subscriptions", label: "Subscriptions", icon: "rows" },
  { to: "/calendar", label: "Renewal Calendar", icon: "calendar" },
  { to: "/analytics", label: "Analytics", icon: "chart" },
  { to: "/budget", label: "Budget", icon: "wallet" },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-head">
        <button type="button" className="wordmark-btn" onClick={() => { navigate("/"); onClose?.(); }} title="Back to landing page">
          <Wordmark size="md" />
        </button>
        <p className="sidebar-tagline">Every subscription. One clear picture.</p>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => onClose?.()}
            className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}
          >
            <Icon name={item.icon} size={19} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <button type="button" className="btn btn-primary btn-block" onClick={() => { navigate("/subscriptions?add=1"); onClose?.(); }}>
          + Add subscription
        </button>
      </div>
    </aside>
  );
}
