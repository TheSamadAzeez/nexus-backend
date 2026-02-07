# Nexus E-commerce Backend API

A robust e-commerce backend API built with NestJS, TypeScript, Drizzle ORM, PostgreSQL, and Redis.

## Features

- **Authentication**: JWT-based with refresh tokens
- **Role-Based Access Control**: Admin and User roles
- **Products**: CRUD with cursor-based pagination and filtering
- **Cart**: Add, update, remove items
- **Orders**: Create from cart, order history
- **Checkout**: Mock payment processing
- **Caching**: Redis-powered caching for improved performance
- **Rate Limiting**: Request throttling with @nestjs/throttler
- **API Documentation**: Swagger/OpenAPI

## Tech Stack

- Node.js + NestJS
- TypeScript
- PostgreSQL + Drizzle ORM
- Redis (caching)
- Docker Compose

## Prerequisites

- Node.js 18+
- pnpm
- Docker & Docker Compose

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd nexus-backend
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Docker Services

```bash
docker-compose up -d
```

### 4. Run Database Migrations

```bash
pnpm drizzle-kit push
```

### 5. Seed Database (Optional)

```bash
pnpm tsx seed.ts
```

### 6. Start Development Server

```bash
pnpm start:dev
```

The API will be available at `http://localhost:3000`

## API Documentation

Once the server is running, access Swagger UI at:

```
http://localhost:3000/api
```

## API Endpoints

### Authentication

| Method | Endpoint       | Description       | Access |
| ------ | -------------- | ----------------- | ------ |
| POST   | /auth/register | Register new user | Public |
| POST   | /auth/login    | Login             | Public |
| POST   | /auth/logout   | Logout            | Auth   |

### Products

| Method | Endpoint      | Description               | Access |
| ------ | ------------- | ------------------------- | ------ |
| GET    | /products     | List products (paginated) | Public |
| GET    | /products/:id | Get product               | Public |
| POST   | /products     | Create product            | Admin  |
| PATCH  | /products/:id | Update product            | Admin  |
| DELETE | /products/:id | Delete product            | Admin  |

### Cart

| Method | Endpoint        | Description     | Access |
| ------ | --------------- | --------------- | ------ |
| GET    | /cart           | Get cart        | Auth   |
| POST   | /cart/items     | Add item        | Auth   |
| PATCH  | /cart/items/:id | Update quantity | Auth   |
| DELETE | /cart/items/:id | Remove item     | Auth   |
| DELETE | /cart           | Clear cart      | Auth   |

### Orders

| Method | Endpoint    | Description      | Access |
| ------ | ----------- | ---------------- | ------ |
| POST   | /orders     | Create from cart | Auth   |
| GET    | /orders     | Order history    | Auth   |
| GET    | /orders/:id | Order details    | Auth   |

### Checkout

| Method | Endpoint      | Description     | Access |
| ------ | ------------- | --------------- | ------ |
| POST   | /checkout/pay | Process payment | Auth   |

## Default Users (after seeding)

| Email           | Password | Role  |
| --------------- | -------- | ----- |
| admin@nexus.com | admin123 | ADMIN |
| user@nexus.com  | user123  | USER  |

## Project Structure

```
src/
├── auth/          # Authentication module
├── users/         # User management
├── products/      # Product catalog
├── cart/          # Shopping cart
├── orders/        # Order management
├── checkout/      # Payment processing
├── common/        # Shared utilities
│   ├── decorators/
│   ├── filters/
│   └── interceptors/
└── database/      # Drizzle schemas
```

## Environment Variables

| Variable               | Description          | Default   |
| ---------------------- | -------------------- | --------- |
| POSTGRES_HOST          | PostgreSQL host      | localhost |
| POSTGRES_PORT          | PostgreSQL port      | 5432      |
| POSTGRES_USER          | Database user        | admin     |
| POSTGRES_PASSWORD      | Database password    | admin     |
| POSTGRES_DB            | Database name        | nexus     |
| REDIS_HOST             | Redis host           | localhost |
| REDIS_PORT             | Redis port           | 6379      |
| JWT_SECRET             | JWT signing secret   | -         |
| JWT_EXPIRES_IN         | Access token expiry  | 15m       |
| JWT_REFRESH_SECRET     | Refresh token secret | -         |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiry | 7d        |
| PORT                   | Server port          | 3000      |

## Scripts

```bash
pnpm start:dev     # Development server
pnpm build         # Build for production
pnpm start:prod    # Production server
pnpm db:push  # Push schema to DB
pnpm db:seed   # Seed database
pnpm db:studio   # Open Drizzle Studio to view database
pnpm db:create-admin # create a new admin user
```

## License

MIT
