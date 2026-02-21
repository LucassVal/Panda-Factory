/**
 * 🗺️ PF System Map — SDK Runtime Introspection
 * Reads window.Panda at runtime to display a full namespace map.
 *
 * Architecture boundary:
 *   🟩 CORE — Founder-guaranteed (SDK → GAS → Firebase → Rust → Security)
 *   🟦 EXTENSION POINT — SDK surface for 3rd-party modules/tentacles
 *   🟪 LOADED — Dynamically loaded tentacles (partner-audited)
 *
 * The founder monitors the SDK gates that allow extensions to run.
 * Third-party tentacles are the partner's responsibility to audit.
 */
import React, { useState, useEffect, useCallback } from "react";
import "./PFSystemMap.css";

/* ── Responsibility domains ── */
const DOMAIN_CORE = "CORE";
const DOMAIN_EXTENSION = "EXTENSION";

/* ── Namespace metadata ── */
const NS_META = {
  // ─── CORE: Founder-guaranteed integration stack ───
  Auth: { icon: "🔐", desc: "Firebase Auth bridge", domain: DOMAIN_CORE },
  Wallet: {
    icon: "💰",
    desc: "RTDB Ledger (server-side)",
    domain: DOMAIN_CORE,
  },
  Bridge: { icon: "🌉", desc: "Rust Agent / MCP", domain: DOMAIN_CORE },
  Loader: { icon: "🚀", desc: "Boot orchestrator", domain: DOMAIN_CORE },
  Governance: {
    icon: "⚖️",
    desc: "Panda Council validator",
    domain: DOMAIN_CORE,
  },
  UI: { icon: "🖼️", desc: "Toast / Modal / Menu", domain: DOMAIN_CORE },

  // ─── EXTENSION POINTS: SDK surface for tentacles/modules ───
  Brain: { icon: "🧠", desc: "Gemini AI wrapper", domain: DOMAIN_EXTENSION },
  Canvas: { icon: "🎨", desc: "TLDraw wrapper", domain: DOMAIN_EXTENSION },
  Dock: { icon: "🧩", desc: "FlexLayout panels", domain: DOMAIN_EXTENSION },
  Collab: { icon: "🤝", desc: "Yjs CRDT", domain: DOMAIN_EXTENSION },
  Data: { icon: "📊", desc: "Zustand / React Query", domain: DOMAIN_EXTENSION },
  Validate: {
    icon: "✅",
    desc: "Zod-like validator",
    domain: DOMAIN_EXTENSION,
  },
  Store: { icon: "🏪", desc: "Medusa Marketplace", domain: DOMAIN_EXTENSION },
  PAT: { icon: "🎯", desc: "Autonomic Toolkit", domain: DOMAIN_EXTENSION },
  Polyglot: { icon: "🌍", desc: "NLLB / Whisper", domain: DOMAIN_EXTENSION },
  Storage: { icon: "💾", desc: "File Upload/DL", domain: DOMAIN_EXTENSION },
  Google: {
    icon: "🔷",
    desc: "Drive / Sheets / Colab",
    domain: DOMAIN_EXTENSION,
    subNamespaces: ["Drive", "Sheets", "Colab"],
  },
};

/* Render order */
const NS_ORDER_CORE = [
  "Auth",
  "Wallet",
  "Bridge",
  "Loader",
  "Governance",
  "UI",
];
const NS_ORDER_EXT = [
  "Brain",
  "Canvas",
  "Dock",
  "Collab",
  "Data",
  "Validate",
  "Store",
  "PAT",
  "Polyglot",
  "Storage",
  "Google",
];

/* ── Live tests per namespace ── */
async function runNamespaceTest(ns, pandaRef) {
  const results = [];
  const p = pandaRef;
  if (!p) return [{ label: "Panda not found", pass: false }];

  const obj = p[ns];
  if (!obj) return [{ label: `Panda.${ns} missing`, pass: false }];

  switch (ns) {
    case "Auth": {
      results.push({
        label: "isLoggedIn()",
        pass: typeof obj.isLoggedIn === "function",
        detail: obj.isLoggedIn?.() ? "✅ Logged in" : "⬜ Not logged in",
      });
      const user = obj.getUser?.();
      results.push({
        label: "getUser()",
        pass: typeof obj.getUser === "function",
        detail: user ? user.email || user.displayName || "User exists" : "null",
      });
      results.push({
        label: "getRoleLevel()",
        pass: typeof obj.getRoleLevel === "function",
        detail: `Level ${obj.getRoleLevel?.() ?? "?"}`,
      });
      results.push({
        label: "getToken()",
        pass: typeof obj.getToken === "function",
        detail: "Function available",
      });
      results.push({
        label: "_reactAuthRef",
        pass: !!obj._reactAuthRef,
        detail: obj._reactAuthRef ? "Bound" : "Not bound",
      });
      break;
    }
    case "Wallet": {
      results.push({
        label: "_mock flag",
        pass: obj._mock === false,
        detail: obj._mock ? "Mock" : "Wired",
      });
      results.push({
        label: "_firebaseDB",
        pass: !!obj._firebaseDB,
        detail: obj._firebaseDB ? "Bound" : "Not bound",
      });
      try {
        const bal = await obj.getBalance?.();
        results.push({
          label: "getBalance()",
          pass: bal?.success !== false,
          detail: `${bal?.balance ?? "?"} PC`,
        });
      } catch (e) {
        results.push({ label: "getBalance()", pass: false, detail: e.message });
      }
      break;
    }
    case "Bridge": {
      results.push({
        label: "isConnected()",
        pass: typeof obj.isConnected === "function",
        detail: obj.isConnected?.() ? "Connected" : "Disconnected",
      });
      results.push({
        label: "loadModule()",
        pass: typeof obj.loadModule === "function",
        detail: "Gate available",
      });
      results.push({
        label: "execute()",
        pass: typeof obj.execute === "function",
        detail: "Gate available",
      });
      break;
    }
    case "Loader": {
      const status = obj.getStatus?.();
      const loaded = obj.getLoaded?.() || [];
      results.push({
        label: "getStatus()",
        pass: status === "ready",
        detail: status || "unknown",
      });
      results.push({
        label: "getLoaded()",
        pass: loaded.length > 0,
        detail: `${loaded.length} boot steps`,
      });
      results.push({
        label: "_status",
        pass: true,
        detail: obj._status || "?",
      });
      break;
    }
    case "Governance": {
      results.push({
        label: "validate()",
        pass: typeof obj.validate === "function",
        detail: "Gate available",
      });
      results.push({
        label: "_mock",
        pass: true,
        detail: obj._mock ? "Mock (no council)" : "Wired",
      });
      break;
    }
    case "UI": {
      results.push({
        label: "toast()",
        pass: typeof obj.toast === "function",
        detail: "Gate available",
      });
      results.push({
        label: "modal()",
        pass: typeof obj.modal === "function",
        detail: "Gate available",
      });
      results.push({
        label: "_menus",
        pass: typeof obj._menus === "object",
        detail: `${Object.keys(obj._menus || {}).length} registered`,
      });
      break;
    }
    case "Google": {
      results.push({
        label: "Drive ns",
        pass: !!obj.Drive,
        detail: obj.Drive
          ? `${Object.keys(obj.Drive).filter((k) => typeof obj.Drive[k] === "function").length} methods`
          : "Missing",
      });
      results.push({
        label: "Sheets ns",
        pass: !!obj.Sheets,
        detail: obj.Sheets
          ? `${Object.keys(obj.Sheets).filter((k) => typeof obj.Sheets[k] === "function").length} methods`
          : "Missing",
      });
      results.push({
        label: "Colab ns",
        pass: !!obj.Colab,
        detail: obj.Colab
          ? `${Object.keys(obj.Colab).filter((k) => typeof obj.Colab[k] === "function").length} methods`
          : "Missing",
      });
      results.push({
        label: "_tentacleLoaded",
        pass: obj._tentacleLoaded === true,
        detail: obj._tentacleLoaded ? "Loaded" : "Stub only",
      });
      break;
    }
    default: {
      results.push({
        label: "_mock flag",
        pass: obj._mock === false,
        detail: obj._mock ? "Mock (stub)" : "Wired",
      });
      const methods = Object.keys(obj).filter(
        (k) => typeof obj[k] === "function",
      );
      results.push({
        label: "Method count",
        pass: methods.length > 0,
        detail: `${methods.length} gates`,
      });
      break;
    }
  }
  return results;
}

/* ── Introspect a namespace ── */
function inspectNamespace(pandaRef, nsName) {
  const obj = pandaRef?.[nsName];
  if (!obj || typeof obj !== "object") return null;

  const meta = NS_META[nsName] || {
    icon: "📦",
    desc: nsName,
    domain: DOMAIN_EXTENSION,
  };
  const isMock = obj._mock === true;

  const methods = Object.keys(obj)
    .filter((k) => typeof obj[k] === "function" && !k.startsWith("_"))
    .sort();

  const subNs = {};
  if (meta.subNamespaces) {
    for (const sub of meta.subNamespaces) {
      if (obj[sub] && typeof obj[sub] === "object") {
        subNs[sub] = Object.keys(obj[sub])
          .filter(
            (k) => typeof obj[sub][k] === "function" && !k.startsWith("_"),
          )
          .sort();
      }
    }
  }

  const totalMethods =
    methods.length + Object.values(subNs).reduce((a, m) => a + m.length, 0);
  let status = "mock";
  if (obj._mock === false) status = "wired";
  else if (obj._mock === undefined) status = "mixed";

  return {
    name: nsName,
    icon: meta.icon,
    desc: meta.desc,
    domain: meta.domain,
    status,
    isMock,
    methods,
    subNamespaces: subNs,
    totalMethods,
    hasSubNs: Object.keys(subNs).length > 0,
  };
}

/* ── EventBus (root-level methods) ── */
function inspectEventBus(pandaRef) {
  if (!pandaRef) return null;
  const ok =
    typeof pandaRef.on === "function" &&
    typeof pandaRef.off === "function" &&
    typeof pandaRef.emit === "function";
  return {
    name: "EventBus",
    icon: "📡",
    desc: "on() / off() / emit()",
    domain: DOMAIN_CORE,
    status: ok ? "wired" : "missing",
    isMock: false,
    methods: ok ? ["on", "off", "emit"] : [],
    subNamespaces: {},
    totalMethods: ok ? 3 : 0,
    hasSubNs: false,
  };
}

/* ── Loaded tentacles/modules discovery ── */
function discoverLoadedExtensions(pandaRef) {
  if (!pandaRef?.Modules) return [];
  const loaded = [];
  for (const [key, mod] of Object.entries(pandaRef.Modules)) {
    if (typeof mod === "object" && mod !== null) {
      const methods = Object.keys(mod).filter(
        (k) => typeof mod[k] === "function",
      );
      loaded.push({
        name: `Modules.${key}`,
        icon: "🐙",
        desc: "Loaded module/tentacle",
        domain: "LOADED",
        status: "loaded",
        isMock: false,
        methods,
        subNamespaces: {},
        totalMethods: methods.length,
        hasSubNs: false,
      });
    }
  }
  return loaded;
}

/* ── Status styling ── */
function statusColor(status) {
  switch (status) {
    case "wired":
      return "#3fb950";
    case "mixed":
      return "#d29922";
    case "mock":
      return "#f85149";
    case "loaded":
      return "#a371f7";
    default:
      return "#484f58";
  }
}

function statusLabel(status) {
  switch (status) {
    case "wired":
      return "WIRED";
    case "mixed":
      return "MIXED";
    case "mock":
      return "STUB";
    case "loaded":
      return "LOADED";
    default:
      return "?";
  }
}

function domainColor(domain) {
  switch (domain) {
    case DOMAIN_CORE:
      return "#3fb950";
    case DOMAIN_EXTENSION:
      return "#58a6ff";
    case "LOADED":
      return "#a371f7";
    default:
      return "#484f58";
  }
}

function domainLabel(domain) {
  switch (domain) {
    case DOMAIN_CORE:
      return "🛡️ CORE";
    case DOMAIN_EXTENSION:
      return "🔌 EXT POINT";
    case "LOADED":
      return "🐙 3RD-PARTY";
    default:
      return "?";
  }
}

/* ════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function PFSystemMap() {
  const [coreNs, setCoreNs] = useState([]);
  const [extNs, setExtNs] = useState([]);
  const [loadedNs, setLoadedNs] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState({});
  const [sdkInfo, setSdkInfo] = useState({ version: "?", bootStatus: "?" });

  useEffect(() => {
    const p = window.Panda;
    if (!p) return;

    setSdkInfo({
      version: p.VERSION || "?",
      bootStatus: p.Loader?.getStatus?.() || "unknown",
    });

    // Core namespaces
    const core = [inspectEventBus(p)].filter(Boolean);
    for (const ns of NS_ORDER_CORE) {
      const r = inspectNamespace(p, ns);
      if (r) core.push(r);
    }
    setCoreNs(core);

    // Extension points
    const ext = [];
    for (const ns of NS_ORDER_EXT) {
      const r = inspectNamespace(p, ns);
      if (r) ext.push(r);
    }
    setExtNs(ext);

    // Discover loaded tentacles/modules
    setLoadedNs(discoverLoadedExtensions(p));
  }, []);

  const allNs = [...coreNs, ...extNs, ...loadedNs];

  const toggleExpand = useCallback((name) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const expandAll = useCallback(() => {
    const all = {};
    allNs.forEach((ns) => {
      all[ns.name] = true;
    });
    setExpanded(all);
  }, [allNs]);

  const collapseAll = useCallback(() => setExpanded({}), []);

  const runTest = useCallback(async (nsName) => {
    setTesting((prev) => ({ ...prev, [nsName]: true }));
    try {
      const results = await runNamespaceTest(nsName, window.Panda);
      setTestResults((prev) => ({ ...prev, [nsName]: results }));
      setExpanded((prev) => ({ ...prev, [nsName]: true }));
    } finally {
      setTesting((prev) => ({ ...prev, [nsName]: false }));
    }
  }, []);

  const runAllTests = useCallback(async () => {
    for (const ns of allNs) await runTest(ns.name);
  }, [allNs, runTest]);

  // Stats
  const total = allNs.length;
  const wired = allNs.filter((n) => n.status === "wired").length;
  const mock = allNs.filter((n) => n.status === "mock").length;
  const mixed = allNs.filter((n) => n.status === "mixed").length;
  const loaded = loadedNs.length;
  const totalMethods = allNs.reduce((a, n) => a + n.totalMethods, 0);
  const coveragePct = total > 0 ? Math.round((wired / total) * 100) : 0;

  /* ── Render a section of namespace cards ── */
  const renderSection = (title, subtitle, nsList, sectionDomain) => (
    <div className="smap-section" key={title}>
      <div className="smap-section-header">
        <div className="smap-section-title-row">
          <span
            className="smap-section-domain-badge"
            style={{ background: domainColor(sectionDomain) }}
          >
            {domainLabel(sectionDomain)}
          </span>
          <h3 className="smap-section-title">{title}</h3>
        </div>
        <p className="smap-section-subtitle">{subtitle}</p>
      </div>
      <div className="smap-grid">
        {nsList.map((ns) => (
          <div
            key={ns.name}
            className={`smap-card ${expanded[ns.name] ? "expanded" : ""}`}
            style={{ borderColor: `${statusColor(ns.status)}33` }}
          >
            <button
              className="smap-card-header"
              onClick={() => toggleExpand(ns.name)}
              style={{ borderLeftColor: statusColor(ns.status) }}
            >
              <div className="smap-card-left">
                <span className="smap-card-icon">{ns.icon}</span>
                <div className="smap-card-info">
                  <div className="smap-card-name">
                    Panda.{ns.name}
                    <span
                      className="smap-status-badge"
                      style={{ background: statusColor(ns.status) }}
                    >
                      {statusLabel(ns.status)}
                    </span>
                  </div>
                  <div className="smap-card-desc">
                    {ns.desc} — {ns.totalMethods} method
                    {ns.totalMethods !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              <div className="smap-card-right">
                <button
                  className="smap-btn smap-btn-test"
                  onClick={(e) => {
                    e.stopPropagation();
                    runTest(ns.name);
                  }}
                  disabled={testing[ns.name]}
                >
                  {testing[ns.name] ? "⏳" : "🧪"}
                </button>
                <span className="smap-expand-arrow">
                  {expanded[ns.name] ? "▼" : "▶"}
                </span>
              </div>
            </button>

            {expanded[ns.name] && (
              <div className="smap-card-body">
                {ns.methods.length > 0 && (
                  <div className="smap-methods-block">
                    <div className="smap-block-title">
                      Methods —{" "}
                      {ns.domain === DOMAIN_CORE
                        ? "Founder-guaranteed gates"
                        : "Extension surface"}
                    </div>
                    <div className="smap-method-list">
                      {ns.methods.map((m) => (
                        <span key={m} className="smap-method-tag">
                          {m}()
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {ns.hasSubNs &&
                  Object.entries(ns.subNamespaces).map(([subName, methods]) => (
                    <div
                      key={subName}
                      className="smap-methods-block smap-sub-ns"
                    >
                      <div className="smap-block-title">.{subName}</div>
                      <div className="smap-method-list">
                        {methods.map((m) => (
                          <span key={m} className="smap-method-tag">
                            {m}()
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                {testResults[ns.name] && (
                  <div className="smap-test-results">
                    <div className="smap-block-title">🧪 Live Test Results</div>
                    {testResults[ns.name].map((r, i) => (
                      <div
                        key={i}
                        className={`smap-test-row ${r.pass ? "pass" : "fail"}`}
                      >
                        <span className="smap-test-icon">
                          {r.pass ? "✅" : "❌"}
                        </span>
                        <span className="smap-test-label">{r.label}</span>
                        <span className="smap-test-detail">{r.detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="smap-container">
      {/* ── Header ── */}
      <div className="smap-header">
        <div className="smap-title-row">
          <span className="smap-title-icon">🗺️</span>
          <h2 className="smap-title">Panda SDK — System Map</h2>
          <span className="smap-version">v{sdkInfo.version}</span>
          <span className={`smap-boot-badge smap-boot-${sdkInfo.bootStatus}`}>
            {sdkInfo.bootStatus.toUpperCase()}
          </span>
        </div>

        {/* Coverage bar */}
        <div className="smap-coverage">
          <div className="smap-coverage-bar">
            <div
              className="smap-coverage-fill"
              style={{ width: `${coveragePct}%` }}
            />
          </div>
          <div className="smap-coverage-stats">
            <span className="smap-stat wired">🟢 {wired} wired</span>
            <span className="smap-stat mixed">🟡 {mixed} mixed</span>
            <span className="smap-stat mock">🔴 {mock} stub</span>
            {loaded > 0 && (
              <span className="smap-stat loaded">🟣 {loaded} loaded</span>
            )}
            <span className="smap-stat total">📦 {total} namespaces</span>
            <span className="smap-stat methods">⚡ {totalMethods} methods</span>
            <span className="smap-stat coverage">
              {coveragePct}% core coverage
            </span>
          </div>
        </div>

        {/* Responsibility notice */}
        <div className="smap-responsibility">
          <span className="smap-resp-badge core">🛡️ CORE</span>
          <span className="smap-resp-text">
            Founder-guaranteed (SDK → GAS → Firebase → Rust → Security)
          </span>
          <span className="smap-resp-divider">|</span>
          <span className="smap-resp-badge ext">🔌 EXT</span>
          <span className="smap-resp-text">
            SDK gates — 3rd-party tentacles use these, audited by partner
          </span>
        </div>

        {/* Actions */}
        <div className="smap-actions">
          <button className="smap-btn smap-btn-primary" onClick={runAllTests}>
            ▶ Run All Tests
          </button>
          <button className="smap-btn" onClick={expandAll}>
            ↕ Expand All
          </button>
          <button className="smap-btn" onClick={collapseAll}>
            ↕ Collapse All
          </button>
        </div>
      </div>

      {/* ── Sections ── */}
      {allNs.length === 0 ? (
        <div className="smap-empty">
          <span style={{ fontSize: 48 }}>🐼</span>
          <p>window.Panda not found — SDK not loaded</p>
        </div>
      ) : (
        <>
          {renderSection(
            "Core Integration Stack",
            "Founder-maintained: Auth → Wallet → Bridge → Loader → Governance → UI → EventBus",
            coreNs,
            DOMAIN_CORE,
          )}
          {renderSection(
            "Extension Points (SDK Surface)",
            "Gates for modules & tentacles — Founder monitors the gate, partner audits the extension",
            extNs,
            DOMAIN_EXTENSION,
          )}
          {loadedNs.length > 0 &&
            renderSection(
              "Loaded Tentacles / Modules",
              "Dynamically loaded — partner-audited, running on SDK-provided gates",
              loadedNs,
              "LOADED",
            )}
        </>
      )}

      {/* ── Footer ── */}
      <div className="smap-footer">
        <span>🗺️ System Map v1.0</span>
        <span>•</span>
        <span>
          {totalMethods} methods across {total} namespaces
        </span>
        <span>•</span>
        <span>Runtime introspection of window.Panda</span>
      </div>
    </div>
  );
}
