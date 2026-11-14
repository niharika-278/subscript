// Simple loading indicator shown while a page fetches its data.

export default function Loader({ label = "Loading…" }) {
  return (
    <div className="loader" role="status">
      <span className="loader-spinner" />
      <span>{label}</span>
    </div>
  );
}
