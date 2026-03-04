import React, { useState, useEffect, useCallback } from "react";
import { gasPost } from "../../../services/callGAS";
import "./PFStockView.css";

const UNITS = ["un", "kg", "g", "L", "mL", "cx", "pct", "m", "m²"];

export default function PFEstoque({ onClose }) {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    totalValue: 0,
    lowStockCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showAdjust, setShowAdjust] = useState(null);
  const [filter, setFilter] = useState("all"); // all | low

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await gasPost("STOCK_LIST", {
        lowStockOnly: filter === "low",
      });
      if (res.status === "SUCCESS") {
        setItems(res.items || []);
        setStats({
          total: res.total,
          totalValue: res.totalValue,
          lowStockCount: res.lowStockCount,
        });
      }
    } catch (err) {
      console.error("[Estoque]", err);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const saveItem = async (item) => {
    await gasPost("STOCK_UPSERT", { item });
    setShowModal(false);
    setEditItem(null);
    load();
  };

  const adjustStock = async (itemId, adjustment, reason, type) => {
    await gasPost("STOCK_ADJUST", { itemId, adjustment, reason, type });
    setShowAdjust(null);
    load();
  };

  return (
    <div className="pf-stk">
      <div className="pf-stk-header">
        <div className="pf-stk-title-row">
          <h2 className="pf-stk-title">📦 Estoque</h2>
          <span className="pf-stk-badge">MOD-07</span>
          {onClose && (
            <button className="pf-stk-close" onClick={onClose}>
              ✕
            </button>
          )}
        </div>
        <div className="pf-stk-stats">
          <div className="pf-stk-stat">
            <span className="pf-stk-stat-val">{stats.total}</span>
            <span className="pf-stk-stat-lbl">ITENS</span>
          </div>
          <div className="pf-stk-stat">
            <span className="pf-stk-stat-val" style={{ color: "#10b981" }}>
              R${" "}
              {(stats.totalValue || 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="pf-stk-stat-lbl">VALOR TOTAL</span>
          </div>
          <div className="pf-stk-stat">
            <span
              className="pf-stk-stat-val"
              style={{ color: stats.lowStockCount > 0 ? "#ef4444" : "#10b981" }}
            >
              {stats.lowStockCount}
            </span>
            <span className="pf-stk-stat-lbl">ESTOQUE BAIXO</span>
          </div>
        </div>
        <div className="pf-stk-toolbar">
          <div className="pf-stk-filter">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              📦 Todos
            </button>
            <button
              className={filter === "low" ? "active" : ""}
              onClick={() => setFilter("low")}
            >
              ⚠️ Baixo
            </button>
          </div>
          <button
            className="pf-stk-add-btn"
            onClick={() => {
              setEditItem(null);
              setShowModal(true);
            }}
          >
            ➕ Novo Item
          </button>
        </div>
      </div>

      <div className="pf-stk-content">
        {loading ? (
          <div className="pf-stk-loading">
            <div className="pf-stk-spinner" />
            <span>Carregando...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="pf-stk-empty">
            <div style={{ fontSize: 48, opacity: 0.3 }}>📦</div>
            <p>Nenhum item no estoque</p>
          </div>
        ) : (
          <div className="pf-stk-list">
            {items.map((item) => {
              const isLow = (item.quantity || 0) <= (item.minStock || 5);
              return (
                <div
                  key={item.id}
                  className={`pf-stk-row ${isLow ? "low" : ""}`}
                >
                  <div className="pf-stk-row-info">
                    <div className="pf-stk-row-name">
                      {item.name}{" "}
                      {isLow && (
                        <span className="pf-stk-low-tag">⚠️ Baixo</span>
                      )}
                    </div>
                    <div className="pf-stk-row-meta">
                      {item.category || "Geral"}
                      {item.supplier ? ` · 🏭 ${item.supplier}` : ""}
                      {item.barcode ? ` · 📊 ${item.barcode}` : ""}
                    </div>
                  </div>
                  <div className="pf-stk-row-qty">
                    <span className="pf-stk-qty-num">{item.quantity || 0}</span>
                    <span className="pf-stk-qty-unit">{item.unit || "un"}</span>
                  </div>
                  <div className="pf-stk-row-cost">
                    R${" "}
                    {((item.unitCost || 0) * (item.quantity || 0)).toFixed(2)}
                  </div>
                  <div className="pf-stk-row-actions">
                    <button
                      title="Entrada"
                      onClick={() =>
                        setShowAdjust({
                          id: item.id,
                          name: item.name,
                          type: "entrada",
                        })
                      }
                    >
                      📥
                    </button>
                    <button
                      title="Saída"
                      onClick={() =>
                        setShowAdjust({
                          id: item.id,
                          name: item.name,
                          type: "saida",
                        })
                      }
                    >
                      📤
                    </button>
                    <button
                      title="Editar"
                      onClick={() => {
                        setEditItem(item);
                        setShowModal(true);
                      }}
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <StockModal
          item={editItem}
          onSave={saveItem}
          onClose={() => {
            setShowModal(false);
            setEditItem(null);
          }}
        />
      )}
      {showAdjust && (
        <AdjustModal
          info={showAdjust}
          onAdjust={adjustStock}
          onClose={() => setShowAdjust(null)}
        />
      )}
    </div>
  );
}

function StockModal({ item, onSave, onClose }) {
  const [f, setF] = useState({
    name: item?.name || "",
    description: item?.description || "",
    category: item?.category || "geral",
    quantity: item?.quantity || 0,
    unit: item?.unit || "un",
    unitCost: item?.unitCost || 0,
    minStock: item?.minStock || 5,
    supplier: item?.supplier || "",
    barcode: item?.barcode || "",
  });
  const s = (k, v) => setF((p) => ({ ...p, [k]: v }));
  return (
    <div className="pf-stk-overlay" onClick={onClose}>
      <div className="pf-stk-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pf-stk-modal-hdr">
          <h3>{item ? "✏️ Editar" : "➕ Novo"} Item</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <form
          className="pf-stk-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              ...f,
              id: item?.id,
              quantity: parseFloat(f.quantity),
              unitCost: parseFloat(f.unitCost),
              minStock: parseFloat(f.minStock),
            });
          }}
        >
          <input
            placeholder="Nome *"
            value={f.name}
            onChange={(e) => s("name", e.target.value)}
            required
          />
          <textarea
            placeholder="Descrição"
            value={f.description}
            onChange={(e) => s("description", e.target.value)}
            rows={2}
          />
          <div className="pf-stk-form-row">
            <input
              placeholder="Categoria"
              value={f.category}
              onChange={(e) => s("category", e.target.value)}
            />
            <input
              placeholder="Fornecedor"
              value={f.supplier}
              onChange={(e) => s("supplier", e.target.value)}
            />
          </div>
          <div className="pf-stk-form-row">
            <input
              type="number"
              placeholder="Qtd"
              value={f.quantity}
              onChange={(e) => s("quantity", e.target.value)}
            />
            <select value={f.unit} onChange={(e) => s("unit", e.target.value)}>
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Custo R$"
              value={f.unitCost}
              onChange={(e) => s("unitCost", e.target.value)}
            />
          </div>
          <div className="pf-stk-form-row">
            <input
              type="number"
              placeholder="Estoque mínimo"
              value={f.minStock}
              onChange={(e) => s("minStock", e.target.value)}
            />
            <input
              placeholder="Código de barras"
              value={f.barcode}
              onChange={(e) => s("barcode", e.target.value)}
            />
          </div>
          <div className="pf-stk-modal-acts">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="pf-stk-save">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdjustModal({ info, onAdjust, onClose }) {
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");
  const isEntrada = info.type === "entrada";
  return (
    <div className="pf-stk-overlay" onClick={onClose}>
      <div
        className="pf-stk-modal pf-stk-modal-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pf-stk-modal-hdr">
          <h3>
            {isEntrada ? "📥 Entrada" : "📤 Saída"}: {info.name}
          </h3>
          <button onClick={onClose}>✕</button>
        </div>
        <form
          className="pf-stk-form"
          onSubmit={(e) => {
            e.preventDefault();
            const v = parseFloat(qty) || 0;
            if (!v) return;
            onAdjust(info.id, isEntrada ? v : -v, reason, info.type);
          }}
        >
          <input
            type="number"
            min="1"
            placeholder="Quantidade"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            required
            autoFocus
          />
          <input
            placeholder="Motivo (opcional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="pf-stk-modal-acts">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="pf-stk-save"
              style={{
                background: isEntrada
                  ? "linear-gradient(135deg,#10b981,#06b6d4)"
                  : "linear-gradient(135deg,#ef4444,#f59e0b)",
              }}
            >
              {isEntrada ? "Registrar Entrada" : "Registrar Saída"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
