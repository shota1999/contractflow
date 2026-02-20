import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost";

const waitFor = async <T>(
  fn: () => Promise<T | null>,
  options?: { timeoutMs?: number; intervalMs?: number },
) => {
  const timeoutMs = options?.timeoutMs ?? 60_000;
  const intervalMs = options?.intervalMs ?? 2_000;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const result = await fn();
    if (result) {
      return result;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("Timed out waiting for condition");
};

test("signup -> verify -> create doc -> generate draft -> audit event", async ({ request }) => {
  const email = `e2e+${Date.now()}@example.com`;
  const password = "Test1234";

  const registerResponse = await request.post("/api/auth/register", {
    data: {
      name: "E2E Tester",
      email,
      password,
      orgName: "E2E Agency",
    },
  });
  expect(registerResponse.status()).toBe(201);
  const registerJson = (await registerResponse.json()) as {
    data?: { verificationToken?: string };
  };
  const verificationToken = registerJson.data?.verificationToken;
  expect(verificationToken).toBeTruthy();

  const verifyResponse = await request.post("/api/auth/verify", {
    data: { token: verificationToken },
  });
  expect(verifyResponse.ok()).toBeTruthy();

  const csrfResponse = await request.get("/api/auth/csrf");
  const csrfJson = (await csrfResponse.json()) as { csrfToken: string };
  expect(csrfJson.csrfToken).toBeTruthy();

  const signInResponse = await request.post("/api/auth/callback/credentials", {
    form: {
      csrfToken: csrfJson.csrfToken,
      email,
      password,
      callbackUrl: `${baseURL}/dashboard`,
      json: "true",
    },
    maxRedirects: 0,
  });
  expect([200, 302]).toContain(signInResponse.status());

  const sessionResponse = await request.get("/api/auth/session");
  expect(sessionResponse.ok()).toBeTruthy();
  const sessionJson = (await sessionResponse.json()) as { user?: { email?: string } };
  expect(sessionJson.user?.email).toBe(email);

  const createDocResponse = await request.post("/api/documents", {
    data: {
      type: "PROPOSAL",
      title: "E2E Proposal",
      sections: [
        {
          title: "Scope",
          content: "E2E test scope",
          order: 1,
        },
      ],
    },
  });
  expect(createDocResponse.status()).toBe(201);
  const createDocJson = (await createDocResponse.json()) as {
    data?: { id?: string };
  };
  const documentId = createDocJson.data?.id;
  expect(documentId).toBeTruthy();

  const draftResponse = await request.post(`/api/documents/${documentId}/generate-draft`);
  expect(draftResponse.status()).toBe(202);

  await waitFor(async () => {
    const jobsResponse = await request.get(`/api/jobs/drafts?documentId=${documentId}`);
    if (!jobsResponse.ok()) {
      return null;
    }
    const jobsJson = (await jobsResponse.json()) as {
      data?: Array<{ status?: string }>;
    };
    const job = jobsJson.data?.[0];
    if (!job) {
      return null;
    }
    return job.status === "SUCCEEDED" ? job : null;
  });

  await waitFor(async () => {
    const auditResponse = await request.get(
      `/api/audit/events?action=DRAFT_SUCCEEDED&targetType=DOCUMENT`,
    );
    if (!auditResponse.ok()) {
      return null;
    }
    const auditJson = (await auditResponse.json()) as {
      data?: Array<{ targetId?: string }>;
    };
    const match = auditJson.data?.find((event) => event.targetId === documentId);
    return match ?? null;
  });
});
