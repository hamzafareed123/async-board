import { expect, test } from "@playwright/test";

test("visitor can open the landing page and navigate to login", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Build, sketch, and collaborate in one shared board.",
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/login$/);
});
