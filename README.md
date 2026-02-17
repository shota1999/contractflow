# ContractFlow AI

**Local Dev**
1. Install dependencies: `npm ci`
2. Create `.env` with the required environment variables listed below.
3. Start infrastructure: `docker compose up db redis`
4. Run migrations and seed: `npm run prisma:migrate` then `npm run prisma:seed`
5. Start the web app: `npm run dev`
6. In a second terminal, start the worker: `npm run worker`

**Docker**
1. Dev stack (bind mounts, hot reload): `docker compose up --build`
2. Production-like profile (no bind mounts): `docker compose --profile prod up --build`

**Production Deploy (VPS)**
1. Push to `main` to build images in GHCR (see `.github/workflows/docker.yml`).
2. On the VPS, copy `.env.production.example` to `.env.production` and fill values.
3. Pull and start the stack:
   - `docker compose -f docker-compose.prod.yml pull`
   - `docker compose -f docker-compose.prod.yml up -d`
4. Run migrations:
   - `docker compose -f docker-compose.prod.yml exec web npx prisma migrate deploy`
5. Caddy provisions HTTPS automatically for `APP_DOMAIN`.

**Run Production Compose Locally**
1. `cp .env.production.example .env.production`
2. `docker compose -f docker-compose.prod.yml up -d --build`

**Prisma**
1. Apply migrations: `npm run prisma:migrate`
2. Seed data: `npm run prisma:seed`

**Email Verification (Dev)**
1. After signup, the API returns a `verificationToken` in dev mode.
2. Open `http://localhost:3000/verify-email?token=...` to verify.
3. If signed in, use the "Resend verification email" button on `/signup` or `/verify-email`.

**Password Reset (Dev)**
1. Request a reset at `/forgot-password` with your email.
2. In dev, the API returns a `resetToken` to open `/reset-password?token=...`.

**Worker**
1. Local: `npm run worker`
2. Docker prod profile: `docker compose --profile prod up worker-prod --build`

**Tests**
1. Lint: `npm run lint`
2. Typecheck: `npm run typecheck`
3. Unit tests: `npm test`
4. E2E (Playwright): `npm run test:e2e`

**Environment**
- `APP_URL`: Base URL for the app (example `http://localhost:3000`)
- `APP_DOMAIN`: Public domain used by Caddy for HTTPS (example `app.example.com`)
- `NEXTAUTH_URL`: NextAuth base URL (match `APP_URL` in dev)
- `AUTH_SECRET`: NextAuth secret
- `POSTGRES_USER`: Postgres user for Docker (prod compose)
- `POSTGRES_PASSWORD`: Postgres password for Docker (prod compose)
- `POSTGRES_DB`: Postgres database for Docker (prod compose)
- `DATABASE_URL`: Postgres connection string
- `REDIS_URL`: Redis connection string
- `RESEND_API_KEY`: Resend API key for transactional email
- `RESEND_FROM_EMAIL`: Resend from address (must be verified in Resend)
- `RESEND_FROM_NAME`: Optional from name (defaults to brand name)
- `SENTRY_DSN`: Sentry DSN for server-side reporting
- `SENTRY_ENVIRONMENT`: Sentry environment name (example `production`)
- `SENTRY_RELEASE`: Sentry release identifier
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry DSN for client-side reporting
- `NEXT_PUBLIC_SENTRY_ENVIRONMENT`: Client Sentry environment name
- `NEXT_PUBLIC_SENTRY_RELEASE`: Client Sentry release identifier
- `IMAGE_OWNER`: GHCR owner for docker-compose.prod.yml
- `IMAGE_REPO`: GHCR repository name for docker-compose.prod.yml
- `IMAGE_TAG`: Image tag or commit SHA for docker-compose.prod.yml
- `RATE_LIMIT_LOGIN_MAX`: Optional rate limit for login
- `RATE_LIMIT_LOGIN_WINDOW_MS`: Optional rate limit window for login
- `RATE_LIMIT_REGISTER_MAX`: Optional rate limit for signup
- `RATE_LIMIT_REGISTER_WINDOW_MS`: Optional rate limit window for signup
- `RATE_LIMIT_VERIFY_MAX`: Optional rate limit for email verification
- `RATE_LIMIT_VERIFY_WINDOW_MS`: Optional rate limit window for email verification
- `RATE_LIMIT_VERIFY_RESEND_MAX`: Optional rate limit for resending verification email
- `RATE_LIMIT_VERIFY_RESEND_WINDOW_MS`: Optional rate limit window for resending verification email
- `RATE_LIMIT_PASSWORD_RESET_REQUEST_MAX`: Optional rate limit for password reset requests
- `RATE_LIMIT_PASSWORD_RESET_REQUEST_WINDOW_MS`: Optional rate limit window for password reset requests
- `RATE_LIMIT_PASSWORD_RESET_CONFIRM_MAX`: Optional rate limit for password reset confirms
- `RATE_LIMIT_PASSWORD_RESET_CONFIRM_WINDOW_MS`: Optional rate limit window for password reset confirms
- `RATE_LIMIT_GENERATE_DRAFT_MAX`: Optional rate limit for draft generation
- `RATE_LIMIT_GENERATE_DRAFT_WINDOW_MS`: Optional rate limit window for draft generation
- `RATE_LIMIT_PUBLIC_DOC_MAX`: Optional rate limit for public doc access
- `RATE_LIMIT_PUBLIC_DOC_WINDOW_MS`: Optional rate limit window for public doc access
- `RATE_LIMIT_LEADS_MAX`: Optional rate limit for lead capture
- `RATE_LIMIT_LEADS_WINDOW_MS`: Optional rate limit window for lead capture

