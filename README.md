# Nexus E-commerce Backend API

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

A production-ready e-commerce backend API built with modern technologies, featuring JWT authentication, role-based access control, Redis caching, rate limiting, and comprehensive Swagger documentation.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack & Architecture Decisions](#-tech-stack--architecture-decisions)
- [Prerequisites](#-prerequisites)
- [Complete Setup Guide](#-complete-setup-guide)
- [Environment Variables](#-environment-variables)
- [Database Management](#-database-management)
- [Creating Admin Users](#-creating-admin-users)
- [API Documentation](#-api-documentation)
- [Caching Strategy](#-caching-strategy)
- [Rate Limiting](#-rate-limiting)
- [Project Structure](#-project-structure)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Scripts Reference](#-scripts-reference)
- [Submission & Deployment](#-submission--deployment)
- [License](#-license)

---

## ✨ Features

| Feature                          | Description                                                   |
| -------------------------------- | ------------------------------------------------------------- |
| 🔐 **JWT Authentication**        | Secure authentication with access + refresh token strategy    |
| 👥 **Role-Based Access Control** | Admin and User roles with granular permissions                |
| 📦 **Product Management**        | Full CRUD with cursor-based pagination and advanced filtering |
| 🛒 **Shopping Cart**             | Add, update, remove items with real-time stock validation     |
| 📋 **Order Management**          | Create orders from cart, view order history                   |
| 💳 **Checkout Flow**             | Mock payment processing for demonstration                     |
| ⚡ **Redis Caching**             | Lightning-fast responses with intelligent cache invalidation  |
| 🛡️ **Rate Limiting**             | Multi-tier request throttling for API protection              |
| 📖 **API Documentation**         | Interactive Swagger/OpenAPI documentation                     |

---

## 🛠 Tech Stack & Architecture Decisions

### Why NestJS?

**NestJS** was chosen as the framework for several compelling reasons:

- **TypeScript-first**: Full type safety out of the box, reducing runtime errors
- **Modular Architecture**: Clean separation of concerns with modules, controllers, and services
- **Dependency Injection**: Built-in DI container for testable, maintainable code
- **Decorator-based**: Familiar patterns for developers coming from Angular or Java/Spring
- **Rich Ecosystem**: First-class support for OpenAPI, validation, caching, and more

### Why Drizzle ORM?

I chose **Drizzle ORM** over alternatives like Prisma or TypeORM for the following reasons:

| Aspect                 | Drizzle Advantage                                                               |
| ---------------------- | ------------------------------------------------------------------------------- |
| **Type Safety**        | SQL-like syntax with full TypeScript inference - you write SQL, get type safety |
| **Performance**        | Lightweight with zero dependencies, minimal runtime overhead                    |
| **Flexibility**        | Direct SQL when needed, no "magic" - what you write is what runs                |
| **Bundle Size**        | Significantly smaller than Prisma (~7KB vs ~300KB)                              |
| **No Code Generation** | Schema-as-code approach - no `prisma generate` step needed                      |
| **Drizzle Studio**     | Built-in visual database browser (`pnpm db:studio`)                             |

### Why PostgreSQL?

- **ACID Compliance**: Reliable transactions for e-commerce operations
- **JSON Support**: Native JSONB for flexible data structures
- **Scalability**: Handles high-volume concurrent operations
- **Ecosystem**: Excellent tooling and community support

### Why Redis for Caching?

- **Speed**: In-memory data store with sub-millisecond latency
- **Persistence**: Optional data persistence for cache survival
- **TTL Support**: Automatic cache expiration management
- **Production Ready**: Battle-tested in high-traffic applications

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- **pnpm** v8.0.0 or higher (`npm install -g pnpm`)
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/))
- **Git** for version control

---

## 🚀 Complete Setup Guide

Follow these steps to get the project running locally:

### Step 1: Clone the Repository

```bash
git clone https://github.com/TheSamadAzeez/nexus-backend.git
cd nexus-backend
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Configure Environment Variables

Create your environment file from the template:

```bash
cp .env.example .env
```

Edit the `.env` file with your preferred settings (see [Environment Variables](#-environment-variables) section).

### Step 4: Start Docker Services

This starts PostgreSQL and Redis containers:

```bash
docker-compose up -d
```

Verify containers are running:

```bash
docker-compose ps
```

You should see both `nexus-postgres` and `nexus-redis` with status `Up`.

### Step 5: Push Database Schema

Apply the database schema to PostgreSQL:

```bash
pnpm db:push
```

### Step 6: Seed the Database (Recommended)

Populate the database with sample data including test users and products:

```bash
pnpm db:seed
```

This creates:

- **Admin User**: `admin@nexus.com` / `admin123`
- **Test User**: `user@nexus.com` / `user123`
- **33 Sample Products** across categories: Electronics, Footwear, Clothing, Accessories, Watches, Gaming

To create your own admin user account:

```bash
pnpm db:create-admin
```

For more info on creating an admin user, see the [Creating Admin Users](#-creating-admin-users) section below.

### Step 7: Start the Development Server

```bash
pnpm start:dev
```

The API will be available at `http://localhost:3000`

### Step 8: Access API Documentation

Open your browser and navigate to:

```
http://localhost:3000/api
```

🎉 **You're all set!** The Swagger UI provides interactive documentation for all endpoints.

---

## 🔧 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=nexus

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=development
```

### Environment Variable Details

| Variable                 | Description                   | Default       | Required |
| ------------------------ | ----------------------------- | ------------- | -------- |
| `POSTGRES_HOST`          | PostgreSQL server hostname    | `localhost`   | Yes      |
| `POSTGRES_PORT`          | PostgreSQL server port        | `5432`        | Yes      |
| `POSTGRES_USER`          | Database username             | `admin`       | Yes      |
| `POSTGRES_PASSWORD`      | Database password             | `admin`       | Yes      |
| `POSTGRES_DB`            | Database name                 | `nexus`       | Yes      |
| `REDIS_HOST`             | Redis server hostname         | `localhost`   | Yes      |
| `REDIS_PORT`             | Redis server port             | `6379`        | Yes      |
| `JWT_SECRET`             | Secret key for access tokens  | -             | **Yes**  |
| `JWT_EXPIRES_IN`         | Access token expiration time  | `15m`         | Yes      |
| `JWT_REFRESH_SECRET`     | Secret key for refresh tokens | -             | **Yes**  |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration time | `7d`          | Yes      |
| `PORT`                   | Server port                   | `3000`        | No       |
| `NODE_ENV`               | Environment mode              | `development` | No       |

> ⚠️ **Security Note**: Always use strong, unique secrets in production. Never commit `.env` files to version control.

---

## 🗄️ Database Management

### Viewing the Database (Drizzle Studio)

Drizzle comes with a built-in visual database browser. To explore your data:

```bash
pnpm db:studio
```

This opens Drizzle Studio in your browser at `https://local.drizzle.studio` where you can:

- Browse all tables and their data
- Execute queries
- View and edit records
- Understand table relationships

### Database Schema

The database consists of the following tables:

| Table         | Description                            |
| ------------- | -------------------------------------- |
| `users`       | User accounts with roles (ADMIN, USER) |
| `products`    | Product catalog with categories        |
| `carts`       | User shopping carts                    |
| `cart_items`  | Items in shopping carts                |
| `orders`      | Order records                          |
| `order_items` | Items in orders                        |

### Pushing Schema Changes

After modifying schemas in `src/database/schemas/`, apply changes:

```bash
pnpm db:push
```

### Re-seeding the Database

To reset and re-seed the database:

```bash
# Drop and recreate schema (use with caution!)
docker-compose down -v
docker-compose up -d
pnpm db:push
pnpm db:seed
```

---

## 👨‍💼 Creating Admin Users

> ⚠️ **IMPORTANT**: This is an interactive CLI command that runs in your terminal!

To create additional admin users, use the built-in CLI script:

```bash
pnpm db:create-admin
```

### What to Expect

The script will interactively prompt you for:

```
🔐 Create Admin User

========================================
Email: newadmin@example.com
Name: John Admin
Password (min 8 characters): ********
Confirm Password: ********

⏳ Creating admin user...

✅ Admin user created successfully!
========================================
ID:    550e8400-e29b-41d4-a716-446655440000
Email: newadmin@example.com
Name:  John Admin
Role:  ADMIN
========================================

🎉 Done!
```

### Validation Rules

- **Email**: Must be a valid email format
- **Name**: Required, cannot be empty
- **Password**: Minimum 8 characters
- **Confirmation**: Passwords must match

### Use Cases

- Creating initial admin accounts in production
- Adding new team members with admin privileges
- Recovering admin access without database manipulation

---

## 📖 API Documentation

### Swagger/OpenAPI

Once the server is running, comprehensive API documentation is available at:

```
http://localhost:3000/api
```

**Features:**

- Interactive endpoint testing
- Request/response schemas
- Authentication support (JWT Bearer)
- Model definitions

### Testing with Swagger UI

1. Navigate to `http://localhost:3000/api`
2. Click "Authorize" button
3. Login via `/auth/login` endpoint to get a token
4. Paste the `accessToken` in the authorization field
5. Test authenticated endpoints

---

## ⚡ Caching Strategy

### How Caching Works

The API uses **Redis** as a caching layer via `@nestjs/cache-manager` with `cache-manager-ioredis-yet`.

```
┌─────────────────────────────────────────────────────────────┐
│                      Request Flow                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Request  ──►  Cache Check  ──►  Cache Hit? ──► Response   │
│                     │                  │                    │
│                     │ No               │ Yes                │
│                     ▼                  │                    │
│               Database Query           │                    │
│                     │                  │                    │
│                     ▼                  │                    │
│               Store in Cache ◄─────────┘                    │
│                     │                                       │
│                     ▼                                       │
│                 Response                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Configuration

Located in `src/app.module.ts`:

```typescript
CacheModule.registerAsync({
  isGlobal: true,
  useFactory: async (configService: ConfigService) => ({
    store: await redisStore({
      host: configService.get('REDIS_HOST', 'localhost'),
      port: configService.get('REDIS_PORT', 6379),
    }),
    ttl: 60000, // 60 seconds default TTL
  }),
}),
```

### Cache Behavior

| Aspect          | Value                               |
| --------------- | ----------------------------------- |
| **Store**       | Redis                               |
| **Default TTL** | 60 seconds                          |
| **Scope**       | Global (available to all modules)   |
| **Connection**  | Automatic via environment variables |

### Why Redis for Caching?

- **Performance**: Sub-millisecond read/write operations
- **Shared Cache**: All server instances share the same cache (horizontal scaling ready)
- **Persistence**: Cache survives server restarts (if configured)
- **TTL Management**: Automatic expiration handling

---

## 🛡️ Rate Limiting

### How Rate Limiting Works

The API implements multi-tier rate limiting using `@nestjs/throttler` to protect against abuse:

### Rate Limit Tiers

| Tier       | Time Window | Max Requests | Purpose                      |
| ---------- | ----------- | ------------ | ---------------------------- |
| **Short**  | 1 second    | 3 requests   | Prevents rapid-fire requests |
| **Medium** | 10 seconds  | 20 requests  | Limits burst traffic         |
| **Long**   | 60 seconds  | 100 requests | Overall usage cap            |

### Implementation

```typescript
// src/app.module.ts
ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1000,     // 1 second
    limit: 3,
  },
  {
    name: 'medium',
    ttl: 10000,    // 10 seconds
    limit: 20,
  },
  {
    name: 'long',
    ttl: 60000,    // 60 seconds
    limit: 100,
  },
]),
```

### Response on Rate Limit Exceeded

When you exceed the rate limit, you'll receive:

```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

### Rate Limit Headers

Responses include headers showing your current rate limit status:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Time until the limit resets

---

## 📁 Project Structure

```
nexus-backend/
├── 📁 src/
│   ├── 📁 auth/              # Authentication module
│   │   ├── dto/              # Data transfer objects
│   │   ├── guards/           # JWT & Roles guards
│   │   ├── strategies/       # Passport JWT strategy
│   │   └── auth.service.ts   # Auth business logic
│   │
│   ├── 📁 users/             # User management module
│   │   ├── dto/
│   │   └── users.service.ts
│   │
│   ├── 📁 products/          # Product catalog module
│   │   ├── dto/              # Create, Update, Query DTOs
│   │   └── products.service.ts
│   │
│   ├── 📁 cart/              # Shopping cart module
│   │   ├── dto/
│   │   └── cart.service.ts
│   │
│   ├── 📁 orders/            # Order management module
│   │   ├── dto/
│   │   └── orders.service.ts
│   │
│   ├── 📁 checkout/          # Payment processing module
│   │   └── checkout.service.ts
│   │
│   ├── 📁 common/            # Shared utilities
│   │   ├── decorators/       # Custom decorators (@Public, @Roles)
│   │   ├── filters/          # Exception filters
│   │   └── interceptors/     # Logging interceptor
│   │
│   ├── 📁 database/          # Database layer
│   │   ├── schemas/          # Drizzle table schemas
│   │   ├── database.module.ts
│   │   └── drizzle.service.ts
│   │
│   ├── app.module.ts         # Root module
│   └── main.ts               # Application entry point
│
├── 📁 scripts/
│   └── create-admin.ts       # Admin user creation CLI
│
├── 📄 seed.ts                # Database seeding script
├── 📄 docker-compose.yml     # Docker services config
├── 📄 drizzle.config.ts      # Drizzle configuration
├── 📄 .env.example           # Environment template
└── 📄 package.json           # Dependencies & scripts
```

---

## 📡 API Endpoints Reference

### Authentication

| Method | Endpoint         | Description        | Access        |
| ------ | ---------------- | ------------------ | ------------- |
| `POST` | `/auth/register` | Register new user  | Public        |
| `POST` | `/auth/login`    | Login & get tokens | Public        |
| `POST` | `/auth/logout`   | Logout user        | Authenticated |

### Products

| Method   | Endpoint               | Description                      | Access |
| -------- | ---------------------- | -------------------------------- | ------ |
| `GET`    | `/products`            | List products (cursor-paginated) | Public |
| `GET`    | `/products/:id`        | Get product by ID                | Public |
| `GET`    | `/products/categories` | Get all categories               | Public |
| `POST`   | `/products`            | Create product                   | Admin  |
| `PATCH`  | `/products/:id`        | Update product                   | Admin  |
| `DELETE` | `/products/:id`        | Delete product                   | Admin  |

#### Product Query Parameters

| Parameter  | Type   | Description                    |
| ---------- | ------ | ------------------------------ |
| `cursor`   | string | Pagination cursor (product ID) |
| `limit`    | number | Results per page (default: 10) |
| `category` | string | Filter by category             |
| `search`   | string | Search in product name         |
| `minPrice` | number | Minimum price filter           |
| `maxPrice` | number | Maximum price filter           |

### Cart

| Method   | Endpoint          | Description           | Access        |
| -------- | ----------------- | --------------------- | ------------- |
| `GET`    | `/cart`           | Get user's cart       | Authenticated |
| `POST`   | `/cart/items`     | Add item to cart      | Authenticated |
| `PATCH`  | `/cart/items/:id` | Update item quantity  | Authenticated |
| `DELETE` | `/cart/items/:id` | Remove item from cart | Authenticated |
| `DELETE` | `/cart`           | Clear entire cart     | Authenticated |

### Orders

| Method | Endpoint      | Description            | Access        |
| ------ | ------------- | ---------------------- | ------------- |
| `POST` | `/orders`     | Create order from cart | Authenticated |
| `GET`  | `/orders`     | Get order history      | Authenticated |
| `GET`  | `/orders/:id` | Get order details      | Authenticated |

### Checkout

| Method | Endpoint        | Description            | Access        |
| ------ | --------------- | ---------------------- | ------------- |
| `POST` | `/checkout/pay` | Process payment (mock) | Authenticated |

---

## 🔧 Scripts Reference

```bash
# Development
pnpm start:dev     # Start development server with hot reload
pnpm start:debug   # Start with debugger attached

# Production
pnpm build         # Build for production
pnpm start:prod    # Run production build

# Database
pnpm db:push       # Push schema changes to database
pnpm db:seed       # Seed database with sample data
pnpm db:studio     # Open Drizzle Studio (visual DB browser)
pnpm db:create-admin  # Create new admin user (interactive)

# Code Quality
pnpm lint          # Run ESLint
pnpm format        # Format code with Prettier

# Testing
pnpm test          # Run unit tests
pnpm test:watch    # Run tests in watch mode
pnpm test:cov      # Generate test coverage report
pnpm test:e2e      # Run end-to-end tests
```

---

## 📦 Submission & Deployment

### Repository

**GitHub**: [https://github.com/TheSamadAzeez/nexus-backend](https://github.com/TheSamadAzeez/nexus-backend)

### What's Included

| Item                              | Status | Description                                |
| --------------------------------- | ------ | ------------------------------------------ |
| 📖 API Documentation (Swagger)    | ✅     | Available at `/api` endpoint               |
| 📄 README with Setup Instructions | ✅     | This document                              |
| 🔧 Sample .env File               | ✅     | `.env.example` included                    |
| 🗄️ Database Schema/Migrations     | ✅     | Drizzle schemas in `src/database/schemas/` |

### Docker Services

The application uses Docker Compose for local development:

| Service    | Container Name   | Port | Purpose          |
| ---------- | ---------------- | ---- | ---------------- |
| PostgreSQL | `nexus-postgres` | 5432 | Primary database |
| Redis      | `nexus-redis`    | 6379 | Caching layer    |

### Quick Access URLs

| Resource              | URL                            |
| --------------------- | ------------------------------ |
| API Server            | `http://localhost:3000`        |
| Swagger Documentation | `http://localhost:3000/api`    |
| Drizzle Studio        | `https://local.drizzle.studio` |

---

## 📝 Default Test Credentials

After running `pnpm db:seed`, the following users are available:

| Email             | Password   | Role  |
| ----------------- | ---------- | ----- |
| `admin@nexus.com` | `admin123` | ADMIN |
| `user@nexus.com`  | `user123`  | USER  |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ using NestJS, Drizzle ORM, PostgreSQL, and Redis
</p>
