// The Subscript brand mark: "Subscript" with the coral full stop.
export default function Wordmark({ size = "md" }) {
  return (
    <span className={`wordmark wordmark-${size}`}>
      Subscript<span className="wordmark-dot">.</span>
    </span>
  );
}
