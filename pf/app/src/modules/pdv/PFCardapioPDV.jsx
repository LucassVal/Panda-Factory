import React, { useState, useEffect, useCallback } from "react";
import { gasPost } from "../../services/callGAS";
import "./PFCardapioPDV.css";

/* ═══════════════════════════════════════════════════════════
   PFCardapioPDV — MOD-06: Point of Sale + Digital Menu
   ═══════════════════════════════════════════════════════════ */

const PAYMENT_METHODS = [
  { id: "dinheiro", label: "💵 Dinheiro" },
  { id: "pix", label: "🟣 Pix" },
  { id: "credito", label: "💳 Crédito" },
  { id: "debito", label: "💳 Débito" },
];

export default function PFCardapioPDV({ onClose }) {
  const [tab, setTab] = useState("menu"); // menu | orders | newOrder
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dailyStats, setDailyStats] = useState({ total: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // ── Fetch ──
  const loadMenu = useCallback(async () => {
    try {
      const res = await gasPost("PDV_GET_MENU", {});
      if (res.status === "SUCCESS") setMenu(res.items || []);
    } catch (err) {
      console.error("[PDV]", err);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const res = await gasPost("PDV_LIST_ORDERS", {});
      if (res.status === "SUCCESS") {
        setOrders(res.orders || []);
        setDailyStats(res.dailyStats || { total: 0, count: 0 });
      }
    } catch (err) {
      console.error("[PDV]", err);
    }
  }, []);

  useEffect(() => {
    Promise.all([loadMenu(), loadOrders()]).then(() => setLoading(false));
  }, [loadMenu, loadOrders]);

  // ── Cart ──
  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists)
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );
      return [...prev, { ...item, qty: 1 }];
    });
    if (tab !== "newOrder") setTab("newOrder");
  };

  const updateCartQty = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.id === itemId ? { ...c, qty: Math.max(0, c.qty + delta) } : c,
        )
        .filter((c) => c.qty > 0),
    );
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // ── Create Order ──
  const createOrder = async (paymentMethod, customer) => {
    if (!cart.length) return;
    const order = {
      items: cart.map((c) => ({
        id: c.id,
        name: c.name,
        price: c.price,
        qty: c.qty,
        stockId: c.stockId || "",
      })),
      paymentMethod,
      customer,
    };
    await gasPost("PDV_CREATE_ORDER", { order });
    setCart([]);
    setTab("orders");
    loadOrders();
  };

  // ── Menu CRUD ──
  const saveMenuItem = async (item) => {
    await gasPost("PDV_UPSERT_MENU", { item });
    setShowItemModal(false);
    setEditItem(null);
    loadMenu();
  };

  // ── Group menu by category ──
  const groupedMenu = menu.reduce((acc, item) => {
    const cat = item.category || "Geral";
    (acc[cat] = acc[cat] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="pf-pdv">
      {/* Header */}
      <div className="pf-pdv-header">
        <div className="pf-pdv-title-row">
          <h2 className="pf-pdv-title">🍽️ Cardápio & PDV</h2>
          <span className="pf-pdv-badge">MOD-06</span>
          {onClose && (
            <button className="pf-pdv-close" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="pf-pdv-stats">
          <div className="pf-pdv-stat">
            <span className="pf-pdv-stat-val">{menu.length}</span>
            <span className="pf-pdv-stat-label">ITENS</span>
          </div>
          <div className="pf-pdv-stat">
            <span className="pf-pdv-stat-val">{dailyStats.count}</span>
            <span className="pf-pdv-stat-label">PEDIDOS HOJE</span>
          </div>
          <div className="pf-pdv-stat">
            <span className="pf-pdv-stat-val" style={{ color: "#10b981" }}>
              R${" "}
              {(dailyStats.total || 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="pf-pdv-stat-label">FATURAMENTO HOJE</span>
          </div>
          {cart.length > 0 && (
            <div
              className="pf-pdv-stat pf-pdv-stat-cart"
              onClick={() => setTab("newOrder")}
            >
              <span className="pf-pdv-stat-val" style={{ color: "#f59e0b" }}>
                🛒 {cart.length}
              </span>
              <span className="pf-pdv-stat-label">CARRINHO</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="pf-pdv-tabs">
          {[
            { id: "menu", label: "🍽️ Cardápio" },
            { id: "newOrder", label: "🛒 Novo Pedido" },
            { id: "orders", label: "📋 Pedidos" },
          ].map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? "active" : ""}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
          <button
            className="pf-pdv-add-item-btn"
            onClick={() => {
              setEditItem(null);
              setShowItemModal(true);
            }}
          >
            ➕ Item
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pf-pdv-content">
        {loading ? (
          <div className="pf-pdv-loading">
            <div className="pf-pdv-spinner" />
            <span>Carregando...</span>
          </div>
        ) : tab === "menu" ? (
          /* ── Menu ── */
          <div className="pf-pdv-menu">
            {Object.entries(groupedMenu).map(([cat, items]) => (
              <div key={cat} className="pf-pdv-category">
                <h3 className="pf-pdv-cat-title">{cat}</h3>
                <div className="pf-pdv-menu-grid">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`pf-pdv-menu-card ${!item.available ? "unavailable" : ""}`}
                    >
                      <div className="pf-pdv-menu-card-info">
                        <div className="pf-pdv-menu-card-name">{item.name}</div>
                        {item.description && (
                          <div className="pf-pdv-menu-card-desc">
                            {item.description}
                          </div>
                        )}
                        <div className="pf-pdv-menu-card-price">
                          R$ {(item.price || 0).toFixed(2)}
                        </div>
                      </div>
                      <div className="pf-pdv-menu-card-actions">
                        <button
                          onClick={() => {
                            setEditItem(item);
                            setShowItemModal(true);
                          }}
                        >
                          ✏️
                        </button>
                        {item.available && (
                          <button
                            className="pf-pdv-add-cart-btn"
                            onClick={() => addToCart(item)}
                          >
                            ➕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {menu.length === 0 && (
              <div className="pf-pdv-empty">
                <div style={{ fontSize: 48, opacity: 0.3 }}>🍽️</div>
                <p>Cardápio vazio</p>
              </div>
            )}
          </div>
        ) : tab === "newOrder" ? (
          /* ── New Order ── */
          <NewOrderView
            cart={cart}
            cartTotal={cartTotal}
            updateQty={updateCartQty}
            onSubmit={createOrder}
            menuItems={menu}
            addToCart={addToCart}
          />
        ) : (
          /* ── Orders ── */
          <div className="pf-pdv-orders">
            {orders.length === 0 && (
              <div className="pf-pdv-empty">
                <div style={{ fontSize: 48, opacity: 0.3 }}>📋</div>
                <p>Nenhum pedido</p>
              </div>
            )}
            {orders.map((ord) => (
              <div key={ord.id} className="pf-pdv-order-card">
                <div className="pf-pdv-order-header">
                  <span className="pf-pdv-order-id">#{ord.id.slice(-6)}</span>
                  <span className="pf-pdv-order-time">
                    {new Date(ord.createdAt).toLocaleString("pt-BR")}
                  </span>
                  <span
                    className={`pf-pdv-order-status pf-pdv-status-${ord.status}`}
                  >
                    {ord.status}
                  </span>
                </div>
                <div className="pf-pdv-order-items">
                  {(ord.items || []).map((it, i) => (
                    <span key={i} className="pf-pdv-order-item">
                      {it.qty}x {it.name}
                    </span>
                  ))}
                </div>
                <div className="pf-pdv-order-footer">
                  {ord.customer && <span>👤 {ord.customer}</span>}
                  <span className="pf-pdv-order-payment">
                    {PAYMENT_METHODS.find((p) => p.id === ord.paymentMethod)
                      ?.label || ord.paymentMethod}
                  </span>
                  <span className="pf-pdv-order-total">
                    R$ {(ord.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu Item Modal */}
      {showItemModal && (
        <MenuItemModal
          item={editItem}
          onSave={saveMenuItem}
          onClose={() => {
            setShowItemModal(false);
            setEditItem(null);
          }}
        />
      )}
    </div>
  );
}

/* ── New Order View ── */
function NewOrderView({
  cart,
  cartTotal,
  updateQty,
  onSubmit,
  menuItems,
  addToCart,
}) {
  const [payment, setPayment] = useState("pix");
  const [customer, setCustomer] = useState("");

  return (
    <div className="pf-pdv-new-order">
      <div className="pf-pdv-order-left">
        <h4>🍽️ Adicionar ao pedido</h4>
        <div className="pf-pdv-quick-menu">
          {menuItems
            .filter((i) => i.available !== false)
            .map((item) => (
              <button
                key={item.id}
                className="pf-pdv-quick-item"
                onClick={() => addToCart(item)}
              >
                <span>{item.name}</span>
                <span style={{ color: "#10b981" }}>
                  R$ {(item.price || 0).toFixed(2)}
                </span>
              </button>
            ))}
        </div>
      </div>
      <div className="pf-pdv-order-right">
        <h4>🛒 Carrinho ({cart.length})</h4>
        <div className="pf-pdv-cart-items">
          {cart.map((c) => (
            <div key={c.id} className="pf-pdv-cart-row">
              <span className="pf-pdv-cart-name">{c.name}</span>
              <div className="pf-pdv-cart-qty">
                <button onClick={() => updateQty(c.id, -1)}>−</button>
                <span>{c.qty}</span>
                <button onClick={() => updateQty(c.id, 1)}>+</button>
              </div>
              <span className="pf-pdv-cart-price">
                R$ {(c.price * c.qty).toFixed(2)}
              </span>
            </div>
          ))}
          {cart.length === 0 && (
            <p style={{ color: "#475569", textAlign: "center" }}>
              Carrinho vazio
            </p>
          )}
        </div>
        <div className="pf-pdv-checkout">
          <input
            placeholder="👤 Nome do cliente (opcional)"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
          <div className="pf-pdv-payment-row">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                className={payment === m.id ? "active" : ""}
                onClick={() => setPayment(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="pf-pdv-total-row">
            <span>TOTAL:</span>
            <span className="pf-pdv-total-value">
              R$ {cartTotal.toFixed(2)}
            </span>
          </div>
          <button
            className="pf-pdv-finalize-btn"
            disabled={cart.length === 0}
            onClick={() => createOrderAndClear()}
          >
            ✅ Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );

  function createOrderAndClear() {
    onSubmit(payment, customer);
    setCustomer("");
    setPayment("pix");
  }
}

/* ── Menu Item Modal ── */
function MenuItemModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || "",
    category: item?.category || "geral",
    available: item?.available !== false,
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="pf-pdv-overlay" onClick={onClose}>
      <div className="pf-pdv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pf-pdv-modal-header">
          <h3>{item ? "✏️ Editar Item" : "➕ Novo Item"}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <form
          className="pf-pdv-modal-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              ...form,
              id: item?.id,
              price: parseFloat(form.price) || 0,
            });
          }}
        >
          <input
            placeholder="Nome do item *"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
          <textarea
            placeholder="Descrição"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
          />
          <div className="pf-pdv-form-row">
            <input
              type="number"
              step="0.01"
              placeholder="Preço (R$)"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
            />
            <input
              placeholder="Categoria"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            />
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#94a3b8",
            }}
          >
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => set("available", e.target.checked)}
            />{" "}
            Disponível
          </label>
          <div className="pf-pdv-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="pf-pdv-cancel-btn"
            >
              Cancelar
            </button>
            <button type="submit" className="pf-pdv-save-btn">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
