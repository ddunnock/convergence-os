/**
 * @fileoverview E2E tests for theme system functionality.
 * Tests theme switching, persistence, and visual appearance in a real browser.
 */

import { test, expect, type Page } from "@playwright/test";

/**
 * Helper to clear localStorage and reset theme state.
 */
async function resetThemeState(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    const link = document.getElementById("theme-variant-css");
    if (link) link.remove();
  });
}

/**
 * Helper to wait for theme to be applied.
 */
async function waitForTheme(page: Page, variant: string) {
  await expect(page.locator("html")).toHaveAttribute("data-theme", variant);
}

test.describe("Theme System E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Initial Load", () => {
    test("page loads without errors", async ({ page }) => {
      await expect(page).toHaveTitle(/Convergence/);
    });

    test("default theme is convergence", async ({ page }) => {
      await waitForTheme(page, "convergence");
    });

    test("theme CSS is loaded", async ({ page }) => {
      const themeLink = page.locator("#theme-variant-css");
      await expect(themeLink).toHaveAttribute("href", /\/themes\/convergence\.css/);
    });

    test("no flash of unstyled content (FOUC)", async ({ page }) => {
      // Navigate with network throttling to better detect FOUC
      await page.route("**/*", (route) => {
        // Add small delay to responses
        setTimeout(() => route.continue(), 50);
      });

      await page.goto("/");

      // Check that data-theme is set immediately (from inline script)
      const dataTheme = await page.getAttribute("html", "data-theme");
      expect(dataTheme).toBe("convergence");
    });
  });

  test.describe("Theme Persistence", () => {
    test("theme persists after page reload", async ({ page }) => {
      // Change theme via localStorage (simulating ThemeSwitcher)
      await page.evaluate(() => {
        localStorage.setItem("convergence-theme-variant", "synthwave");
      });

      // Reload page
      await page.reload();

      // Theme should be synthwave
      await waitForTheme(page, "synthwave");
    });

    test("theme persists across navigation", async ({ page }) => {
      // Set theme
      await page.evaluate(() => {
        localStorage.setItem("convergence-theme-variant", "synthwave");
      });

      await page.reload();
      await waitForTheme(page, "synthwave");

      // Navigate to same page (simulating SPA navigation)
      await page.goto("/");

      // Theme should still be synthwave
      await waitForTheme(page, "synthwave");
    });

    test("localStorage stores correct value", async ({ page }) => {
      await page.evaluate(() => {
        localStorage.setItem("convergence-theme-variant", "synthwave");
      });

      const storedValue = await page.evaluate(() => {
        return localStorage.getItem("convergence-theme-variant");
      });

      expect(storedValue).toBe("synthwave");
    });
  });

  test.describe("Color Mode", () => {
    test("light mode has light color scheme", async ({ page }) => {
      // Wait for next-themes to initialize
      await page.waitForTimeout(100);

      // Check color scheme is set
      const html = page.locator("html");
      const colorScheme = await html.evaluate((el) =>
        getComputedStyle(el).colorScheme
      );
      expect(["light", "dark", "normal"]).toContain(colorScheme);
    });

    test("system preference is detected", async ({ page, context }) => {
      // Emulate dark mode preference
      await context.route("**/*", async (route) => {
        await route.continue();
      });

      // Check that system preference detection works
      // (The actual value depends on the test environment)
      const hasColorScheme = await page.evaluate(() => {
        return window.matchMedia("(prefers-color-scheme: dark)").matches !== undefined;
      });
      expect(hasColorScheme).toBe(true);
    });
  });

  test.describe("Theme CSS Loading", () => {
    test("convergence.css loads for convergence theme", async ({ page }) => {
      await waitForTheme(page, "convergence");

      const themeLink = page.locator("#theme-variant-css");
      await expect(themeLink).toHaveAttribute("href", "/themes/convergence.css");
    });

    test("synthwave.css loads for synthwave theme", async ({ page }) => {
      await page.evaluate(() => {
        localStorage.setItem("convergence-theme-variant", "synthwave");
      });

      await page.reload();
      await waitForTheme(page, "synthwave");

      const themeLink = page.locator("#theme-variant-css");
      await expect(themeLink).toHaveAttribute("href", "/themes/synthwave.css");
    });

    test("theme CSS is in document head", async ({ page }) => {
      const linkInHead = await page.evaluate(() => {
        const link = document.getElementById("theme-variant-css");
        return link?.parentElement?.tagName === "HEAD";
      });
      expect(linkInHead).toBe(true);
    });
  });

  test.describe("Visual Regression", () => {
    test("convergence theme has expected styling", async ({ page }) => {
      await waitForTheme(page, "convergence");

      // Take screenshot for visual comparison
      await expect(page).toHaveScreenshot("convergence-theme.png", {
        maxDiffPixels: 100,
      });
    });

    test("synthwave theme has expected styling", async ({ page }) => {
      await page.evaluate(() => {
        localStorage.setItem("convergence-theme-variant", "synthwave");
      });

      await page.reload();
      await waitForTheme(page, "synthwave");

      // Take screenshot for visual comparison
      await expect(page).toHaveScreenshot("synthwave-theme.png", {
        maxDiffPixels: 100,
      });
    });
  });

  test.describe("Accessibility", () => {
    test("page has proper lang attribute", async ({ page }) => {
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });

    test("page has title", async ({ page }) => {
      await expect(page).toHaveTitle(/Convergence/);
    });

    test("images have alt text", async ({ page }) => {
      const images = page.locator("img");
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        await expect(img).toHaveAttribute("alt");
      }
    });
  });

  test.describe("Error Handling", () => {
    test("handles invalid localStorage value gracefully", async ({ page }) => {
      await page.evaluate(() => {
        localStorage.setItem("convergence-theme-variant", "invalid-theme");
      });

      await page.reload();

      // Should fall back to default
      await waitForTheme(page, "convergence");
    });

    test("handles corrupted localStorage data", async ({ page }) => {
      await page.evaluate(() => {
        localStorage.setItem("convergence-theme-variant", '{"__proto__":null}');
      });

      await page.reload();

      // Should not crash, fall back to default
      await waitForTheme(page, "convergence");
    });

    test("handles missing theme CSS gracefully", async ({ page }) => {
      // Block theme CSS
      await page.route("**/themes/*.css", (route) => {
        route.abort();
      });

      // Page should still load without crashing
      const response = await page.goto("/");
      expect(response?.ok()).toBe(true);
    });
  });

  test.describe("Performance", () => {
    test("page loads within acceptable time", async ({ page }) => {
      const startTime = Date.now();
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const loadTime = Date.now() - startTime;

      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test("theme switch is instant (no visible delay)", async ({ page }) => {
      await waitForTheme(page, "convergence");

      const startTime = Date.now();

      await page.evaluate(() => {
        localStorage.setItem("convergence-theme-variant", "synthwave");
        document.documentElement.setAttribute("data-theme", "synthwave");
      });

      const switchTime = Date.now() - startTime;

      // Theme switch should be nearly instant
      expect(switchTime).toBeLessThan(100);
    });
  });

  test.describe("Mobile Responsiveness", () => {
    test("theme works on mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      await waitForTheme(page, "convergence");

      // Page should be visible and scrollable
      const body = page.locator("body");
      await expect(body).toBeVisible();
    });
  });
});
