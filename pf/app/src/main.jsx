import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/pf.css";
import init, * as pandaCore from "panda-core";

// 🛡️ Wasm Shield: Top-Level Await Init
await init();
console.log("🛡️", pandaCore.init_shield());

// Exporta o Wasm Shield globalmente para as APIs JS legadas/externas
window.PandaCore = pandaCore;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
