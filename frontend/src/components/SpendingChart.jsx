import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// Thin wrapper around Chart.js: creates the chart on a canvas when the
// component mounts (or when data/options change) and destroys it on
// unmount, which is the standard Chart.js lifecycle in React.

export default function SpendingChart({ type, data, options = {}, height = 260 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(canvasRef.current, { type, data, options });
    return () => chart.destroy();
  }, [type, data, options]);

  return (
    <div className="chart-box" style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
