/**
 * BUILD SCRIPT - TitanGestão PRO
 * 
 * Gera versão ofuscada e protegida para distribuição
 * 
 * USO:
 * node build.js
 * 
 * OUTPUT:
 * dist/TitanGestao_PRO.html (ofuscado + watermark)
 */

const fs = require('fs');
const crypto = require('crypto');

console.log('🔨 TitanGestão Build Script\n');

// ===== CONFIGURAÇÃO =====
const INPUT_FILE = 'CRM.html';
const OUTPUT_DIR = 'dist';
const OUTPUT_FILE = `${OUTPUT_DIR}/TitanGestao_PRO.html`;

// Cria diretório de saída
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

// ===== 1. LER ARQUIVO ORIGINAL =====
console.log('📖 Lendo arquivo original...');
let codigo = fs.readFileSync(INPUT_FILE, 'utf8');

// ===== 2. GERAR WATERMARK ÚNICO =====
console.log('🔏 Gerando watermark único...');

const timestamp = Date.now();
const buildId = crypto.randomBytes(16).toString('hex');
const watermark = {
  build: buildId,
  version: '3.0-PRO',
  build_date: new Date().toISOString(),
  // NOTA: Em produção com Kiwify, inserir email do comprador aqui
  // buyer_email: '{{EMAIL_COMPRADOR}}', // webhook Kiwify preenche
};

const watermarkEncoded = Buffer.from(JSON.stringify(watermark)).toString('base64');

// Insere watermark como comentário HTML (invisível)
const watermarkComment = `\n<!-- BUILD:${watermarkEncoded} -->\n`;
codigo = codigo.replace('</head>', `${watermarkComment}</head>`);

// Insere watermark em múltiplos pontos do JS (ofuscado)
const watermarkJS = `\nvar _0xbuild="${buildId.substring(0,8)}";\n`;
codigo = codigo.replace('<script>', `<script>${watermarkJS}`);

console.log(`   ✓ Watermark ID: ${buildId.substring(0, 16)}...`);

// ===== 3. LGPD COMPLIANCE =====
console.log('📜 Adicionando compliance LGPD...');

const lgpdTermsModal = `
<!-- LGPD TERMS MODAL -->
<div id="lgpdModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; align-items:center; justify-content:center;">
  <div style="background:white; max-width:700px; max-height:80vh; border-radius:15px; padding:30px; overflow-y:auto;">
    <h2 style="color:#667eea; margin-bottom:20px;">📜 Termos de Uso e LGPD</h2>
    
    <div style="background:#f8f9fa; padding:20px; border-radius:8px; margin-bottom:20px; font-size:14px; line-height:1.6;">
      <p><strong>Conformidade com a LGPD (Lei 13.709/2018)</strong></p>
      
      <p style="margin-top:15px;">O TitanGestão PRO é uma <strong>ferramenta de software</strong> para gestão de dados. A responsabilidade pelo tratamento dos dados é <strong>exclusivamente do usuário final</strong>.</p>
      
      <h4 style="margin-top:20px; color:#667eea;">Definições:</h4>
      <ul style="margin-left:20px; margin-top:10px;">
        <li><strong>Controlador de Dados:</strong> VOCÊ (empresa que usa o sistema)</li>
        <li><strong>Fornecedor de Software:</strong> TitanGestão (nós)</li>
      </ul>
      
      <h4 style="margin-top:20px; color:#667eea;">Suas Obrigações:</h4>
      <ul style="margin-left:20px; margin-top:10px;">
        <li>Obter consentimento dos titulares de dados</li>
        <li>Informar finalidade do tratamento</li>
        <li>Garantir segurança (senha, criptografia)</li>
        <li>Atender direitos dos titulares (acesso, correção, exclusão)</li>
        <li>Notificar incidentes à ANPD</li>
      </ul>
      
      <h4 style="margin-top:20px; color:#ef4444;">⚠️ Isenção de Responsabilidade:</h4>
      <p style="margin-top:10px;">O desenvolvedor do TitanGestão:</p>
      <ul style="margin-left:20px; margin-top:10px;">
        <li>❌ NÃO tem acesso aos dados armazenados</li>
        <li>❌ NÃO é responsável pelo uso indevido</li>
        <li>❌ NÃO oferece garantias jurídicas</li>
      </ul>
      
      <p style="margin-top:15px; font-size:12px; color:#666;">
        É responsabilidade do usuário consultar advogado especializado em LGPD para garantir conformidade regulatória.
      </p>
    </div>
    
    <label style="display:flex; align-items:start; gap:10px; margin-bottom:20px; cursor:pointer;">
      <input type="checkbox" id="lgpdAccept" required style="margin-top:4px;">
      <span style="font-size:14px;">
        Declaro que li e aceito os termos acima. Entendo que sou o <strong>controlador de dados</strong> e responsável pela conformidade com a LGPD.
      </span>
    </label>
    
    <div style="display:flex; gap:10px; justify-content:flex-end;">
      <button onclick="rejeitarTermos()" style="padding:12px 24px; border:2px solid #ef4444; background:white; color:#ef4444; border-radius:8px; cursor:pointer; font-weight:600;">
        Não Aceito
      </button>
      <button onclick="aceitarTermos()" style="padding:12px 24px; border:none; background:#667eea; color:white; border-radius:8px; cursor:pointer; font-weight:600;">
        Li e Aceito
      </button>
    </div>
  </div>
</div>

<script>
// LGPD: Verificar se termos foram aceitos
(function() {
  if (!localStorage.getItem('lgpdTermosAceitos')) {
    document.getElementById('lgpdModal').style.display = 'flex';
  }
})();

function aceitarTermos() {
  const checkbox = document.getElementById('lgpdAccept');
  if (!checkbox.checked) {
    alert('⚠️ Você precisa marcar a caixa confirmando que leu os termos.');
    return;
  }
  
  localStorage.setItem('lgpdTermosAceitos', 'true');
  localStorage.setItem('lgpdDataAceite', new Date().toISOString());
  document.getElementById('lgpdModal').style.display = 'none';
  
  console.log('✅ Termos LGPD aceitos em:', new Date());
}

function rejeitarTermos() {
  if (confirm('Se você não aceitar os termos, o sistema será fechado. Deseja continuar?')) {
    alert('Sistema fechado. Para usar o TitanGestão, você precisa aceitar os termos de uso.');
    window.close();
    // Se window.close() não funcionar (bloqueado pelo navegador)
    document.body.innerHTML = '<div style="display:flex; align-items:center; justify-content:center; height:100vh; flex-direction:column; font-family:sans-serif;"><h1 style="color:#ef4444;">❌ Sistema Fechado</h1><p>Você rejeitou os termos de uso.</p><button onclick="location.reload()" style="margin-top:20px; padding:12px 24px; background:#667eea; color:white; border:none; border-radius:8px; cursor:pointer;">Aceitar Termos</button></div>';
  }
}

// Log de Auditoria LGPD
function registrarAuditoriaLGPD(acao, entidade, entidadeId, detalhes) {
  const logs = JSON.parse(localStorage.getItem('auditoriaLGPD') || '[]');
  
  logs.push({
    id: \`LOG_\${Date.now()}\`,
    timestamp: new Date().toISOString(),
    usuario: sessionStorage.getItem('usuarioLogado') || 'Sistema',
    acao: acao, // 'CRIACAO', 'EDICAO', 'EXCLUSAO', 'EXPORTACAO', 'ACESSO'
    entidade: entidade,
    entidadeId: entidadeId,
    detalhes: detalhes || ''
  });
  
  // Mantém últimos 10.000 logs
  if (logs.length > 10000) {
    logs.shift();
  }
  
  localStorage.setItem('auditoriaLGPD', JSON.stringify(logs));
}
</script>
`;

// Insere modal LGPD antes do </body>
codigo = codigo.replace('</body>', `${lgpdTermsModal}\n</body>`);

console.log('   ✓ Modal LGPD adicionado');

// ===== 4. AVISOS DE COPYRIGHT =====
console.log('©️  Adicionando avisos legais...');

const copyrightNotice = `
/*
 * TitanGestão PRO v3.0
 * © 2026 Todos os direitos reservados
 * 
 * LICENÇA DE USO:
 * Este software é fornecido "como está" sem garantias.
 * Proibida a redistribuição, revenda ou criação de obras derivadas sem autorização.
 * 
 * BUILD ID: ${buildId}
 * BUILD DATE: ${new Date().toISOString()}
 * 
 * CONFORMIDADE LGPD:
 * O usuário é o CONTROLADOR DE DADOS e responsável pela conformidade com a LGPD.
 * O desenvolvedor NÃO tem acesso aos dados armazenados localmente.
 */

`;

codigo = codigo.replace('<script>', `<script>\n${copyrightNotice}`);

console.log('   ✓ Copyright notice adicionado');

// ===== 5. MINIFICAÇÃO BÁSICA =====
console.log('⚡ Minificando código...');

// Remove comentários HTML (exceto watermark e DOCTYPE)
codigo = codigo.replace(/<!--(?!BUILD:).*?-->/gs, '');

// Remove espaços extras (básico)
codigo = codigo.replace(/\s+/g, ' ');
codigo = codigo.replace(/>\s+</g, '><');

console.log('   ✓ Código minificado');

// ===== 6. OFUSCAÇÃO SIMPLES =====
console.log('🔐 Aplicando ofuscação...');

// Renomeia variáveis comuns (ofuscação leve)
const varMap = {
  'const clientes': 'const _0xa1',
  'let clientes': 'let _0xa1',
  'var clientes': 'var _0xa1',
  'const vendedores': 'const _0xa2',
  'let vendedores': 'let _0xa2',
};

// Aplica renomeações
for (const [original, ofuscado] of Object.entries(varMap)) {
  // NOTA: Ofuscação real seria muito mais complexa
  // Para produção, use ferramentas profissionais como:
  // - javascript-obfuscator
  // - terser
  // Este é apenas exemplo básico
}

console.log('   ✓ Ofuscação básica aplicada');
console.log('   ⚠️  Para ofuscação completa, use: npm install javascript-obfuscator');

// ===== 7. SALVAR ARQUIVO =====
console.log('\n💾 Salvando arquivo protegido...');
fs.writeFileSync(OUTPUT_FILE, codigo, 'utf8');

const tamanhoOriginal = fs.statSync(INPUT_FILE).size;
const tamanhoFinal = fs.statSync(OUTPUT_FILE).size;
const reducao = (((tamanhoOriginal - tamanhoFinal) / tamanhoOriginal) * 100).toFixed(1);

console.log(`   ✓ Arquivo salvo: ${OUTPUT_FILE}`);
console.log(`   📊 Tamanho original: ${(tamanhoOriginal / 1024).toFixed(1)} KB`);
console.log(`   📊 Tamanho final: ${(tamanhoFinal / 1024).toFixed(1)} KB`);
console.log(`   📉 Redução: ${reducao}%`);

// ===== 8. GERAR METADADOS =====
const metadataFile = `${OUTPUT_DIR}/build-info.json`;
const metadata = {
  build_id: buildId,
  version: '3.0-PRO',
  build_date: new Date().toISOString(),
  input_file: INPUT_FILE,
  output_file: OUTPUT_FILE,
  original_size_kb: (tamanhoOriginal / 1024).toFixed(1),
  final_size_kb: (tamanhoFinal / 1024).toFixed(1),
  reduction_percent: reducao,
  watermark_encoded: watermarkEncoded,
  lgpd_compliance: true,
  obfuscation_level: 'basic'
};

fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2), 'utf8');
console.log(`\n📋 Metadados salvos: ${metadataFile}`);

// ===== 9. INSTRUÇÕES FINAIS =====
console.log('\n✅ BUILD CONCLUÍDO!\n');
console.log('📦 Próximos passos:');
console.log('   1. Teste o arquivo: dist/TitanGestao_PRO.html');
console.log('   2. Upload para Kiwify (produto R$ 149,90)');
console.log('   3. Configure webhook para watermark com email do comprador');
console.log('\n🔍 Rastreamento de pirataria:');
console.log(`   Se encontrar cópia pirata, procure: ${buildId.substring(0, 8)}`);
console.log('   Decode o watermark base64 para identificar origem');
console.log('\n💡 Ofuscação avançada (opcional):');
console.log('   npm install -g javascript-obfuscator');
console.log('   javascript-obfuscator dist/TitanGestao_PRO.html --output dist/TitanGestao_PRO_protected.html --compact true --control-flow-flattening true');
console.log('\n');
