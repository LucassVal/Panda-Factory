/**
 * Panda Assistant - AI Controller
 * Gerencia o chat flutuante e a lógica de ingestão de arquivos.
 */

window.AiAssistant = {
  isOpen: false,

  init: function () {
    this.renderButton();
    this.renderChatWindow();
    this.bindEvents();
    console.log("🐼 Panda Assistant inicializado!");
  },

  toggle: function () {
    this.isOpen = !this.isOpen;
    const chatWindow = document.getElementById("panda-chat-window");
    const fab = document.getElementById("panda-fab");

    if (this.isOpen) {
      chatWindow.style.display = "flex";
      chatWindow.classList.add("fade-in");
      fab.style.display = "none";
      this.addMessage(
        "panda",
        "Olá! Sou o Panda. 🐼\nArraste arquivos (PDF/Excel) aqui para eu importar.",
      );
    } else {
      chatWindow.style.display = "none";
      fab.style.display = "flex";
    }
  },

  addMessage: function (sender, text, actions = null) {
    const messagesArea = document.getElementById("panda-messages");
    const msgDiv = document.createElement("div");
    msgDiv.className = `panda-msg ${sender}`;
    msgDiv.innerHTML = `<div class="msg-bubble">${text.replace(/\n/g, "<br>")}</div>`;

    if (actions) {
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "panda-actions";
      actions.forEach((action) => {
        const btn = document.createElement("button");
        btn.className = "panda-btn-small";
        btn.textContent = action.label;
        btn.onclick = action.callback;
        actionsDiv.appendChild(btn);
      });
      msgDiv.appendChild(actionsDiv);
    }

    messagesArea.appendChild(msgDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  },

  simulateAnalysis: async function (file) {
    this.addMessage("panda", "🧐 Analisando arquivo...");

    // Simulação de delay (IA pensando)
    await new Promise((r) => setTimeout(r, 2000));

    // Mock de resultado
    const mockResult = {
      novosCampos: ["Profissão", "Time de Futebol"],
      clientesEncontrados: 5,
    };

    this.addMessage(
      "panda",
      `Encontrei ${mockResult.clientesEncontrados} clientes!`,
    );
    this.addMessage(
      "panda",
      `⚠️ Notei campos novos: <b>${mockResult.novosCampos.join(", ")}</b>.\nPosso criar essas colunas no sistema?`,
      [
        {
          label: "✅ Sim, criar colunas",
          callback: () => this.confirmarIngestao(mockResult),
        },
        {
          label: "❌ Cancelar",
          callback: () => this.addMessage("user", "Cancelar"),
        },
      ],
    );
  },

  confirmarIngestao: async function (data) {
    this.addMessage("user", "Sim, criar colunas.");
    this.addMessage("panda", "🛠️ Criando estrutura e importando...");

    // Aqui chamaremos o Repository real futuramente
    await new Promise((r) => setTimeout(r, 1500));

    this.addMessage(
      "panda",
      "✅ Pronto! Clientes importados e banco atualizado.",
    );
  },

  // --- RENDERERS ---

  renderButton: function () {
    // Tenta encontrar botão existente primeiro para evitar duplicação e conflito de estilos
    let btn = document.getElementById("panda-fab");

    if (!btn) {
      btn = document.createElement("div");
      btn.id = "panda-fab";
      btn.innerHTML = "🐼";
      // Só adiciona evento se criou o botão. Se já existe, assume que o HTML controla (OmniBar) ou adicionaremos listener extra.
      btn.onclick = () => this.toggle();
      document.body.appendChild(btn);
    } else {
      // Opcional: Se quiser que o botão TAMBÉM abra o chat (com Double Click ou algo assim), adicione aqui.
      // Por enquanto, respeitamos o onclick="toggleOmniBar()" do HTML para não quebrar a OmniBar.
      console.log(
        "🐼 Panda Assistant: Botão FAB existente encontrado. Usando-o.",
      );
    }
  },

  renderChatWindow: function () {
    const win = document.createElement("div");
    win.id = "panda-chat-window";
    win.innerHTML = `
            <div class="panda-header">
                <span>🐼 Panda Assistant</span>
                <button onclick="window.AiAssistant.toggle()">✖</button>
            </div>
            <div class="panda-messages" id="panda-messages"></div>
            <div class="panda-input-area" id="panda-drop-zone">
                <input type="text" placeholder="Digite ou arraste arquivos..." id="panda-input">
                <button>➤</button>
            </div>
        `;
    document.body.appendChild(win);
  },

  bindEvents: function () {
    const dropZone = document.getElementById("panda-drop-zone");

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.style.background = "#eef2ff";
    });

    dropZone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dropZone.style.background = "white";
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.style.background = "white";
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileUpload(files[0]);
      }
    });

    // Chat Input Events
    const input = document.getElementById("panda-input");
    const sendBtn = document.querySelector("#panda-drop-zone button");

    const sendMessage = () => {
      const text = input.value.trim();
      if (text) {
        this.addMessage("user", text);
        input.value = "";
        // Simulation response
        setTimeout(() => {
          this.addMessage(
            "panda",
            "Por enquanto só sei ler arquivos! 📄\nArraste um PDF ou Excel para eu analisar.",
          );
        }, 1000);
      }
    };

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  },

  handleFileUpload: function (file) {
    this.addMessage("user", `📂 Enviando: ${file.name}`);
    this.simulateAnalysis(file);
  },
};
