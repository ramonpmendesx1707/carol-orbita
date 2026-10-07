# Validação
## Roteiro funcional
- Desktop e celular: início, navegação, leitura e botões sem corte horizontal.
- Buscar por código e medida; filtrar todas as categorias; ordenar e alternar lista/grade; conferir vazio e paginação.
- Abrir produtos simples e variáveis; seleção obrigatória; quantidade positiva; descrição, informação adicional e documentos.
- Comparar três; impedir quarta peça; remover comparação. Salvar favorito e recarregar.
- Cotação: incluir medida, alterar quantidade, remover e recuperar rascunho após recarga.
- CEP curto/inválido deve falhar; Joinville/Sul/outros estados mostram tabela demonstrativa, sem spinner permanente.
- CNPJ inválido e telefone ausente devem bloquear; CNPJ válido com DDD registra teste e produz link somente para 5547996180088.
- Mensagem WhatsApp deve incluir identificação, contexto, medida, quantidade e mensagem; nenhum e-mail real enviado.
- Área /validacao requer autenticação; pedidos persistem na conta e não executam mudanças automaticamente.
- PDF: baixar, navegar por família, conferir 60 páginas, nova identidade e contatos Joinville.
- Acesso por teclado, foco de modais, Escape, contraste e redução de movimento.
- Conferir contagens de dados, imagens locais e ausência de conteúdo institucional de Curitiba.

## Banco local
Após build, aplicar uma vez cada SQL pendente:
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_stale_solo.sql

Prévia portátil: usar /signin-with-chatgpt?return_to=/validacao para conta local de testes. Autenticação simulada nunca é incluída na produção. Publicação aplica migrações empacotadas ao banco hospedado.

## Liberação
TypeScript, build, auditoria de dados/PDF e testes reais dos fluxos essenciais antes de publicar. Registrar evidências em docs/RELEASE.md; números previstos não substituem resultado observado.
