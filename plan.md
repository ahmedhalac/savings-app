# Savings App

## Description

The application enables users to track and manage their savings across multiple accounts.

### Core Features

* Add money to savings accounts
* Create savings goals with optional deadlines
* Support unexpected withdrawals with a required explanation for why funds were withdrawn
* Display transaction history (deposits and withdrawals) with dates in a list view
* Automatically calculate and display the total balance across all connected accounts

### AI Financial Assistant

The application includes an AI-powered assistant that provides personalized savings recommendations based on:

* Monthly salary
* Current savings balance
* Savings goal amount
* Target deadline

The AI assistant helps users optimize their saving strategy to achieve financial goals more efficiently.

### Multi-Account Support

The app supports multiple savings and current accounts, including:

* Ahmed — BBI Savings Account
* Ahmed — BBI Current Account (buffer for unexpected expenses)
* Ahmed — UniCredit Current Account
* Dzeneta — UniCredit Current Account

Part of the total savings may be distributed across different accounts, and the application should aggregate all balances into a single overview.

### Loan Tracking

The application also supports loan tracking directly connected to savings.

Example:

* Total savings: `20,000 KM`
* Active loans: `-3,500 KM`

Loans should not directly reduce the displayed savings balance. Instead, they should be presented separately to provide a clear overview of:

* Total saved funds
* Money currently loaned out
* Net available balance

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

* **Frontend:** Angular 19
* **Backend:** NestJS
* **Database:** PostgreSQL
