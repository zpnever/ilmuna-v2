import { expect, test } from "@playwright/test";

test("landing to app shell flow works", async ({ page, isMobile }) => {
  await page.goto("/");
  await expect(page.getByText(/Ilmu kita bersama, dalam ritme digital yang tenang/i)).toBeVisible();

  await page.getByRole("link", { name: /Masuk/i }).click();
  await expect(page.getByRole("heading", { name: /Kembali belajar bersama/i })).toBeVisible();

  await page.getByLabel("Email").fill("demo@ilmuna.id");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: /Masuk ke aplikasi/i }).click();

  await expect(page.getByRole("heading", { name: /Feed sosial sudah punya bentuk awal/i })).toBeVisible();

  if (isMobile) {
    await expect(page.getByRole("link", { name: /Quran/i })).toBeVisible();
  }

  await page.getByRole("link", { name: /Quran/i }).click();
  await expect(page.getByRole("heading", { name: /Fondasi halaman Al-Quran/i })).toBeVisible();
});

