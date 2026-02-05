import re
from collections import defaultdict, OrderedDict

print("🚀 Iniciando organização do relatório por cidade...")

# Ler o arquivo HTML
with open('Relatório Especial.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("📖 Arquivo lido com sucesso")

# Extrair cabeçalho
header_match = re.search(r'(.*?)<table id="tabela" border="0">', html, re.DOTALL)
header = header_match.group(1) if header_match else ''

# Extrair rodapé  
footer_match = re.search(r'(</div>\s*</table>.*)', html, re.DOTALL)
footer = footer_match.group(1) if footer_match else '</table></div></form></body></html>'

# Extrair todas as entries
tbody_pattern = r'<tbody>(.*?)</tbody>'
tbody_matches = list(re.finditer(tbody_pattern, html, re.DOTALL))

print(f"🔍 Encontrados {len(tbody_matches)} registros")

# Diciionário para agrupar clientes por cidade
clientes_por_cidade = defaultdict(list)

# Processar cada cliente
for match in tbody_matches:
    tbody_content = match.group(1)
    
    # Extrair cidade
    cidade_match = re.search(r'Cidade/UF:</td>\s*<td[^>]*>([^<]+)</td>', tbody_content)
    
    if cidade_match:
        cidade = cidade_match.group(1).strip()
        clientes_por_cidade[cidade].append('<tbody>' + tbody_content + '</tbody>')

# Ordenar cidades alfabeticamente
cidades_ordenadas = OrderedDict(sorted(clientes_por_cidade.items()))

print(f"📊 Encontradas {len(cidades_ordenadas)} cidades diferentes")

# Criar o novo HTML
novo_html = header

# Adicionar navegação por cidade
novo_html += '''
    <div class="NaoImprimir" style="background: #f0f0f0; padding: 20px; margin: 20px auto; border: 2px solid #333; width: 95%; border-radius: 10px;">
        <h2 style="text-align: center; color: #333; margin-bottom: 15px;">📍 Navegação por Cidade</h2>
        <p style="text-align: center; font-size: 16px; margin-bottom: 20px;">
            <strong>Total de Cidades:</strong> ''' + str(len(cidades_ordenadas)) + ''' | 
            <strong>Total de Clientes:</strong> ''' + str(sum(len(c) for c in cidades_ordenadas.values())) + '''
        </p>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 15px;">
'''

# Adicionar botões de navegação
for cidade, clientes in cidades_ordenadas.items():
    cidade_id = re.sub(r'[^a-zA-Z0-9]', '', cidade)
    novo_html += f'''            <a href="#{cidade_id}" style="background: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 5px;">
                {cidade} ({len(clientes)})
            </a>
'''

novo_html += '''        </div>
    </div>
    
    <table id="tabela" border="0">
        <thead>
            <tr style="border-bottom: 1px solid black">
                <th class="celula_head_left">Código</th>
                <th class="celula_head_left" colspan="5">Nome</th>
            </tr>
        </thead>
'''

# Adicionar clientes agrupados por cidade
for cidade, clientes in cidades_ordenadas.items():
    cidade_id = re.sub(r'[^a-zA-Z0-9]', '', cidade)
    
    # Cabeçalho da cidade
    novo_html += f'''
        <tbody>
            <tr id="{cidade_id}" style="background: #2196F3; color: white;">
                <td colspan="6" style="padding: 15px; font-size: 18px; font-weight: bold; text-align: center;">
                    📍 {cidade} - {len(clientes)} Cliente(s)
                </td>
            </tr>
        </tbody>
'''
    
    # Adicionar todos os clientes desta cidade
    for cliente_tbody in clientes:
        novo_html += cliente_tbody + '\n'

# Fechar tabela e adicionar rodapé
novo_html += '''    </table>
''' + footer

# Salvar o novo arquivo
with open('Relatório por Cidade.html', 'w', encoding='utf-8') as f:
    f.write(novo_html)

print('✅ Relatório organizado por cidade criado com sucesso!')
print(f'📊 Resumo: {len(cidades_ordenadas)} cidades, {sum(len(c) for c in cidades_ordenadas.values())} clientes')
print('📄 Arquivo salvo como: Relatório por Cidade.html')

# Mostrar resumo por cidade
print('\n📋 Clientes por cidade:')
for cidade, clientes in cidades_ordenadas.items():
    print(f'   • {cidade}: {len(clientes)} cliente(s)')
