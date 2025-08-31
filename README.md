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
   - Implemented using NestJS `ThrottlerGuard`.

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
   - Ensures reliability without depending on database state.

8. **Robust Error Handling**
   - Global exception filter captures all errors.
   - Response formatter ensures consistent API responses with the structure:
   ```
   {
     "status": "success | error",
     "message": "description",
     "data": { ... }
   }
   ```

---

## Running the Application

### Locally
> Instructions: Duplicate the `.env.example` files in both `auth` and `url-shortener` services and rename them to `.env` before running the application and use your mongo connection string..

> ---
pnpm install <br>
(Run the Auth service)
pnpm run start:dev auth <br>
(Run the Url shortener service)
pnpm run start:dev url-shortener

### Running Tests

pnpm test

### With Docker
> Instructions: Duplicate the `.env.example` files in both `auth` and `url-shortener` services and rename them to `.env` before running the application. No changes needed.

---
docker-compose build <br>
docker-compose up


## Reason for Our Architecture

The chosen architecture optimizes for **scalability, maintainability, and developer efficiency**. By using a **monorepo**, code reuse is maximized, and dependencies are easier to manage across services. Employing **JWT** for authentication offers stateless, scalable user sessions without centralized storage, a crucial aspect for horizontally scaled microservices. The **repository pattern** cleanly separates business logic from data access, enhancing testability and easing future substitutions or database migrations. Rate limiting safeguards core APIs from abuse without adding excessive complexity, and utilizing deterministic short code generation ensures URL uniqueness and consistency without race conditions.

Furthermore, **robust error handling** and **testing** maximize system reliability and developer confidence when making changes. Lastly, containerization with **Docker** facilitates quick deployment and consistency across environments, meeting modern microservice deployment standards.

This architecture balances practical production requirements with clean, modular code suited for team collaboration and future growth.
