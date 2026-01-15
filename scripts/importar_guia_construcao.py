import re
import json
from datetime import datetime
import unicodedata

def normalizar_bairro(nome):
    """Normaliza nome do bairro (MAIÚSCULO e sem acentos)"""
    if not nome: return ""
    # Converte para maiúsculas e remove espaços extras
    nome = nome.upper().strip()
    # Normaliza unicode para decompor acentos
    nfkd_form = unicodedata.normalize('NFD', nome)
    # Remove caracteres de combinação (acentos)
    nome_sem_acento = "".join([c for c in nfkd_form if not unicodedata.combining(c)])
    return nome_sem_acento

print("🔍 Analisando HTML do Guia da Construção para importação...")

# Função para processar o HTML do relatório
def processar_relatorio_html(caminho_html):
    """
    Extrai dados do relatório HTML e prepara para o CRM com sistema de status
    """
    with open(caminho_html, 'r', encoding='utf-8') as f:
        html = f.read()
    
    clientes = []
    tbody_pattern = r'<tbody>(.*?)</tbody>'
    tbody_matches = list(re.finditer(tbody_pattern, html, re.DOTALL))
    
    print(f"📊 Encontrados {len(tbody_matches)} registros no relatório")
    
    for match in tbody_matches:
        tbody_content = match.group(1)
        
        # Extrair dados básicos
        codigo_match = re.search(r'(\d{6})</td>', tbody_content)
        
        # Nome: procurar por strings que não sejam apenas números após uma imagem
        # O regex original pegava qualquer coisa. Agora vamos iterar para achar um nome válido.
        nome_matches = re.finditer(r'<img[^>]*>([^<]+)</td>', tbody_content)
        nome_texto = "Sem Nome"
        
        for nm in nome_matches:
            texto = nm.group(1).strip()
            # Se não for só números e tiver pelo menos 3 letras, assumimos que é o nome
            if not texto.isdigit() and len(re.findall(r'[a-zA-Z]', texto)) > 2:
                nome_texto = texto
                break
                
        cidade_match = re.search(r'Cidade/UF:</td>\s*<td[^>]*>([^<]+)</td>', tbody_content)
        data_match = re.search(r'Data:</td>\s*<td[^>]*>([^<]+)</td>', tbody_content)
        telefones = re.findall(r'\((\d{2})\) (\d{4,5})-(\d{4})', tbody_content)
        telefones_formatados = [f"({t[0]}) {t[1]}-{t[2]}" for t in telefones]
        metragem_match = re.search(r'Metragem:</td>\s*<td[^>]*>([^<]+)</td>', tbody_content)
        endereco_match = re.search(r'Endereço:</td>\s*<td[^>]*>([^<]+)</td>', tbody_content)
        bairro_match = re.search(r'Bairro:</td>\s*<td[^>]*>([^<]+)</td>', tbody_content)
        estagio_match = re.search(r'Estágio:</td>\s*<td[^>]*>([^<]+)</td>', tbody_content)
        observacao_match = re.search(r'Observação:</td>\s*<td[^>]*>(.*?)</td>', tbody_content, re.DOTALL)
        
        if codigo_match and cidade_match:
            cliente = {
                'id': codigo_match.group(1),
                'nome': nome_texto,
                'cidade': cidade_match.group(1).strip(),
                'data': data_match.group(1).strip() if data_match else '',
                'telefones': telefones_formatados,
                'metragem': metragem_match.group(1).strip() if metragem_match else '',
                'endereco': endereco_match.group(1).strip() if endereco_match else '',
                'bairro': normalizar_bairro(bairro_match.group(1)) if bairro_match else '',
                'estagio': estagio_match.group(1).strip() if estagio_match else '',
                'observacao': re.sub(r'<[^>]+>', ' ', observacao_match.group(1)).strip() if observacao_match else '',
                
                # Novos campos para sistema de status
                'status': 'nao_acompanhando',  # Valores possíveis: nao_acompanhando, em_acompanhamento, com_orcamento, fechado, finalizado
                'motivo': '',  # Campo obrigatório
                'valor_estimado': 0,
                'data_status': datetime.now().isoformat(),
                'fonte': 'guia_construcao',  # Indica que veio do banco de dados
                'prospect': True,  # Indica que é um prospect do banco de dados pago
                
                # Campos existentes
                'anotacoes': [],
                'retornos': []
            }
            clientes.append(cliente)
    
    return clientes

# Processar o arquivo APENAS se executado diretamente
if __name__ == "__main__":
    try:
        # Tenta processar um arquivo padrão para teste
        arquivo_teste = 'Relatório Especial.html'
        import os
        if os.path.exists(arquivo_teste):
            clientes = processar_relatorio_html(arquivo_teste)
            
            # Salvar com novos campos
            with open('clientes_crm_v2.json', 'w', encoding='utf-8') as f:
                json.dump(clientes, f, ensure_ascii=False, indent=2)
            
            print(f"✅ {len(clientes)} clientes processados com sucesso!")
            print(f"💾 Dados salvos em: clientes_crm_v2.json")
            
            # Estatísticas
            cidades = len(set(c['cidade'] for c in clientes))
            print(f"\n📊 Estatísticas:")
            print(f"   • Total de prospects: {len(clientes)}")
            print(f"   • Cidades diferentes: {cidades}")
            print(f"   • Fonte: Guia da Construção (banco de dados pago)")
        else:
            print(f"ℹ️ Modo de importação: Para testar, crie o arquivo '{arquivo_teste}'")
        
    except Exception as e:
        print(f"❌ Erro ao processar: {e}")
