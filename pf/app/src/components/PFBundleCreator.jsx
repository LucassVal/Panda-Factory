import React, { useState, useMemo } from "react";
import "./PFBundleCreator.css";
import { useStoreModules, pcToUSD, PC_TO_USD } from "../hooks/useStoreModules";

/**
 * 📦 Casulo / Bundle Creator v2.0
 *
 * Creates Encapsulado bundles for distribution via Panda Store.
 * Generates panda.manifest.json (type: "encapsulado")
 *
 * @reference PF_MEDUSA_REFERENCE.md §10.5 (Casulo/Encapsulado)
 * @ticket #41 — BundleCreator MVP (DR-008)
 * @version 2.0.0
 */

const PANDA_FEE = 0.3; // 30% Panda
const DEV_SHARE = 0.7; // 70% Devs

const HOOK_PLATFORMS = [
  { id: "panda-store", name: "Panda Store", icon: "🐼", fee: "30% split" },
  { id: "landing", name: "Landing Page", icon: "🌐", fee: "Grátis" },
  { id: "kiwify", name: "Kiwify", icon: "🥝", fee: "$1.99 + 5%" },
  { id: "hotmart", name: "Hotmart", icon: "🔥", fee: "$1.99 + 5%" },
  { id: "playstore", name: "Play Store", icon: "🤖", fee: "Link ext" },
  { id: "appstore", name: "App Store", icon: "🍎", fee: "Link ext" },
];

const CATEGORIES = [
  { id: "all", name: "Todos", icon: "📦" },
  { id: "productivity", name: "Produtividade", icon: "📋" },
  { id: "ai", name: "AI", icon: "🧠" },
  { id: "trading", name: "Trading", icon: "📊" },
  { id: "analytics", name: "Analytics", icon: "📈" },
  { id: "social", name: "Social", icon: "💬" },
  { id: "automation", name: "Automação", icon: "⚡" },
];

export function BundleCreator({ onClose, onCreate, embedded = false }) {
  // ── Data ──
  const { modules, loading } = useStoreModules();

  // ── Form state ──
  const [bundleName, setBundleName] = useState("");
  const [bundleDescription, setBundleDescription] = useState("");
  const [selectedModules, setSelectedModules] = useState([]);
  const [totalPricePC, setTotalPricePC] = useState(0);
  const [hookPlatform, setHookPlatform] = useState("panda-store");
  const [affiliateEnabled, setAffiliateEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // ── UI state ──
  const [showManifest, setShowManifest] = useState(false);
  const [step, setStep] = useState(1); // 1=info, 2=modules, 3=split, 4=publish
  const [publishing, setPublishing] = useState(false);

  // ── Filtered modules ──
  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || m.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [modules, searchQuery, categoryFilter]);

  // ── Selected module objects ──
  const selectedModuleObjects = useMemo(() => {
    return modules.filter((m) => selectedModules.includes(m.id));
  }, [modules, selectedModules]);

  // ── Auto-calculate total when selection changes ──
  const calculatedTotalPC = useMemo(() => {
    return selectedModuleObjects.reduce((sum, m) => sum + (m.price_pc || 0), 0);
  }, [selectedModuleObjects]);

  // ── Split calculation ──
  const splitBreakdown = useMemo(() => {
    const total = totalPricePC || calculatedTotalPC || 0;
    if (total === 0 || selectedModuleObjects.length === 0) return null;

    const pandaShare = Math.round(total * PANDA_FEE);
    const devPool = total - pandaShare;

    // Non-native modules split proportionally
    const paidModules = selectedModuleObjects.filter(
      (m) => !m.native && m.price_pc > 0,
    );
    const totalPaidPC = paidModules.reduce((s, m) => s + m.price_pc, 0);

    const devSplits = paidModules.map((m) => {
      const proportion = totalPaidPC > 0 ? m.price_pc / totalPaidPC : 0;
      const sharePC = Math.round(devPool * proportion);
      return {
        moduleId: m.id,
        moduleName: m.name,
        author: m.author?.name || "Unknown",
        namespace: m.author?.namespace || m.id.split("/")[0],
        sharePC,
        shareUSD: pcToUSD(sharePC),
        proportion: (proportion * 100).toFixed(1),
      };
    });

    return {
      totalPC: total,
      totalUSD: pcToUSD(total),
      pandaSharePC: pandaShare,
      pandaShareUSD: pcToUSD(pandaShare),
      devPool,
      devPoolUSD: pcToUSD(devPool),
      nativeCount: selectedModuleObjects.filter((m) => m.native).length,
      paidCount: paidModules.length,
      devSplits,
    };
  }, [totalPricePC, calculatedTotalPC, selectedModuleObjects]);

  // ── Manifest Generator (§10.5.2) ──
  const generateManifest = () => {
    const manifest = {
      name: bundleName || "Untitled Bundle",
      id: `@panda/${(bundleName || "untitled").toLowerCase().replace(/\s+/g, "-")}`,
      type: "encapsulado",
      version: "1.0.0",
      description: bundleDescription || "",
      modules: selectedModuleObjects.map((m) => ({
        id: m.id,
        native: m.native || false,
        ...(m.native ? {} : { price_pc: m.price_pc }),
      })),
      total_price_pc: totalPricePC || calculatedTotalPC,
      distribution: {
        channel: hookPlatform,
        affiliate_enabled: affiliateEnabled,
      },
      created_at: new Date().toISOString(),
    };
    return manifest;
  };

  const downloadManifest = () => {
    const manifest = generateManifest();
    const blob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "panda.manifest.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Toggle module selection ──
  const toggleModule = (moduleId) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId],
    );
  };

  // ── Handle publish ──
  const handlePublish = async () => {
    if (!bundleName.trim()) {
      alert("Nome do Encapsulado é obrigatório");
      return;
    }
    if (selectedModules.length === 0) {
      alert("Selecione pelo menos um módulo");
      return;
    }

    setPublishing(true);
    const manifest = generateManifest();

    try {
      // Phase 4 will wire this to GAS CREATE_ENCAPSULADO
      if (window.Panda?.callGAS) {
        await window.Panda.callGAS("STORE", "CREATE_ENCAPSULADO", manifest);
      }
      console.log("📦 Encapsulado published:", manifest);
      onCreate && onCreate(manifest);
      onClose && onClose();
    } catch (e) {
      console.error("📦 Publish failed:", e);
      alert("Erro ao publicar. O manifest foi gerado — use Download.");
    } finally {
      setPublishing(false);
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ RENDER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (loading) {
    return (
      <div className="bundle-overlay">
        <div className="bundle-creator bundle-loading">
          <span className="loading-icon">📦</span>
          <span>Carregando módulos...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bundle-overlay ${embedded ? "bundle-embedded" : ""}`}
      onClick={!embedded ? onClose : undefined}
    >
      <div className="bundle-creator" onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <header className="bundle-header">
          <div className="bundle-header-left">
            <h2>📦 Casulo — Encapsulado Creator</h2>
            <span className="bundle-version">v2.0 MVP</span>
          </div>
          <div className="bundle-header-right">
            <div className="step-indicators">
              {["Info", "Módulos", "Split", "Publicar"].map((label, i) => (
                <button
                  key={i}
                  className={`step-dot ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}`}
                  onClick={() => setStep(i + 1)}
                  title={label}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </button>
              ))}
            </div>
            {onClose && (
              <button className="btn-close" onClick={onClose}>
                ×
              </button>
            )}
          </div>
        </header>

        <div className="bundle-content">
          {/* ════════════ STEP 1: Info ════════════ */}
          {step === 1 && (
            <section className="bundle-section bundle-step">
              <h3>📝 Informações do Encapsulado</h3>
              <p className="section-hint">
                O Encapsulado é um pacote vendável que combina múltiplos módulos
                em uma solução completa por nicho.
              </p>

              <div className="form-group">
                <label>Nome do Encapsulado *</label>
                <input
                  type="text"
                  value={bundleName}
                  onChange={(e) => setBundleName(e.target.value)}
                  placeholder="ex: Starter Pack Restaurante"
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={bundleDescription}
                  onChange={(e) => setBundleDescription(e.target.value)}
                  placeholder="Descreva o que esse Encapsulado oferece ao usuário..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Preço Total (PC) — deixe 0 para auto-calcular</label>
                <div className="price-input-group">
                  <input
                    type="number"
                    value={totalPricePC}
                    onChange={(e) =>
                      setTotalPricePC(parseInt(e.target.value) || 0)
                    }
                    min={0}
                    step={100}
                  />
                  <span className="price-usd">
                    ≈ ${pcToUSD(totalPricePC || calculatedTotalPC)} USD
                  </span>
                </div>
              </div>

              <button className="btn-next" onClick={() => setStep(2)}>
                Próximo → Selecionar Módulos
              </button>
            </section>
          )}

          {/* ════════════ STEP 2: Module Selection ════════════ */}
          {step === 2 && (
            <section className="bundle-section bundle-step">
              <h3>🔌 Selecionar Módulos</h3>
              <p className="section-hint">
                {selectedModules.length} selecionado(s) · Módulos{" "}
                <span className="badge-native">@panda</span> = custo zero ·
                Módulos <span className="badge-community">@dev</span> = split
                proporcional
              </p>

              {/* Search + Filter */}
              <div className="module-filters">
                <input
                  type="text"
                  className="module-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Buscar módulo..."
                />
                <div className="category-pills">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      className={`category-pill ${categoryFilter === cat.id ? "active" : ""}`}
                      onClick={() => setCategoryFilter(cat.id)}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Module Grid */}
              <div className="modules-grid">
                {filteredModules.map((mod) => (
                  <div
                    key={mod.id}
                    className={`module-card ${selectedModules.includes(mod.id) ? "selected" : ""} ${mod.native ? "native" : "community"}`}
                    onClick={() => toggleModule(mod.id)}
                  >
                    <div className="module-card-top">
                      <span className="module-icon">{mod.icon}</span>
                      {selectedModules.includes(mod.id) && (
                        <span className="module-check">✓</span>
                      )}
                    </div>
                    <span className="module-name">{mod.name}</span>
                    <span className="module-namespace">{mod.id}</span>
                    <div className="module-card-bottom">
                      <span
                        className={`module-badge ${mod.native ? "native" : "community"}`}
                      >
                        {mod.native
                          ? "🐼 Nativo"
                          : `${pcToUSD(mod.price_pc)} USD`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="step-nav">
                <button className="btn-back" onClick={() => setStep(1)}>
                  ← Voltar
                </button>
                <button
                  className="btn-next"
                  onClick={() => setStep(3)}
                  disabled={selectedModules.length === 0}
                >
                  Próximo → Split Calculator
                </button>
              </div>
            </section>
          )}

          {/* ════════════ STEP 3: Split Calculator ════════════ */}
          {step === 3 && (
            <section className="bundle-section bundle-step">
              <h3>💰 Split Calculator</h3>
              <p className="section-hint">
                Previsão de receita para cada dev com base no preço do
                Encapsulado
              </p>

              {splitBreakdown ? (
                <>
                  {/* Total Overview */}
                  <div className="split-overview">
                    <div className="split-total">
                      <span className="split-total-label">Preço Total</span>
                      <span className="split-total-value">
                        {splitBreakdown.totalPC.toLocaleString()} PC
                        <small> ≈ ${splitBreakdown.totalUSD}</small>
                      </span>
                    </div>

                    {/* Visual Split Bar */}
                    <div className="split-bar-container">
                      <div
                        className="split-bar-segment panda-segment"
                        style={{ width: `${PANDA_FEE * 100}%` }}
                        title={`Panda: ${splitBreakdown.pandaSharePC} PC ($${splitBreakdown.pandaShareUSD})`}
                      >
                        🐼 30%
                      </div>
                      <div
                        className="split-bar-segment dev-segment"
                        style={{ width: `${DEV_SHARE * 100}%` }}
                        title={`Devs: ${splitBreakdown.devPool} PC ($${splitBreakdown.devPoolUSD})`}
                      >
                        👨‍💻 70%
                      </div>
                    </div>
                  </div>

                  {/* Module Breakdown */}
                  <div className="split-breakdown">
                    {/* Native modules */}
                    {splitBreakdown.nativeCount > 0 && (
                      <div className="split-row native-row">
                        <div className="split-row-left">
                          <span className="split-badge native">🐼</span>
                          <span>
                            Módulos @panda/ ({splitBreakdown.nativeCount}x)
                          </span>
                        </div>
                        <div className="split-row-right">
                          <span className="split-amount free">GRÁTIS</span>
                          <small>Monetizam via usage</small>
                        </div>
                      </div>
                    )}

                    {/* Dev splits */}
                    {splitBreakdown.devSplits.map((ds) => (
                      <div key={ds.moduleId} className="split-row dev-row">
                        <div className="split-row-left">
                          <span className="split-badge community">👨‍💻</span>
                          <div>
                            <span className="split-dev-name">{ds.author}</span>
                            <span className="split-module-name">
                              {ds.moduleName}
                            </span>
                          </div>
                        </div>
                        <div className="split-row-right">
                          <span className="split-amount">
                            {ds.sharePC.toLocaleString()} PC
                          </span>
                          <small>
                            ≈ ${ds.shareUSD} ({ds.proportion}%)
                          </small>
                        </div>
                        <div
                          className="split-row-bar"
                          style={{ width: `${ds.proportion}%` }}
                        />
                      </div>
                    ))}

                    {/* Panda fee */}
                    <div className="split-row panda-row">
                      <div className="split-row-left">
                        <span className="split-badge panda">🐼</span>
                        <span>Panda Fee (30%)</span>
                      </div>
                      <div className="split-row-right">
                        <span className="split-amount">
                          {splitBreakdown.pandaSharePC.toLocaleString()} PC
                        </span>
                        <small>≈ ${splitBreakdown.pandaShareUSD}</small>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="split-empty">
                  <span>
                    ⚠️ Defina um preço ou selecione módulos pagos para ver o
                    split
                  </span>
                </div>
              )}

              <div className="step-nav">
                <button className="btn-back" onClick={() => setStep(2)}>
                  ← Voltar
                </button>
                <button className="btn-next" onClick={() => setStep(4)}>
                  Próximo → Publicar
                </button>
              </div>
            </section>
          )}

          {/* ════════════ STEP 4: Publish ════════════ */}
          {step === 4 && (
            <section className="bundle-section bundle-step">
              <h3>🚀 Publicar Encapsulado</h3>

              {/* Distribution Platform */}
              <div className="form-group">
                <label>Plataforma de Distribuição</label>
                <div className="platforms-grid">
                  {HOOK_PLATFORMS.map((platform) => (
                    <button
                      key={platform.id}
                      className={`platform-btn ${hookPlatform === platform.id ? "selected" : ""}`}
                      onClick={() => setHookPlatform(platform.id)}
                    >
                      <span className="platform-icon">{platform.icon}</span>
                      <div className="platform-info">
                        <span className="platform-name">{platform.name}</span>
                        <span className="platform-fee">{platform.fee}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group affiliate-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={affiliateEnabled}
                    onChange={(e) => setAffiliateEnabled(e.target.checked)}
                  />
                  Habilitar programa de afiliados
                </label>
              </div>

              {/* Final Summary */}
              <div className="publish-summary">
                <h4>📋 Resumo Final</h4>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Nome</span>
                    <span className="summary-value">{bundleName || "—"}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Módulos</span>
                    <span className="summary-value">
                      {selectedModules.length}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Preço</span>
                    <span className="summary-value">
                      {(totalPricePC || calculatedTotalPC).toLocaleString()} PC
                      (${pcToUSD(totalPricePC || calculatedTotalPC)})
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Canal</span>
                    <span className="summary-value">
                      {HOOK_PLATFORMS.find((p) => p.id === hookPlatform)?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="publish-actions">
                <button
                  className="btn-manifest"
                  onClick={() => setShowManifest(!showManifest)}
                >
                  📋 {showManifest ? "Fechar" : "Preview"} Manifest
                </button>
                <button className="btn-download" onClick={downloadManifest}>
                  💾 Download .json
                </button>
              </div>

              {/* Manifest Preview */}
              {showManifest && (
                <div className="manifest-preview">
                  <pre>{JSON.stringify(generateManifest(), null, 2)}</pre>
                </div>
              )}

              <div className="step-nav">
                <button className="btn-back" onClick={() => setStep(3)}>
                  ← Voltar
                </button>
                <button
                  className="btn-publish"
                  onClick={handlePublish}
                  disabled={
                    publishing ||
                    !bundleName.trim() ||
                    selectedModules.length === 0
                  }
                >
                  {publishing ? "⏳ Publicando..." : "🚀 Publicar Encapsulado"}
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default BundleCreator;
