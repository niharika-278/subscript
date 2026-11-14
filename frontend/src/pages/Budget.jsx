import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { formatINR } from "../utils/format.js";
import BudgetProgress from "../components/BudgetProgress.jsx";
import StatCard from "../components/StatCard.jsx";
import Loader from "../components/Loader.jsx";
import { useToast } from "../context/ToastContext.jsx";

// Budget module: set/edit the monthly limit, see utilisation and the
// category split. The limit lives in the single "budget" row in MySQL.

export default function Budget() {
  const toast = useToast();
  const [budget, setBudget] = useState(null);
  const [limitInput, setLimitInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const data = await api.getBudget();
      setBudget(data);
      setLimitInput(data.monthlyLimit > 0 ? String(Number(data.monthlyLimit)) : "");
    } catch (error) {
      toast.error(error.message);
      setBudget(null);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(event) {
    event.preventDefault();
    const value = Number(limitInput);
    if (limitInput === "" || Number.isNaN(value) || value <= 0) {
      toast.error("Enter a monthly budget greater than ₹0");
      return;
    }
    setBusy(true);
    try {
      const updated = await api.updateBudget(value);
      setBudget(updated);
      setLimitInput(String(Number(updated.monthlyLimit)));
      toast.success(`Monthly budget set to ${formatINR(updated.monthlyLimit)}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  if (!budget) return <Loader label="Loading budget…" />;

  const over = budget.state === "OVER_BUDGET";

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Budget</h2>
          <p className="page-sub">One number to rule your recurring spend — Subscript keeps the score.</p>
        </div>
      </div>

      <div className="stat-grid stat-grid-3">
        <StatCard label="Monthly budget" value={budget.monthlyLimit > 0 ? formatINR(budget.monthlyLimit) : "Not set"} sub="Your self-imposed ceiling" accent="green" icon="target" />
        <StatCard label="Current monthly spend" value={formatINR(budget.monthlySpend)} sub="Active subscriptions only" accent="blue" icon="calendar" />
        <StatCard
          label={over ? "Over budget by" : "Remaining this month"}
          value={formatINR(Math.abs(Number(budget.remaining)))}
          sub={budget.monthlyLimit > 0 ? `${budget.utilizationPercent}% utilised` : "Set a limit to see utilisation"}
          accent={over ? "red" : "amber"} icon={over ? "alert" : "coins"}
        />
      </div>

      <div className="budget-layout">
        <section className="card">
          <div className="card-head">
            <h3>Budget status</h3>
            <span className="card-sub">thresholds: under 75% comfortable · 75–100% approaching · over 100% over budget</span>
          </div>
          <BudgetProgress budget={budget} />
        </section>

        <section className="card">
          <div className="card-head">
            <h3>{budget.monthlyLimit > 0 ? "Adjust budget" : "Set your monthly budget"}</h3>
          </div>
          <form className="form" onSubmit={handleSave}>
            <div className="form-field">
              <label htmlFor="budget-limit">Monthly limit (₹)</label>
              <input
                id="budget-limit"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                placeholder="e.g. 5000"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
              />
              <span className="field-hint">
                Compare this against your current monthly spend of {formatINR(budget.monthlySpend)}.
              </span>
            </div>
            <div className="quick-amounts">
              {[2000, 5000, 10000, 25000].map((amount) => (
                <button key={amount} type="button" className="btn btn-ghost btn-xs" onClick={() => setLimitInput(String(amount))}>
                  ₹{amount.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
            <div className="modal-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? "Saving…" : budget.monthlyLimit > 0 ? "Update budget" : "Save budget"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
