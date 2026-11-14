import { useNavigate } from "react-router-dom";
import { BUDGET_STATES, CATEGORIES } from "../constants.js";
import { formatINR, percent } from "../utils/format.js";

// Budget progress card with threshold marker at 75%.
// `compact` renders the dashboard-sized version without the category bars.

export default function BudgetProgress({ budget, compact = false }) {
  const navigate = useNavigate();
  const state = budget?.state || "NO_BUDGET";

  if (state === "NO_BUDGET") {
    return (
      <div className="budget-progress budget-empty">
        <div className="budget-empty-copy">
          <h3>No monthly budget yet</h3>
          <p>Set a limit and Subscript will warn you before you cross it.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => navigate("/budget")}>
          Set a budget
        </button>
      </div>
    );
  }

  const utilization = Number(budget.utilizationPercent) || 0;
  const width = Math.min(utilization, 100);
  const over = utilization > 100;
  const stateMeta = BUDGET_STATES[state] || { label: state };

  return (
    <div className={`budget-progress budget-state-${String(state).toLowerCase()}`}>
      <div className="budget-top">
        <div>
          <span className="stat-label">Monthly budget</span>
          <div className="budget-limit">{formatINR(budget.monthlyLimit)}</div>
        </div>
        <span className={`budget-state-chip state-${String(state).toLowerCase()}`}>{stateMeta.label}</span>
      </div>

      <div className="budget-bar" role="progressbar" aria-valuenow={utilization} aria-valuemin={0} aria-valuemax={100}>
        <div className="budget-fill" style={{ width: `${width}%` }} />
        <span className="budget-marker" style={{ left: "75%" }} title="75% — approaching limit" />
      </div>

      <div className="budget-figures">
        <div><span>Spent</span><strong>{formatINR(budget.monthlySpend)}</strong></div>
        <div className="budget-util"><span>Utilisation</span><strong>{percent(utilization, utilization % 1 ? 1 : 0)}</strong></div>
        <div className={`budget-remaining ${over ? "is-over" : ""}`}>
          <span>{over ? "Over by" : "Remaining"}</span>
          <strong>{formatINR(Math.abs(Number(budget.remaining)))}</strong>
        </div>
      </div>

      {!compact && budget.categoryBreakdown?.length > 0 && (
        <div className="budget-breakdown">
          <span className="panel-label">Where the money goes</span>
          {budget.categoryBreakdown.map((share) => {
            const category = CATEGORIES[share.category] || CATEGORIES.OTHER;
            const shareWidth = Math.min(Number(share.percentage) || 0, 100);
            return (
              <div key={share.category} className="breakdown-row">
                <span className="breakdown-name">{category.icon} {category.label}</span>
                <div className="breakdown-bar">
                  <div className="breakdown-fill" style={{ width: `${shareWidth}%`, background: category.color }} />
                </div>
                <span className="breakdown-amount">{formatINR(share.monthlyAmount)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
