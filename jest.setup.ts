import "@testing-library/jest-dom";

if (!process.env.APP_URL) {
  process.env.APP_URL = "http://localhost:3000";
}
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = "http://localhost:3000";
}
if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = "test-secret";
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://contractflow:contractflow@localhost:5432/contractflow?schema=public";
}
if (!process.env.REDIS_URL) {
  process.env.REDIS_URL = "redis://localhost:6379";
}
