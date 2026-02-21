import React, { useState } from "react";
import "./PFFinancePanel.css";

/**
 * FinancePanel - Treasury and financial data
 */
export function FinancePanel({ metrics }) {
  const [period, setPeriod] = useState("24h");

  const treasury = metrics?.treasury || {};
  const transactions = metrics?.transactions || [];

  return (
    <div className="finance-panel">
      {/* Treasury Overview */}
      <section className="treasury-section">
        <h3>💰 Treasury</h3>
        <div className="treasury-cards">
          <TreasuryCard
            title="Panda Coin (PC)"
            value={treasury.pc || "1,234,567"}
            change="+2.3%"
            positive
          />
          <TreasuryCard
            title="PAT Holders"
            value={treasury.pat || "500"}
            change="+5"
            positive
          />
          <TreasuryCard
            title="USD Value"
            value={treasury.usd || "$5,234.89"}
            change="+$123.45"
            positive
          />
          <TreasuryCard
            title="Pending"
            value={treasury.pending || "$0.00"}
            change=""
            neutral
          />
        </div>
      </section>

      {/* Revenue Breakdown */}
      <section className="revenue-section">
        <h3>📊 Revenue Breakdown</h3>
        <div className="period-selector">
          {["24h", "7d", "30d", "All"].map((p) => (
            <button
              key={p}
              className={`period-btn ${period === p ? "active" : ""}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="revenue-bars">
          <RevenueBar label="PC Sales" value={65} amount="$3,400" />
          <RevenueBar label="Store Commission" value={20} amount="$1,050" />
          <RevenueBar label="API Usage" value={10} amount="$524" />
          <RevenueBar label="Premium Subs" value={5} amount="$260" />
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="transactions-section">
        <h3>💳 Recent Transactions</h3>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>User</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No recent transactions
                </td>
              </tr>
            ) : (
              transactions.slice(0, 10).map((tx, i) => (
                <tr key={i}>
                  <td>
                    <span className={`tx-type tx-${tx.type}`}>{tx.type}</span>
                  </td>
                  <td className={tx.amount > 0 ? "positive" : "negative"}>
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount} PC
                  </td>
                  <td>{tx.user}</td>
                  <td>{tx.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Founder Share */}
      <section className="founder-section">
        <h3>👑 Founder Share (5%)</h3>
        <div className="founder-share">
          <div className="share-item">
            <span className="share-label">Total Earned</span>
            <span className="share-value">$1,234.56</span>
          </div>
          <div className="share-item">
            <span className="share-label">This Month</span>
            <span className="share-value">$234.56</span>
          </div>
          <div className="share-item">
            <span className="share-label">Pending Payout</span>
            <span className="share-value">$89.12</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Treasury Card Component
 */
function TreasuryCard({ title, value, change, positive, neutral }) {
  return (
    <div className="treasury-card">
      <span className="treasury-title">{title}</span>
      <span className="treasury-value">{value}</span>
      {change && (
        <span
          className={`treasury-change ${positive ? "positive" : neutral ? "neutral" : "negative"}`}
        >
          {change}
        </span>
      )}
    </div>
  );
}

/**
 * Revenue Bar Component
 */
function RevenueBar({ label, value, amount }) {
  return (
    <div className="revenue-bar">
      <div className="revenue-info">
        <span className="revenue-label">{label}</span>
        <span className="revenue-amount">{amount}</span>
      </div>
      <div className="revenue-track">
        <div className="revenue-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="revenue-percent">{value}%</span>
    </div>
  );
}

export default FinancePanel;
