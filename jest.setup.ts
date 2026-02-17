import "@testing-library/jest-dom";

process.env.APP_URL ??= "http://localhost:3000";
process.env.NEXTAUTH_URL ??= "http://localhost:3000";
process.env.AUTH_SECRET ??= "test-secret";
process.env.DATABASE_URL ??= "postgresql://contractflow:contractflow@localhost:5432/contractflow?schema=public";
process.env.REDIS_URL ??= "redis://localhost:6379";
