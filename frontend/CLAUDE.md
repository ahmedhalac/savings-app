# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- Angular 20 (standalone components — NO NgModule, ever)
- TypeScript 5.9
- RxJS 7 (HTTP only — not for state)
- Karma + Jasmine (test runner)

## Non-Negotiable Rules

- ALWAYS use `inject()` — zero constructor injection
- ALWAYS use `input()` / `output()` — zero `@Input()` / `@Output()` decorators
- ALWAYS use `@if` / `@for` — zero `*ngIf` / `*ngFor`
- ALWAYS `ChangeDetectionStrategy.OnPush` on every component
- State lives in signal stores — zero `BehaviorSubject`
- After generating code, run `ng build` and fix ALL errors before finishing

## Commands

```bash
ng serve                                    # Dev server (port 4200)
ng build                                    # Production build
ng test                                     # Run all tests (Karma)
ng test --include="**/foo.spec.ts"          # Run a single test file
```

## Folder Layout

```
src/app/
  core/       → interceptors, guards, singleton services (HttpClient, API base)
  features/   → feature-sliced: accounts/, transactions/, goals/, loans/, ai/
  shared/     → reusable dumb components, pipes, directives
  models/     → TypeScript interfaces only
```

## Architecture

- Routing: lazy-loaded feature routes defined in `app.routes.ts`; each feature has its own `*.routes.ts`
- HTTP: `HttpClient` provided via `provideHttpClient()` in `app.config.ts`; `apiBaseUrl` set in `environment.ts`
- State: Angular signals and signal stores — no NgRx, no BehaviorSubject
- Change detection: zoneless-friendly; `provideZoneChangeDetection({ eventCoalescing: true })` is already wired
- Components follow the domain boundary of the backend API: accounts, transactions, goals, loans, ai
