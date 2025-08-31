# URL Shortener Microservice

A simple URL Shortener microservice built with **NestJS**, supporting JWT authentication, rate limiting, and robust error handling.

---

## Features

- Shorten URLs via REST API
- Redirect short URLs to original URLs
- JWT-protected endpoints
- Rate-limited critical routes
- Click tracking
- Dockerized for easy deployment
- Unit tested with Jest
- Global error handling and standardized API responses

---

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB
- **Authentication**: JWT
- **Testing**: Jest
- **Containerization**: Docker
- **Patterns Used**: Repository Pattern, Dependency Injection, Interceptors, Global Exception Filters

---

## System Architecture & Design Decisions

### Architecture

The project is a **monorepo** containing:

- **Auth Service** – Handles user authentication and JWT issuance.
- **URL Shortener Service** – Handles URL creation, redirection, click tracking, and short code generation.

Shared utilities (DTOs, guards, interceptors, filters) are located in **`libs/common`**.

### Design Decisions

1. **Monorepo**
   - Promotes code reuse via shared libraries.
   - Simplifies dependency management and service scaling.

2. **JWT Authentication**
   - Stateless authentication that scales horizontally.
   - Protects endpoints without central session storage.

3. **Rate Limiting**
   - Protects critical URL creation routes from abuse.
   - Implemented using NestJS ThrottlerGuard.

4. **Repository Pattern**
   - Separates data access from business logic.
   - Improves testability and maintainability.

5. **Short Code Generation**
   - Deterministic Base62 encoding from MongoDB ObjectId.
   - Avoids collisions and race conditions.

6. **Click Tracking**
   - Atomic `$inc` operation ensures concurrency safety.

7. **Testing with Jest**
   - Repository and utility mocking allows isolated unit tests.
   - Ensures reliability without depending on DB state.

8. **Robust Error Handling**
   - Global exception filter captures all errors.
   - Response formatter ensures consistent API responses:

```json
{
  "status": "success | error",
  "message": "description",
  "data": { ... }
}
```