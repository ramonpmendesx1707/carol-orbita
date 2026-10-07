# Publicação da proposta Carol Órbita

Leia README.md e AGENTS.md. Esta proposta tem projeto, URL, D1 e R2 separados. Nunca substituir o projeto carol-componentes original.

## Ambiente
Node 24.13.0, npm e package-lock.json. Em uma nova máquina execute npm run install:ci. Não copie node_modules. npm run dev inicia a prévia do Worker; npm run build produz dist/server/index.js com export default.fetch e assets em dist/client. npx tsc --noEmit valida os tipos.

## Sites
.openai/hosting.json é a identidade exclusiva deste projeto. Use o fluxo oficial Sites para preparar/push da fonte, construir o pacote, salvar uma versão e publicar. Migrações drizzle/ são schema-only e provisionam o banco independente. Não alterar migrações já aplicadas. Nunca apontar lib/api-client.ts para a primeira proposta.

## Servidor e autenticação
DB e BUCKET são bindings lógicos geridos pelo Sites. ADMIN_INITIAL_HASH é um segredo com salt:hash PBKDF2-SHA256, 100000 iterações, 32 bytes. Login inicial carol; a senha inicial deve ser transmitida ao gestor por canal separado, nunca incluída na fonte. A primeira entrada obriga a troca. Sessões duram 4 horas e carga de Excel exige autenticação. RESEND_API_KEY e EMAIL_FROM são opcionais; enquanto não configurados, mensagens ficam pendentes e o usuário continua no WhatsApp.

## Domínio oficial
Escolher esta proposta ou a primeira antes de associar o domínio oficial. Preservar a outra URL. Para hospedagem externa, o pacote Worker requer Cloudflare Workers/D1/R2 ou uma adaptação equivalente do backend. A exportação estática (npm run build:pages) tem apenas a interface; o backend deve ser publicado separadamente e VITE_CAROL_API_ORIGIN configurado com sua origem, incluindo CORS e HTTPS. A base padrão desta proposta é /. Não publicar páginas estáticas com API relativa sem backend.

## Revisão antes de subir
Verificar catálogo, imagens, galeria, comparação mobile, cotação, telefone/CNPJ, mapa e filtros por região, quatro capítulos em subida e descida, fontes/ícones locais, links, navegação por teclado e prefers-reduced-motion. Confirmar o histórico e condições comerciais com a empresa antes do domínio oficial. O catálogo e PDF são o mesmo snapshot técnico da proposta original; não representam confirmação de estoque atual.
