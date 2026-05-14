# 🗄️ Database Mappings & Models Workspace

Houses the core relational database layers, entity schemas, and localized Prisma artifacts. This folder is structured as an isolated npm workspace to completely block hoist conflicts.

## 🏗️ Prisma Client Config & Driver Adapters
Prisma utilizes a lightweight, zero-wasm JavaScript client. To establish clean PostgreSQL streaming threads without requiring a serverless proxy layer, a custom native pg pool driver loop is exported inside `db/src/index.js`.

### Explicit Schema Case Identifiers (`/prisma/schema.prisma`)
Models explicitly leverage the database map decorator attribute `@@map` to guarantee seamless mapping compatibility across double-quoted PostgreSQL system instances:
* `Character` table maps to lowercase database table `"character"`.
* `Leaderboard` table maps to lowercase database table `"leaderboard"`.

## 🚀 Setup & Structural Seeding
* Run schema push updates directly from the monorepo root:
  `npx prisma db push --schema=db/prisma/schema.prisma`
* Inject the 14 precise percentage win-zones and 10 arcade high scores:
  `node db/prisma/direct-seed.js`
