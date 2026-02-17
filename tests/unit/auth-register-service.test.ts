/** @jest-environment node */
import { compare } from "bcryptjs";
import { registerUser } from "@/features/auth/service";
import * as repo from "@/features/auth/repo";

jest.mock("@/features/auth/repo");

const mockedRepo = repo as jest.Mocked<typeof repo>;

describe("registerUser", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("hashes the password and returns user + organization data", async () => {
    mockedRepo.findUserByEmail.mockResolvedValue(null);
    mockedRepo.findOrganizationBySlug.mockResolvedValue(null);
    mockedRepo.createUserWithOrgAndMembership.mockResolvedValue({
      user: { id: "user-1", email: "test@company.com", name: "Test User" },
      organization: { id: "org-1", name: "Test User", slug: "test-user" },
      membership: { id: "mem-1" },
    } as unknown as Awaited<ReturnType<typeof repo.createUserWithOrgAndMembership>>);
    mockedRepo.createEmailVerificationToken.mockResolvedValue({
      id: "token-1",
      userId: "user-1",
      token: "token-1",
      expiresAt: new Date(),
    } as Awaited<ReturnType<typeof repo.createEmailVerificationToken>>);
    mockedRepo.deleteEmailVerificationTokensForUser.mockResolvedValue({ count: 0 });

    const result = await registerUser({
      email: "Test@Company.com",
      password: "password1",
      name: "Test User",
      orgName: "",
    });

    expect(result.user.email).toBe("test@company.com");
    const createArgs = mockedRepo.createUserWithOrgAndMembership.mock.calls[0][0];
    expect(createArgs.passwordHash).not.toBe("password1");
    await expect(compare("password1", createArgs.passwordHash)).resolves.toBe(true);
    expect(mockedRepo.createEmailVerificationToken).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-1" }),
    );
  });

  it("throws a conflict error when the email already exists", async () => {
    mockedRepo.findUserByEmail.mockResolvedValue({
      id: "user-2",
      email: "existing@company.com",
    } as Awaited<ReturnType<typeof repo.findUserByEmail>>);

    await expect(
      registerUser({
        email: "existing@company.com",
        password: "password1",
        name: "Existing User",
        orgName: "",
      }),
    ).rejects.toMatchObject({ code: "CONFLICT", status: 409 });
  });
});
