import { Link } from "react-router-dom";
import Wordmark from "../components/Wordmark.jsx";
import Icon from "../components/Icon.jsx";

// Marketing landing page. Pure presentation — the "screenshots" are CSS
// and the hero backdrop is the supplied pixel-art meadow, blended into
// charcoal like a premium dark hero.

const FEATURES = [
  {
    icon: "receipt",
    title: "One honest number",
    copy: "Weekly, monthly, quarterly or yearly — every plan is normalised into a monthly equivalent, so your total spend is finally real.",
    accent: "blue",
  },
  {
    icon: "calendar",
    title: "Renewal calendar",
    copy: "A calendar-style month view puts every renewal on its exact date. Due today? It glows. Overdue? It waves a red flag.",
    accent: "violet",
  },
  {
    icon: "bell",
    title: "Reminders that make sense",
    copy: "Choose 1, 3 or 7 days before each renewal. See what's overdue, due today, or on approach — no emails, no noise.",
    accent: "green",
  },
  {
    icon: "target",
    title: "A budget with teeth",
    copy: "Set a monthly ceiling. Subscript shows utilisation live and warns you at 75% — before it becomes 120%.",
    accent: "amber",
  },
  {
    icon: "pie",
    title: "Charts without the fluff",
    copy: "Category doughnut, monthly spending bars and billing-cycle distribution — recomputed from your data on every change.",
    accent: "cyan",
  },
  {
    icon: "lock",
    title: "Private by design",
    copy: "No accounts, no passwords, no tracking. Your subscriptions live in your own local MySQL database. That's it.",
    accent: "pink",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Add your subscriptions",
    copy: "Name, amount, billing cycle, category. Thirty seconds each — Netflix, Spotify, the gym, iCloud, all of it.",
  },
  {
    number: "02",
    title: "See your true monthly cost",
    copy: "Subscript converts every plan into monthly and annual equivalents and totals them up. No spreadsheet required.",
  },
  {
    number: "03",
    title: "Stay ahead of every renewal",
    copy: "The calendar, reminders and budget warnings keep renewal-day surprises at exactly zero.",
  },
];

const MARQUEE_ITEMS = [
  "Streaming", "Music", "Cloud storage", "Fitness", "Gaming", "Education",
  "Productivity", "News", "Design tools", "Groceries", "Rides", "Coffee",
];

export default function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Wordmark size="lg" />
        <nav className="landing-links">
          <a href="#features">Features</a>
          <a href="#preview">Preview</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <Link to="/dashboard" className="btn btn-primary btn-sm">Open dashboard</Link>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-scrim" aria-hidden="true" />

        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" /> Personal subscription manager · built in Java
            </span>
            <h1 className="hero-title">
              Every subscription.<br />
              <span className="hero-highlight">One clear picture<em>.</em></span>
            </h1>
            <p className="hero-sub">
              Subscript tracks every service you pay for, converts it into one honest monthly
              number, warns you before renewals hit, and keeps you inside your budget.
            </p>
            <div className="hero-ctas">
              <Link to="/dashboard" className="btn btn-primary btn-lg">Explore Dashboard →</Link>
              <a href="#how-it-works" className="btn btn-ghost-dark btn-lg">See how it works</a>
            </div>
            <ul className="hero-proof">
              {["No login", "No cloud", "Data stays in your MySQL"].map((item) => (
                <li key={item}><Icon name="check" size={13} strokeWidth={3} /> {item}</li>
              ))}
            </ul>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="mock-window">
              <div className="mock-top">
                <span className="mock-dot dot-blue" /><span className="mock-dot dot-sand" /><span className="mock-dot dot-green" />
                <span className="mock-pill">subscript / dashboard</span>
              </div>
              <div className="mock-stats">
                <div className="mock-stat"><span>Monthly</span><strong>₹5,851</strong></div>
                <div className="mock-stat"><span>Annual</span><strong>₹70,222</strong></div>
                <div className="mock-stat mock-stat-accent"><span>Budget</span><strong>97.5%</strong></div>
              </div>
              <div className="mock-chart">
                {[62, 38, 90, 26, 54, 44, 70].map((height, index) => (
                  <span key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="mock-rows">
                <div className="mock-row"><span className="mock-ava mock-ava-blue"><Icon name="film" size={16} /></span><div><strong>Netflix</strong><em>renews in 2 days</em></div><b>₹649</b></div>
                <div className="mock-row"><span className="mock-ava mock-ava-violet"><Icon name="music" size={16} /></span><div><strong>Spotify</strong><em>renews in 9 days</em></div><b>₹119</b></div>
                <div className="mock-row"><span className="mock-ava mock-ava-cyan"><Icon name="cloud" size={16} /></span><div><strong>Google One</strong><em>4 days overdue</em></div><b>₹130</b></div>
              </div>
            </div>

            <span className="float-chip float-chip-1"><Icon name="film" size={13} strokeWidth={2.2} /> Netflix · ₹649/mo</span>
            <span className="float-chip float-chip-2"><Icon name="music" size={13} strokeWidth={2.2} /> Spotify · ₹119/mo</span>
            <span className="float-chip float-chip-3"><Icon name="flame" size={13} strokeWidth={2.2} /> Overdue: Google One</span>

            <span className="sticker">
              <svg viewBox="0 0 120 120">
                <path d="M60 4l12 14 18-6 4 19 19 4-6 18 14 12-14 12 6 18-19 4-4 19-18-6-12 14-12-14-18 6-4-19-19-4 6-18L4 60l14-12-6-18 19-4 4-19 18 6z" fill="#2F6BFF" stroke="#1E1E1C" strokeWidth="3" />
              </svg>
              <span>zero<br />logins</span>
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- Marquee ---------------- */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
            <span key={index} className="marquee-item">
              {item} <em>₹</em>
            </span>
          ))}
        </div>
      </div>

      {/* ---------------- Features ---------------- */}
      <section id="features" className="landing-section">
        <div className="section-head">
          <span className="section-label">Why Subscript</span>
          <h2 className="section-title">Built for the way subscriptions<br />actually behave</h2>
          <p className="section-sub">Different cycles, surprise renewals, silent price hikes — Subscript was designed around all three.</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map((feature) => (
            <article key={feature.title} className={`feature-card feature-${feature.accent}`}>
              <span className="feature-icon"><Icon name={feature.icon} size={22} strokeWidth={1.8} /></span>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- Preview ---------------- */}
      <section id="preview" className="landing-section landing-section-dark">
        <div className="section-head">
          <span className="section-label">The dashboard</span>
          <h2 className="section-title">A dashboard you'll actually open</h2>
          <p className="section-sub">Stats, budget pulse, reminders and the renewal calendar — one screen, zero digging.</p>
        </div>

        <div className="preview-frame" aria-hidden="true">
          <div className="preview-window">
            <div className="preview-side">
              <Wordmark size="sm" />
              <span className="preview-nav preview-nav-active">Dashboard</span>
              <span className="preview-nav">Subscriptions</span>
              <span className="preview-nav">Calendar</span>
              <span className="preview-nav">Analytics</span>
              <span className="preview-nav">Budget</span>
            </div>
            <div className="preview-main">
              <div className="preview-stats">
                <div><span>Active</span><strong>11</strong></div>
                <div><span>Monthly</span><strong>₹5,851</strong></div>
                <div><span>Yearly</span><strong>₹70,222</strong></div>
                <div><span>Average</span><strong>₹532</strong></div>
              </div>
              <div className="preview-panels">
                <div className="preview-budget">
                  <span className="preview-label">Budget · 97.5%</span>
                  <div className="preview-bar"><i /></div>
                  <em>₹5,851 of ₹6,000</em>
                </div>
                <div className="preview-donut">
                  <span className="preview-label">By category</span>
                  <span className="donut" />
                </div>
                <div className="preview-reminders">
                  <span className="preview-label">Reminders</span>
                  <div className="preview-chip chip-warm"><Icon name="flame" size={11} strokeWidth={2.4} /> Google One · overdue</div>
                  <div className="preview-chip chip-hot"><Icon name="bolt" size={11} strokeWidth={2.4} /> YouTube Premium · today</div>
                  <div className="preview-chip chip-cool"><Icon name="wind" size={11} strokeWidth={2.4} /> Netflix · in 2 days</div>
                </div>
              </div>
              <div className="preview-calendar">
                <span className="preview-label">Renewals this week</span>
                <div className="preview-days">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                    <span key={index} className={`preview-day ${index === 2 ? "preview-day-today" : ""} ${index === 3 || index === 5 ? "preview-dot" : ""}`}>
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <span className="preview-note note-1">live stats</span>
          <span className="preview-note note-2">budget pulse</span>
          <span className="preview-note note-3">reminder states</span>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how-it-works" className="landing-section">
        <div className="section-head">
          <span className="section-label">How it works</span>
          <h2 className="section-title">Three steps to clarity</h2>
        </div>
        <div className="steps-grid">
          {STEPS.map((step) => (
            <article key={step.number} className="step-card">
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
        <div className="steps-cta">
          <Link to="/dashboard" className="btn btn-dark btn-lg">Start exploring — it's already running →</Link>
        </div>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <section className="final-cta">
        <div className="final-inner">
          <h2>Ready for one clear picture?</h2>
          <p>Your subscriptions are already costing you money. Knowing exactly how much is free.</p>
          <Link to="/dashboard" className="btn btn-ink btn-lg">Explore Dashboard →</Link>
        </div>
      </section>

      <footer className="landing-footer">
        <Wordmark size="sm" />
        <p>Every subscription. One clear picture.</p>
        <span className="footer-copy">
          © 2026 Subscript. Crafted by Niharika Aaswani.
          <a
            className="footer-github"
            href="https://github.com/niharika-278/subscript"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Subscript on GitHub"
            title="View the source on GitHub"
          >
            <Icon name="github" size={16} />
          </a>
        </span>
      </footer>
    </div>
  );
}
