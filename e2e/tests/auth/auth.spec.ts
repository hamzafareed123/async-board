import { expect, test, type Page } from "@playwright/test";

const testUser = {
  id: "e2e-test-user",
  fullName: "Playwright Test User",
  email: "playwright@example.com",
};

async function mockSuccessfulAuth(
  page: Page,
  endpoint: "signup" | "login",
) {
  await page.route(`**/api/auth/${endpoint}`, async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          user: testUser,
          accessToken: "e2e-test-access-token",
        },
        success: true,
        message: "Authentication successful",
      }),
    });
  });

  await page.route("**/api/room", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ data: [] }),
    });
  });
}

async function mockForgotPasswordFlow(page: Page) {
  await page.route("**/api/auth/forgot-password", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        data: { userId: "e2e-forgot-user-id" },
        success: true,
        message: "OTP sent successfully",
      }),
    });
  });

  await page.route("**/api/auth/verify-otp", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        data: { resetToken: "e2e-reset-token" },
        success: true,
        message: "OTP verified successfully",
      }),
    });
  });

  await page.route("**/api/auth/reset-password", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        data: null,
        success: true,
        message: "Password reset successfully",
      }),
    });
  });
}

test("signup shows validation errors for empty fields", async ({ page }) => {
  await page.goto("/signup");
  await page.getByRole("button", { name: "Sign up" }).click();

  await expect(page.getByText("Name is required")).toBeVisible();
  await expect(page.getByText("Email is required")).toBeVisible();
  await expect(page.getByText("Password is required")).toBeVisible();
});

test("signup shows an error when passwords do not match", async ({ page }) => {
  await page.goto("/signup");
  await page.getByPlaceholder("Your name").fill(testUser.fullName);
  await page.getByPlaceholder("you@example.com").fill(testUser.email);
  await page.getByPlaceholder("••••••••").nth(0).fill("safe-pass-123");
  await page.getByPlaceholder("••••••••").nth(1).fill("different-pass");
  await page.getByRole("button", { name: "Sign up" }).click();

  await expect(page.getByText("Passwords do not match")).toBeVisible();
});

test("signup submits valid details and opens the dashboard", async ({
  page,
}) => {
  await mockSuccessfulAuth(page, "signup");
  await page.goto("/signup");
  await page.getByPlaceholder("Your name").fill(testUser.fullName);
  await page.getByPlaceholder("you@example.com").fill(testUser.email);
  await page.getByPlaceholder("••••••••").nth(0).fill("safe-pass-123");
  await page.getByPlaceholder("••••••••").nth(1).fill("safe-pass-123");
  await page.getByRole("button", { name: "Sign up" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", {
      name: `Welcome back, ${testUser.fullName}`,
    }),
  ).toBeVisible();
});

test("login shows validation errors for empty fields", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.getByText("Email is required")).toBeVisible();
  await expect(page.getByText("Password is required")).toBeVisible();
});

test("login submits valid credentials and opens the dashboard", async ({
  page,
}) => {
  await mockSuccessfulAuth(page, "login");
  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill(testUser.email);
  await page.getByPlaceholder("••••••••").fill("safe-pass-123");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", {
      name: `Welcome back, ${testUser.fullName}`,
    }),
  ).toBeVisible();
});

test("login displays an error when the server rejects credentials", async ({
  page,
}) => {
  await page.route("**/api/auth/login", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "Invalid credentials" }),
    });
  });

  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill(testUser.email);
  await page.getByPlaceholder("••••••••").fill("wrong-pass");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.getByText("Invalid credentials")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("user can reach the forgot password flow from login", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("link", { name: "Forgot password?" }).click();

  await expect(page).toHaveURL(/\/forgot-password$/);
  await expect(
    page.getByRole("heading", { name: "Forgot password?" }),
  ).toBeVisible();
});

test("user can complete the forgot password reset flow", async ({ page }) => {
  await mockForgotPasswordFlow(page);
  await page.goto("/login");
  await page.getByRole("link", { name: "Forgot password?" }).click();

  await page.getByPlaceholder("you@example.com").fill(testUser.email);
  await page.getByRole("button", { name: "Send OTP" }).click();

  await expect(
    page.getByRole("heading", { name: "Enter verification code" }),
  ).toBeVisible();
  await expect(page.getByText("OTP sent to your email successfully.")).toBeVisible();

  const otpInputs = page.locator('input[type="text"][inputmode="numeric"]');
  await otpInputs.nth(0).fill("1");
  await otpInputs.nth(1).fill("2");
  await otpInputs.nth(2).fill("3");
  await otpInputs.nth(3).fill("4");
  await otpInputs.nth(4).fill("5");
  await otpInputs.nth(5).fill("6");
  await page.getByRole("button", { name: "Verify OTP" }).click();

  await expect(
    page.getByRole("heading", { name: "Reset password" }),
  ).toBeVisible();
  await expect(
    page.getByText("Email verified successfully."),
  ).toBeVisible();

  await page.getByPlaceholder("••••••••").nth(0).fill("new-pass-123");
  await page.getByPlaceholder("••••••••").nth(1).fill("new-pass-123");
  await page.getByRole("button", { name: "Reset password" }).click();

  await expect(page).toHaveURL(/\/login$/);
});
