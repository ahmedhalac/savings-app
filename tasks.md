# Savings App Tasks

> Use MCP servers wherever possible (e.g. PostgreSQL MCP server for database operations, any other available MCP integrations for relevant tasks).

## Database

> ORM: Prisma (used for all database access and schema management)

- [x] Initialize PostgreSQL database and configure connection
- [x] Create `accounts` table (id, name, type: savings|current|buffer, balance, created_at)
- [x] Add `buffer` value to `AccountType` enum (migration: `add_buffer_account_type`)
- [x] Create `transactions` table (id, account_id, type: deposit|withdrawal, amount, note, created_at)
- [x] Create `goals` table (id, account_id, name, target_amount, deadline, created_at)
- [x] Create `loans` table (id, borrower_name, amount, created_at)
- [x] ~~Seed initial accounts~~ — replaced by first-time setup flow

---

## Backend

### Accounts

- [x] `POST /accounts` — create a new account (name, type)
- [x] `GET /accounts` — list all accounts with balances
- [x] `GET /accounts/summary` — return total balance aggregated across all accounts
- [x] `DELETE /accounts/:id` — delete account (cascades transactions and goals)
- [x] Enforce single Buffer account constraint (409 Conflict if one already exists)

### Transactions

- [x] `POST /accounts/:id/deposit` — add money to an account
- [x] `POST /accounts/:id/withdraw` — withdraw from an account (require `note` field)
- [x] `GET /accounts/:id/transactions` — list transactions for an account (date-sorted)

### Goals

- [x] `POST /goals` — create a savings goal (name, target_amount, optional deadline)
- [x] `GET /goals` — list all goals
- [x] `DELETE /goals/:id` — delete a goal

### Loans

- [x] `POST /loans` — create a loan record (borrower_name, amount)
- [x] `GET /loans` — list all loans with total loaned amount
- [x] `DELETE /loans/:id` — mark loan as returned

### Auth (Better Auth)

- [x] Rename Prisma `Account` model → `AppAccount` with `@@map("accounts")` to avoid conflict with Better Auth's own `Account` model
- [x] Install `better-auth` and `@thallesp/nestjs-better-auth` in backend
- [x] Add Better Auth models to Prisma schema via `npx auth@latest generate`
- [x] Add `userId` FK to `AppAccount`, `Goal`, and `Loan` models
- [x] Run fresh migration (`add_auth_and_user_scope`) — wipes existing data
- [x] Create `src/auth/auth.ts` — Better Auth config with Prisma adapter, email+password, Google
- [x] Create `src/auth/auth.module.ts` — register `AuthModule.forRoot({ auth })`
- [x] Update `main.ts` — disable body parser (`bodyParser: false`)
- [x] Update `app.module.ts` — import `AuthModule`
- [x] Add env vars: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
- [x] Update all controllers to extract `userId` from `@Session()` and pass to services
- [x] Update all services to filter/create data by `userId` (accounts, transactions, goals, loans)
- [x] Replace all `prisma.account.*` calls with `prisma.appAccount.*` throughout backend

---

## Frontend

### Setup

- [x] Scaffold Angular 20 project inside `frontend/`
- [x] Configure HTTP client and environment files (API base URL)
- [x] Set up routing with lazy-loaded feature modules
- [x] Configure mobile-first responsive styles (viewport meta, base breakpoints)
- [x] Establish minimalistic design tokens: neutral color palette, single font, tight spacing scale
- [x] First-time account setup flow (`/setup`) — shown when no accounts exist; guarded once accounts are created

### Dashboard

- [x] Display total balance aggregated across all accounts
- [x] Display each account card with name, type, and balance
- [x] Display total loaned amount separately below savings balance
- [x] Display net available balance (total savings − total loans)
- [x] Display Buffer account in a separate section below the main accounts section
- [x] "Create Buffer Account" action shown only when no buffer account exists

### Transactions

- [x] Deposit form: account selector, amount field, submit button
- [x] Withdrawal form: account selector, amount field, required explanation field
- [x] Transaction history list per account: type, amount, note, date

### Goals

- [x] Create goal form: name, target amount, optional deadline date picker
- [x] Goals list view showing name, target, and optional deadline
- [x] Delete goal action

### Loans

- [x] Create loan form: borrower name, amount
- [x] Loans list view showing borrower, amount, date
- [x] Mark loan as returned action

### Auth (Better Auth)

- [x] Install `better-auth` in frontend
- [x] Create `core/auth/auth.client.ts` — `createAuthClient` pointing to backend
- [x] Create `core/auth/auth.service.ts` — Angular signal-based service (session, isAuthenticated, signIn, signOut)
- [x] Create `core/interceptors/credentials.interceptor.ts` — adds `withCredentials: true` to all requests
- [x] Register credentials interceptor in `app.config.ts`
- [x] Create `core/guards/auth.guard.ts` — redirect to `/login` if not authenticated
- [ ] Update `app.routes.ts` — add `/login` and `/register` routes; wrap all existing routes under `authGuard`
- [ ] Create `features/auth/login` — email/password form + Google
- [ ] Create `features/auth/register` — name + email + password form + social buttons
- [ ] Style login/register pages using existing design tokens (card layout, mobile-first)
