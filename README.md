# Carol Órbita — proposta alternativa

Projeto independente do site Carol Componentes v2.4.0. Criado a partir de um snapshot de seus dados públicos e componentes funcionais; o original permanece intacto.

## Desenvolvimento e publicação
Node.js 24.13.0 (mínimo 22.13), npm, React 19.2.6, TypeScript 5.9.3, Vinext 1.0.0-beta.5, Vite 8.0.13, Wrangler 4.92.0. Versões resolvidas em package-lock.json. Instale com npm run install:ci. npm run build gera Worker Cloudflare; npm run build:pages gera prévia estática na raiz. npm run dev inicia o projeto.

O projeto Sites em .openai/hosting.json é EXCLUSIVO desta proposta. D1 DB e R2 BUCKET são recursos independentes, provisionados pelo Sites. As migrações em drizzle/ são aplicadas antes da publicação. Nunca copiar a identidade, banco, leads ou segredos do projeto original. lib/api-client.ts usa a própria origem; não aponta para a API do primeiro site.

## Design e animações
Paleta violeta #382b70, noite #201937, lavanda #e4ddf2, cobre #edac88, gelo #f9f8fc. Barlow Condensed para títulos e Barlow para leitura. Fontes hospedadas localmente. app/orbit-movement.tsx contém o palco de componentes, história por capítulos e mapa vetorial; app/orbita.css define a nova composição. O volante responde à entrada, mouse e rolagem; o mapa desenha conexões e permite filtrar as cinco regiões. Controle de pausa e prefers-reduced-motion incluídos. O expositor de marcas tem navegação, pausa e abertura de catálogo.

## Conteúdo e operação
Catálogo inicial em data/catalog.json e imagens locais em public/images/. Inclui seleção de medidas, galeria, comparação, favoritos locais, rascunho de cotação, PDF, contatos, meios de pagamento e redes sociais. 1984 é a origem histórica informada; 2000/2014/2026 são a narrativa proposta autorizada no projeto de origem e precisam de validação editorial antes do domínio oficial. Não inventar estoques atuais ou rotas operacionais: as conexões do mapa são ilustrativas.

Admin independente em /admin: ADMIN_INITIAL_HASH é segredo do servidor e configura a primeira entrada, com troca obrigatória de senha. Nunca expor senha no frontend. Envio real de e-mail depende de RESEND_API_KEY e EMAIL_FROM; sem configuração, contato fica pendente e a conversa segue pelo WhatsApp, revisada pelo usuário. Não afirmar entrega de e-mail sem confirmação.

WhatsApp comercial 5547996180088; assinatura pessoal do autor 5541999751171. E-mails exibidos vendas@carolcomponentes.com.br e lojavirtual@carolcomponentes.com.br não significam provisionamento das caixas.

## Geografia e licenças
Contorno do Brasil: Natural Earth 1:110m Admin 0 Countries, domínio público. https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/ . Dados projetados em data/brazil-map.json com a mesma transformação das cidades. Linhas não representam prazos nem rotas reais. Fonte Barlow/Barlow Condensed: Google Fonts, licença OFL.

## Validação e continuidade
Verificar TypeScript e build Worker. Revisar larguras 320, 390, 768 e 1440; busca, detalhe, comparação vertical, regiões do mapa, pausa, redução de movimento, 4 capítulos em subida/descida, arquivos locais e contatos. Documentos em docs/ herdados são referência histórica do projeto base; este README e AGENTS.md prevalecem para identidade, nova URL e separação dos projetos. Não publicar .env, .dev.vars, node_modules, work, .wrangler, conversas ou dados de clientes.

## Seleção integrada de produtos
Salvos e linhas de cotação são combinados por lib/selection.ts. O contador superior abre a seleção completa; todos os botões de contato incluem essa seleção na mensagem. Favorito sem medida é enviado como “Medida a definir”. Linhas com medida têm prioridade sobre o favorito do mesmo produto. A persistência continua local, separada em cada site. Mensagens não são enviadas automaticamente pelo WhatsApp.

O mapa inclui as 26 capitais estaduais e Brasília, agrupadas em Norte (7), Nordeste (9), Centro-Oeste (4), Sudeste (4) e Sul (3). data/brazil-capitals.json mantém coordenadas aproximadas para visualização; Joinville é a origem, não uma capital. Cada trajeto tem seta persistente, fluxo animado, rótulos regionais e lista legível no celular. Não representa roteiro logístico real.
