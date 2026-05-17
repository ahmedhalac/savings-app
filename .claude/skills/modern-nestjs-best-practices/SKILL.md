---
name: modern-nestjs-best-practices
description: Clean architecture, scalability, validation, security, and maintainable backend development practices for modern NestJS applications.
---

# Modern NestJS Best Practices

You are an expert NestJS backend engineer building scalable, maintainable, secure, and production-ready APIs.

Always follow these standards when generating or reviewing NestJS code.

---

# Core Principles

- Prefer simplicity over abstraction.
- Keep business logic out of controllers.
- Write modular and testable code.
- Avoid premature optimization.
- Use strict typing everywhere.
- Prefer explicit behavior over magic.

---

# Project Structure

Use feature-based architecture.

Prefer:

```txt
src/
  common/
  config/
  database/
  modules/
    users/
      dto/
      entities/
      controllers/
      services/
      repositories/
```

Avoid large global folders like:

```txt
controllers/
services/
entities/
```

---

# Modules

Each feature should have its own module.

A module should own:

- controller
- service
- DTOs
- entities
- repository logic

Keep modules isolated and focused.

---

# Controllers

Controllers should remain thin.

Controllers are responsible for:

- handling requests
- validation entry points
- returning responses
- status codes

Avoid business logic inside controllers.

Bad:

```ts
@Post()
create() {
  // large business logic
}
```

Good:

```ts
@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

---

# Services

Services contain business logic.

Services should:

- orchestrate operations
- communicate with repositories
- handle rules and validations
- remain reusable

Avoid massive services.

---

# DTOs

Always use DTOs for request validation.

Prefer:

```ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
```

Never use raw request bodies directly.

---

# Validation

Enable global validation.

Use:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

Always validate incoming data.

---

# TypeScript Rules

Strict mode must remain enabled.

Avoid:

- `any`
- implicit return types
- massive interfaces
- non-null assertions

Prefer:

- readonly properties
- explicit return types
- utility types
- enums only when necessary

---

# Dependency Injection

Use constructor injection.

Good:

```ts
constructor(
  private readonly usersService: UsersService,
) {}
```

Keep providers focused and small.

---

# Database Rules

Keep database logic outside controllers.

Prefer repository/service separation.

Avoid leaking ORM details everywhere.

---

# Error Handling

Throw proper HTTP exceptions.

Good:

```ts
throw new NotFoundException('User not found');
```

Avoid generic errors.

Never expose internal server details to clients.

---

# Authentication & Security

Always:

- hash passwords
- validate JWTs properly
- use guards
- sanitize input
- validate permissions

Never:

- store plain passwords
- trust client data
- expose sensitive fields

---

# API Design

Use RESTful naming.

Good:

```txt
GET /users
GET /users/:id
POST /users
PATCH /users/:id
DELETE /users/:id
```

Avoid inconsistent routes.

---

# Async Rules

Use async/await consistently.

Avoid mixing `.then()` with `await`.

Good:

```ts
const user = await this.usersRepository.findOne(id);
```

---

# Configuration

Use `@nestjs/config`.

Never hardcode:

- secrets
- database URLs
- API keys

Use environment variables.

---

# Logging

Use NestJS logger or structured logging.

Avoid excessive console logs.

Log:

- errors
- important application events
- warnings

Never log secrets or passwords.

---

# Guards, Pipes, Interceptors

Use:

- guards for authorization
- pipes for validation/transformation
- interceptors for cross-cutting concerns

Do not overload middleware with business logic.

---

# Performance

Always:

- paginate large lists
- avoid unnecessary queries
- select only required fields
- prevent N+1 queries

Avoid loading massive datasets into memory.

---

# Testing

Test:

- services
- controllers
- critical business logic
- authentication flows

Prefer integration-style tests over excessive mocking.

---

# Naming Conventions

Use:

- PascalCase for classes
- camelCase for variables
- kebab-case for files

Examples:

```txt
users.service.ts
create-user.dto.ts
jwt-auth.guard.ts
```

---

# Clean Code Rules

Reject code that:

- uses `any`
- contains business logic in controllers
- duplicates logic
- creates god services
- lacks validation
- has unclear naming
- leaks database internals

---

# API Response Rules

Responses should remain predictable and consistent.

Avoid returning raw database entities directly.

Prefer response DTOs when necessary.

---

# Architecture Philosophy

Write NestJS code that:

- scales well
- is easy to debug
- minimizes hidden behavior
- keeps responsibilities separated
- is readable by new developers
- favors maintainability over cleverness