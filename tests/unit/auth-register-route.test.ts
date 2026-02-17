/** @jest-environment node */
import { POST } from "@/app/api/auth/register/route";
import { AppError } from "@/lib/errors";
import { registerUser } from "@/features/auth/service";
import { rateLimit } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request";

jest.mock("@/features/auth/service");
jest.mock("@/lib/rate-limit");
jest.mock("@/lib/request");
jest.mock("@/lib/env", () => ({
  env: {
    RATE_LIMIT_REGISTER_MAX: 5,
    RATE_LIMIT_REGISTER_WINDOW_MS: 60_000,
  },
}));

const mockedRegisterUser = registerUser as jest.MockedFunction<typeof registerUser>;
const mockedRateLimit = rateLimit as jest.MockedFunction<typeof rateLimit>;
const mockedGetRequestIp = getRequestIp as jest.MockedFunction<typeof getRequestIp>;

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedRateLimit.mockResolvedValue({
      ok: true,
      limit: 5,
      remaining: 4,
      resetMs: 1000,
    });
    mockedGetRequestIp.mockReturnValue("127.0.0.1");
  });

  it("returns 201 with ok=true on success", async () => {
    mockedRegisterUser.mockResolvedValue({
      user: { id: "user-1", email: "test@company.com", name: "Test User" },
      organization: { id: "org-1", name: "Test Org", slug: "test-org" },
      verificationToken: "11111111-1111-1111-1111-111111111111",
    });

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@company.com",
        password: "password1",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    const payload = await response.json();
    expect(payload.ok).toBe(true);
  });

  it("returns 409 when the email already exists", async () => {
    mockedRegisterUser.mockRejectedValue(
      new AppError("CONFLICT", "An account with this email already exists.", 409),
    );

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "existing@company.com",
        password: "password1",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(409);
    const payload = await response.json();
    expect(payload.ok).toBe(false);
    expect(payload.error?.code).toBe("CONFLICT");
  });
});
