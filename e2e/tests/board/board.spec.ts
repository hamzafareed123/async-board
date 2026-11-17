import { expect, test, type Page, type Route } from "@playwright/test";

const testUser = {
  id: "e2e-test-user",
  fullName: "Playwright Test User",
  email: "playwright@example.com",
};

const createdBoard = {
  _id: "board-12345",
  name: "Product planning board 3",
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
    editorCode: "board-editor-code-123",
    maxMembers: 5,
    expiresAt: null,
  },
  isPublic: true,
  inviteLink: "http://127.0.0.1:5173/join/board-code-123?role=viewer",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

async function mockAuthenticatedDashboard(
  page: Page,
  rooms: typeof createdBoard[] = [],
  onCreateRoom?: (route: Route) => Promise<void>,
) {
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
        body: JSON.stringify({ data: rooms }),
      });
      return;
    }

    if (onCreateRoom) {
      await onCreateRoom(route);
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
  await mockAuthenticatedDashboard(page, [createdBoard]);

  await page.goto("/dashboard");
  await page.getByRole("button", { name: "My boards" }).click();

  await expect(page.getByRole("heading", { name: "Product planning board 3" })).toBeVisible();
  await expect(page.getByText("Public")).toBeVisible();
  await expect(page.getByText("1 member")).toBeVisible();
});

test("board card opens the board canvas", async ({ page }) => {
  await mockAuthenticatedDashboard(page, [createdBoard]);
  await page.route(`**/api/room/${createdBoard._id}`, async (route) => {
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
  await page.getByRole("heading", { name: "Product planning board 3" }).click();

  await expect(page).toHaveURL(/\/canvas\/board-12345$/);
});

test("dashboard creates a board with the selected settings", async ({
  page,
}) => {
  test.setTimeout(60_000);
  let submittedData: unknown;
  await mockAuthenticatedDashboard(page, [], async (route) => {
    submittedData = route.request().postDataJSON();
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

  await page.goto("/dashboard");
  await page.getByRole("button", { name: "My boards" }).click();
  await page.getByRole("button", { name: "Create board", exact: true }).click();
  await page.getByPlaceholder("Enter board name").fill("Planning board");
  await page
    .getByPlaceholder("Add an optional board description")
    .fill("Plan the product launch");
  await page.getByLabel("Max members").selectOption("5");
  await page.getByRole("checkbox").uncheck();
  await page.getByRole("button", { name: "Create board", exact: true }).last().click();

  await expect(page.getByRole("heading", { name: "Board created" })).toBeVisible();
  expect(submittedData).toEqual({
    name: "Planning board",
    description: "Plan the product launch",
    isPublic: false,
    maxMembers: 5,
  });
  await expect(page.getByText(createdBoard.inviteLink)).toBeVisible();
});

test("dashboard shows an error when board creation fails", async ({ page }) => {
  await mockAuthenticatedDashboard(page, [], async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ message: "Server error" }),
    });
  });

  await page.goto("/dashboard");
  await page.getByRole("button", { name: "My boards" }).click();
  await page.getByRole("button", { name: "Create board", exact: true }).click();
  await page.getByPlaceholder("Enter board name").fill("Planning board");
  await page.getByRole("button", { name: "Create board", exact: true }).last().click();

  await expect(
    page.getByText("Unable to create board. Please try again."),
  ).toBeVisible();
  await expect(page.getByPlaceholder("Enter board name")).toHaveValue("Planning board");
});

test("board owner can delete a board from the dashboard", async ({ page }) => {
  await mockAuthenticatedDashboard(page, [createdBoard]);
  await page.route(`**/api/room/${createdBoard._id}`, async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, message: "Board deleted" }),
    });
  });

  await page.goto("/dashboard");
  await page.getByRole("button", { name: "My boards" }).click();
  await page.getByRole("button", { name: `Delete ${createdBoard.name}` }).click();

  await expect(
    page.getByRole("heading", { name: createdBoard.name }),
  ).toHaveCount(0);
});

test("board owner can share an editor invitation from the canvas", async ({
  page,
}) => {
  await mockAuthenticatedDashboard(page, [createdBoard]);
  await page.route(`**/api/room/${createdBoard._id}`, async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ data: createdBoard }),
    });
  });
  await page.route(`**/api/room/${createdBoard._id}/editor-invite`, async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ data: { editorCode: createdBoard.inviteCode.editorCode } }),
    });
  });
  await page.route("**/api/elements/**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ data: [] }),
    });
  });

  await page.goto(`/canvas/${createdBoard._id}`);
  await page.getByRole("button", { name: "Share" }).click();
  await expect(page.getByRole("heading", { name: "Share board" })).toBeVisible();
  await page.getByRole("button", { name: /Editor/ }).click();

  const appOrigin = new URL(page.url()).origin;
  await expect(
    page.getByText(
      `${appOrigin}/join/${createdBoard.inviteCode.editorCode}?role=editor`,
    ),
  ).toBeVisible();
});

test("user can join a board using an editor invitation", async ({ page }) => {
  let inviteRole: string | null = null;
  await mockAuthenticatedDashboard(page);
  await page.route("**/api/room/join/**", async (route) => {
    inviteRole = new URL(route.request().url()).searchParams.get("role");
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ data: { updatedRoom: createdBoard } }),
    });
  });
  await page.route(`**/api/room/${createdBoard._id}`, async (route) => {
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

  await page.goto(`/join/${createdBoard.inviteCode.editorCode}?role=editor`);
  await page.getByRole("button", { name: "Join Room" }).click();

  await expect(page).toHaveURL(new RegExp(`/canvas/${createdBoard._id}$`));
  await expect(
    page.getByRole("button", { name: createdBoard.name }),
  ).toBeVisible();
  expect(inviteRole).toBe("editor");
});

test("sticky notes save to the board and can be erased", async ({ page }) => {
  let createdElement: Record<string, unknown> | undefined;
  let deletedElementPath = "";
  await mockAuthenticatedDashboard(page, [createdBoard]);
  await page.route(`**/api/room/${createdBoard._id}`, async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ data: createdBoard }),
    });
  });
  await page.route(`**/api/elements/${createdBoard._id}/elements`, async (route) => {
    if (route.request().method() === "POST") {
      createdElement = route.request().postDataJSON();
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            _id: "sticky-db-id",
            ...createdElement,
          },
        }),
      });
      return;
    }
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ data: [] }) });
  });
  await page.route(`**/api/elements/${createdBoard._id}/elements/sticky-db-id`, async (route) => {
    deletedElementPath = new URL(route.request().url()).pathname;
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ success: true, data: null }) });
  });

  await page.goto(`/canvas/${createdBoard._id}`);
  await page.locator('button[title="Sticky"]').click();
  await page.locator("canvas").first().click({ position: { x: 500, y: 300 } });
  await page.getByRole("textbox", { name: "Sticky note text" }).fill("Ship the first version");
  await page.getByRole("button", { name: "Add note" }).click();

  await expect.poll(() => createdElement?.type).toBe("sticky");
  expect(createdElement).toMatchObject({
    type: "sticky",
    text: "Ship the first version",
    size: { width: 220, height: 160 },
  });

  await page.locator('button[title="Eraser"]').click();
  await page.locator("canvas").first().click({ position: { x: 520, y: 320 } });
  await expect.poll(() => deletedElementPath).toContain("sticky-db-id");
});
