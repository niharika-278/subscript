import Icon from "./Icon.jsx";

// Friendly empty state used by pages and panels.

export default function EmptyState({ icon = "inbox", title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-art" aria-hidden="true">
        <span className="empty-icon"><Icon name={icon} size={34} strokeWidth={1.5} /></span>
        <span className="empty-ring" />
      </div>
      <h3 className="empty-title">{title}</h3>
      {message && <p className="empty-message">{message}</p>}
      {action}
    </div>
  );
}
