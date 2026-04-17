# Global Pharma Human - Marketplace

Este repositório contém o frontend (Next.js) e o backend (Node/Express) do marketplace Global Pharma Human.

## Estrutura do Projeto

- `/` (raiz): Frontend em Next.js.
- `/backend`: Backend em Node.js com Express e Prisma.

---

## Como Rodar no Ubuntu Server (Produção com PM2)

### 1. Pré-requisitos
- Node.js (v20+)
- PostgreSQL instalado e rodando
- PM2 instalado globalmente (`npm install -g pm2`)

### 2. Configuração de Variáveis de Ambiente

Crie os arquivos `.env` baseando-se nos exemplos:

**Frontend (raiz):**
```bash
cp .env.example .env
# Edite o .env com os dados reais
```

**Backend (`/backend`):**
```bash
cp backend/.env.example backend/.env
# Edite o backend/.env com os dados reais do banco e JWT
```

### 3. Instalação e Build

**Backend:**
```bash
cd backend
npm install
npm run prisma:generate
npm run build
cd ..
```

**Frontend:**
```bash
npm install
npm run prisma:generate
npm run build
```

### 4. Iniciando com PM2

Na raiz do projeto, utilize o arquivo de configuração do ecossistema:

```bash
pm2 start ecosystem.config.cjs
```

Isso iniciará dois processos:
- `globalpharmahuman-frontend` (Porta 3000)
- `globalpharmahuman-backend` (Porta 4000)

**Comandos úteis do PM2:**
```bash
pm2 status             # Verifica o status dos processos
pm2 logs               # Visualiza os logs em tempo real
pm2 restart all        # Reinicia ambos os serviços
pm2 save               # Salva a lista de processos para o boot
pm2 startup            # Gera o comando para iniciar o PM2 no boot do sistema
```

---

## Desenvolvimento Local

### Iniciar Backend:
```bash
cd backend
npm run dev
```

### Iniciar Frontend:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000` e o backend em `http://localhost:4000`.
