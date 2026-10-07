# Infraestrutura — passo a passo
O usuário informou a compra de carolcomponentes.com.br. Esta entrega não alterou DNS, contratou correio ou criou caixas. Seguir também DEPLOY_MANUAL.md para os dois alvos de build.

## Domínio e hospedagem
1. Confirmar registro de carolcomponentes.com.br no Registro.br, titular correto, e-mail de recuperação, autenticação em duas etapas, renovação e responsáveis.
2. Inventariar DNS atual antes de alterar nameservers; guardar cópia e registrar fornecedores.
3. Criar zona Cloudflare na conta da empresa; reproduzir registros, confirmar domínio e apontar nameservers no registrador. Não alterar domínio compartilhado com Curitiba.
4. Definir hospedagem definitiva. Homologação atual usa Sites/ChatGPT Pages com Worker/D1. Verificar suporte e condições para domínio próprio antes de decidir apontamento; não supor que o link de validação já conecta automaticamente ao domínio. Se necessário, planejar implantação da mesma aplicação em Cloudflare Workers com D1 e migrações.
5. Configurar domínio apex e www de acordo com o destino real informado pela hospedagem; TLS válido, renovação automática, redirecionamento para URL canônica e HTTPS.
6. Separar homologação privada e produção pública; banco e segredos separados. Secrets só no servidor, backup/exportação de dados e procedimento de restauração.
7. Antes da virada: TTL reduzido, certificado, roteamento /produto, download PDF, formulários, banco e observabilidade. Depois: sitemap/robots/canonical/Search Console e monitoramento de erros.

## Google Workspace e preservação do histórico
1. Levantar provedor atual, caixas, tamanhos, aliases, grupos, domínios, IMAP, contatos, calendários, regras, dispositivos e usuários. Confirmar quem administra e a data contratual de separação.
2. Contratar quantidade de licenças necessária e verificar domínio por TXT. Definir caixas e aliases somente com aprovação. Os endereços autorizados exibidos são vendas@carolcomponentes.com.br e lojavirtual@carolcomponentes.com.br; provisionar e testar antes da virada.
3. Criar usuários, grupos e permissões; ativar MFA, recuperação e regras de acesso.
4. Fazer backup/exportação das caixas antigas e validar leitura de amostras. Usar ferramenta de migração compatível com o provedor real; preservar pastas, datas e anexos. Migração de mensagens não garante migração de calendário/regras.
5. Fazer piloto com uma caixa, comparar contagens por pasta e mensagens antigas/novas, pesquisar anexos e testar envio/recebimento externo.
6. Migrar lote inicial sem desligar o provedor antigo. Executar migração incremental imediatamente antes da mudança de MX.
7. Aplicar MX exatos da documentação atual do provedor; TXT SPF com todos os remetentes legítimos, apenas um SPF por domínio; DKIM conforme seletor gerado; DMARC inicialmente monitorado e endurecido após analisar relatórios.
8. Testar recebimento externo, entrega, resposta, alias e grupo. Configurar clientes/dispositivos. Avisar clientes conforme estratégia aprovada.
9. Manter 90 dias de sobreposição acordada; verificar encaminhamento e histórico, reconciliar e exportar backup final. Só desativar origem após aceite por caixa.
10. Documentar retorno: recuperar DNS anterior, manter caixas antigas, não apagar mensagens e registrar impacto/duplicidade. Não encerrar provedor compartilhado sem acordo com Curitiba.

## E-mail transacional do site
1. Escolher provedor, verificar domínio/remetente e configurar API key secreta. Correio Workspace e serviço transacional têm funções diferentes.
2. Confirmar destinatário interno final; homologação inicial seria Ramon, mas usuário optou por envio demonstrativo nesta versão.
3. Implementar fila/idempotência e rastreio de entrega. Fluxo real: validar CNPJ/telefone → persistir → enviar → confirmar aceite do provedor → abrir WhatsApp preenchido.
4. Em erro: manter pedido recuperável, mostrar falha e permitir repetição sem duplicar. Definir como vendas acompanha pendências.
5. Testar remetente, SPF/DKIM, destinatário, anexos se houver, spam, rejeição, timeout e retentativa. Ativar modo real apenas após teste e aceite.

## Operação
Responsáveis e contas pertencem à empresa. Definir retenção de CNPJ/telefone, acesso interno, exportação e exclusão. Nunca guardar dados pessoais no GitHub. Monitorar indisponibilidade, falhas de formulário e correio; manutenção e valores dependem de contrato, não foram contratados por esta entrega.
