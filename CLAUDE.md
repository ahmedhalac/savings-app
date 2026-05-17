# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Keep your replies extremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensure that you're working with up-to-date information.
Use the DocsExplorer subagent for efficient documentation lookup.

## Project Overview

A personal savings management app with an AI financial assistant. Users track balances across multiple accounts (Primary Savings, Primary Current, Secondary Current), manage savings goals, log deposits/withdrawals, and track loans. An AI assistant (Claude API) provides savings recommendations based on salary and goals.

**Tech Stack:** Angular 20 (frontend) · NestJS 11 (backend) · PostgreSQL + Prisma (database)

## Commands

### Root (runs both services)
```bash
npm run dev          # Start frontend + backend concurrently
npm run frontend     # Angular dev server only (port 4200)
npm run backend      # NestJS dev server only (port 3000, watch mode)
```

### Frontend (`cd frontend`)
```bash
ng serve             # Dev server
ng build             # Production build
ng test              # Run Karma/Jasmine tests
ng test --include="**/foo.spec.ts"  # Run a single test file
```

### Backend (`cd backend`)
```bash
npm run start:dev    # NestJS with watch mode
npm run build        # Compile to dist/
npm test             # Jest unit tests
npm run test:watch   # Jest in watch mode
npm run test:e2e     # End-to-end tests
npm run lint         # ESLint with auto-fix
```

## Architecture

### Monorepo layout
```
savings-app/
├── frontend/   Angular 20 SPA
├── backend/    NestJS REST API
├── plan.md     Feature spec and domain rules
└── tasks.md    Remaining implementation checklist
```

### Backend (NestJS)
- Feature modules: `accounts`, `transactions`, `goals`, `loans`, `ai`
- ORM: **Prisma** for all database access and schema migrations — do not use raw SQL directly
- MCP servers should be used where available (e.g., PostgreSQL MCP for DB operations)
- API contract (from `tasks.md`):
  - `GET /accounts`, `GET /accounts/summary`
  - `POST /accounts/:id/deposit`, `POST /accounts/:id/withdraw` (requires `note`)
  - `GET /accounts/:id/transactions`
  - `POST|GET|DELETE /goals`
  - `POST|GET|DELETE /loans`
  - `POST /ai/recommend` — calls Claude API with (salary, balance, goal_amount, deadline)

### Frontend (Angular 20)
- Standalone components, lazy-loaded feature modules per domain (accounts, transactions, goals, loans, ai)
- Mobile-first, minimalistic design — neutral palette, single font, tight spacing
- Environment files configure `apiBaseUrl`; use Angular's `HttpClient` for all API calls

### Domain rules (from `plan.md`)
- Loans are tracked separately and do **not** reduce the savings balance display; show net = savings − loans
- Withdrawals require a mandatory `note` (explanation field)
- Dashboard aggregates balances across all accounts (including buffer) into one total
- **Buffer account**: a single special-purpose account for unexpected expenses. Only one may exist — backend enforces 409 Conflict on duplicate. Displayed as a separate section on the dashboard below the main accounts; participates in transactions/history like any other account.
