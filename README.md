# CRM BIA

Sistema de gestão de leads para imobiliárias com pipeline visual, integração WhatsApp e dashboard de métricas.

## 🚀 Funcionalidades MVP

- ✅ Autenticação e controle de acesso (Admin, Gestor, Atendente)
- ✅ Dashboard com funil de vendas visual
- ✅ Pipeline Kanban com drag & drop
- ✅ Gestão de leads com campos personalizados
- ✅ Integração básica com WhatsApp (abre WhatsApp Web)
- ✅ Importação de leads via CSV
- ✅ Histórico de interações
- ✅ Relatórios básicos
- ✅ Busca de leads
- ✅ Tags e categorização

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 14+ (ou usar SQLite para desenvolvimento)
- npm ou yarn

## 🛠️ Instalação

### 1. Instale as dependências

```bash
npm run install:all
```

### 2. Configure o banco de dados

Crie um arquivo `.env` na pasta `backend` com as variáveis de ambiente:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/crm_bia
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

**Nota:** Se não tiver PostgreSQL instalado, você pode usar um serviço como [Supabase](https://supabase.com) ou [Railway](https://railway.app) para obter uma URL de banco de dados gratuita.

### 3. Execute as migrações

```bash
cd backend
npm run migrate
```

Isso criará todas as tabelas necessárias no banco de dados.

### 4. Inicie o servidor de desenvolvimento

Na raiz do projeto:

```bash
npm run dev
```

Isso iniciará tanto o backend quanto o frontend simultaneamente.

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## 📁 Estrutura do Projeto

```
crm-bia/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── contexts/      # Context API (Auth)
│   │   ├── pages/        # Páginas da aplicação
│   │   └── services/     # Serviços API
│   └── package.json
├── backend/               # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── database/     # Configuração e migrações do banco
│   │   ├── middleware/   # Middlewares (auth)
│   │   ├── routes/       # Rotas da API
│   │   └── index.ts      # Entry point
│   └── package.json
└── README.md
```

## 🔐 Primeiro Acesso

1. Acesse `http://localhost:5173`
2. Clique em "Não tem conta? Registre-se"
3. Crie sua conta (o primeiro usuário será automaticamente admin)
4. Faça login e comece a usar!

## 📖 Como Usar

### Dashboard
- Visualize o funil de vendas com todas as etapas
- Veja métricas de conversão entre etapas
- Acompanhe estatísticas de vendas

### Pipeline de Leads
- Arraste e solte leads entre as colunas para mudar o status
- Clique no ícone do WhatsApp para abrir conversa
- Clique em "Editar" para modificar informações do lead
- Use a busca para encontrar leads rapidamente

### Importar Leads
1. Prepare um arquivo CSV com as colunas: `name`, `phone`, `email`, `origin`
2. Clique em "Importar CSV"
3. Selecione o arquivo
4. Os leads serão importados automaticamente

### Criar Lead Manualmente
1. Clique em "Novo Lead"
2. Preencha as informações
3. Selecione o status inicial
4. Salve

## 🔧 Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- @dnd-kit (drag & drop)
- Axios

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT (autenticação)
- bcrypt (hash de senhas)

## 🚧 Próximas Funcionalidades (v2, v3)

- Automação de mensagens via WhatsApp API
- Integração com Meta Ads e Google Ads
- Alertas e notificações
- Integração com IA para responder leads
- Agenda de compromissos
- Relatórios avançados (CPL, CPA, ROI)
- Aplicativo mobile nativo
- Multi-empresa

## 📝 Licença

MIT

