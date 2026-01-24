"""
🏛️ PANDA COUNCIL ORCHESTRATOR
Multi-Agent System for Gemini + Claude APIs

Usage:
    python panda_orchestrator.py "Implementar feature X"
    
This script orchestrates multiple AI agents:
- Gemini 3 Pro (Architect) 
- Claude Sonnet (Auditor)
- Claude Opus (Implementer)
"""

import os
import json
import asyncio
from typing import Optional
import google.generativeai as genai
import anthropic

# ==========================================
# CONFIG
# ==========================================
CONFIG = {
    "gemini_model": "gemini-2.0-flash",
    "claude_model": "claude-sonnet-4-20250514",
    "opus_model": "claude-sonnet-4-20250514",  # Use Opus when available
    "max_tokens": 4096,
    "docs_path": "docs/",
    "workflows_path": ".agent/workflows/",
}

# ==========================================
# LOAD API KEYS
# ==========================================
GEMINI_KEY = os.getenv("GEMINI_API_KEY") or "YOUR_GEMINI_KEY"
ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY") or "YOUR_ANTHROPIC_KEY"

genai.configure(api_key=GEMINI_KEY)
claude = anthropic.Anthropic(api_key=ANTHROPIC_KEY)

# ==========================================
# AGENT DEFINITIONS
# ==========================================

async def call_gemini(prompt: str, system: str = "") -> str:
    """Call Gemini 3 Pro for architecture/planning"""
    model = genai.GenerativeModel(CONFIG["gemini_model"])
    full_prompt = f"{system}\n\n{prompt}" if system else prompt
    response = await asyncio.to_thread(
        model.generate_content, full_prompt
    )
    return response.text

async def call_claude(prompt: str, system: str = "", model: str = None) -> str:
    """Call Claude Sonnet/Opus for review/implementation"""
    model = model or CONFIG["claude_model"]
    response = await asyncio.to_thread(
        claude.messages.create,
        model=model,
        max_tokens=CONFIG["max_tokens"],
        system=system,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text

# ==========================================
# WORKFLOW PHASES
# ==========================================

async def phase_1_architect(objective: str, docs_context: str) -> str:
    """Phase 1: Gemini creates architecture"""
    print("🏗️ PHASE 1: Architecture (Gemini)")
    
    system = """You are the ARCHITECT agent in the Panda Council.
Your role: Create complete architecture for the given objective.
Output: Markdown architecture.md with:
- System overview
- File structure
- Component interfaces
- Data flow"""

    prompt = f"""
OBJECTIVE: {objective}

CONTEXT (from docs):
{docs_context[:10000]}

Create the architecture.md for this objective.
"""
    
    result = await call_gemini(prompt, system)
    print("✅ Architecture created")
    return result

async def phase_2_audit(architecture: str) -> tuple[bool, str]:
    """Phase 2: Claude Sonnet audits and critiques"""
    print("🔍 PHASE 2: Audit (Claude Sonnet)")
    
    system = """You are the AUDITOR agent in the Panda Council.
Your role: Critically review the architecture for:
- Logic flaws
- Security vulnerabilities
- Performance issues
- Missing requirements

If issues found: Output "🔴 REFAZER" with list of issues.
If approved: Output "🟢 APROVADO" with test_plan.md"""

    prompt = f"""
Review this architecture:

{architecture}

Is it approved or needs rework?
"""
    
    result = await call_claude(prompt, system)
    approved = "🟢 APROVADO" in result or "APROVADO" in result.upper()
    print(f"{'✅ Approved' if approved else '⚠️ Needs rework'}")
    return approved, result

async def phase_3_implement(architecture: str, test_plan: str) -> str:
    """Phase 3: Claude Opus implements the code"""
    print("⚙️ PHASE 3: Implementation (Claude Opus)")
    
    system = """You are the IMPLEMENTER agent in the Panda Council.
Your role: Write production-ready code following the architecture.
Rules:
- Follow architecture exactly
- Clean, documented code
- Error handling included
- Ready to run"""

    prompt = f"""
ARCHITECTURE:
{architecture}

TEST PLAN:
{test_plan}

Implement the complete code.
"""
    
    result = await call_claude(prompt, system, CONFIG["opus_model"])
    print("✅ Implementation complete")
    return result

# ==========================================
# ORCHESTRATOR
# ==========================================

async def run_council(objective: str) -> dict:
    """Run the full Panda Council workflow"""
    print(f"\n🏛️ PANDA COUNCIL ACTIVATED")
    print(f"📋 Objective: {objective}\n")
    print("=" * 50)
    
    # Load docs context
    docs_context = ""
    docs_files = ["PF_MASTER_ARCHITECTURE.md", "PF_SDK_REFERENCE.md"]
    for doc in docs_files:
        path = os.path.join(CONFIG["docs_path"], doc)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                docs_context += f"\n\n# {doc}\n{f.read()[:5000]}"
    
    # Phase 1: Architecture
    architecture = await phase_1_architect(objective, docs_context)
    
    # Phase 2: Audit (with retry loop)
    max_retries = 2
    for attempt in range(max_retries + 1):
        approved, audit_result = await phase_2_audit(architecture)
        if approved:
            break
        if attempt < max_retries:
            print(f"🔄 Retry {attempt + 1}: Refining architecture...")
            architecture = await phase_1_architect(
                f"{objective}\n\nPREVIOUS ISSUES:\n{audit_result}",
                docs_context
            )
    
    if not approved:
        return {
            "status": "BLOCKED",
            "reason": "Architecture not approved after retries",
            "audit_result": audit_result
        }
    
    # Phase 3: Implementation
    implementation = await phase_3_implement(architecture, audit_result)
    
    print("\n" + "=" * 50)
    print("✅ COUNCIL COMPLETE")
    
    return {
        "status": "SUCCESS",
        "architecture": architecture,
        "audit": audit_result,
        "implementation": implementation
    }

# ==========================================
# CLI
# ==========================================

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python panda_orchestrator.py 'Your objective here'")
        sys.exit(1)
    
    objective = " ".join(sys.argv[1:])
    result = asyncio.run(run_council(objective))
    
    # Save outputs
    with open("council_output.json", "w") as f:
        json.dump(result, f, indent=2)
    
    print(f"\n📁 Output saved to council_output.json")
    print(f"📊 Status: {result['status']}")
