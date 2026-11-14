import { expect, test, type Page } from "@playwright/test";

const testUser = {
  id: "e2e-test-user",
  fullName: "Playwright Test User",
  email: "playwright@example.com",
};

const createdBoard = {
  _id: "board-123",
  name: "Product planning board",
  description: "Roadmap for launch week",
  createdBy: testUser.id,
  members: [
    {
      _id: "member-1",
      role: "owner",
      userId: { _id: testUser.id, fullName: testUser.fullName },
    },
  ],
  inviteCode: {
    code: "board-code-123",
    maxMembers: 5,
    expiresAt: null,
  },
  isPublic: true,
  inviteLink: "http://127.0.0.1:5173/join/board-code-123?role=viewer",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

async function mockAuthenticatedDashboard(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("accessToken", "e2e-test-access-token");
  });

  await page.route("**/api/auth/auth-user", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        data: testUser,
        success: true,
        message: "User authenticated",
      }),
    });
  });

  await page.route("**/api/room", async (route) => {
    const method = route.request().method();

    if (method === "GET") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ data: [] }),
      });
      return;
    }

    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          room: createdBoard,
          inviteLink: createdBoard.inviteLink,
        },
        success: true,
        message: "Board created successfully",
      }),
    });
  });
}

test("dashboard validates the board name before creating a board", async ({
  page,
}) => {
  await mockAuthenticatedDashboard(page);
  await page.goto("/dashboard");

  await page.getByRole("button", { name: "My boards" }).click();
  await page.getByRole("button", { name: "Create board", exact: true }).click();
  await page.locator('button[type="submit"]').click();

  await expect(page.getByText("Board name is required.").first()).toBeVisible();
});

test("dashboard shows an existing board in the board list", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("accessToken", "e2e-test-access-token");
  });

  await page.route("**/api/auth/auth-user", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        data: testUser,
        success: true,
        message: "User authenticated",
      }),
    });
  });

  await page.route("**/api/room", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ data: [createdBoard] }),
    });
  });

  await page.goto("/dashboard");
  await page.getByRole("button", { name: "My boards" }).click();

  await expect(page.getByRole("heading", { name: "Product planning board" })).toBeVisible();
  await expect(page.getByText("Public")).toBeVisible();
  await expect(page.getByText("1 member")).toBeVisible();
});

test("board card opens the board canvas", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("accessToken", "e2e-test-access-token");
  });

  await page.route("**/api/auth/auth-user", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        data: testUser,
        success: true,
        message: "User authenticated",
      }),
    });
  });

  await page.route("**/api/room", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ data: [createdBoard] }),
    });
  });

  await page.route("**/api/room/**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ data: createdBoard }),
    });
  });

  await page.route("**/api/elements/**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ data: [] }),
    });
  });

  await page.goto("/dashboard");
  await page.getByRole("button", { name: "My boards" }).click();
  await page.getByRole("heading", { name: "Product planning board" }).click();

  await expect(page).toHaveURL(/\/canvas\/board-123$/);
});
