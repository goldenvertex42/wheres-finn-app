# 🚀 "Where's Finn?" — Where's Waldo Clone Monorepo

An arcade-style "Where's Waldo" clone built with a unified runtime environment utilizing **NPM Workspaces**. Players target characters hidden across a scene canvas with secure, server-side validated timestamp scoring metrics.

## 📂 Architecture Blueprint
The repository is split into three synchronized local workspace packages to completely isolate graph dependencies:
* `/frontend`: React + Vite client-side user view orchestration layer.
* `/backend`: Express API utilizing strict native ES Modules (`"type": "module"`).
* `/db`: Centralized local workspace layer housing schemas, migrations, and Prisma models.

## 🛠️ Global Prerequisites & Infrastructure
* **Node.js**: `v22.x` or higher recommended.
* **Database**: Native PostgreSQL instance layer.

### Deployment Environment Mappings (`/.env`)
Create a `.env` file at the repository root matching this exact specification system profile:
```text
DATABASE_URL="postgresql://username:password@localhost:5432/wheres_finn_local?schema=public"
VITE_API_URL="http://localhost:3000"
NODE_ENV="development"
PRODUCTION_FRONTEND_URL="netlify.app"
```

## ⚡ Unified Development Execution Workflow
All workspace scripts are driven centrally from this root folder. Avoid navigating into subfolders.

```bash
# 1. Clean bootstrap installation of internal monorepo dependencies
npm install

# 2. Push schema mappings and run database target seed inputs
npx prisma db push --schema=db/prisma/schema.prisma
npx prisma generate --schema=db/prisma/schema.prisma
node db/prisma/direct-seed.js

# 3. Spin up both Vite and Express in parallel watch streams
npm run dev
```
