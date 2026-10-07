# Administração e integrações — v2.3.0

## Arquitetura publicada
O GitHub Pages entrega a interface em `/carol-componentes/`, incluindo `/carol-componentes/admin/`. Pages é estático. Login, catálogo compartilhado, contatos e backups são processados pelo Worker/D1 do projeto Sites existente. O endereço desse servidor é configuração pública em `lib/api-client.ts`; nenhum segredo acompanha o frontend. Não é um link de navegação: a interface permanece no GitHub Pages.

Para migrar ao domínio oficial, publique o frontend com `CAROL_PAGES_BASE=/` e `VITE_CAROL_API_ORIGIN=https://api.carolcomponentes.com.br`, ou hospede o Worker completo na mesma origem. Configure DNS/TLS e o servidor antes de substituir a origem. Não aponte um CNAME do Pages esperando que ele execute a API. O servidor aceita CORS apenas das origens listadas em `build/catalog-api.ts`. Atualize essa lista na migração. O controle CORS não substitui a autenticação.

## Login
Usuário inicial: `carol`. A senha inicial foi fornecida pelo proprietário e configurada exclusivamente como segredo no servidor. Não consta deste repositório. No primeiro acesso é obrigatório substituí-la por uma senha de pelo menos 12 caracteres, com maiúscula, minúscula, número e símbolo.

O segredo `ADMIN_INITIAL_HASH` tem formato salt:hash PBKDF2-SHA256 (100.000 iterações, 32 bytes). A configuração apenas inicializa uma conta inexistente; não sobrescreve uma senha já alterada no banco. Para restaurar acesso, um operador autorizado deve redefinir a linha `admin` de `cc_state` e invalidar todas as sessões. Nunca registre senha em commit, issue, logs ou variáveis VITE_.

Sessões de 4 horas, tokens aleatórios armazenados no navegador em sessionStorage e apenas SHA256 no banco. Cinco falhas por IP em 15 minutos bloqueiam novas tentativas. Trocar senha revoga as outras sessões. Administração e dados de contatos exigem token; a senha inicial não permite editar antes da troca. HTTPS obrigatório.

## Produtos e página inicial
CRUD de nome, slug, SKU, marca, tipo, seção, preço, resumo, descrição, categorias, atributos, peso, dimensões, foto e medidas com atributos próprios. Preço 0 significa sob consulta. Descrições novas são texto simples; a API rejeita conteúdo ativo. Fotos JPG/PNG/WebP são redimensionadas no navegador para até 1.000 px e armazenadas no R2, separadas do catálogo D1. A API confere o formato real do arquivo. Dados textuais do catálogo limitados a 1,8 MB; fotos não consomem esse limite.

A seleção inicial corresponde aos 12 primeiros produtos por nome. Redefinir destaques inicia um rascunho vazio, sem alterar o catálogo publicado. Apenas exatamente 12 podem ser publicados. Cancelar descarta o rascunho. Se uma carga Excel deixar quantidade diferente de 12 marcada, a home usa os primeiros 12 por nome. Busca, categorias e outras ordenações continuam funcionando normalmente.

## Excel e substituição integral
ExcelJS 4.4.0, carregado sob demanda. Baixar Excel completo inclui abas Produtos, Medidas e Orientações. IDs existentes devem permanecer. IDs e slugs precisam ser exclusivos; produtos exigem nome/categoria; medidas exigem ID/nome. Categorias e atributos usam JSON. Fórmulas são rejeitadas. Limites: arquivo 8 MB, 5.000 produtos, 20.000 medidas.

Carga mostra contagem de novos/removidos/medidas e exige confirmação explícita. O servidor valida tudo antes de publicar. Ausentes são removidos. Fotos de IDs existentes são preservadas, novos usam imagem substituta até upload manual. Não há coluna de fotos. Banco mantém 20 snapshots anteriores em cc_backups. Escrita com revisão otimista evita sobrescrever alteração simultânea. Uma falha mantém o catálogo anterior. Nunca importe dados de contatos nessa planilha.

## CNPJ e mensagens
GET /api/company?cnpj=… consulta OpenCNPJ (https://api.opencnpj.org/{CNPJ}), sem chave, timeout 6,5 s. Extrai razão social, nome fantasia, situação, município/UF e até 30 nomes/cargos do QSA. Não coleta CPF de sócios, idade ou documentos pessoais. Consulta e bases podem estar desatualizadas. Falha não bloqueia WhatsApp. O servidor refaz a consulta ao registrar contato, sem confiar no cadastro enviado pelo navegador.

A API Conecta gov.br exige credenciamento e não foi usada como consulta pública. Referências: https://www.gov.br/conecta/catalogo/apis/consulta-cnpj e https://opencnpj.org/ e https://github.com/Hitmasu/OpenCNPJ .

POST /api/contact registra contato no D1, prepara texto de WhatsApp com CNPJ/telefone formatados e HTML de e-mail escapado. O WhatsApp único permanece 5547996180088. A pessoa precisa confirmar o envio no aplicativo. E-mail para ramonpmendesx@gmail.com exige RESEND_API_KEY (segredo) e EMAIL_FROM (remetente verificado). Sem configuração ou em falha, status pending, nunca afirma entrega. Contatos pendentes podem ser consultados pelo gestor. Domínio e caixas vendas@ / lojavirtual@ não são provisionados por código.

## Banco / continuidade
Tabelas cc_state, cc_sessions, cc_attempts, cc_backups e cc_contacts criadas por migrations Drizzle versionadas; a migration inicial é idempotente para compatibilidade com a publicação anterior. Catálogo inicial em data/catalog.json só é usado quando ainda não existe catálogo no banco. Novas publicações não apagam edições do gestor. Faça exportação do D1 antes de migrar, incluindo catálogo e referências às fotos; migre também o bucket R2; mantenha contatos em backup privado, fora do Git. Configure retenção de contatos conforme a operação. Sites env secrets não migram pelo Git: o operador deve configurá-los no novo servidor.

## Rotas / verificação
Rotas de navegação são relativas à base de publicação. /admin/ recebe index próprio no Pages para abrir diretamente. Produtos usam hash/modal e fallback de navegação. Links sociais e mapas seguem externos intencionalmente. A antiga validação Sites foi removida da navegação. /api/contato legado não é o fluxo atual.

Validar build Pages e Worker, autenticação/negação anônima, senha inicial, exportar/importar, revisão simultânea, CRUD, 12 destaques, celular 320/390/768, comparação vertical, timeline subindo/descendo e imagens locais. Não executar carga destrutiva no catálogo de produção como teste; use banco local isolado.

O botão Baixar versões anteriores exporta os 20 snapshots privados autenticados, incluindo referências às fotos do R2. Para restaurar, um operador autorizado seleciona um payload e o aplica ao catálogo via PUT /api/manage/catalog com a revisão atual, após revisar o conteúdo. Contatos permitem baixar o HTML formatado do e-mail; isso não indica envio.

## Testes da versão
`scripts/verify-v23-browser.mjs` aceita CAROL_TEST_URL, CAROL_PLAYWRIGHT_PACKAGE e CAROL_CHROME_EXECUTABLE. `scripts/verify-admin-api.mjs` exige banco isolado local e CAROL_ADMIN_TEST_PASSWORD; o teste recusa host remoto porque altera produtos e senha. Os testes de UI também confirmaram ida e volta do Excel com 49 produtos no banco de teste, cadastro manual, seleção de 12 destaques e layout mobile. A produção iniciou com os 50 produtos e 290 medidas preservados.

## Refinamentos v2.4
O cadastro gera o endereço automaticamente ao digitar o nome de um produto novo; resolve conflitos com sufixos numéricos. O endereço existente não muda ao renomear, preservando links. Categorias existentes aparecem em seleção múltipla; novas categorias podem ser incluídas no mesmo formulário. Cada produto aceita até 10 fotos; upload múltiplo, escolha de principal e remoção de referência. Remover foto do produto não apaga o objeto R2, preservando snapshots anteriores. O detalhe público apresenta miniaturas selecionáveis.

Os caminhos canônicos /images/ recebidos da API são resolvidos para a base de publicação em lib/api-client.ts. O prefixo de reconhecimento é construído sem literal de asset, pois o transform do Vite Pages também processa esse módulo. Não restaurar startsWith('/images/') literalmente sem excluir o helper do transform: isso quebrou a publicação 2.3. O teste scripts/verify-v24-browser.mjs intercepta a API com caminhos canônicos e verifica naturalWidth das imagens no build real, incluindo a administração.

Ícones: public/icons/carol-mark.svg é a fonte vetorial; public/apple-touch-icon.png (180 px), carol-192.png e carol-512.png são os exports PNG. public/site.webmanifest usa URLs relativas, nome curto Carol e display standalone. static/index.html e app/layout.tsx incluem Apple touch icon, apple-mobile-web-app-title e suporte standalone. Validar links de ícones/manifest após alterar base/domínio. Adicionar pelo menu Compartilhar > Adicionar à Tela de Início no Safari. A configuração não inclui cache offline do catálogo ou da área administrativa.

A assinatura do rodapé é Ramon Paulino Mendes, ramonpmendesx@gmail.com e WhatsApp 5541999751171, conforme pedido explícito do proprietário. É contato de autoria, separado do único WhatsApp comercial 5547996180088. Nunca redirecionar cotações comerciais para o contato do autor.
