import { expect, test } from "@playwright/test";

test("visitor can open the landing page and navigate to login", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Make space for better ideas.",
    }),
  ).toBeVisible();

  await page.getByRole("banner").getByRole("link", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/login$/);
});
