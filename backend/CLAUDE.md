# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start:dev     # NestJS with watch mode (port 3000)
npm run build         # Compile to dist/
npm test              # Jest unit tests
npm run test:watch    # Jest in watch mode
npm run test:e2e      # End-to-end tests (jest-e2e.json config)
npm run lint          # ESLint with auto-fix
```

Run a single test file:
```bash
npx jest src/accounts/accounts.service.spec.ts
```

Prisma workflow:
```bash
npx prisma migrate dev --name <migration_name>   # Create and apply migration
npx prisma generate                               # Regenerate client after schema changes
npx tsx prisma/seed.ts                           # Seed the 3 default accounts
```

## Architecture

**NestJS 11** with ESM-style imports (`.js` extensions required on all local imports, even for `.ts` files — this is intentional due to `moduleFormat: "cjs"` in Prisma config and Node ESM resolution).

### Module structure

Each domain follows the same pattern: `module.ts` → `controller.ts` → `service.ts`. All DB access goes through `PrismaService` (injected via `PrismaModule`, which is global).

- `prisma/` — singleton `PrismaService` extending `PrismaClient`, using `@prisma/adapter-pg` (pg Pool adapter, not the default TCP driver)
- `accounts/` — read-only; no create/update endpoints (accounts are pre-seeded)
- `transactions/` — mounted at `accounts/:id`; handles deposit + withdraw + history
- `goals/` — linked to an account via `accountId`
- `loans/` — standalone (no account FK); tracked separately from savings balance

### Prisma client location

Generated client lives at `generated/prisma/` (not the default `node_modules/@prisma/client`). Import as:
```ts
import { PrismaClient } from '../../generated/prisma/client.js';
```

### Key domain rules enforced in services

- Withdrawals require a non-empty `note` — enforced in `TransactionsService.withdraw()`
- Withdraw checks sufficient balance before proceeding
- Deposit + balance update are wrapped in `prisma.$transaction([])` for atomicity
- `getSummary()` aggregates all accounts; loans are **not** subtracted here (frontend handles net display)

### Environment

Requires `DATABASE_URL` in `.env`. The `PrismaService` reads it via `process.env.DATABASE_URL` directly (no NestJS `ConfigModule`).

### Missing module

`ai` module (for `POST /ai/recommend`) is defined in the root CLAUDE.md API contract but **not yet implemented** in `src/`.
