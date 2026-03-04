/**
 * 🧠 PFOrchestrator v1.0 — Central Module Orchestrator
 *
 * Visual dashboard showing active modules, available MCP tools,
 * registry status, and AI context integration.
 *
 * Architecture:
 *   - Reads active modules from Dock state
 *   - Uses useMCPRegistry for manifest loading
 *   - Displays tool registry as live dashboard
 *   - Provides quick-access to AI with loaded context
 *
 * @version 1.0.0
 * @see PF_UI_REFERENCE.md §17
 * @see PF_MCP_REFERENCE.md §B-C
 */

import React, { useState, useEffect, useMemo } from "react";
import useMCPRegistry from "../hooks/useMCPRegistry";
import "./PFOrchestrator.css";

export default function PFOrchestrator({ activeModuleIds = [], onClose }) {
  const {
    registry,
    tools,
    toolCount,
    activeModules,
    loadModule,
    unloadModule,
    syncWithDock,
    getToolsForAI,
  } = useMCPRegistry();

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedModule, setExpandedModule] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  // ── Sync with Dock when active modules change ──
  useEffect(() => {
    if (activeModuleIds.length > 0) {
      syncWithDock(activeModuleIds).then(() => {
        setLastSync(new Date());
      });
    }
  }, [activeModuleIds, syncWithDock]);

  // ── Group tools by module ──
  const toolsByModule = useMemo(() => {
    const groups = {};
    for (const tool of tools) {
      if (!groups[tool.moduleId]) {
        groups[tool.moduleId] = {
          name: tool.moduleName,
          icon: tool.moduleIcon,
          tools: [],
        };
      }
      groups[tool.moduleId].tools.push(tool);
    }
    return groups;
  }, [tools]);

  // ── Filter tools by search ──
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    const q = searchQuery.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.moduleName.toLowerCase().includes(q),
    );
  }, [tools, searchQuery]);

  // ── Time formatter ──
  const formatAgo = (date) => {
    if (!date) return "nunca";
    const secs = Math.floor((Date.now() - date.getTime()) / 1000);
    if (secs < 60) return `${secs}s atrás`;
    if (secs < 3600) return `${Math.floor(secs / 60)}min atrás`;
    return `${Math.floor(secs / 3600)}h atrás`;
  };

  return (
    <div className="pf-orchestrator-overlay" onClick={onClose}>
      <div className="pf-orchestrator" onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className="pf-orch-header">
          <div className="pf-orch-title">
            <span className="pf-orch-icon">🧠</span>
            <span>Panda Orchestrator</span>
          </div>
          <div className="pf-orch-header-actions">
            <button
              className="pf-orch-btn-close"
              onClick={onClose}
              title="Fechar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Status Bar ── */}
        <div className="pf-orch-status">
          <div className="pf-orch-stat">
            <span className="pf-orch-stat-value">{activeModules.length}</span>
            <span className="pf-orch-stat-label">Módulos</span>
          </div>
          <div className="pf-orch-stat">
            <span className="pf-orch-stat-value">{toolCount}</span>
            <span className="pf-orch-stat-label">Tools</span>
          </div>
          <div className="pf-orch-stat">
            <span
              className={`pf-orch-stat-dot ${activeModules.length > 0 ? "online" : "offline"}`}
            />
            <span className="pf-orch-stat-label">
              {activeModules.length > 0 ? "Online" : "Offline"}
            </span>
          </div>
          <div className="pf-orch-stat">
            <span className="pf-orch-stat-label">
              Sync: {formatAgo(lastSync)}
            </span>
          </div>
        </div>

        {/* ── Active Modules Grid ── */}
        <div className="pf-orch-section">
          <h3 className="pf-orch-section-title">📊 Módulos Ativos</h3>
          <div className="pf-orch-grid">
            {Object.entries(toolsByModule).map(([id, mod]) => (
              <div
                key={id}
                className={`pf-orch-module-card ${expandedModule === id ? "expanded" : ""}`}
                onClick={() =>
                  setExpandedModule(expandedModule === id ? null : id)
                }
              >
                <div className="pf-orch-module-icon">{mod.icon}</div>
                <div className="pf-orch-module-name">{mod.name}</div>
                <div className="pf-orch-module-tools">
                  {mod.tools.length} tools
                </div>
                <div className="pf-orch-module-status">🟢</div>
              </div>
            ))}

            {activeModules.length === 0 && (
              <div className="pf-orch-empty">
                <div className="pf-orch-empty-icon">🐼</div>
                <div>Nenhum módulo ativo no Dock</div>
                <div className="pf-orch-empty-hint">
                  Instale módulos pela Store para ativar tools MCP
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Tools Registry ── */}
        <div className="pf-orch-section">
          <div className="pf-orch-section-header">
            <h3 className="pf-orch-section-title">
              🔧 Tools Disponíveis ({filteredTools.length})
            </h3>
            <div className="pf-orch-search">
              <input
                type="text"
                placeholder="Buscar tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pf-orch-search-input"
              />
            </div>
          </div>

          <div className="pf-orch-tools-list">
            {filteredTools.map((tool) => (
              <div key={tool.name} className="pf-orch-tool-item">
                <span className="pf-orch-tool-icon">{tool.moduleIcon}</span>
                <div className="pf-orch-tool-info">
                  <code className="pf-orch-tool-name">{tool.name}</code>
                  <span className="pf-orch-tool-desc">{tool.description}</span>
                </div>
                {tool.parameters && Object.keys(tool.parameters).length > 0 && (
                  <span className="pf-orch-tool-params">
                    {Object.keys(tool.parameters).length} params
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── AI Context Preview ── */}
        <div className="pf-orch-section">
          <h3 className="pf-orch-section-title">
            💬 Contexto IA ({toolCount} tools loaded)
          </h3>
          <pre className="pf-orch-context-preview">{getToolsForAI()}</pre>
        </div>
      </div>
    </div>
  );
}
