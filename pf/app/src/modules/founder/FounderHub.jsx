/**
 * 🚀 FounderHub v1.0 — Affiliate Sales Command Center (TICKET-10)
 *
 * Founder-only panel for managing Kiwify/Hotmart affiliate sales.
 * Features: Drive Materials Browser, Affiliate Link Builder, Sales Dashboard.
 *
 * Architecture: Medusa Module Pattern
 *   - Self-contained: single component, own styles
 *   - GAS integration via callGAS.Drive + callGAS.Founder
 *   - 3 tabs: Materials, Links, Sales
 */
import React, { useState, useEffect, useCallback } from "react";
import { Drive, Founder } from "../../services/callGAS";
import "./FounderHub.css";

// ── Affiliate Platform Configs ──
const PLATFORMS = {
  kiwify: {
    name: "Kiwify",
    icon: "🥝",
    color: "#22c55e",
    baseUrl: "https://pay.kiwify.com.br",
    docs: "https://dashboard.kiwify.com.br",
  },
  hotmart: {
    name: "Hotmart",
    icon: "🔥",
    color: "#ff6b35",
    baseUrl: "https://pay.hotmart.com",
    docs: "https://app.hotmart.com/?ref=Z87949064T",
  },
};

// ── Store Products (matches PF_Config.gs STORE_CATALOG) ──
const PRODUCTS = [
  {
    id: "panda-factory-pro",
    name: "Panda Factory PRO",
    price: "R$ 97/mês",
    description: "Assinatura completa — todos os módulos + IA",
    kiwifyId: "",
    hotmartId: "",
  },
  {
    id: "crm",
    name: "Panda CRM",
    price: "Grátis",
    description: "CRM com IA — gestão de leads e vendas",
    kiwifyId: "",
    hotmartId: "",
  },
  {
    id: "landing-pages",
    name: "Landing Pages",
    price: "Grátis",
    description: "Builder de páginas com templates prontos",
    kiwifyId: "",
    hotmartId: "",
  },
];

export default function FounderHub({ onClose }) {
  const [activeTab, setActiveTab] = useState("materials");
  const [driveFiles, setDriveFiles] = useState([]);
  const [driveSubfolders, setDriveSubfolders] = useState([]);
  const [driveFolderPath, setDriveFolderPath] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [sales, setSales] = useState([]);
  const [webhookLogs, setWebhookLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copyMsg, setCopyMsg] = useState("");
  const [utmSource, setUtmSource] = useState("affiliate");
  const [utmMedium, setUtmMedium] = useState("link");
  const [utmCampaign, setUtmCampaign] = useState("launch-2026");
  const [initMsg, setInitMsg] = useState("");

  // ── Load data on tab change ──
  useEffect(() => {
    if (activeTab === "materials") loadDriveFiles();
    if (activeTab === "sales") loadSalesData();
  }, [activeTab]);

  // ── Drive Materials ──
  const loadDriveFiles = useCallback(async (folderId) => {
    setLoading(true);
    try {
      const res = await Drive.listFiles(folderId || null);
      if (res?.data) {
        setDriveFiles(res.data.files || []);
        setDriveSubfolders(res.data.subfolders || []);
        if (folderId) {
          setCurrentFolderId(folderId);
        }
      }
    } catch (e) {
      console.error("Drive load error:", e);
    }
    setLoading(false);
  }, []);

  const navigateToFolder = (folder) => {
    setDriveFolderPath((prev) => [...prev, folder]);
    loadDriveFiles(folder.id);
  };

  const navigateBack = () => {
    const newPath = [...driveFolderPath];
    newPath.pop();
    setDriveFolderPath(newPath);
    const parentId = newPath.length > 0 ? newPath[newPath.length - 1].id : null;
    loadDriveFiles(parentId);
  };

  const copyShareLink = async (fileId, fileName) => {
    try {
      const res = await Drive.getShareLink(fileId);
      if (res?.data?.shareUrl) {
        await navigator.clipboard.writeText(res.data.shareUrl);
        setCopyMsg(`✅ Link copiado: ${fileName}`);
        setTimeout(() => setCopyMsg(""), 3000);
      }
    } catch (e) {
      setCopyMsg("❌ Erro ao gerar link");
    }
  };

  const initFounderFolder = async () => {
    setLoading(true);
    try {
      const res = await Drive.initFounderFolder();
      if (res?.data) {
        setInitMsg(
          `✅ Pasta criada! ${res.data.subfolders?.length || 0} subpastas`,
        );
        loadDriveFiles(); // Refresh
      }
    } catch (e) {
      setInitMsg("❌ Erro ao criar pasta");
    }
    setLoading(false);
  };

  // ── Sales Dashboard ──
  const loadSalesData = async () => {
    setLoading(true);
    try {
      const [salesRes, logsRes] = await Promise.all([
        Founder.getRecentSales(20),
        Founder.getWebhookLogs(50),
      ]);
      if (salesRes?.data?.sales) setSales(salesRes.data.sales);
      if (logsRes?.data?.logs) setWebhookLogs(logsRes.data.logs);
    } catch (e) {
      console.error("Sales load error:", e);
    }
    setLoading(false);
  };

  // ── UTM Link Builder ──
  const buildAffiliateLink = (platform, productId) => {
    const base = PLATFORMS[platform]?.baseUrl || "";
    const product = PRODUCTS.find((p) => p.id === productId);
    const pid = platform === "kiwify" ? product?.kiwifyId : product?.hotmartId;
    if (!pid) return `${base}/{PRODUCT_ID}`;
    const params = new URLSearchParams({
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
    });
    return `${base}/${pid}?${params}`;
  };

  const copyText = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopyMsg("✅ Link copiado!");
    setTimeout(() => setCopyMsg(""), 3000);
  };

  // ── Render ──
  return (
    <div className="founder-hub">
      {/* Header */}
      <header className="fh-header">
        <div className="fh-title">
          <span className="fh-icon">🐼</span>
          <h1>Founder Hub</h1>
          <span className="fh-badge">FOUNDER</span>
        </div>
        <div className="fh-actions">
          {copyMsg && <span className="fh-copy-msg">{copyMsg}</span>}
          <button className="fh-close" onClick={onClose}>
            ✕
          </button>
        </div>
      </header>

      {/* Tab Bar */}
      <nav className="fh-tabs">
        {[
          { id: "materials", icon: "📂", label: "Materials Drive" },
          { id: "links", icon: "🔗", label: "Affiliate Links" },
          { id: "sales", icon: "📊", label: "Sales Dashboard" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`fh-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="fh-content">
        {loading && <div className="fh-loading">⏳ Carregando...</div>}

        {/* ─── TAB: Materials Drive ─── */}
        {activeTab === "materials" && !loading && (
          <div className="fh-materials">
            <div className="fh-materials-toolbar">
              <div className="fh-breadcrumb">
                <button
                  className="fh-breadcrumb-item"
                  onClick={() => {
                    setDriveFolderPath([]);
                    loadDriveFiles(null);
                  }}
                >
                  📂 Root
                </button>
                {driveFolderPath.map((f, i) => (
                  <React.Fragment key={f.id}>
                    <span className="fh-breadcrumb-sep">/</span>
                    <button
                      className="fh-breadcrumb-item"
                      onClick={() => {
                        setDriveFolderPath(driveFolderPath.slice(0, i + 1));
                        loadDriveFiles(f.id);
                      }}
                    >
                      {f.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <button
                className="fh-btn fh-btn-primary"
                onClick={initFounderFolder}
              >
                🚀 Inicializar Pasta de Afiliados
              </button>
            </div>
            {initMsg && <div className="fh-init-msg">{initMsg}</div>}

            <div className="fh-file-grid">
              {/* Back button */}
              {driveFolderPath.length > 0 && (
                <div
                  className="fh-file-card fh-folder-card"
                  onClick={navigateBack}
                >
                  <span className="fh-file-icon">⬆️</span>
                  <span className="fh-file-name">..</span>
                </div>
              )}

              {/* Subfolders */}
              {driveSubfolders.map((sf) => (
                <div
                  key={sf.id}
                  className="fh-file-card fh-folder-card"
                  onClick={() => navigateToFolder(sf)}
                >
                  <span className="fh-file-icon">📁</span>
                  <span className="fh-file-name">{sf.name}</span>
                </div>
              ))}

              {/* Files */}
              {driveFiles.map((file) => (
                <div key={file.id} className="fh-file-card">
                  <span className="fh-file-icon">
                    {file.mimeType?.includes("image")
                      ? "🖼️"
                      : file.mimeType?.includes("video")
                        ? "🎬"
                        : file.mimeType?.includes("pdf")
                          ? "📄"
                          : "📎"}
                  </span>
                  <span className="fh-file-name">{file.name}</span>
                  <span className="fh-file-size">
                    {file.size ? `${(file.size / 1024).toFixed(1)}KB` : "—"}
                  </span>
                  <div className="fh-file-actions">
                    <button
                      className="fh-btn-sm"
                      onClick={() => copyShareLink(file.id, file.name)}
                      title="Copiar link compartilhável"
                    >
                      🔗
                    </button>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fh-btn-sm"
                      title="Abrir no Drive"
                    >
                      ↗️
                    </a>
                  </div>
                </div>
              ))}

              {driveFiles.length === 0 && driveSubfolders.length === 0 && (
                <div className="fh-empty">
                  <p>📂 Pasta vazia</p>
                  <p>
                    Clique em "Inicializar Pasta de Afiliados" para criar a
                    estrutura
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB: Affiliate Links ─── */}
        {activeTab === "links" && (
          <div className="fh-links">
            {/* UTM Builder */}
            <div className="fh-utm-builder">
              <h3>🏷️ UTM Builder</h3>
              <div className="fh-utm-fields">
                <label>
                  Source
                  <input
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    placeholder="affiliate"
                  />
                </label>
                <label>
                  Medium
                  <input
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    placeholder="link"
                  />
                </label>
                <label>
                  Campaign
                  <input
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    placeholder="launch-2026"
                  />
                </label>
              </div>
            </div>

            {/* Product Links */}
            <div className="fh-product-links">
              {PRODUCTS.map((product) => (
                <div key={product.id} className="fh-product-card">
                  <div className="fh-product-info">
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                    <span className="fh-product-price">{product.price}</span>
                  </div>
                  <div className="fh-product-buttons">
                    {Object.entries(PLATFORMS).map(([key, platform]) => {
                      const link = buildAffiliateLink(key, product.id);
                      return (
                        <button
                          key={key}
                          className="fh-btn fh-btn-platform"
                          style={{ "--platform-color": platform.color }}
                          onClick={() => copyText(link)}
                          title={`Copiar link ${platform.name}`}
                        >
                          {platform.icon} {platform.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="fh-quick-links">
              <h3>⚡ Dashboards</h3>
              <div className="fh-quick-grid">
                {Object.entries(PLATFORMS).map(([key, p]) => (
                  <a
                    key={key}
                    href={p.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fh-quick-card"
                    style={{ borderColor: p.color }}
                  >
                    <span>{p.icon}</span>
                    <span>{p.name} Dashboard</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: Sales Dashboard ─── */}
        {activeTab === "sales" && !loading && (
          <div className="fh-sales">
            {/* Summary Cards */}
            <div className="fh-summary">
              <div className="fh-stat-card">
                <span className="fh-stat-value">{sales.length}</span>
                <span className="fh-stat-label">Vendas Recentes</span>
              </div>
              <div className="fh-stat-card">
                <span className="fh-stat-value">
                  R${" "}
                  {sales
                    .reduce((sum, s) => sum + (s.amountPaid || 0), 0)
                    .toFixed(2)}
                </span>
                <span className="fh-stat-label">Receita Total</span>
              </div>
              <div className="fh-stat-card">
                <span className="fh-stat-value">
                  {sales.filter((s) => s.status === "ACTIVATED").length}
                </span>
                <span className="fh-stat-label">Licenças Ativadas</span>
              </div>
              <div className="fh-stat-card">
                <span className="fh-stat-value">
                  {sales.filter((s) => s.status === "PENDING").length}
                </span>
                <span className="fh-stat-label">Pendentes</span>
              </div>
            </div>

            {/* Recent Sales Table */}
            <div className="fh-table-section">
              <h3>🧾 Purchase Codes (RTDB)</h3>
              <div className="fh-table-wrap">
                <table className="fh-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Email</th>
                      <th>Source</th>
                      <th>Amount</th>
                      <th>PC</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="fh-empty-cell">
                          Nenhuma venda registrada ainda
                        </td>
                      </tr>
                    ) : (
                      sales.map((sale) => (
                        <tr key={sale.code}>
                          <td className="fh-code">{sale.code}</td>
                          <td>{sale.email}</td>
                          <td>
                            <span
                              className={`fh-source fh-source-${sale.source?.toLowerCase()}`}
                            >
                              {sale.source}
                            </span>
                          </td>
                          <td>R$ {sale.amountPaid?.toFixed(2)}</td>
                          <td>{sale.coins} PC</td>
                          <td>
                            <span
                              className={`fh-status fh-status-${sale.status?.toLowerCase()}`}
                            >
                              {sale.status}
                            </span>
                          </td>
                          <td>
                            {new Date(sale.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Webhook Logs */}
            <div className="fh-table-section">
              <h3>📡 Webhook Logs</h3>
              <div className="fh-table-wrap">
                <table className="fh-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Source</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>PC</th>
                      <th>TX ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {webhookLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="fh-empty-cell">
                          Nenhum webhook recebido ainda
                        </td>
                      </tr>
                    ) : (
                      webhookLogs.map((log, i) => (
                        <tr key={i}>
                          <td>{log.timestamp}</td>
                          <td>
                            <span
                              className={`fh-source fh-source-${log.source?.toLowerCase()}`}
                            >
                              {log.source}
                            </span>
                          </td>
                          <td>{log.email}</td>
                          <td>R$ {log.amount}</td>
                          <td>{log.coins} PC</td>
                          <td className="fh-code">{log.transactionId}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <button className="fh-btn fh-btn-primary" onClick={loadSalesData}>
              🔄 Atualizar Dados
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
