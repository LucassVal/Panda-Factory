import React, { useState, useEffect } from "react";
import "./PluginManifestEditor.css";

/**
 * 🔧 Plugin Manifest Editor
 *
 * Editor and validator for panda.json plugin manifests.
 * Based on PF_MASTER_ARCHITECTURE.md §26.6.D
 *
 * Required fields:
 * - name, version, description, author
 * - permissions (what the plugin needs access to)
 * - files (entry points and assets)
 */

// Schema for panda.json validation
const MANIFEST_SCHEMA = {
  required: ["name", "version", "description", "author", "permissions"],
  fields: {
    name: {
      type: "string",
      pattern: /^[a-z0-9-]+$/,
      minLength: 3,
      maxLength: 50,
    },
    version: { type: "string", pattern: /^\d+\.\d+\.\d+$/ },
    description: { type: "string", minLength: 10, maxLength: 200 },
    author: { type: "string", minLength: 3 },
    permissions: {
      type: "array",
      items: [
        "network",
        "storage",
        "clipboard",
        "notifications",
        "geolocation",
      ],
    },
    files: { type: "object" },
    homepage: { type: "string", optional: true },
    repository: { type: "string", optional: true },
    license: { type: "string", optional: true },
    keywords: { type: "array", optional: true },
    priceUSD: { type: "number", optional: true, min: 0, max: 9999 },
  },
};

// Template for new manifest
const MANIFEST_TEMPLATE = {
  name: "my-plugin",
  version: "1.0.0",
  description: "Descrição do meu plugin",
  author: "Seu Nome",
  homepage: "https://github.com/user/repo",
  license: "MIT",
  permissions: [],
  files: {
    main: "index.js",
    styles: "styles.css",
  },
  keywords: ["panda", "plugin"],
  priceUSD: 0,
};

export function PluginManifestEditor({
  onSave,
  onClose,
  initialManifest = null,
}) {
  const [manifest, setManifest] = useState(
    initialManifest || MANIFEST_TEMPLATE,
  );
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [jsonView, setJsonView] = useState(false);
  const [rawJson, setRawJson] = useState("");

  // Validate manifest
  useEffect(() => {
    const validationErrors = [];
    const validationWarnings = [];

    // Required fields
    for (const field of MANIFEST_SCHEMA.required) {
      if (!manifest[field]) {
        validationErrors.push(`Campo obrigatório ausente: ${field}`);
      }
    }

    // Field validation
    const { fields } = MANIFEST_SCHEMA;

    if (manifest.name && !fields.name.pattern.test(manifest.name)) {
      validationErrors.push(
        "Nome inválido: use apenas letras minúsculas, números e hífens",
      );
    }

    if (manifest.version && !fields.version.pattern.test(manifest.version)) {
      validationErrors.push("Versão inválida: use formato X.Y.Z (ex: 1.0.0)");
    }

    if (manifest.description) {
      if (manifest.description.length < 10) {
        validationErrors.push("Descrição muito curta (mínimo 10 caracteres)");
      }
      if (manifest.description.length > 200) {
        validationErrors.push("Descrição muito longa (máximo 200 caracteres)");
      }
    }

    // Warnings
    if (!manifest.homepage) {
      validationWarnings.push("Recomendado: adicionar homepage");
    }

    if (!manifest.license) {
      validationWarnings.push("Recomendado: especificar licença");
    }

    if (
      manifest.permissions?.includes("network") &&
      !manifest.permissions?.includes("storage")
    ) {
      validationWarnings.push(
        'Permissão "network" sem "storage" pode limitar funcionalidade',
      );
    }

    setErrors(validationErrors);
    setWarnings(validationWarnings);
  }, [manifest]);

  // Update raw JSON when manifest changes
  useEffect(() => {
    setRawJson(JSON.stringify(manifest, null, 2));
  }, [manifest]);

  const handleFieldChange = (field, value) => {
    setManifest((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermissionToggle = (permission) => {
    const current = manifest.permissions || [];
    const updated = current.includes(permission)
      ? current.filter((p) => p !== permission)
      : [...current, permission];
    handleFieldChange("permissions", updated);
  };

  const handleJsonChange = (e) => {
    setRawJson(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setManifest(parsed);
    } catch (err) {
      setErrors((prev) => [
        ...prev.filter((e) => !e.includes("JSON inválido")),
        "JSON inválido: " + err.message,
      ]);
    }
  };

  const handleSave = () => {
    if (errors.length > 0) {
      alert("Corrija os erros antes de salvar");
      return;
    }
    onSave && onSave(manifest);
  };

  const handleReset = () => {
    if (confirm("Resetar para o template padrão?")) {
      setManifest(MANIFEST_TEMPLATE);
    }
  };

  const isValid = errors.length === 0;

  return (
    <div className="manifest-editor-overlay" onClick={onClose}>
      <div className="manifest-editor" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="editor-header">
          <h2>🔧 Plugin Manifest Editor</h2>
          <div className="header-actions">
            <button
              className={`toggle-view ${jsonView ? "active" : ""}`}
              onClick={() => setJsonView(!jsonView)}
            >
              {jsonView ? "📝 Form" : "{ } JSON"}
            </button>
            <button className="btn-close" onClick={onClose}>
              ×
            </button>
          </div>
        </header>

        {/* Validation Status */}
        <div className={`validation-status ${isValid ? "valid" : "invalid"}`}>
          <span className="status-icon">{isValid ? "✅" : "❌"}</span>
          <span className="status-text">
            {isValid
              ? "Manifest válido"
              : `${errors.length} erro(s) encontrado(s)`}
          </span>
        </div>

        {/* Content */}
        <div className="editor-content">
          {jsonView ? (
            /* JSON View */
            <div className="json-editor">
              <textarea
                value={rawJson}
                onChange={handleJsonChange}
                spellCheck={false}
              />
            </div>
          ) : (
            /* Form View */
            <div className="form-editor">
              {/* Basic Info */}
              <section className="form-section">
                <h3>📦 Informações Básicas</h3>

                <div className="form-row">
                  <label>Nome do Plugin *</label>
                  <input
                    type="text"
                    value={manifest.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="my-plugin"
                  />
                  <span className="hint">
                    Letras minúsculas, números e hífens
                  </span>
                </div>

                <div className="form-row">
                  <label>Versão *</label>
                  <input
                    type="text"
                    value={manifest.version || ""}
                    onChange={(e) =>
                      handleFieldChange("version", e.target.value)
                    }
                    placeholder="1.0.0"
                  />
                </div>

                <div className="form-row">
                  <label>Descrição *</label>
                  <textarea
                    value={manifest.description || ""}
                    onChange={(e) =>
                      handleFieldChange("description", e.target.value)
                    }
                    placeholder="O que seu plugin faz?"
                    rows={2}
                  />
                  <span className="char-count">
                    {(manifest.description || "").length}/200
                  </span>
                </div>

                <div className="form-row">
                  <label>Autor *</label>
                  <input
                    type="text"
                    value={manifest.author || ""}
                    onChange={(e) =>
                      handleFieldChange("author", e.target.value)
                    }
                    placeholder="Seu Nome"
                  />
                </div>
              </section>

              {/* Permissions */}
              <section className="form-section">
                <h3>🔐 Permissões</h3>
                <p className="section-desc">
                  Selecione as permissões que seu plugin precisa
                </p>

                <div className="permissions-grid">
                  {MANIFEST_SCHEMA.fields.permissions.items.map((perm) => (
                    <label key={perm} className="permission-item">
                      <input
                        type="checkbox"
                        checked={(manifest.permissions || []).includes(perm)}
                        onChange={() => handlePermissionToggle(perm)}
                      />
                      <span className="perm-icon">
                        {perm === "network" && "🌐"}
                        {perm === "storage" && "💾"}
                        {perm === "clipboard" && "📋"}
                        {perm === "notifications" && "🔔"}
                        {perm === "geolocation" && "📍"}
                      </span>
                      <span className="perm-name">{perm}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Pricing */}
              <section className="form-section">
                <h3>💰 Preço (USD)</h3>
                <div className="form-row">
                  <label>Preço em USD (0 = Grátis)</label>
                  <input
                    type="number"
                    value={manifest.priceUSD || 0}
                    onChange={(e) =>
                      handleFieldChange(
                        "priceUSD",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    min={0}
                    max={9999}
                    step={0.01}
                  />
                </div>
              </section>

              {/* Optional */}
              <section className="form-section">
                <h3>📎 Opcional</h3>

                <div className="form-row">
                  <label>Homepage</label>
                  <input
                    type="url"
                    value={manifest.homepage || ""}
                    onChange={(e) =>
                      handleFieldChange("homepage", e.target.value)
                    }
                    placeholder="https://github.com/user/repo"
                  />
                </div>

                <div className="form-row">
                  <label>Licença</label>
                  <select
                    value={manifest.license || ""}
                    onChange={(e) =>
                      handleFieldChange("license", e.target.value)
                    }
                  >
                    <option value="">Selecione...</option>
                    <option value="MIT">MIT</option>
                    <option value="Apache-2.0">Apache 2.0</option>
                    <option value="GPL-3.0">GPL 3.0</option>
                    <option value="BSD-3-Clause">BSD 3-Clause</option>
                    <option value="Proprietary">Proprietária</option>
                  </select>
                </div>
              </section>
            </div>
          )}

          {/* Errors & Warnings */}
          {(errors.length > 0 || warnings.length > 0) && (
            <div className="validation-messages">
              {errors.map((err, i) => (
                <div key={i} className="msg error">
                  ❌ {err}
                </div>
              ))}
              {warnings.map((warn, i) => (
                <div key={i} className="msg warning">
                  ⚠️ {warn}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="editor-footer">
          <button className="btn-reset" onClick={handleReset}>
            🔄 Reset
          </button>
          <div className="footer-right">
            <button className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn-save"
              onClick={handleSave}
              disabled={!isValid}
            >
              💾 Salvar Manifest
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default PluginManifestEditor;
