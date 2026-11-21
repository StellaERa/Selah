# Selah Backend

The Selah backend is a NestJS API for wallet authentication, courses, mentorship, study groups, Scripture study requests, payment events, and public verification data. PostgreSQL is the relational store.

## Planned API areas

- SEP-10 wallet login and wallet profile management
- Courses and mentorship listings
- Study group membership and reading plans
- Group fund proposals and approvals
- Soroban event indexing
- Payment and certificate status
- Citations-only study assistant integration
- Reviewer escrow and human review routing

## Technology

- Node.js and TypeScript
- NestJS
- PostgreSQL and TypeORM
- Stellar SDK and SEP-10 authentication
- Redis for caching and real-time operations
- Freighter-compatible wallet flows

## Getting started

Requirements: Node.js 20+, PostgreSQL, and optionally Redis.

```bash
cd Backend
cp .env.example .env
npm install
npm run start:dev
```

The API listens on `PORT` (default `3000`). Swagger is available at `/api/docs`.

## Commands

```bash
npm run build
npm run test
npm run test:e2e
npm run lint
npm run migration:run
```

## API contract

Successful responses use a standard success envelope. Failed requests use a standard error envelope with an HTTP status, machine-readable `errorCode`, message, details, timestamp, and request path.

Never commit private keys or secrets. Use environment variables or a secrets manager.
