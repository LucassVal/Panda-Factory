import time
from playwright.sync_api import sync_playwright
import json
import os
from datetime import datetime
import re

# Configurações
LOGIN_URL = "https://guiadaconstrucao1.com.br/acesso/"
# URL limpa sem ID de sessão
CONSULTA_URL = "https://guiaconstrucao.maxapex.net/apex/f?p=150" 
USERNAME = "Signore"
PASSWORD = "Sig2025$"

# Parâmetros de filtro
M2_INICIAL = 150
M2_FINAL = 300
ESTAGIO = "acabamento"

def scraper_guia_construcao(headless=False, m2_inicial="150", m2_final="300"):
    """
    Executa scraper completo com login e extração de dados
    """
    print("🚀 Iniciando Scraper Automático do Guia da Construção...")
    
    with sync_playwright() as p:
        # Abrir navegador
        browser = p.chromium.launch(headless=headless)
        context = browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )
        page = context.new_page()
        
        try:
            # PASSO 1: Login
            print(f"🔐 Acessando página de login: {LOGIN_URL}")
            page.goto(LOGIN_URL, wait_until='networkidle')
            time.sleep(2)
            
            # Verificar se carregou
            print("⏳ Aguardando carregamento completo...")
            time.sleep(5)
            
            # PASSO INTERMEDIÁRIO: Clicar em "Acessar relatório de obras"
            print("👆 Procurando botão 'Acessar relatório de obras'...")
            try:
                # Regex para encontrar botão (Case Insensitive)
                btn_pattern = re.compile(r"acessar relat[óo]rio de obras", re.IGNORECASE)
                access_btn = page.get_by_text(btn_pattern)
                
                if access_btn.count() > 0:
                    print("✅ Botão encontrado! Clicando...")
                    access_btn.first.click()
                elif page.locator('a[href*="f?p=150"]').count() > 0:
                     page.locator('a[href*="f?p=150"]').first.click()
                     print("✅ Clicou no botão de acesso (via href)")
                else:
                    print("⚠️ Botão de acesso não encontrado, tentando prosseguir...")
                
                print("⏳ Aguardando redirecionamento para login...")
                try:
                    page.wait_for_load_state('networkidle', timeout=10000)
                except:
                    pass
                time.sleep(5)
            except Exception as e:
                print(f"⚠️ Aviso no passo intermediário: {e}")

            # Procurar campos de login
            print("📝 Preenchendo credenciais...")
            print(f"🧐 DEBUG: Usuário configurado = '{USERNAME}'")
            print(f"🧐 DEBUG: Senha configurada = '{PASSWORD}'")
            
            # Seletores INTELIGENTES (Busca por Label/Placeholder)
            print("🧠 Tentando localizar campos inteligentemente...")
            
            # Preencher LOGIN
            try:
                # Tentar achar label "Usuário" ou placeholder
                page.get_by_label("Usuário", exact=False).fill(USERNAME)
                print("✅ Login preenchido via Label!")
            except:
                try:
                    page.get_by_placeholder("usuário", exact=False).fill(USERNAME)
                    print("✅ Login preenchido via Placeholder!")
                except:
                    # Fallback para seletores técnicos
                    login_selectors = ['input[name="username"]', 'input[name="user"]', 'input[id*="username"]', 'input[id*="user"]']
                    for sel in login_selectors:
                        if page.is_visible(sel):
                            page.fill(sel, USERNAME)
                            print(f"✅ Login preenchido via Seletor: {sel}")
                            break
            time.sleep(0.5)

            # Preencher SENHA
            try:
                page.get_by_label("Senha", exact=False).fill(PASSWORD)
                print("✅ Senha preenchida via Label!")
            except:
                try:
                    page.get_by_placeholder("senha", exact=False).fill(PASSWORD)
                    print("✅ Senha preenchida via Placeholder!")
                except:
                    password_selectors = ['input[name="password"]', 'input[type="password"]']
                    for sel in password_selectors:
                        if page.is_visible(sel):
                            page.fill(sel, PASSWORD)
                            print(f"✅ Senha preenchida via Seletor: {sel}")
                            break
            time.sleep(1)

            # Clicar em Entrar (Estratégia Segura Anti-Crash)
            print("🔘 Clicando em Entrar...")
            
            login_iniciado = False
            
            try:
                # 1. Tentar ENTER (Padrão)
                print("⌨️ Pressionando ENTER...")
                page.keyboard.press("Enter")
                time.sleep(1) # Esperar para ver se reage
                
                # Verificar se já começou a navegar (input de senha sumiu ou erro de contexto)
                if page.locator('input[type="password"]').count() == 0:
                    print("✅ Navegação iniciada via ENTER!")
                    login_iniciado = True
            except Exception as e:
                if "Execution context was destroyed" in str(e) or "navigating" in str(e):
                     print("✅ Navegação detectada (Erro de Contexto esperado)!")
                     login_iniciado = True
                else:
                    print(f"⚠️ Erro no ENTER: {e}")

            # 2. Se ainda não foi, tentar botão
            if not login_iniciado:
                try:
                    btns = page.get_by_role("button", name=re.compile("entrar|login|acessar", re.IGNORECASE))
                    if btns.count() > 0 and page.locator('input[type="password"]').is_visible():
                        btns.first.click(timeout=2000)
                        print("✅ Clicou via Role Button")
                        time.sleep(1)
                except Exception as e:
                    if "Execution context was destroyed" in str(e):
                         print("✅ Navegação iniciada via Botão!")
                         login_iniciado = True

            # 3. Último recurso: JS (apenas se ainda estivermos na mesma página)
            if not login_iniciado:
                try:
                    # Verificar se password ainda está lá antes de rodar JS
                    if page.locator('input[type="password"]').count() > 0:
                        page.evaluate("""
                            const buttons = document.querySelectorAll('button, input[type="submit"], a.btn');
                            buttons.forEach(b => {
                                const txt = b.innerText.toLowerCase();
                                if(txt.includes('entrar') || txt.includes('login') || b.id.includes('LOGIN')) {
                                    b.click();
                                }
                            });
                        """)
                        print("✅ Executou JS Force Click")
                except Exception as e:
                     if "Execution context was destroyed" in str(e):
                         print("✅ Navegação iniciada via JS!")
                         login_iniciado = True

            # Aguardar login real
            print("⏳ Validando acesso...")
            try:
                # Esperar URL mudar ou input senha sumir
                # Usar try/except para timeouts
                page.wait_for_function("""
                    () => !document.querySelector('input[type="password"]') || window.location.href.includes('f?p=150')
                """, timeout=20000)
                print("✅ Autenticação detectada com sucesso!")
            except Exception as e:
                if "Execution context was destroyed" in str(e):
                    print("✅ Contexto mudou (Sucesso)!")
                else:
                    print(f"⚠️ Aviso: Timeout ou erro na validação: {e}")

            # PASSO 2: Verificar/Navegar para Consulta
            time.sleep(5)
            try:
                current_url = page.url
                if "f?p=150" not in current_url:
                    print(f"� Forçando navegação para consulta: {CONSULTA_URL}")
                    page.goto(CONSULTA_URL, wait_until='networkidle')
                    time.sleep(5)
            except Exception as e:
                 print(f"⚠️ Erro ao verificar URL pós-login (pode estar carregando ainda): {e}")          # Screenshot de diagnóstico pós-login
            try:
                page.screenshot(path="debug_pos_login.png")
                print("📸 Screenshot de debug salvo: debug_pos_login.png")
            except: pass

            # Tentar identificar onde estamos
            print(f"📍 URL Atual: {page.url}")
            
            # Navegação Robusta
            crm_encontrado = False
            
            # Tentativa 1: Validar se já estamos no CRM
            if "f?p=150" in page.url:
                 # Verificar se botão Consultar Obra já está visível
                 if page.locator('a[href*="T_OBRAC"]').count() > 0:
                     print("✅ Já estamos na Dashboard com Consultar Obra!")
                     crm_encontrado = True
            
            # Tentativa 2: Clicar no botão CRM (Imagem ou Texto)
            if not crm_encontrado:
                try:
                    # Imagem CRM
                    if page.locator('img[src*="bt-gfiss-crm"]').is_visible():
                        page.locator('img[src*="bt-gfiss-crm"]').click()
                        print("✅ Clicou no botão CRM (Imagem)")
                        time.sleep(3)
                    
                    # Texto CRM
                    elif page.get_by_text("CRM", exact=False).count() > 0:
                         page.get_by_text("CRM", exact=False).first.click()
                         print("✅ Clicou no texto CRM")
                         time.sleep(3)
                    
                    # Se nada funcionou, navegar para URL base do APP 150
                    else:
                        print("⚠️ Botão CRM não visível, forçando navegação URL...")
                        page.goto("https://guiaconstrucao.maxapex.net/apex/f?p=150", wait_until='networkidle')
                        time.sleep(3)
                except Exception as e:
                    print(f"⚠️ Erro ao navegar para CRM: {e}")

            # Consultar Obra
            print("👆 Procurando 'Consultar Obra'...")
            consultar_clicked = False
            try:
                # Tentar link com javascript:apex.submit('T_OBRAC')
                # Procura por href específico
                link_obra = page.locator('a[href*="T_OBRAC"]')
                if link_obra.count() > 0:
                    link_obra.first.click()
                    print("✅ Clicou em 'Consultar Obra'")
                    consultar_clicked = True
                else:
                    # Tentar pelo texto
                    link_text = page.get_by_text("Consultar Obra", exact=False)
                    if link_text.count() > 0:
                        link_text.first.click()
                        print("✅ Clicou em 'Consultar Obra' (Texto)")
                        consultar_clicked = True
            except: pass
            
            if not consultar_clicked:
                print("❌ FALHA CRÍTICA: Não consegui entrar em 'Consultar Obra'.")
                print("Tentando executar script JS direto...")
                try:
                    page.evaluate("apex.submit('T_OBRAC');")
                    print("✅ Executou JS apex.submit('T_OBRAC')")
                    time.sleep(3)
                except:
                    print("❌ JS falhou. Tentando continuar mesmo assim (talvez já estejamos na tela)...")

            time.sleep(3)

            # PASSO 3: Preencher Filtros
            print("🎯 Preenchendo filtros de pesquisa...")
            
            # Verificar se estamos na tela certa (procurar input de data ou M2)
            if page.locator('input[name*="M2"]').count() == 0 and page.locator('input.datepicker').count() == 0:
                print("⚠️ PARECE QUE NÃO ESTAMOS NA TELA DE FILTROS! (Inputs não encontrados)")
                page.screenshot(path="erro_tela_filtros.png")
            else:
                print("✅ Tela de filtros detectada (Inputs encontrados)")

            # DATA (Hoje - 6 meses)
            from datetime import timedelta
            hoje = datetime.now()
            seis_meses_atras = hoje - timedelta(days=180) # Aprox 6 meses
            
            data_fim_str = hoje.strftime("%d/%m/%Y")
            data_ini_str = seis_meses_atras.strftime("%d/%m/%Y")
            
            print(f"📅 Definindo período: {data_ini_str} até {data_fim_str}")
            
            try:
                # IDs exatos fornecidos (Componente Oracle APEX DatePicker)
                # Precisamos preencher o input real que tem sufixo _input
                
                # Data Inicial
                if page.locator('#P8_ENTREGA_INICIAL_input').is_visible():
                    print("✅ Input de Data Inicial encontrado (#P8_ENTREGA_INICIAL_input)")
                    page.fill('#P8_ENTREGA_INICIAL_input', data_ini_str)
                    page.keyboard.press("Tab") # Sair do campo para validar
                    time.sleep(1)
                else:
                    print("⚠️ ID exato P8_ENTREGA_INICIAL_input não visível, tentando genérico...")
                    page.locator('input.apex-item-datepicker').first.fill(data_ini_str)

                # Data Final
                if page.locator('#P8_ENTREGA_FINAL_input').is_visible():
                    print("✅ Input de Data Final encontrado (#P8_ENTREGA_FINAL_input)")
                    page.fill('#P8_ENTREGA_FINAL_input', data_fim_str)
                    page.keyboard.press("Tab") # Sair do campo
                    time.sleep(1)
                else:
                    print("⚠️ ID exato P8_ENTREGA_FINAL_input não visível, tentando genérico...")
                    page.locator('input.apex-item-datepicker').nth(1).fill(data_fim_str)
                    
            except Exception as e:
                print(f"⚠️ Erro ao preencher datas (Tentativa 1): {e}")
                # Fallback: Tentar digitar caractere por caractere se o fill falhar
                try:
                    print("🔄 Tentando digitar datas caractere por caractere...")
                    page.click('#P8_ENTREGA_INICIAL_input')
                    page.keyboard.type(data_ini_str, delay=100)
                    
                    page.click('#P8_ENTREGA_FINAL_input')
                    page.keyboard.type(data_fim_str, delay=100)
                except: pass

            # M2 (Dinâmico)
            M2_INICIAL_VAL = m2_inicial
            M2_FINAL_VAL = m2_final
            
            print(f"📏 Definindo Metragem: {M2_INICIAL_VAL}m² a {M2_FINAL_VAL}m²")
            
            try:
                # M2 Inicial (ID P8_M2_INICIAL confirmado pelo user)
                if page.locator('#P8_M2_INICIAL').is_visible():
                    page.fill('#P8_M2_INICIAL', M2_INICIAL_VAL)
                    print(f"✅ M2 Inicial preenchido (ID P8_M2_INICIAL)")
                else:
                    page.get_by_label("M2 Inicial", exact=False).fill(M2_INICIAL_VAL)
            except: pass
            
            try:
                # M2 Final (User mandou ID igual, vou tentar adivinhar P8_M2_FINAL ou Label)
                if page.locator('#P8_M2_FINAL').is_visible():
                    page.fill('#P8_M2_FINAL', M2_FINAL_VAL)
                    print(f"✅ M2 Final preenchido (ID P8_M2_FINAL)")
                else:
                    # Tentar input vizinho do inicial ou por label
                    page.get_by_label("M2 Final", exact=False).fill(M2_FINAL_VAL)
                    print(f"✅ M2 Final preenchido (Label)")
            except: pass

            # ESTÁGIO (Acabamento)
            print("🏗️ Selecionando Estágio: Acabamento...")
            try:
                # O usuário confirmou que é um Multi-Select Checkbox
                # Valor 14 = Acabamento: Rebocando
                
                # 1. Abrir o dropdown se estiver fechado (verificar visibility do container)
                if not page.locator('#msl_P8_ESTAGIO').is_visible():
                     print("🔽 Abrindo lista de estágios...")
                     page.click('#P8_ESTAGIO_LABEL', force=True) 
                     # Ou tentar clicar na setinha/input que abre
                     try: page.locator('div.multi_checkbox_div').first.click(force=True)
                     except: pass
                     time.sleep(1)

                # 2. Marcar o checkbox específico (value="14")
                # Seletor exato: input[value="14"] dentro do container
                checkbox = page.locator('input[type="checkbox"][value="14"]')
                
                if checkbox.count() > 0:
                    if not checkbox.is_checked():
                        checkbox.check(force=True)
                        print("✅ Checkbox 'Acabamento: Rebocando' (14) MARCADO!")
                    else:
                        print("✅ Checkbox já estava marcado.")
                else:
                    # Fallback por texto
                    print("⚠️ Checkbox valor 14 não achado, tentando por texto...")
                    page.get_by_label("Acabamento: Rebocando").check(force=True)
                    print("✅ Checkbox marcado por texto Label")

            except Exception as e:
                print(f"⚠️ Erro ao selecionar estágio: {e}")
                # Logar HTML da parte de estágio para debug
                try:
                    html_estagio = page.locator('#fs_P8_ESTAGIO').inner_html()
                    print(f"DEBUG HTML ESTAGIO: {html_estagio[:200]}...")
                except: pass

            # PASSO 4: PESQUISAR
            print("🔍 Clicando em PESQUISAR...")
            page.evaluate("apex.submit({request:'PESQUISAR',validate:true});")
            
            print("⏳ Aguardando resultados (10s)...")
            time.sleep(10)

            # PASSO 5: RELATÓRIO COMPLETO
            print("📄 Clicando em 'Relatório Completo'...")
            
            # Preparar para capturar nova página ou popup
            with context.expect_page() as new_page_info:
                # Clicar no botão ID B14294164084520012
                try:
                    page.click('#B14294164084520012', timeout=5000)
                except:
                    # Fallback por valor
                    page.click('input[value="Relatório Completo"]')
                
            print("⏳ Aguardando carregamento do relatório...")
            relatorio_page = new_page_info.value
            relatorio_page.wait_for_load_state('networkidle')
            time.sleep(5)
            
            print("📥 Extraindo HTML do Relatório...")
            html_content = relatorio_page.content()
            
            # Salvar
            dados_dir = os.path.join('..', 'dados') 
            os.makedirs(dados_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            html_filename = os.path.join(dados_dir, f"guia_construcao_relatorio_{timestamp}.html")
            
            with open(html_filename, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            print(f"✅ HTML salvo em: {html_filename}")
            
            # Screenshot do Relatório
            try:
                screenshot_filename = os.path.join(dados_dir, f"guia_construcao_screenshot_{timestamp}.png")
                relatorio_page.screenshot(path=screenshot_filename, full_page=True)
                print(f"📸 Screenshot salvo em: {screenshot_filename}")
            except: pass
            
            # Processar JSON
            try:
                from importar_guia_construcao import processar_relatorio_html
                clientes = processar_relatorio_html(html_filename)
                
                # Salvar arquivos JSON
                json_bkp = os.path.join(dados_dir, f"clientes_crm_v2_{timestamp}.json")
                json_main = os.path.join(dados_dir, "clientes_crm_v2.json")
                
                with open(json_bkp, 'w', encoding='utf-8') as f:
                    json.dump(clientes, f, indent=4, ensure_ascii=False)
                
                with open(json_main, 'w', encoding='utf-8') as f:
                    json.dump(clientes, f, indent=4, ensure_ascii=False)

                # --- MÁGICA DO ZERO-CLIQUE ---
                # Salvar como .js para importar automaticamente no navegador (bypassing CORS)
                js_filename = os.path.join(dados_dir, "auto_import.js")
                json_str = json.dumps(clientes, indent=4, ensure_ascii=False)
                
                with open(js_filename, 'w', encoding='utf-8') as f:
                    f.write(f"window.DADOS_AUTO_IMPORT = {json_str};")
                    f.write(f"\nwindow.DATA_IMPORTACAO = '{datetime.now().isoformat()}';")
                
                print(f"✅ Arquivo de automação gerado: {js_filename}")
                # -----------------------------
                    
                print(f"✅ JSON gerado com sucesso: {len(clientes)} clientes")
                print("🏁 Processo concluído! O CRM abrirá e importará tudo sozinho.")
                
            except Exception as e:
                print(f"⚠️ Erro ao processar JSON: {e}")

        except Exception as e:
            print(f"❌ Erro fatal: {e}")
            try:
                page.screenshot(path="erro_fatal.png")
            except: pass
            
        finally:
            print("🔒 Fechando navegador...")
            try:
                # Verificar se context/browser ainda estao abertos antes de fechar
                # context.close()
                browser.close()
            except Exception as e:
                # Ignorar erros de TargetClosed, pois significa que ja fechou
                if "Target page, context or browser has been closed" not in str(e):
                    print(f"⚠️ Aviso ao fechar: {e}")

if __name__ == "__main__":
    print("-" * 50)
    print("📋 CONFIGURAÇÃO DE FILTROS DO SCRAPER")
    print("-" * 50)
    
    m2_ini = input("👉 M² Inicial [Padrão 150]: ").strip()
    if not m2_ini: m2_ini = "150"
    
    m2_fim = input("👉 M² Final [Padrão 300]: ").strip()
    if not m2_fim: m2_fim = "300"
    
    print(f"✅ Filtros definidos: {m2_ini}m² até {m2_fim}m²")
    print("-" * 50)
    time.sleep(1)
    
    scraper_guia_construcao(headless=False, m2_inicial=m2_ini, m2_final=m2_fim)
