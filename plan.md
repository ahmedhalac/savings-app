# Savings App

## Description

The application enables users to track and manage their savings across multiple accounts.

### Core Features

- Add money to savings accounts
- Create savings goals with optional deadlines
- Support unexpected withdrawals with a required explanation for why funds were withdrawn
- Display transaction history (deposits and withdrawals) with dates in a list view
- Automatically calculate and display the total balance across all connected accounts

### Multi-Account Support

The application supports multiple savings and current accounts. On first launch, the user creates their own accounts with custom names and types (savings or current). Any number of accounts can be created during setup; account names are set once and are not editable after creation.

The total savings balance may be distributed across multiple accounts, and the application should aggregate all balances into a single financial overview.

### Buffer Account

A single dedicated Buffer account can be created to track unexpected expenses (e.g. car repairs, sudden costs). Rules:

- Only one Buffer account may exist at a time — the backend enforces this with a 409 Conflict response.
- The Buffer account is displayed as a separate section on the dashboard, below the main accounts section.
- It is **excluded** from Total Balance and Net Available — it is completely separate from savings tracking.
- It supports the full transaction history (deposit/withdraw) available in the Transactions page.
- Buffer accounts cannot be created via the standard "Add Account" flow; they have a dedicated "Create Buffer Account" action in the Buffer section.

### Loan Tracking

The application also supports loan tracking directly connected to savings.

Example:

- Total savings: `20,000 KM`
- Active loans: `-3,500 KM`

Loans should not directly reduce the displayed savings balance. Instead, they should be presented separately to provide a clear overview of:

- Total saved funds
- Money currently loaned out
- Net available balance

### Authentication & Authorization

The app requires user accounts so each person's data is fully isolated. Auth is handled by **Better Auth**, a TypeScript-native library that runs inside the NestJS backend and manages its own tables in the existing PostgreSQL database via the Prisma adapter.

**Sign-in options:**
- Email + password (registration + login)
- Sign in with Google (Gmail)
- Sign in with Microsoft (Outlook)

**Rules:**
- All routes (frontend and API) are protected — unauthenticated users are redirected to `/login`.
- Every piece of app data (accounts, goals, loans) is scoped to the authenticated user via a `userId` FK on each table.
- Session is managed via a cookie; the frontend sends `withCredentials: true` on all requests.
- The login and register pages follow the existing minimalistic design (same tokens, card layout, mobile-first).
- Social logins automatically register the user on first use.

**Backend impact:**
- The Prisma `Account` model (savings accounts) is renamed to `AppAccount` (with `@@map("accounts")`) to avoid a naming conflict with Better Auth's own `Account` model (used for OAuth connections).
- Better Auth mounts its handlers at `/api/auth/*` inside the NestJS app.
- A global auth guard (from `@thallesp/nestjs-better-auth`) protects all routes automatically.

---

# Project Structure

The project will use a monorepo structure:

```text
savings-app/
├── frontend/
└── backend/
```

## Development Order

The application will be developed in the following order:

1. Database
2. Backend
3. Frontend

# Tech Stack

- **Frontend:** Angular 20
- **Backend:** NestJS
- **Database:** PostgreSQL

## Design

- **Style:** Minimalistic — clean layouts, minimal decoration, only essential UI elements
- **Responsive:** Mobile-first design; the app is primarily used on a phone
