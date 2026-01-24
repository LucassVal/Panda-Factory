"""
🏛️ PANDA COUNCIL ORCHESTRATOR (Gemini-Only)
Multi-Agent System using only Google Gemini APIs

Usage:
    python panda_orchestrator.py "Implementar feature X"
    
Agents (all Gemini):
- Gemini 3 Pro (Architect) - Complex reasoning
- Gemini 3 Flash (Auditor) - Fast review
- Gemini 3 Pro (Implementer) - Code generation
"""

import os
import json
import asyncio
from typing import Optional
import google.generativeai as genai

# ==========================================
# CONFIG
# ==========================================
CONFIG = {
    # Models for each role
    "architect_model": "gemini-3-pro-preview",     # Deep reasoning
    "auditor_model": "gemini-3-flash-latest",      # Fast review
    "implementer_model": "gemini-3-pro-preview",   # Code generation
    
    "max_output_tokens": 8192,
    "docs_path": "docs/",
    "output_path": "council_output/",
}

# ==========================================
# LOAD API KEY
# ==========================================
GEMINI_KEY = os.getenv("GEMINI_API_KEY") or "AIzaSyB7fd4wjaco1d8glU9UkWaCisC-mbU5EUw"
genai.configure(api_key=GEMINI_KEY)

# ==========================================
# AGENT CALLS
# ==========================================

async def call_gemini(prompt: str, system: str = "", model_name: str = None) -> str:
    """Call Gemini with specified model"""
    model_name = model_name or CONFIG["architect_model"]
    
    try:
        model = genai.GenerativeModel(
            model_name,
            system_instruction=system if system else None
        )
        
        response = await asyncio.to_thread(
            model.generate_content,
            prompt,
            generation_config=genai.GenerationConfig(
                max_output_tokens=CONFIG["max_output_tokens"]
            )
        )
        return response.text
    except Exception as e:
        print(f"⚠️ Error with {model_name}: {e}")
        # Fallback to flash
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = await asyncio.to_thread(model.generate_content, prompt)
        return response.text

# ==========================================
# WORKFLOW PHASES
# ==========================================

async def phase_1_architect(objective: str, docs_context: str) -> str:
    """Phase 1: Gemini 3 Pro creates architecture"""
    print("\n🏗️ PHASE 1: Architecture (Gemini 3 Pro)")
    print("-" * 40)
    
    system = """Você é o ARQUITETO no Panda Council.
Seu papel: Criar arquitetura completa para o objetivo dado.
Saída: Markdown com:
- Visão geral do sistema
- Estrutura de arquivos
- Interfaces dos componentes
- Fluxo de dados
- Dependências"""

    prompt = f"""OBJETIVO: {objective}

CONTEXTO DOS DOCS:
{docs_context[:8000]}

Crie a arquitetura completa em markdown."""
    
    result = await call_gemini(prompt, system, CONFIG["architect_model"])
    print("✅ Arquitetura criada")
    return result

async def phase_2_audit(architecture: str) -> tuple[bool, str]:
    """Phase 2: Gemini 3 Flash audits (fast)"""
    print("\n🔍 PHASE 2: Auditoria (Gemini 3 Flash)")
    print("-" * 40)
    
    system = """Você é o AUDITOR no Panda Council.
Seu papel: Revisar criticamente a arquitetura.
Verificar:
- Falhas de lógica
- Vulnerabilidades de segurança
- Problemas de performance
- Requisitos faltando

Se há problemas: "🔴 REFAZER" + lista de issues
Se aprovado: "🟢 APROVADO" + resumo do test_plan"""

    prompt = f"""Revise esta arquitetura:

{architecture}

Dê seu veredito: APROVADO ou REFAZER?"""
    
    result = await call_gemini(prompt, system, CONFIG["auditor_model"])
    approved = "🟢" in result or "APROVADO" in result.upper()
    print(f"{'✅ Aprovado' if approved else '⚠️ Precisa refazer'}")
    return approved, result

async def phase_3_implement(architecture: str, audit_notes: str) -> str:
    """Phase 3: Gemini 3 Pro implements code"""
    print("\n⚙️ PHASE 3: Implementação (Gemini 3 Pro)")
    print("-" * 40)
    
    system = """Você é o IMPLEMENTADOR no Panda Council.
Seu papel: Escrever código de produção seguindo a arquitetura.
Regras:
- Seguir arquitetura exatamente
- Código limpo e documentado
- Tratamento de erros incluído
- Pronto para rodar
- Usar JavaScript/Python conforme apropriado"""

    prompt = f"""ARQUITETURA:
{architecture}

NOTAS DA AUDITORIA:
{audit_notes}

Implemente o código completo. Inclua todos os arquivos necessários."""
    
    result = await call_gemini(prompt, system, CONFIG["implementer_model"])
    print("✅ Implementação completa")
    return result

# ==========================================
# ORCHESTRATOR
# ==========================================

async def run_council(objective: str) -> dict:
    """Run the full Panda Council workflow"""
    print("\n" + "=" * 50)
    print("🏛️ PANDA COUNCIL ATIVADO (Gemini-Only)")
    print("=" * 50)
    print(f"\n📋 Objetivo: {objective}")
    
    # Load docs context
    docs_context = ""
    docs_files = ["PF_MASTER_ARCHITECTURE.md", "PF_SDK_REFERENCE.md"]
    for doc in docs_files:
        path = os.path.join(CONFIG["docs_path"], doc)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                docs_context += f"\n\n# {doc}\n{f.read()[:5000]}"
    
    if not docs_context:
        docs_context = "Nenhum documento de contexto encontrado."
    
    # Phase 1: Architecture
    architecture = await phase_1_architect(objective, docs_context)
    
    # Phase 2: Audit (with retry loop)
    max_retries = 2
    for attempt in range(max_retries + 1):
        approved, audit_result = await phase_2_audit(architecture)
        if approved:
            break
        if attempt < max_retries:
            print(f"\n🔄 Retry {attempt + 1}: Refinando arquitetura...")
            architecture = await phase_1_architect(
                f"{objective}\n\nPROBLEMAS ANTERIORES:\n{audit_result}",
                docs_context
            )
    
    if not approved:
        return {
            "status": "BLOCKED",
            "reason": "Arquitetura não aprovada após retentativas",
            "audit_result": audit_result
        }
    
    # Phase 3: Implementation
    implementation = await phase_3_implement(architecture, audit_result)
    
    print("\n" + "=" * 50)
    print("✅ COUNCIL COMPLETE")
    print("=" * 50)
    
    return {
        "status": "SUCCESS",
        "architecture": architecture,
        "audit": audit_result,
        "implementation": implementation
    }

# ==========================================
# CLI
# ==========================================

def save_output(result: dict, objective: str):
    """Save outputs to files"""
    os.makedirs(CONFIG["output_path"], exist_ok=True)
    
    # Save full JSON
    with open(os.path.join(CONFIG["output_path"], "council_result.json"), "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    if result["status"] == "SUCCESS":
        # Save individual files
        with open(os.path.join(CONFIG["output_path"], "architecture.md"), "w", encoding="utf-8") as f:
            f.write(f"# Arquitetura: {objective}\n\n{result['architecture']}")
        
        with open(os.path.join(CONFIG["output_path"], "audit.md"), "w", encoding="utf-8") as f:
            f.write(f"# Auditoria\n\n{result['audit']}")
        
        with open(os.path.join(CONFIG["output_path"], "implementation.md"), "w", encoding="utf-8") as f:
            f.write(f"# Implementação\n\n{result['implementation']}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("🏛️ PANDA COUNCIL - Gemini-Only Multi-Agent")
        print("-" * 40)
        print("Uso: python panda_orchestrator.py 'Seu objetivo aqui'")
        print("\nExemplo:")
        print("  python panda_orchestrator.py 'Criar componente OmniBar'")
        sys.exit(1)
    
    objective = " ".join(sys.argv[1:])
    result = asyncio.run(run_council(objective))
    
    # Save outputs
    save_output(result, objective)
    
    print(f"\n📁 Outputs salvos em: {CONFIG['output_path']}")
    print(f"📊 Status: {result['status']}")
    
    if result["status"] == "SUCCESS":
        print("\n📄 Arquivos gerados:")
        print("  - architecture.md")
        print("  - audit.md")
        print("  - implementation.md")
