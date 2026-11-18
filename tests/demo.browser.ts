import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
});

test("searches, sorts, paginates and clears the main catalog", async ({
  page,
}) => {
  const demo = page.getByRole("region", {
    name: "Resource explorer",
    exact: true,
  });
  await expect(demo.locator(".rsf")).toHaveCount(1);
  await expect(demo.getByRole("article")).toHaveCount(6);
  await expect(
    demo.getByRole("heading", { name: "Atlas layout kit" }),
  ).toBeVisible();

  await demo.getByRole("button", { name: "Next", exact: true }).click();
  await expect(
    demo.getByRole("button", { name: "Page 2", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    demo.getByRole("heading", { name: "Grove grid builder" }),
  ).toBeVisible();

  await demo
    .getByRole("combobox", { name: "Sort resources", exact: true })
    .click();
  await page.getByRole("option", { name: "Name: Z–A", exact: true }).click();
  await expect(
    demo.getByRole("button", { name: "Page 1", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    demo.getByRole("article").first().getByRole("heading"),
  ).toHaveText("River responsive patterns");

  await demo
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("Beacon");
  await expect(demo.getByRole("article")).toHaveCount(1);
  await expect(
    demo.getByRole("heading", { name: "Beacon contrast guide" }),
  ).toBeVisible();
  await demo
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await expect(
    demo.getByRole("textbox", { name: "Search", exact: true }),
  ).toHaveValue("");
  await expect(demo.getByRole("article")).toHaveCount(6);
  await expect(
    demo.getByRole("article").first().getByRole("heading"),
  ).toHaveText("River responsive patterns");
});

test("combines all five filter controls and clears their selections", async ({
  page,
}) => {
  const demo = page.getByRole("region", {
    name: "Resource explorer",
    exact: true,
  });
  await demo.getByRole("combobox", { name: "Category", exact: true }).click();
  await page.getByRole("option", { name: "Guides", exact: true }).click();
  await expect(demo.getByRole("article")).toHaveCount(6);
  await expect(
    demo.getByRole("heading", { name: "Beacon contrast guide" }),
  ).toBeVisible();

  await demo
    .getByRole("checkbox", { name: "Accessibility", exact: true })
    .check();
  await expect(demo.getByRole("article")).toHaveCount(2);
  await demo.getByRole("button", { name: "Article", exact: true }).click();
  await expect(
    demo.getByRole("button", { name: "Article", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await demo
    .getByRole("checkbox", { name: "Free resources only", exact: true })
    .check();
  await expect(
    demo.getByRole("checkbox", { name: "Free resources only", exact: true }),
  ).toBeChecked();
  await demo.getByRole("button", { name: "Amber", exact: true }).click();
  await expect(
    demo.getByRole("button", { name: "Amber", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(demo.getByRole("article")).toHaveCount(2);
  await expect(
    demo.getByRole("heading", { name: "Harbor keyboard guide" }),
  ).toBeVisible();

  await demo
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await expect(
    demo.getByRole("checkbox", { name: "Accessibility", exact: true }),
  ).not.toBeChecked();
  await expect(
    demo.getByRole("checkbox", { name: "Free resources only", exact: true }),
  ).not.toBeChecked();
  await expect(
    demo.getByRole("button", { name: "Article", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await expect(
    demo.getByRole("button", { name: "Amber", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await expect(demo.getByRole("article")).toHaveCount(6);
});

test("uses caller-provided translations without resetting the query", async ({
  page,
}) => {
  const demo = page.getByRole("region", {
    name: "Resource explorer",
    exact: true,
  });
  await demo
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("Atlas");
  await expect(demo.getByRole("article")).toHaveCount(1);
  await demo
    .getByRole("combobox", { name: "Demo language", exact: true })
    .selectOption("pl");
  await expect(demo.locator(".rsf")).toHaveAttribute("lang", "pl-PL");
  await expect(
    demo.getByRole("textbox", { name: "Szukaj", exact: true }),
  ).toHaveValue("Atlas");
  await expect(
    demo.getByRole("button", { name: "Wyczyść filtry", exact: true }),
  ).toBeVisible();
  await expect(
    demo.getByText("Materiały: 1", { exact: true }).filter({ visible: true }),
  ).toBeVisible();

  await demo
    .getByRole("combobox", { name: "Demo language", exact: true })
    .selectOption("es");
  await expect(
    demo.getByRole("textbox", { name: "Buscar", exact: true }),
  ).toHaveValue("Atlas");
  await expect(
    demo.getByRole("button", { name: "Borrar filtros", exact: true }),
  ).toBeVisible();
  await expect(
    demo.getByText("1 recursos", { exact: true }).filter({ visible: true }),
  ).toBeVisible();
});

test("keeps two module instances independent", async ({ page }) => {
  const main = page.getByRole("region", {
    name: "Resource explorer",
    exact: true,
  });
  const saved = page.getByRole("region", {
    name: "Saved resources",
    exact: true,
    includeHidden: true,
  });
  await main
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("Atlas");
  await expect(main.getByRole("article")).toHaveCount(1);
  await expect(saved.getByRole("article")).toHaveCount(3);
  await saved
    .getByRole("button", { name: "Saved filters", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Saved filters",
    exact: true,
  });
  await dialog
    .getByRole("textbox", { name: "Search saved resources", exact: true })
    .fill("Beacon");
  await expect(saved.getByRole("article", { includeHidden: true })).toHaveCount(
    1,
  );
  await page.keyboard.press("Escape");
  await expect(
    saved.getByRole("heading", { name: "Beacon contrast guide" }),
  ).toBeVisible();
  await expect(
    main.getByRole("heading", { name: "Atlas layout kit" }),
  ).toBeVisible();
  await expect(
    main.getByRole("textbox", { name: "Search", exact: true }),
  ).toHaveValue("Atlas");
});

test("opens the drawer on desktop and mobile, traps focus and restores it after Escape", async ({
  page,
}) => {
  const demo = page.getByRole("region", {
    name: "Resource explorer",
    exact: true,
    includeHidden: true,
  });
  await demo
    .getByRole("combobox", { name: "Desktop layout", exact: true })
    .selectOption("drawer");
  const trigger = demo.getByRole("button", { name: "Filters", exact: true });
  await trigger.click();
  await expect(
    page.getByRole("dialog", { name: "Filters", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();

  await demo
    .getByRole("combobox", { name: "Desktop layout", exact: true })
    .selectOption("sidebar");
  await page.setViewportSize({ width: 390, height: 844 });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Filters", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(":focus")).toHaveCount(1);
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.locator(":focus")).toHaveCount(1);
  await page.keyboard.press("Tab");
  await expect(dialog.locator(":focus")).toHaveCount(1);
  await dialog
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("Beacon");
  await expect(demo.getByRole("article", { includeHidden: true })).toHaveCount(
    1,
  );
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(
    demo.getByRole("heading", { name: "Beacon contrast guide" }),
  ).toBeVisible();
});

test("recovers a failed request with the library retry button and handles empty results", async ({
  page,
}) => {
  const demo = page.getByRole("region", {
    name: "Resource explorer",
    exact: true,
  });
  await demo
    .getByRole("button", { name: "Simulate request error", exact: true })
    .click();
  await expect(demo.getByRole("alert")).toContainText(
    "We couldn't load the resources.",
  );
  await demo.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(demo.getByRole("alert")).toHaveCount(0);
  await expect(demo.getByRole("article")).toHaveCount(6);

  await demo
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("no-resource-has-this-name");
  await expect(
    demo.getByRole("heading", { name: "No resources found", exact: true }),
  ).toBeVisible();
  await expect(demo.getByRole("article")).toHaveCount(0);
  await expect(
    demo.getByRole("navigation", { name: "Pagination", exact: true }),
  ).toHaveCount(0);
  await demo
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await expect(demo.getByRole("article")).toHaveCount(6);
});
