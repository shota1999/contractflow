import { test, expect } from "@playwright/test";

test("home highlights ContractFlow AI", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /ContractFlow AI/i }),
  ).toBeVisible();
});
