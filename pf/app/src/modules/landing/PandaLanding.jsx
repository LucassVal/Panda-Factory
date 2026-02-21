/**
 * 🚀 PandaLanding v1.0 — AI-Powered Landing Page Builder (TICKET-14)
 *
 * Second official Medusa module.
 * Features: Template picker, section editor, live preview, export HTML.
 *
 * Architecture: Medusa Module Pattern
 *   - Self-contained in /modules/landing/
 *   - Opens as dockable tab via componentFactory
 *   - Stores pages in localStorage (RTDB sync in Phase 2)
 *
 * @version 1.0.0
 * @see PF_MEDUSA_REFERENCE.md §2
 */

import React, { useState, useEffect, useRef } from "react";

// ── Templates ──
const TEMPLATES = [
  {
    id: "saas",
    name: "SaaS Product",
    icon: "🚀",
    description: "Modern SaaS landing with hero, features, pricing",
    color: "#3b82f6",
    sections: [
      {
        type: "hero",
        title: "Build Something Amazing",
        subtitle: "The all-in-one platform for modern teams.",
        cta: "Start Free Trial",
        bg: "linear-gradient(135deg, #1e3a5f, #0d1b2a)",
      },
      {
        type: "features",
        title: "Why Choose Us",
        items: [
          {
            icon: "⚡",
            title: "Lightning Fast",
            desc: "Deploy in seconds, not hours",
          },
          {
            icon: "🔒",
            title: "Secure by Default",
            desc: "Enterprise-grade security built in",
          },
          {
            icon: "📊",
            title: "Real-time Analytics",
            desc: "Track everything that matters",
          },
        ],
      },
      {
        type: "pricing",
        title: "Simple Pricing",
        plans: [
          {
            name: "Starter",
            price: "Free",
            features: ["5 Projects", "Basic Analytics", "Community Support"],
          },
          {
            name: "Pro",
            price: "$29/mo",
            features: [
              "Unlimited Projects",
              "Advanced Analytics",
              "Priority Support",
            ],
            highlighted: true,
          },
          {
            name: "Enterprise",
            price: "Custom",
            features: ["Custom Integration", "SLA 99.9%", "Dedicated Support"],
          },
        ],
      },
      {
        type: "cta",
        title: "Ready to Get Started?",
        subtitle: "Join 10,000+ teams already using our platform.",
        cta: "Create Your Account",
      },
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    icon: "🎨",
    description: "Clean portfolio for creatives and freelancers",
    color: "#8b5cf6",
    sections: [
      {
        type: "hero",
        title: "Hi, I'm [Your Name]",
        subtitle: "Designer & Developer crafting digital experiences.",
        cta: "View My Work",
        bg: "linear-gradient(135deg, #2d1b69, #1a0d3a)",
      },
      {
        type: "features",
        title: "What I Do",
        items: [
          {
            icon: "🎨",
            title: "UI/UX Design",
            desc: "Beautiful, intuitive interfaces",
          },
          {
            icon: "💻",
            title: "Web Development",
            desc: "Modern, responsive websites",
          },
          {
            icon: "📱",
            title: "Mobile Apps",
            desc: "Native and cross-platform",
          },
        ],
      },
      {
        type: "cta",
        title: "Let's Work Together",
        subtitle: "Open for freelance opportunities.",
        cta: "Get in Touch",
      },
    ],
  },
  {
    id: "product",
    name: "Product Launch",
    icon: "📦",
    description: "High-converting product launch page",
    color: "#f59e0b",
    sections: [
      {
        type: "hero",
        title: "Introducing [Product]",
        subtitle: "The revolutionary tool that changes everything.",
        cta: "Pre-order Now — $49",
        bg: "linear-gradient(135deg, #5c3d0d, #2d1b06)",
      },
      {
        type: "features",
        title: "Key Features",
        items: [
          {
            icon: "✨",
            title: "Feature One",
            desc: "Describe your first key feature",
          },
          {
            icon: "🎯",
            title: "Feature Two",
            desc: "Describe your second key feature",
          },
          {
            icon: "💎",
            title: "Feature Three",
            desc: "Describe your third key feature",
          },
        ],
      },
      {
        type: "pricing",
        title: "Launch Pricing",
        plans: [
          {
            name: "Early Bird",
            price: "$29",
            features: ["Full Access", "Lifetime Updates", "Community"],
            highlighted: true,
          },
          {
            name: "Regular",
            price: "$49",
            features: ["Full Access", "1 Year Updates", "Email Support"],
          },
        ],
      },
      {
        type: "cta",
        title: "Don't Miss Out!",
        subtitle: "Limited early-bird pricing — only 100 spots left.",
        cta: "Claim Your Spot",
      },
    ],
  },
];

export default function PandaLanding({ onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [sections, setSections] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [savedPages, setSavedPages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pf_landing_pages") || "[]");
    } catch (_) {
      return [];
    }
  });

  // ── Select template ──
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setSections(JSON.parse(JSON.stringify(template.sections)));
    setPreviewMode(false);
  };

  // ── Update section ──
  const updateSection = (index, updates) => {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...updates } : s)),
    );
  };

  // ── Save page ──
  const savePage = () => {
    const page = {
      id: `lp-${Date.now()}`,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      sections,
      createdAt: new Date().toISOString(),
    };
    const updated = [...savedPages, page];
    setSavedPages(updated);
    localStorage.setItem("pf_landing_pages", JSON.stringify(updated));
    alert("✅ Página salva!");
  };

  // ── Export HTML ──
  const exportHTML = () => {
    const html = generateHTML(sections);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `landing-${selectedTemplate?.id || "page"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Delete saved page ──
  const deletePage = (pageId) => {
    const updated = savedPages.filter((p) => p.id !== pageId);
    setSavedPages(updated);
    localStorage.setItem("pf_landing_pages", JSON.stringify(updated));
  };

  // ── Load saved page ──
  const loadPage = (page) => {
    const template =
      TEMPLATES.find((t) => t.id === page.templateId) || TEMPLATES[0];
    setSelectedTemplate(template);
    setSections(page.sections);
  };

  // ── Template Picker View ──
  if (!selectedTemplate) {
    return (
      <div className="panda-landing">
        <div className="landing-header">
          <div className="landing-header-left">
            <h2 className="landing-title">🚀 Landing Page Builder</h2>
            <span className="landing-subtitle">Choose a template to start</span>
          </div>
          <div className="landing-header-right">
            {onClose && (
              <button className="landing-close-btn" onClick={onClose}>
                ×
              </button>
            )}
          </div>
        </div>

        <div className="landing-content">
          {/* Templates */}
          <div className="landing-templates">
            <h3 className="landing-section-title">📋 Templates</h3>
            <div className="landing-template-grid">
              {TEMPLATES.map((t) => (
                <div
                  key={t.id}
                  className="landing-template-card"
                  onClick={() => handleSelectTemplate(t)}
                  style={{ borderColor: t.color + "40" }}
                >
                  <div
                    className="landing-template-icon"
                    style={{ background: t.color + "20", color: t.color }}
                  >
                    {t.icon}
                  </div>
                  <h4>{t.name}</h4>
                  <p>{t.description}</p>
                  <span className="landing-template-sections">
                    {t.sections.length} sections
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Pages */}
          {savedPages.length > 0 && (
            <div className="landing-saved">
              <h3 className="landing-section-title">
                💾 Saved Pages ({savedPages.length})
              </h3>
              <div className="landing-saved-list">
                {savedPages.map((page) => (
                  <div key={page.id} className="landing-saved-item">
                    <div className="landing-saved-info">
                      <strong>{page.templateName}</strong>
                      <span>
                        {new Date(page.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="landing-saved-actions">
                      <button onClick={() => loadPage(page)}>✏️ Edit</button>
                      <button onClick={() => deletePage(page.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Editor + Preview View ──
  return (
    <div className="panda-landing">
      <div className="landing-header">
        <div className="landing-header-left">
          <h2 className="landing-title">🚀 {selectedTemplate.name}</h2>
          <div className="landing-header-actions">
            <button
              className="landing-btn secondary"
              onClick={() => {
                setSelectedTemplate(null);
                setSections([]);
              }}
            >
              ← Templates
            </button>
            <button
              className={`landing-btn ${previewMode ? "active" : ""}`}
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? "✏️ Editor" : "👁️ Preview"}
            </button>
            <button className="landing-btn primary" onClick={savePage}>
              💾 Save
            </button>
            <button className="landing-btn export" onClick={exportHTML}>
              📤 Export HTML
            </button>
          </div>
        </div>
        {onClose && (
          <button className="landing-close-btn" onClick={onClose}>
            ×
          </button>
        )}
      </div>

      <div className="landing-content">
        {previewMode ? (
          <PreviewPanel sections={sections} />
        ) : (
          <div className="landing-editor-layout">
            {/* Section List */}
            <div className="landing-section-list">
              {sections.map((section, idx) => (
                <div
                  key={idx}
                  className={`landing-section-item ${editingSection === idx ? "active" : ""}`}
                  onClick={() => setEditingSection(idx)}
                >
                  <span className="landing-section-type">
                    {section.type === "hero" && "🎯"}
                    {section.type === "features" && "⭐"}
                    {section.type === "pricing" && "💰"}
                    {section.type === "cta" && "📢"}{" "}
                    {section.type.toUpperCase()}
                  </span>
                  <span className="landing-section-preview-text">
                    {section.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Section Editor */}
            <div className="landing-section-editor">
              {editingSection !== null && sections[editingSection] ? (
                <SectionEditor
                  section={sections[editingSection]}
                  onChange={(updates) => updateSection(editingSection, updates)}
                />
              ) : (
                <div className="landing-editor-empty">
                  <span style={{ fontSize: 48 }}>👈</span>
                  <p>Select a section to edit</p>
                </div>
              )}
            </div>

            {/* Mini Preview */}
            <div className="landing-mini-preview">
              <PreviewPanel sections={sections} mini />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section Editor Component ──
function SectionEditor({ section, onChange }) {
  const handleChange = (field, value) => onChange({ [field]: value });

  return (
    <div className="landing-editor-form">
      <h3>
        {section.type === "hero" && "🎯 Hero Section"}
        {section.type === "features" && "⭐ Features Section"}
        {section.type === "pricing" && "💰 Pricing Section"}
        {section.type === "cta" && "📢 CTA Section"}
      </h3>

      <div className="landing-field">
        <label>Title</label>
        <input
          type="text"
          value={section.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      {section.subtitle !== undefined && (
        <div className="landing-field">
          <label>Subtitle</label>
          <input
            type="text"
            value={section.subtitle || ""}
            onChange={(e) => handleChange("subtitle", e.target.value)}
          />
        </div>
      )}

      {section.cta !== undefined && (
        <div className="landing-field">
          <label>Button Text</label>
          <input
            type="text"
            value={section.cta || ""}
            onChange={(e) => handleChange("cta", e.target.value)}
          />
        </div>
      )}

      {section.items && (
        <div className="landing-field">
          <label>Features ({section.items.length})</label>
          {section.items.map((item, idx) => (
            <div key={idx} className="landing-feature-edit">
              <input
                type="text"
                value={item.icon}
                onChange={(e) => {
                  const items = [...section.items];
                  items[idx] = { ...items[idx], icon: e.target.value };
                  onChange({ items });
                }}
                className="landing-icon-input"
                maxLength={2}
              />
              <input
                type="text"
                value={item.title}
                onChange={(e) => {
                  const items = [...section.items];
                  items[idx] = { ...items[idx], title: e.target.value };
                  onChange({ items });
                }}
                placeholder="Feature title"
              />
              <input
                type="text"
                value={item.desc}
                onChange={(e) => {
                  const items = [...section.items];
                  items[idx] = { ...items[idx], desc: e.target.value };
                  onChange({ items });
                }}
                placeholder="Feature description"
              />
            </div>
          ))}
        </div>
      )}

      {section.plans && (
        <div className="landing-field">
          <label>Pricing Plans ({section.plans.length})</label>
          {section.plans.map((plan, idx) => (
            <div key={idx} className="landing-plan-edit">
              <input
                type="text"
                value={plan.name}
                onChange={(e) => {
                  const plans = [...section.plans];
                  plans[idx] = { ...plans[idx], name: e.target.value };
                  onChange({ plans });
                }}
                placeholder="Plan name"
              />
              <input
                type="text"
                value={plan.price}
                onChange={(e) => {
                  const plans = [...section.plans];
                  plans[idx] = { ...plans[idx], price: e.target.value };
                  onChange({ plans });
                }}
                placeholder="Price"
                className="landing-price-input"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Preview Panel ──
function PreviewPanel({ sections, mini }) {
  return (
    <div className={`landing-preview ${mini ? "mini" : "full"}`}>
      {sections.map((section, idx) => (
        <div
          key={idx}
          className={`lp-section lp-${section.type}`}
          style={section.bg ? { background: section.bg } : {}}
        >
          {section.type === "hero" && (
            <div className="lp-hero">
              <h1>{section.title}</h1>
              <p>{section.subtitle}</p>
              {section.cta && (
                <button className="lp-cta-btn">{section.cta}</button>
              )}
            </div>
          )}

          {section.type === "features" && (
            <div className="lp-features">
              <h2>{section.title}</h2>
              <div className="lp-features-grid">
                {section.items?.map((item, i) => (
                  <div key={i} className="lp-feature-card">
                    <span className="lp-feature-icon">{item.icon}</span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section.type === "pricing" && (
            <div className="lp-pricing">
              <h2>{section.title}</h2>
              <div className="lp-pricing-grid">
                {section.plans?.map((plan, i) => (
                  <div
                    key={i}
                    className={`lp-plan-card ${plan.highlighted ? "highlighted" : ""}`}
                  >
                    <h3>{plan.name}</h3>
                    <div className="lp-plan-price">{plan.price}</div>
                    <ul>
                      {plan.features?.map((f, fi) => (
                        <li key={fi}>✓ {f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section.type === "cta" && (
            <div className="lp-cta">
              <h2>{section.title}</h2>
              <p>{section.subtitle}</p>
              {section.cta && (
                <button className="lp-cta-btn">{section.cta}</button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── HTML Export Generator ──
function generateHTML(sections) {
  const sectionHTML = sections
    .map((s) => {
      if (s.type === "hero") {
        return `<section style="padding:80px 20px;text-align:center;background:${s.bg || "#1a1a2e"}">
  <h1 style="font-size:48px;margin-bottom:16px;color:#fff">${s.title}</h1>
  <p style="font-size:20px;color:#aaa;margin-bottom:32px">${s.subtitle || ""}</p>
  ${s.cta ? `<a href="#" style="display:inline-block;padding:14px 32px;background:#3b82f6;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">${s.cta}</a>` : ""}
</section>`;
      }
      if (s.type === "features") {
        const items = (s.items || [])
          .map(
            (i) =>
              `<div style="flex:1;min-width:250px;text-align:center;padding:24px">
    <div style="font-size:40px;margin-bottom:12px">${i.icon}</div>
    <h3 style="color:#fff;margin-bottom:8px">${i.title}</h3>
    <p style="color:#aaa">${i.desc}</p>
  </div>`,
          )
          .join("\n");
        return `<section style="padding:60px 20px;background:#0d1117">
  <h2 style="text-align:center;color:#fff;margin-bottom:40px">${s.title}</h2>
  <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:20px;max-width:900px;margin:0 auto">
    ${items}
  </div>
</section>`;
      }
      if (s.type === "pricing") {
        const plans = (s.plans || [])
          .map((p) => {
            const feats = (p.features || [])
              .map(
                (f) =>
                  `<li style="padding:8px 0;border-bottom:1px solid #333">✓ ${f}</li>`,
              )
              .join("\n");
            const hl = p.highlighted
              ? "border:2px solid #3b82f6;"
              : "border:1px solid #333;";
            return `<div style="flex:1;min-width:220px;${hl}border-radius:12px;padding:24px;text-align:center;background:#161b22">
    <h3 style="color:#fff">${p.name}</h3>
    <div style="font-size:32px;font-weight:700;color:#3b82f6;margin:16px 0">${p.price}</div>
    <ul style="list-style:none;padding:0;color:#aaa">${feats}</ul>
  </div>`;
          })
          .join("\n");
        return `<section style="padding:60px 20px;background:#0d1117">
  <h2 style="text-align:center;color:#fff;margin-bottom:40px">${s.title}</h2>
  <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:20px;max-width:900px;margin:0 auto">
    ${plans}
  </div>
</section>`;
      }
      if (s.type === "cta") {
        return `<section style="padding:60px 20px;text-align:center;background:linear-gradient(135deg,#1e3a5f,#0d1b2a)">
  <h2 style="font-size:36px;color:#fff;margin-bottom:16px">${s.title}</h2>
  <p style="font-size:18px;color:#aaa;margin-bottom:32px">${s.subtitle || ""}</p>
  ${s.cta ? `<a href="#" style="display:inline-block;padding:14px 32px;background:#3b82f6;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">${s.cta}</a>` : ""}
</section>`;
      }
      return "";
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; background: #0d1117; color: #c9d1d9; }
  </style>
</head>
<body>
${sectionHTML}
</body>
</html>`;
}
