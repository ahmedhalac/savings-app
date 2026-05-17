---
name: modern-angular-best-practices
description: Complete Angular 20 best practices guide for architecture, components, state management, performance, RxJS, forms, styling, testing, and scalable enterprise development using Zone.js.
---

# Modern Angular 20 Best Practices

You are an expert Angular 20 engineer building scalable, maintainable, high-performance enterprise applications using Zone.js.

Always follow these standards when generating, reviewing, or refactoring Angular code.

---

# Core Engineering Principles

- Prefer simplicity over abstraction.
- Avoid premature optimization.
- Write predictable and explicit code.
- Keep components small and focused.
- Push business logic outside components.
- Prefer composition over inheritance.
- Avoid tight coupling between features.
- Optimize for long-term maintainability.
- Never introduce complexity without a measurable benefit.

---

# Project Architecture

## Use Feature-Based Structure

Prefer:

```txt
src/
  app/
    core/
    shared/
    features/
      savings/
        pages/
        components/
        services/
        store/
        models/
        pipes/
        utils/
```

Avoid global type-based folders:

```txt
components/
services/
pipes/
```

---

# Folder Responsibilities

## core/

Contains singleton application-wide logic:

- interceptors
- guards
- authentication
- global services
- app initialization

## shared/

Contains reusable generic functionality:

- buttons
- modals
- reusable components
- directives
- pipes

Shared should never contain business logic.

## features/

Contains isolated business domains.

Each feature owns its:

- UI
- services
- state
- models
- routes

---

# Standalone Components

Always use standalone APIs.

Good:

```ts
@Component({
  standalone: true,
})
export class SavingsCardComponent {}
```

Avoid NgModules unless legacy compatibility requires them.

---

# Change Detection Strategy

Application uses Zone.js.

Rules:

- Use `ChangeDetectionStrategy.OnPush` by default.
- Never mutate state directly.
- Prefer immutable updates.
- Avoid triggering unnecessary change detection.

Good:

```ts
this.transactions = [...this.transactions, transaction];
```

Bad:

```ts
this.transactions.push(transaction);
```

---

# Modern Angular APIs

Prefer modern Angular APIs.

Use:

- `signal`
- `computed`
- `effect`
- `inject`
- `input`
- `output`
- `model`
- `takeUntilDestroyed`
- `@if`
- `@for`
- `@defer`

Avoid outdated patterns unless necessary.

---

# Dependency Injection

Prefer `inject()` over constructor injection.

Good:

```ts
private readonly api = inject(ApiService);
```

Avoid:

```ts
constructor(private api: ApiService) {}
```

---

# Component Design

## Components Should

- Handle UI concerns only
- Be small and focused
- Have one responsibility
- Be reusable when appropriate
- Receive data through inputs
- Emit events through outputs

Avoid giant components.

---

# Smart vs Presentational Components

## Smart Components

Responsible for:

- fetching data
- orchestration
- state management
- side effects

## Presentational Components

Responsible for:

- rendering UI
- displaying data
- emitting events

Presentational components should remain dumb.

---

# Signal-Based Inputs & Outputs

Prefer modern signal APIs.

Good:

```ts
readonly account = input.required<Account>();

readonly deleted = output<string>();
```

Avoid:

```ts
@Input() account!: Account;

@Output() deleted = new EventEmitter<string>();
```

---

# Template Best Practices

Templates should remain simple.

Avoid:

- large inline expressions
- nested ternaries
- calling methods repeatedly
- business logic in templates

Bad:

```html
<div>{{ calculateBalance() }}</div>
```

Good:

```ts
readonly balance = computed(() => ...);
```

---

# Control Flow Syntax

Prefer modern Angular syntax.

Good:

```html
@if (loading()) {
  <app-spinner />
}

@for (transaction of transactions(); track transaction.id) {
  <app-transaction-row />
}
```

Avoid legacy syntax when possible:

```html
*ngIf
*ngFor
```

---

# Signals

Use signals for local synchronous state.

Good use cases:

- UI state
- filters
- toggles
- local form state
- derived values

Example:

```ts
readonly loading = signal(false);

readonly filteredAccounts = computed(() =>
  this.accounts().filter(account => account.active)
);
```

---

# RxJS Best Practices

Use RxJS for:

- HTTP streams
- WebSockets
- async orchestration
- external streams
- event streams

Avoid using RxJS for simple local state.

---

# RxJS Rules

Never nest subscriptions.

Bad:

```ts
this.api.getUser().subscribe(user => {
  this.api.getAccounts(user.id).subscribe();
});
```

Good:

```ts
this.api.getUser().pipe(
  switchMap(user => this.api.getAccounts(user.id))
);
```

Prefer:

- `switchMap`
- `combineLatest`
- `forkJoin`
- `map`
- `tap`
- `catchError`

Always cleanup subscriptions.

Use:

```ts
takeUntilDestroyed()
```

Or:

```html
async pipe
```

---

# State Management

Use the simplest solution possible.

Preferred order:

1. Signals
2. Service state
3. RxJS state
4. NgRx only when truly necessary

Do not introduce NgRx for small applications.

---

# Services

Services should contain:

- business logic
- API communication
- shared reusable logic
- orchestration
- state handling

Avoid placing business logic inside components.

---

# HTTP Standards

Always use typed responses.

Good:

```ts
getAccounts(): Observable<Account[]>
```

Never use:

```ts
Observable<any>
```

Always define interfaces/types/models.

---

# Models

Keep models close to the feature.

Example:

```txt
features/
  savings/
    models/
      account.model.ts
      transaction.model.ts
```

Prefer explicit types.

Good:

```ts
export interface Transaction {
  readonly id: string;
  readonly amountInCents: number;
}
```

---

# TypeScript Rules

Strict mode must remain enabled.

Avoid:

- `any`
- implicit types
- non-null assertions when avoidable
- oversized interfaces

Prefer:

- union types
- utility types
- readonly
- exact typing

Good:

```ts
type Status = 'idle' | 'loading' | 'success' | 'error';
```

---

# Forms

Prefer Reactive Forms.

Avoid Template-driven Forms for complex applications.

Use strongly typed forms.

Good:

```ts
readonly form = this.fb.nonNullable.group({
  name: ['', Validators.required],
  amount: [0, Validators.min(1)],
});
```

---

# Validation

Keep validation predictable.

Validate:

- required fields
- numeric ranges
- currency inputs
- edge cases
- empty states

Never trust frontend validation alone.

---

# Error Handling

Never silently swallow errors.

Always expose UI states:

- loading
- error
- empty
- success

Good:

```ts
catchError(error => {
  this.error.set(true);
  return EMPTY;
})
```

---

# Performance Optimization

Always optimize rendering behavior.

Use:

- `track` in `@for`
- `OnPush`
- lazy loading
- deferrable views
- memoized computed values

Example:

```html
@defer {
  <app-heavy-chart />
}
```

---

# Lazy Loading

All major features should be lazy loaded.

Good:

```ts
{
  path: 'savings',
  loadComponent: () =>
    import('./pages/savings.page').then(m => m.SavingsPage),
}
```

---

# Styling Standards

Use SCSS.

Rules:

- avoid inline styles
- avoid deep nesting
- avoid `!important`
- keep styles scoped
- use CSS variables for theming

---

# Naming Conventions

## Files

Use kebab-case.

Good:

```txt
savings-summary.component.ts
```

## Classes

Use PascalCase.

## Variables

Use camelCase.

## Constants

Use UPPER_SNAKE_CASE only for true constants.

## Observables

Suffix observables with `$`.

Example:

```ts
accounts$
```

---

# Accessibility

Accessibility is mandatory.

Rules:

- use semantic HTML
- support keyboard navigation
- provide aria labels
- ensure focus visibility
- maintain contrast ratios

Avoid clickable divs.

Bad:

```html
<div (click)="save()"></div>
```

Good:

```html
<button type="button" (click)="save()"></button>
```

---

# Testing Strategy

Test behavior, not implementation details.

Prefer:

- Angular Testing Library
- integration-style tests
- component harnesses

Avoid fragile over-mocked tests.

Test:

- user interactions
- rendering states
- form validation
- API integration behavior

---

# Code Review Rules

Reject code that:

- uses `any`
- mutates state
- creates giant components
- contains duplicated logic
- has nested subscriptions
- hides side effects
- mixes UI with business logic
- has unclear naming
- performs expensive template operations

---

# Savings App Financial Rules

Financial calculations must be deterministic.

Never use floating-point math for money.

Bad:

```ts
balance = 1250.55;
```

Good:

```ts
balanceInCents = 125055;
```

Always:

- use integer cents
- validate numeric input
- format currency consistently
- avoid precision loss

---

# Security Practices

Never trust frontend data.

Always:

- sanitize user input
- validate backend responses
- handle authorization properly
- avoid exposing sensitive data
- avoid storing secrets in frontend code

---

# Routing Best Practices

Keep routes feature-oriented.

Good:

```txt
/features/savings
/features/accounts
/features/reports
```

Avoid deeply nested unnecessary routing.

---

# Environment Configuration

Keep environment configuration centralized.

Never hardcode:

- API URLs
- tokens
- environment flags

---

# Reusability Guidelines

Before creating reusable abstractions ask:

- Is this duplicated?
- Is the abstraction simpler than duplication?
- Will this actually be reused?

Do not create abstractions too early.

---

# Angular Philosophy

Write Angular code that:

- scales well
- is easy to debug
- minimizes hidden behavior
- is explicit
- is readable by new developers
- avoids framework magic
- reduces cognitive load

Prioritize maintainability over cleverness.