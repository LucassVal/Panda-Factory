import re
import json

print("🔍 Extraindo dados dos clientes do relatório...")

# Ler o arquivo HTML
with open('Relatório Especial.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Lista para armazenar todos os clientes
clientes = []

# Regex para extrair dados de cada cliente
tbody_pattern = r'<tbody>(.*?)</tbody>'
tbody_matches = list(re.finditer(tbody_pattern, html, re.DOTALL))

print(f"📊 Processando {len(tbody_matches)} registros...")

for idx, match in enumerate(tbody_matches):
    tbody_content = match.group(1)
    
    # Extrair código
    codigo_match = re.search(r'(\d{6})</td>', tbody_content)
    
    # Extrair nome
    nome_match = re.search(r'<img[^>]*>([^<]+)</td>', tbody_content)
    
    # Extrair cidade
    cidade_match = re.search(r'Cidade/UF:</td>\s*<td[^>]*>([^<]+)</td>', tbody_content)
    
    # Extrair data
    data_match = re.search(r'Data:</td>\s*<td[^>]*>([^<]+)</td>', tbody_content)
    
    # Extrair telefone(s)
    telefones = re.findall(r'\((\d{2})\) (\d{4,5})-(\d{4})', tbody_content)
    telefones_formatados = [f"({t[0]}) {t[1]}-{t[2]}" for t in telefones]
    
    # Extrair metragem
    metragem_match = re.search(r'Metragem:</td>\s*<td[^>]*>([^<]+)</td>', tbody_content)
    
    # Extrair endereço
    endereco_match = re.search(r'Endereço:</td>\s*<td[^>]*>([^<]+)</td>', tbody_content)
    
    # Extrair bairro
    bairro_match = re.search(r'Bairro:</td>\s*<td[^>]*>([^<]+)</td>', tbody_content)
    
    # Extrair estágio
    estagio_match = re.search(r'Estágio:</td>\s*<td[^>]*>([^<]+)</td>', tbody_content)
    
    # Extrair observação
    observacao_match = re.search(r'Observação:</td>\s*<td[^>]*>(.*?)</td>', tbody_content, re.DOTALL)
    
    if codigo_match and nome_match and cidade_match:
        cliente = {
            'id': codigo_match.group(1),
            'nome': nome_match.group(1).strip(),
            'cidade': cidade_match.group(1).strip(),
            'data': data_match.group(1).strip() if data_match else '',
            'telefones': telefones_formatados,
            'metragem': metragem_match.group(1).strip() if metragem_match else '',
            'endereco': endereco_match.group(1).strip() if endereco_match else '',
            'bairro': bairro_match.group(1).strip() if bairro_match else '',
            'estagio': estagio_match.group(1).strip() if estagio_match else '',
            'observacao': re.sub(r'<[^>]+>', ' ', observacao_match.group(1)).strip() if observacao_match else '',
            'anotacoes': [],
            'retornos': []
        }
        clientes.append(cliente)

# Salvar como JSON
with open('clientes_crm.json', 'w', encoding='utf-8') as f:
    json.dump(clientes, f, ensure_ascii=False, indent=2)

print(f"✅ {len(clientes)} clientes extraídos com sucesso!")
print(f"💾 Dados salvos em: clientes_crm.json")
