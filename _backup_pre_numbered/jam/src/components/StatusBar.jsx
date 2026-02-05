import React, { useState, useEffect } from 'react';
import './StatusBar.css';

/**
 * StatusBar - Shows health status of all Panda services
 * Each indicator has hover tooltip with details
 */
export function StatusBar() {
  const [health, setHealth] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Poll health every 5 seconds
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        // TODO: Replace with actual Rust IPC/HTTP endpoint
        // For now, simulate health response
        const mockHealth = {
          version: '0.2.0',
          uptime_secs: Math.floor((Date.now() - window._pandaStartTime) / 1000) || 0,
          status: 'healthy',
          services: {
            rust: { status: 'ready', message: 'Agent running' },
            mcp: { status: 'ready', details: { tools: '5' } },
            firebase: { status: 'connected', latency_ms: 45 },
            gas: { status: 'connected', latency_ms: 120 },
            gpu: { status: 'unavailable', message: 'No NVIDIA GPU' },
          },
        };
        setHealth(mockHealth);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Health check failed:', err);
      }
    };

    // Initial fetch
    window._pandaStartTime = window._pandaStartTime || Date.now();
    fetchHealth();

    // Poll interval
    const interval = setInterval(fetchHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!health) {
    return (
      <div className="status-bar">
        <StatusIndicator name="Rust" status="loading" />
      </div>
    );
  }

  return (
    <div className="status-bar">
      <StatusIndicator
        name="Rust"
        status={health.services.rust?.status}
        tooltip={{
          title: `🦀 Rust Agent v${health.version}`,
          items: [
            `Status: ${health.status}`,
            `Uptime: ${formatUptime(health.uptime_secs)}`,
          ],
        }}
      />

      <StatusIndicator
        name="Firebase"
        status={health.services.firebase?.status}
        tooltip={{
          title: '🔥 Firebase',
          items: [
            `Status: ${health.services.firebase?.status}`,
            health.services.firebase?.latency_ms
              ? `Latency: ${health.services.firebase.latency_ms}ms`
              : null,
          ].filter(Boolean),
        }}
      />

      <StatusIndicator
        name="GAS"
        status={health.services.gas?.status}
        tooltip={{
          title: '📜 Google Apps Script',
          items: [
            `Status: ${health.services.gas?.status}`,
            health.services.gas?.latency_ms
              ? `Latency: ${health.services.gas.latency_ms}ms`
              : null,
          ].filter(Boolean),
        }}
      />

      <StatusIndicator
        name="GPU"
        status={health.services.gpu?.status}
        tooltip={{
          title: '🎮 GPU',
          items: [
            `Status: ${health.services.gpu?.status}`,
            health.services.gpu?.details?.name || health.services.gpu?.message,
            health.services.gpu?.details?.memory_gb
              ? `Memory: ${health.services.gpu.details.memory_gb}GB`
              : null,
          ].filter(Boolean),
        }}
      />

      <StatusIndicator
        name="MCP"
        status={health.services.mcp?.status}
        tooltip={{
          title: '🧠 MCP Server',
          items: [
            `Status: ${health.services.mcp?.status}`,
            health.services.mcp?.details?.tools
              ? `Tools: ${health.services.mcp.details.tools}`
              : null,
          ].filter(Boolean),
        }}
      />

      {lastUpdate && (
        <span className="status-bar-time">
          {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

/**
 * Individual status indicator with tooltip
 */
function StatusIndicator({ name, status, tooltip }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const statusColor = {
    ready: 'green',
    connected: 'green',
    available: 'green',
    degraded: 'yellow',
    unavailable: 'red',
    error: 'red',
    loading: 'gray',
    notinitialized: 'gray',
  };

  const color = statusColor[status?.toLowerCase()] || 'gray';

  return (
    <div
      className="status-indicator"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className={`status-dot status-${color}`} />
      <span className="status-label">{name}</span>

      {showTooltip && tooltip && (
        <div className="status-tooltip">
          <div className="tooltip-title">{tooltip.title}</div>
          <div className="tooltip-divider" />
          {tooltip.items.map((item, i) => (
            <div key={i} className="tooltip-item">
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Format uptime in human readable format
 */
function formatUptime(seconds) {
  if (!seconds) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export default StatusBar;
