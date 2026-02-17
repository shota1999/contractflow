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

**Production Deploy (Railway)**
This repo includes Railway config files: `railway.json` and `nixpacks.toml`.
1. Create a Railway project and connect this GitHub repo.
2. Add Railway Postgres and Railway Redis to the project.
3. Create two services from the repo:
   - `web` service: uses `npm run start` from config
   - `worker` service: override the start command to `npm run worker`
4. Set environment variables for both services (see Environment section).
5. Run migrations once from the `web` service shell: `npx prisma migrate deploy`
6. Set your public domain in Railway, then update `APP_URL` and `NEXTAUTH_URL` to match it.

Railway UI overrides:
- For the worker service, set `NIXPACKS_START_CMD` to `npm run worker` or use the UI Start Command field.

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

**Tests**
1. Lint: `npm run lint`
2. Typecheck: `npm run typecheck`
3. Unit tests: `npm test`
4. E2E (Playwright): `npm run test:e2e`

**Environment**
Required for Railway deploy:
- `APP_URL`: Base URL for the app (example `https://your-domain.com`)
- `NEXTAUTH_URL`: NextAuth base URL (match `APP_URL`)
- `AUTH_SECRET`: NextAuth secret
- `DATABASE_URL`: Postgres connection string (from Railway Postgres)
- `REDIS_URL`: Redis connection string (from Railway Redis)
- `RESEND_API_KEY`: Resend API key for transactional email
- `RESEND_FROM_EMAIL`: Resend from address (must be verified in Resend)
- `RESEND_FROM_NAME`: Optional from name (defaults to brand name)
- `SENTRY_DSN`: Sentry DSN for server-side reporting
- `SENTRY_ENVIRONMENT`: Sentry environment name (example `production`)
- `SENTRY_RELEASE`: Sentry release identifier
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry DSN for client-side reporting
- `NEXT_PUBLIC_SENTRY_ENVIRONMENT`: Client Sentry environment name
- `NEXT_PUBLIC_SENTRY_RELEASE`: Client Sentry release identifier

Docker-only (local dev):
- `POSTGRES_USER`: Postgres user for Docker
- `POSTGRES_PASSWORD`: Postgres password for Docker
- `POSTGRES_DB`: Postgres database for Docker

Optional toggles:
- `NEXT_PUBLIC_ANALYTICS`: `true` or `false` to enable client event logging
- `RATE_LIMIT_LOGIN_MAX`: Optional rate limit for login
- `RATE_LIMIT_LOGIN_WINDOW_MS`: Optional rate limit window for login
- `RATE_LIMIT_REGISTER_MAX`: Optional rate limit for signup
- `RATE_LIMIT_REGISTER_WINDOW_MS`: Optional rate limit window for signup
- `RATE_LIMIT_VERIFY_MAX`: Optional rate limit for email verification
- `RATE_LIMIT_VERIFY_WINDOW_MS`: Optional rate limit window for email verification
- `RATE_LIMIT_VERIFY_RESEND_MAX`: Optional rate limit window for resending verification email
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

