/**
 * 🐼 PFDrivePanel — Google Drive Native Workspace
 * ================================================
 * Native file manager integrated directly into the canvas.
 * Not a Store plugin — it's a core workspace feature.
 *
 * Features:
 * - Dual view: "Panda Files" (dedicated folder) | "Explore Drive" (root)
 * - Breadcrumb navigation
 * - File operations: upload, download, share, move, trash
 * - Auto-provisioning of Panda Factory folder structure
 *
 * @version 1.0.0
 * @see callGAS.Drive namespace
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Drive } from "../services/callGAS";
import "../styles/PFDrivePanel.css";

// ── Folder Structure Template ──
const PANDA_FOLDERS = [
  { name: "Assets", icon: "🖼️", description: "Mídia, logos, banners" },
  { name: "Documents", icon: "📄", description: "Docs gerados" },
  { name: "Backups", icon: "💾", description: "Backups automáticos" },
  { name: "Exports", icon: "📊", description: "CRM, agenda exports" },
  { name: "Reports", icon: "📈", description: "Council, analytics" },
  { name: "Config", icon: "⚙️", description: "Workspace config" },
  { name: "Shared", icon: "🤝", description: "Compartilhados do time" },
];

// ── MIME Type Icons ──
const MIME_ICONS = {
  "application/pdf": "📕",
  "application/vnd.google-apps.document": "📝",
  "application/vnd.google-apps.spreadsheet": "📊",
  "application/vnd.google-apps.presentation": "📽️",
  "application/vnd.google-apps.folder": "📁",
  "image/": "🖼️",
  "video/": "🎥",
  "audio/": "🎵",
  "text/": "📄",
  "application/zip": "📦",
  "application/json": "🔧",
  default: "📎",
};

function getFileIcon(mimeType) {
  if (!mimeType) return MIME_ICONS.default;
  const exact = MIME_ICONS[mimeType];
  if (exact) return exact;
  for (const [prefix, icon] of Object.entries(MIME_ICONS)) {
    if (mimeType.startsWith(prefix)) return icon;
  }
  return MIME_ICONS.default;
}

function formatFileSize(bytes) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let size = Number(bytes);
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ── Main Component ──
export default function PFDrivePanel({ onClose }) {
  const [viewMode, setViewMode] = useState("panda"); // "panda" | "explore"
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([
    { id: "root", name: "Panda Factory" },
  ]);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [viewType, setViewType] = useState("grid"); // "grid" | "list"
  const fileInputRef = useRef(null);

  // ── Initialize Panda Folder ──
  const initPandaFolder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await Drive.initFounderFolder();
      if (result.status === "MOCK") {
        // GAS not connected — show demo structure
        setFiles(
          PANDA_FOLDERS.map((f, i) => ({
            id: `pf-folder-${i}`,
            name: f.name,
            mimeType: "application/vnd.google-apps.folder",
            icon: f.icon,
            description: f.description,
            modifiedTime: new Date().toISOString(),
            size: null,
            isFolder: true,
            isProtected: true,
          })),
        );
      } else if (result.status === "SUCCESS" || result.folderId) {
        // Real folder created/found — load its contents
        const filesLoaded = await loadFiles(result.folderId || "root");
        // If real folder is actually empty, show the template folders as "protected" shortcuts
        if (!filesLoaded || filesLoaded.length === 0) {
          setFiles(
            PANDA_FOLDERS.map((f, i) => ({
              id: `pf-folder-${i}`,
              name: f.name,
              mimeType: "application/vnd.google-apps.folder",
              icon: f.icon,
              description: f.description,
              modifiedTime: new Date().toISOString(),
              size: null,
              isFolder: true,
              isProtected: true,
            })),
          );
        }
      } else {
        setFiles(
          PANDA_FOLDERS.map((f, i) => ({
            id: `pf-folder-${i}`,
            name: f.name,
            mimeType: "application/vnd.google-apps.folder",
            icon: f.icon,
            description: f.description,
            modifiedTime: new Date().toISOString(),
            size: null,
            isFolder: true,
            isProtected: true,
          })),
        );
      }
      setInitialized(true);
    } catch (err) {
      setError("Falha ao inicializar Google Drive: " + err.message);
      // Fallback — show template folders
      setFiles(
        PANDA_FOLDERS.map((f, i) => ({
          id: `pf-folder-${i}`,
          name: f.name,
          mimeType: "application/vnd.google-apps.folder",
          icon: f.icon,
          description: f.description,
          modifiedTime: new Date().toISOString(),
          size: null,
          isFolder: true,
        })),
      );
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Load Files ──
  const loadFiles = useCallback(async (folderId = "root") => {
    try {
      setLoading(true);
      setError(null);
      const result = await Drive.listFiles(folderId);
      if (result.status === "MOCK") {
        // No real GAS connection — show error or empty state for Explore Mode
        setError("GAS não configurado ou desconectado.");
        setFiles([]);
        return;
      }
      if (result.status === "SUCCESS" && result.files) {
        const processedFiles = result.files.map((f) => ({
          ...f,
          isFolder: f.mimeType === "application/vnd.google-apps.folder",
          icon: getFileIcon(f.mimeType),
        }));
        setFiles(processedFiles);
        return processedFiles;
      }
      return [];
    } catch (err) {
      setError("Erro ao carregar arquivos: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Navigate into folder ──
  const navigateToFolder = useCallback(
    (folder) => {
      setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }]);
      loadFiles(folder.id);
    },
    [loadFiles],
  );

  // ── Navigate via breadcrumb ──
  const navigateToBreadcrumb = useCallback(
    (index) => {
      const crumb = breadcrumbs[index];
      setBreadcrumbs(breadcrumbs.slice(0, index + 1));
      if (index === 0 && viewMode === "panda") {
        initPandaFolder();
      } else {
        loadFiles(crumb.id);
      }
    },
    [breadcrumbs, viewMode, initPandaFolder, loadFiles],
  );

  // ── Switch view mode ──
  const switchMode = useCallback(
    (mode) => {
      setViewMode(mode);
      setSearch("");
      setSelectedFile(null);
      setContextMenu(null);
      if (mode === "panda") {
        setBreadcrumbs([{ id: "root", name: "Panda Factory" }]);
        initPandaFolder();
      } else {
        setBreadcrumbs([{ id: "root", name: "Google Drive" }]);
        loadFiles("root");
      }
    },
    [initPandaFolder, loadFiles],
  );

  // ── Boot ──
  useEffect(() => {
    initPandaFolder();
  }, [initPandaFolder]);

  // ── Context Menu ──
  const handleFileContextMenu = (e, file) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      type: "file",
      x: e.clientX,
      y: e.clientY,
      file,
    });
  };

  const handleDesktopContextMenu = (e) => {
    // Only trigger if clicking on the background, not on a file directly
    if (e.target.closest(".pf-drive-file-item")) return;
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      type: "desktop",
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Close context menu on click elsewhere
  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // ── File Actions ──
  const handleFileAction = async (action, file) => {
    setContextMenu(null);
    switch (action) {
      case "open":
        if (file.isFolder) {
          navigateToFolder(file);
        } else if (file.webViewLink) {
          window.open(file.webViewLink, "_blank");
        }
        break;
      case "share": {
        const result = await Drive.getShareLink(file.id);
        if (result.shareLink || result.link) {
          navigator.clipboard.writeText(result.shareLink || result.link);
          // TODO: show toast
        }
        break;
      }
      case "download":
        if (file.webContentLink) {
          window.open(file.webContentLink, "_blank");
        }
        break;
      case "copy":
      case "paste":
      case "rename":
        // TODO: Implement actual logic
        console.log(`Command ${action} on ${file.name}`);
        break;
      case "trash":
        if (file.isProtected) return; // Blocked
        console.log(`Trashing ${file.name}`);
        // TODO: callGAS logic
        break;
      default:
        break;
    }
  };

  // ── Desktop Actions ──
  const handleDesktopAction = (action) => {
    setContextMenu(null);
    switch (action) {
      case "refresh":
        loadFiles(breadcrumbs[breadcrumbs.length - 1].id);
        break;
      case "catalog":
        window.__pfWindowManager?.openApp("catalog");
        break;
      case "store":
        window.__pfWindowManager?.openApp("store");
        break;
      case "settings":
        window.__pfWindowManager?.openApp("settings");
        break;
      case "board":
        window.__pfWindowManager?.openApp("panda-board");
        break;
      default:
        console.log(`Desktop Action: ${action}`);
    }
  };

  // ── Upload ──
  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  // ── Filter ──
  const filteredFiles = files.filter((f) =>
    f.name?.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Sort: folders first, then alphabetical ──
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (a.isFolder && !b.isFolder) return -1;
    if (!a.isFolder && b.isFolder) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  return (
    <div className="pf-drive-panel">
      {/* ── HEADER ── */}
      <div className="pf-drive-header">
        <div className="pf-drive-header-left">
          <span className="pf-drive-icon">☁️</span>
          <h2 className="pf-drive-title">PANDA DRIVE</h2>
          <span className="pf-drive-badge">
            {loading ? "⏳" : `${files.length} itens`}
          </span>
        </div>
        <div className="pf-drive-header-right">
          <button
            className="pf-drive-btn pf-drive-btn-upload"
            onClick={handleUpload}
            title="UPLOAD"
          >
            ⬆️ UPLOAD
          </button>
          <button
            className={`pf-drive-btn pf-drive-view-btn ${viewType === "grid" ? "active" : ""}`}
            onClick={() => setViewType("grid")}
            title="Grid"
          >
            ▦
          </button>
          <button
            className={`pf-drive-btn pf-drive-view-btn ${viewType === "list" ? "active" : ""}`}
            onClick={() => setViewType("list")}
            title="Lista"
          >
            ☰
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          multiple
          onChange={(e) => {
            // TODO: implement upload via callGAS
            console.log("📤 Upload files:", e.target.files);
          }}
        />
      </div>

      {/* ── MODE TABS ── */}
      <div className="pf-drive-tabs">
        <button
          className={`pf-drive-tab ${viewMode === "panda" ? "active" : ""}`}
          onClick={() => switchMode("panda")}
        >
          📁 PANDA FILES
        </button>
        <button
          className={`pf-drive-tab ${viewMode === "explore" ? "active" : ""}`}
          onClick={() => switchMode("explore")}
        >
          🌐 EXPLORAR DRIVE
        </button>
        <div className="pf-drive-search-wrapper">
          <input
            className="pf-drive-search"
            type="text"
            placeholder="Buscar arquivos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── BREADCRUMBS ── */}
      <div className="pf-drive-breadcrumbs">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.id}>
            {i > 0 && <span className="pf-drive-breadcrumb-sep">›</span>}
            <button
              className={`pf-drive-breadcrumb ${i === breadcrumbs.length - 1 ? "current" : ""}`}
              onClick={() => navigateToBreadcrumb(i)}
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* ── ERROR ── */}
      {error && (
        <div className="pf-drive-error">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* ── LOADING ── */}
      {loading && (
        <div className="pf-drive-loading">
          <div className="pf-drive-spinner" />
          <span>Carregando arquivos...</span>
        </div>
      )}

      {/* ── FILE LIST/GRID ── */}
      {!loading && (
        <div
          className={`pf-drive-files ${viewType === "grid" ? "pf-drive-grid" : "pf-drive-list"}`}
          onContextMenu={handleDesktopContextMenu}
        >
          {sortedFiles.length === 0 && (
            <div className="pf-drive-empty">
              <span className="pf-drive-empty-icon">📂</span>
              <p>Nenhum arquivo encontrado</p>
              <button className="pf-drive-btn" onClick={handleUpload}>
                ⬆️ FAZER UPLOAD
              </button>
            </div>
          )}

          {/* HARDCODED SHORTCUTS (Desktop only) */}
          {viewMode === "panda" && breadcrumbs.length === 1 && (
            <div
              className="pf-drive-file-item folder"
              onDoubleClick={() => window.__pfWindowManager?.openApp("catalog")}
            >
              <span className="pf-drive-file-icon">📦</span>
              <div className="pf-drive-file-info">
                <span className="pf-drive-file-name">Catálogo de Apps</span>
                <span className="pf-drive-file-desc">
                  Meus aplicativos e módulos
                </span>
              </div>
            </div>
          )}

          {sortedFiles.map((file) => (
            <div
              key={file.id}
              className={`pf-drive-file-item ${selectedFile?.id === file.id ? "selected" : ""} ${file.isFolder ? "folder" : ""}`}
              onClick={() => setSelectedFile(file)}
              onDoubleClick={() =>
                file.isFolder
                  ? navigateToFolder(file)
                  : file.webViewLink && window.open(file.webViewLink, "_blank")
              }
              onContextMenu={(e) => handleFileContextMenu(e, file)}
            >
              <span className="pf-drive-file-icon">
                {file.icon || getFileIcon(file.mimeType)}
              </span>
              <div className="pf-drive-file-info">
                <span className="pf-drive-file-name">{file.name}</span>
                {file.description && (
                  <span className="pf-drive-file-desc">{file.description}</span>
                )}
                {viewType === "list" && (
                  <div className="pf-drive-file-meta">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatDate(file.modifiedTime)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CONTEXT MENU ── */}
      {contextMenu && contextMenu.type === "desktop" && (
        <div
          className="pf-drive-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={() => handleDesktopAction("new")}>
            📁 Nova Pasta
          </button>
          <button onClick={() => handleDesktopAction("board")}>
            🎨 Nova Lousa
          </button>
          <div className="pf-drive-context-sep" />
          <button onClick={() => handleDesktopAction("refresh")}>
            🔄 Atualizar
          </button>
          <button onClick={() => handleDesktopAction("organize")}>
            ✨ Organizar Ícones
          </button>
          <div className="pf-drive-context-sep" />
          <button onClick={() => handleDesktopAction("catalog")}>
            📁 Abrir Catálogo
          </button>
          <button onClick={() => handleDesktopAction("store")}>
            🏪 Panda Store
          </button>
          <button onClick={() => handleDesktopAction("settings")}>
            ⚙️ Configurações
          </button>
        </div>
      )}

      {contextMenu && contextMenu.type === "file" && (
        <div
          className="pf-drive-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={() => handleFileAction("open", contextMenu.file)}>
            {contextMenu.file.isFolder ? "📂 Abrir" : "🔗 Abrir"}
          </button>

          {!contextMenu.file.isProtected && (
            <>
              <button
                onClick={() => handleFileAction("copy", contextMenu.file)}
              >
                📋 Copiar
              </button>
              <button
                onClick={() => handleFileAction("rename", contextMenu.file)}
              >
                ✏️ Renomear
              </button>
            </>
          )}

          {!contextMenu.file.isFolder && (
            <button
              onClick={() => handleFileAction("download", contextMenu.file)}
            >
              ⬇️ Download
            </button>
          )}

          <button onClick={() => handleFileAction("share", contextMenu.file)}>
            🔗 Compartilhar
          </button>

          <div className="pf-drive-context-sep" />

          {!contextMenu.file.isProtected ? (
            <button
              className="pf-drive-context-danger"
              onClick={() => handleFileAction("trash", contextMenu.file)}
            >
              🗑️ Excluir
            </button>
          ) : (
            <button
              className="pf-drive-context-danger"
              disabled
              title="Pasta protegida do sistema"
              style={{ opacity: 0.5, cursor: "not-allowed" }}
            >
              🔒 Exclusão Bloqueada
            </button>
          )}
        </div>
      )}

      {/* ── STATUS BAR ── */}
      <div className="pf-drive-status">
        <span>
          {initialized ? "✅ Conectado" : "⏳ Conectando..."} •{" "}
          {sortedFiles.length} itens
        </span>
        <span className="pf-drive-status-mode">
          {viewMode === "panda" ? "📁 Panda Files" : "🌐 Google Drive"}
        </span>
      </div>
    </div>
  );
}
