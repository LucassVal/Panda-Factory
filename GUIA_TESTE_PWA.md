# 🐼 Guia de Teste: Panda CRM (PWA)

Como o TitanGestão agora é **Panda CRM** (Progressive Web App), ele funciona como um aplicativo nativo. Siga os passos abaixo para testar.

## 🖥️ 1. Teste no Desktop (Chrome/Edge)

1.  **Acesse o CRM:** Abra o arquivo `CRM.html` (ou a URL se já estiver hospedado).
2.  **Identifique o Ícone:** Olhe para a **barra de endereços** (lá em cima, perto da URL).
3.  **Botão de Instalar:** Você deve ver um ícone de um **computador com uma setinha para baixo** (ou um `+`).
    - _Dica:_ Se não aparecer, clique nos 3 pontinhos do navegador > "Salvar e compartilhar" > "Instalar Panda CRM".
4.  **Ação:** Clique em Instalar.
5.  **Resultado:** O CRM vai fechar a aba do navegador e abrir em uma **janela própria**, parecendo um programa do Windows, com o ícone do Panda na barra de tarefas!

## 📱 2. Teste no Android (Chrome)

1.  **Acesse o link** pelo Chrome no celular.
2.  **Banner Automático:** Geralmente aparece uma barra no fundo: _"Adicionar Panda CRM à tela inicial"_. Clique nela.
3.  **Menu:** Se não aparecer, toque nos 3 pontinhos > **"Adicionar à Tela Inicial"** (ou "Instalar App").
4.  **Resultado:** O ícone do Panda vai aparecer na home do seu Android. Ao abrir, ele roda em tela cheia (sem barra de navegador).

## 🍎 3. Teste no iPhone (iOS - Safari)

1.  **Acesse o link** pelo Safari.
2.  **Botão Compartilhar:** Toque no ícone de compartilhamento (quadrado com seta pra cima).
3.  **Role para baixo:** Procure a opção **"Adicionar à Tela de Início"** (+).
4.  **Confirmar:** Toque em "Adicionar".
5.  **Resultado:** O App do Panda estará na sua home.

## 📡 4. Teste Offline (Modo Avião)

1.  Com o App instalado (celular ou PC), **desligue a internet** (tire o cabo ou ponha modo avião).
2.  Feche o App e abra de novo.
3.  **Resultado Esperado:**
    - O App DEVE abrir normalmente (não pode dar o "Dinossauro" do Chrome).
    - Você deve conseguir navegar pelos clientes.
    - _Nota:_ O Sync com o Google Drive não funcionará, mas o App estará vivo!

## ⚠️ Solução de Problemas

- **Não aparece instalar?** Verifique se o `manifest.json` está na mesma pasta.
- **Não funciona offline?** O Service Worker pode demorar uns segundos para cachear na primeira vez. Deixe o app aberto por 10 segundos conectado antes de testar offline.
- **Ícone errado?** Limpe o cache do navegador (`Ctrl+Shift+R` no PC).
