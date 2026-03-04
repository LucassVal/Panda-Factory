/**
 * 🏢 PandaCRM v2.0 — Consolidado (CRM + Agenda + Estoque)
 *
 * Módulo core unificado contendo gestão de leads, agendamentos e inventário.
 * Substitui os 3 módulos anteriores, agrupando funcionalidades afins.
 *
 * @version 2.0.0
 * @see SPRINT_ETAPA1_FASE2.md
 */

import React, { useState } from "react";
import PFFunnelView from "./views/PFFunnelView";
import PFAgendaView from "./views/PFAgendaView";
import PFStockView from "./views/PFStockView";
import "./PandaCRM.css";

import {
  RiFileList3Line,
  RiCalendarEventLine,
  RiOrganizationChart,
} from "react-icons/ri";
import { FiBox } from "react-icons/fi";

// ── Icons (Inline SVG) ──
const IconPipeline = () => <RiFileList3Line size={20} />;
const IconAgenda = () => <RiCalendarEventLine size={20} />;
const IconStock = () => <FiBox size={20} />;

export default function PandaCRM({ onClose }) {
  const [activeTab, setActiveTab] = useState("pipeline"); // 'pipeline' | 'agenda' | 'stock'

  // Sidebar Menu Items
  const MENU_ITEMS = [
    { id: "pipeline", label: "Contatos e Funil", icon: <IconPipeline /> },
    { id: "agenda", label: "Agenda", icon: <IconAgenda /> },
    { id: "stock", label: "Estoque", icon: <IconStock /> },
  ];

  return (
    <div className="crm-master-layout">
      {/* ── Sidebar ── */}
      <div className="crm-master-sidebar">
        <div className="crm-master-brand">
          <div className="crm-master-logo">
            <RiOrganizationChart size={28} color="#818cf8" />
          </div>
          <div className="crm-master-title">
            <h3>Panda CRM</h3>
            <span>Workspace Integrado</span>
          </div>
        </div>

        <nav className="crm-master-nav">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`crm-master-nav-btn ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="crm-nav-icon">{item.icon}</div>
              <span className="crm-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── Main Content Area ── */}
      <div className="crm-master-content">
        {/* We reuse the components logic but hide their native close buttons via prompt or wrap them */}
        {activeTab === "pipeline" && <PFFunnelView onClose={onClose} />}
        {activeTab === "agenda" && <PFAgendaView onClose={onClose} />}
        {activeTab === "stock" && <PFStockView onClose={onClose} />}
      </div>
    </div>
  );
}
