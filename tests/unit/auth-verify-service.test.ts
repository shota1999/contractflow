/** @jest-environment node */
import { verifyEmailToken } from "@/features/auth/service";
import * as repo from "@/features/auth/repo";

jest.mock("@/features/auth/repo");

const mockedRepo = repo as jest.Mocked<typeof repo>;

describe("verifyEmailToken", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("verifies token and updates the user", async () => {
    mockedRepo.getEmailVerificationTokenByToken.mockResolvedValue({
      id: "token-1",
      userId: "user-1",
      token: "token-1",
      expiresAt: new Date(Date.now() + 60_000),
      user: { id: "user-1", email: "test@company.com", emailVerifiedAt: null },
    } as Awaited<ReturnType<typeof repo.getEmailVerificationTokenByToken>>);

    mockedRepo.updateUserEmailVerifiedAt.mockResolvedValue({
      id: "user-1",
      emailVerifiedAt: new Date(),
    } as Awaited<ReturnType<typeof repo.updateUserEmailVerifiedAt>>);

    mockedRepo.deleteEmailVerificationToken.mockResolvedValue({
      id: "token-1",
    } as Awaited<ReturnType<typeof repo.deleteEmailVerificationToken>>);

    const result = await verifyEmailToken("token-1");

    expect(result.userId).toBe("user-1");
    expect(mockedRepo.updateUserEmailVerifiedAt).toHaveBeenCalledWith(
      "user-1",
      expect.any(Date),
    );
  });

  it("throws a conflict error when the token is expired", async () => {
    mockedRepo.getEmailVerificationTokenByToken.mockResolvedValue({
      id: "token-expired",
      userId: "user-2",
      token: "token-expired",
      expiresAt: new Date(Date.now() - 60_000),
      user: { id: "user-2", email: "expired@company.com", emailVerifiedAt: null },
    } as Awaited<ReturnType<typeof repo.getEmailVerificationTokenByToken>>);

    mockedRepo.deleteEmailVerificationToken.mockResolvedValue({
      id: "token-expired",
    } as Awaited<ReturnType<typeof repo.deleteEmailVerificationToken>>);

    await expect(verifyEmailToken("token-expired")).rejects.toMatchObject({
      code: "CONFLICT",
      status: 409,
    });
  });
});
