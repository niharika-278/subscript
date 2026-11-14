import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";
import { formatINR, percent } from "../utils/format.js";
import { CATEGORIES, FREQUENCIES } from "../constants.js";
import SpendingChart from "../components/SpendingChart.jsx";
import StatCard from "../components/StatCard.jsx";
import Icon from "../components/Icon.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Loader from "../components/Loader.jsx";
import { useToast } from "../context/ToastContext.jsx";

// Chart.js house style shared by all three charts: charcoal tooltips,
// ink labels, no chart borders.
const CHART_DEFAULTS = {
  plugins: {
    legend: {
      labels: {
        color: "#45423C",
        font: { family: "Inter, sans-serif", size: 12, weight: 600 },
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 8,
        boxHeight: 8,
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: "#1E1E1C",
      titleColor: "#F8F4EA",
      bodyColor: "#D8CBB3",
      titleFont: { family: "Inter, sans-serif", size: 13, weight: 700 },
      bodyFont: { family: "Inter, sans-serif", size: 12 },
      padding: 12,
      cornerRadius: 10,
      displayColors: false,
    },
  },
};

const FREQUENCY_COLORS = { WEEKLY: "#7FA32E", MONTHLY: "#2F6BFF", QUARTERLY: "#D97706", YEARLY: "#8B5CF6" };

// Analytics page: the three required charts plus a category table.
// Everything is derived from GET /api/dashboard.

export default function Analytics() {
  const toast = useToast();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.getDashboard()
      .then(setDashboard)
      .catch((error) => toast.error(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doughnutData = useMemo(() => {
    if (!dashboard) return null;
    const shares = dashboard.categoryBreakdown || [];
    return {
      labels: shares.map((share) => CATEGORIES[share.category]?.label || share.category),
      datasets: [{
        data: shares.map((share) => Number(share.monthlyAmount)),
        backgroundColor: shares.map((share) => CATEGORIES[share.category]?.color || "#8A8378"),
        borderColor: "#EFF1F5",
        borderWidth: 3,
        hoverOffset: 10,
        borderRadius: 6,
      }],
    };
  }, [dashboard]);

  const barData = useMemo(() => {
    if (!dashboard) return null;
    const shares = dashboard.categoryBreakdown || [];
    return {
      labels: shares.map((share) => CATEGORIES[share.category]?.label || share.category),
      datasets: [{
        label: "Monthly recurring spend",
        data: shares.map((share) => Number(share.monthlyAmount)),
        backgroundColor: shares.map((share) => CATEGORIES[share.category]?.color || "#8A8378"),
        borderRadius: 8,
        maxBarThickness: 44,
      }],
    };
  }, [dashboard]);

  const distributionData = useMemo(() => {
    if (!dashboard) return null;
    const shares = dashboard.frequencyBreakdown || [];
    return {
      labels: shares.map((share) => FREQUENCIES[share.frequency]?.label || share.frequency),
      datasets: [{
        label: "Active subscriptions",
        data: shares.map((share) => share.count),
        backgroundColor: shares.map((share) => FREQUENCY_COLORS[share.frequency] || "#8A8378"),
        borderRadius: 8,
        maxBarThickness: 30,
      }],
    };
  }, [dashboard]);

  if (!dashboard) return <Loader label="Building your charts…" />;

  const totalMonthly = Number(dashboard.monthlySpend) || 0;

  if (dashboard.totalActiveSubscriptions === 0) {
    return (
      <div className="page">
        <div className="page-head">
          <div>
            <h2 className="page-title">Analytics</h2>
            <p className="page-sub">Where your recurring money actually goes.</p>
          </div>
        </div>
        <div className="card">
          <EmptyState
            icon="chart"
            title="Nothing to analyse yet"
            message="Charts appear as soon as you have at least one active subscription. Paused and cancelled services are excluded."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Analytics</h2>
          <p className="page-sub">Computed live from your active subscriptions — nothing pre-stored.</p>
        </div>
      </div>

      <div className="stat-grid stat-grid-4">
        <StatCard label="Active subscriptions" value={dashboard.totalActiveSubscriptions} accent="green" icon="rows" />
        <StatCard label="Monthly spend" value={formatINR(totalMonthly)} accent="blue" icon="calendar" />
        <StatCard label="Annual projection" value={formatINR(dashboard.annualSpend)} accent="violet" icon="trending-up" />
        <StatCard label="Average subscription" value={formatINR(dashboard.averageMonthlyCost)} accent="amber" icon="gauge" />
      </div>

      <div className="chart-grid">
        <section className="card chart-card">
          <div className="card-head">
            <h3>Spending by category</h3>
            <span className="card-sub">monthly equivalents</span>
          </div>
          <SpendingChart
            type="doughnut"
            data={doughnutData}
            height={300}
            options={{
              ...CHART_DEFAULTS,
              cutout: "66%",
              plugins: {
                ...CHART_DEFAULTS.plugins,
                tooltip: {
                  ...CHART_DEFAULTS.plugins.tooltip,
                  callbacks: {
                    label: (ctx) => {
                      const value = ctx.parsed || 0;
                      const share = totalMonthly > 0 ? ` (${((value / totalMonthly) * 100).toFixed(1)}%)` : "";
                      return `${formatINR(value)} per month${share}`;
                    },
                  },
                },
              },
            }}
          />
        </section>

        <section className="card chart-card">
          <div className="card-head">
            <h3>Current monthly spending</h3>
            <span className="card-sub">recurring projection</span>
          </div>
          <p className="chart-note">
            Subscript does not invent payment history — this shows how your <strong>current</strong> recurring
            commitments are split each month.
          </p>
          <SpendingChart
            type="bar"
            data={barData}
            height={280}
            options={{
              ...CHART_DEFAULTS,
              plugins: {
                ...CHART_DEFAULTS.plugins,
                legend: { display: false },
                tooltip: {
                  ...CHART_DEFAULTS.plugins.tooltip,
                  callbacks: { label: (ctx) => `${formatINR(ctx.parsed.y)} per month` },
                },
              },
              scales: {
                x: { ticks: { color: "#45423C", font: { family: "Inter, sans-serif", size: 11 } }, grid: { display: false } },
                y: {
                  ticks: {
                    color: "#857E6E",
                    font: { family: "Space Grotesk, sans-serif", size: 11 },
                    callback: (value) => `₹${Number(value).toLocaleString("en-IN")}`,
                  },
                  grid: { color: "rgba(30,30,28,0.07)" },
                  border: { display: false },
                },
              },
            }}
          />
        </section>

        <section className="card chart-card">
          <div className="card-head">
            <h3>Subscription distribution</h3>
            <span className="card-sub">by billing cycle</span>
          </div>
          <SpendingChart
            type="bar"
            data={distributionData}
            height={260}
            options={{
              ...CHART_DEFAULTS,
              indexAxis: "y",
              plugins: {
                ...CHART_DEFAULTS.plugins,
                legend: { display: false },
                tooltip: {
                  ...CHART_DEFAULTS.plugins.tooltip,
                  callbacks: {
                    label: (ctx) => {
                      const share = dashboard.frequencyBreakdown[ctx.dataIndex];
                      return `${share.count} subscription${share.count === 1 ? "" : "s"} · ${formatINR(share.monthlyAmount)}/mo`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  ticks: { color: "#857E6E", precision: 0, font: { family: "Space Grotesk, sans-serif", size: 11 } },
                  grid: { color: "rgba(30,30,28,0.07)" },
                  border: { display: false },
                },
                y: { ticks: { color: "#45423C", font: { family: "Inter, sans-serif", size: 12, weight: 600 } }, grid: { display: false } },
              },
            }}
          />
        </section>

        <section className="card table-card">
          <div className="card-head">
            <h3>Category ledger</h3>
            <span className="card-sub">{dashboard.categoryBreakdown.length} categories in use</span>
          </div>
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Category</th>
                <th className="num">Subs</th>
                <th className="num">Per month</th>
                <th className="num">Share</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.categoryBreakdown.map((share) => {
                const category = CATEGORIES[share.category] || CATEGORIES.OTHER;
                return (
                  <tr key={share.category}>
                    <td>
                      <span className="ledger-cat">
                        <span className="ledger-dot" style={{ background: category.color }} />
                        <span className="ledger-cat-icon" style={{ color: category.color }}><Icon name={category.icon} size={15} /></span>
                        {category.label}
                      </span>
                    </td>
                    <td className="num">{share.count}</td>
                    <td className="num">{formatINR(share.monthlyAmount)}</td>
                    <td className="num">{percent(share.percentage, 1)}</td>
                  </tr>
                );
              })}
              <tr className="ledger-total">
                <td>Total</td>
                <td className="num">{dashboard.totalActiveSubscriptions}</td>
                <td className="num">{formatINR(totalMonthly)}</td>
                <td className="num">100%</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
