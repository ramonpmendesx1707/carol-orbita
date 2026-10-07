# Dados e catálogo
Fonte primária: catálogo público Carolfix em 06/10/2026, via WooCommerce Store API. Preservados IDs, slugs, nomes, descrições, resumos, categorias e opções. 50 produtos principais, 290 variantes, 16 categorias: não são 340 produtos independentes e não representam o estoque completo de Joinville.

Carolfix deixou de responder durante a coleta. Merkbak oficial é fonte complementar das fotos, informações adicionais e especificações de variantes correspondentes. O mapeamento produto→fabricante consta de data/manufacturer-matching.json; correspondência única e variantes com rótulo exato. Não substituir produto por modelo semelhante. Campos ausentes permanecem sob consulta. Origem primária e complementar ficam em sourceUrl/technicalSource.

data/import-manifest.json registra contagens e arquivos. Aplicação utiliza JSON e imagens locais. scripts/import-catalog.py documenta transformação e higienização do HTML. Cache original fica local e ignorado pelo Git. Não atribuir disponibilidade ao fato de a peça aparecer no site.

## PDF
Original fornecido Catalogo-Carolfix-1.pdf permanece intacto. Saída public/downloads/catalogo-carol-componentes.pdf: capa, página institucional e contracapa alteradas; tabelas, desenhos e marcas de fabricantes preservados. Retirados contatos de Curitiba, marca e links antigos. Conteúdo técnico histórico, edição 2016. Não comprova preço ou estoque atual. scripts/rebrand-catalog.py registra o tratamento. Revisão textual e visual de todas as 60 páginas.

## Produção
Exportação ERP exclusivamente Joinville é necessária para vincular cada SKU a estoque, preço e características. Mapear código de fabricante, medida, unidade, família e variante; impedir atualização que troque modelo. Receber fichas e CADs atuais com autorização do fornecedor. Reconsultar Carolfix quando voltar para reconciliar dados adicionais.
