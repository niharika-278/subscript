import Icon from "./Icon.jsx";

// Dashboard metric card: label, big number, optional footnote.
// accent drives the colour of the underline bar; icon is an SVG name.

export default function StatCard({ label, value, sub, accent = "blue", icon }) {
  return (
    <article className={`stat-card stat-accent-${accent}`}>
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        {icon && <span className="stat-icon"><Icon name={icon} size={19} strokeWidth={1.8} /></span>}
      </div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </article>
  );
}
