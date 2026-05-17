# Savings App Tasks

> Use MCP servers wherever possible (e.g. PostgreSQL MCP server for database operations, any other available MCP integrations for relevant tasks).

## Database

> ORM: Prisma (used for all database access and schema management)

- [x] Initialize PostgreSQL database and configure connection
- [x] Create `accounts` table (id, name, type: savings|current, balance, created_at)
- [x] Create `transactions` table (id, account_id, type: deposit|withdrawal, amount, note, created_at)
- [x] Create `goals` table (id, account_id, name, target_amount, deadline, created_at)
- [x] Create `loans` table (id, borrower_name, amount, created_at)
- [x] Seed initial accounts (Primary Savings, Primary Current, Secondary Current)

---

## Backend

### Accounts

- [x] `GET /accounts` — list all accounts with balances
- [x] `GET /accounts/summary` — return total balance aggregated across all accounts

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

### AI Assistant

- [ ] `POST /ai/recommend` — accept (salary, balance, goal_amount, deadline), return savings recommendations via Claude API

---

## Frontend

### Setup

- [x] Scaffold Angular 20 project inside `frontend/`
- [x] Configure HTTP client and environment files (API base URL)
- [x] Set up routing with lazy-loaded feature modules
- [x] Configure mobile-first responsive styles (viewport meta, base breakpoints)
- [x] Establish minimalistic design tokens: neutral color palette, single font, tight spacing scale

### Dashboard

- [ ] Display total balance aggregated across all accounts
- [ ] Display each account card with name, type, and balance
- [ ] Display total loaned amount separately below savings balance
- [ ] Display net available balance (total savings − total loans)

### Transactions

- [ ] Deposit form: account selector, amount field, submit button
- [ ] Withdrawal form: account selector, amount field, required explanation field
- [ ] Transaction history list per account: type, amount, note, date

### Goals

- [ ] Create goal form: name, target amount, optional deadline date picker
- [ ] Goals list view showing name, target, and optional deadline
- [ ] Delete goal action

### Loans

- [ ] Create loan form: borrower name, amount
- [ ] Loans list view showing borrower, amount, date
- [ ] Mark loan as returned action

### AI Assistant

- [ ] AI assistant panel/modal with inputs: monthly salary, current balance, goal amount, deadline
- [ ] Submit to backend and display recommendation text response
