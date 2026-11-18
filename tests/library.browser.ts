import { test, expect, type Page } from "@playwright/test";
import { build } from "esbuild";
import { readFile } from "node:fs/promises";
let javascript: string;
test.beforeAll(async () => {
  const result = await build({
    entryPoints: ["tests/fixtures/library.tsx"],
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' },
  });
  javascript = result.outputFiles[0].text;
});
async function mount(page: Page, scenario: "fast" | "deferred" = "fast") {
  await page.setContent(
    '<div class="hidden" id="outside">Host content</div><div id="root"></div>',
  );
  await page.addStyleTag({
    content: await readFile("dist/styles.css", "utf8"),
  });
  await page.evaluate((scenario) => {
    window.testScenario = scenario;
  }, scenario);
  await page.addScriptTag({ content: javascript });
}
async function openFilters(page: Page) {
  const search = page.getByRole("textbox", { name: "Search", exact: true });
  if (!(await search.isVisible()))
    await page.getByRole("button", { name: "Filters", exact: true }).click();
  return search;
}
test("clear stays cleared after debounce", async ({ page }) => {
  await mount(page);
  const search = await openFilters(page);
  await search.fill("oak");
  await expect
    .poll(() => page.evaluate(() => window.libraryTest.queries.length))
    .toBe(1);
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await expect(search).toHaveValue("");
  await page.waitForTimeout(650);
  expect(
    await page.evaluate(() =>
      window.libraryTest.queries.map((q) => q.searchFilter?.value),
    ),
  ).toEqual(["oak", null]);
  await expect(search).toHaveValue("");
});
test("a pending response cannot erase newer input", async ({ page }) => {
  await mount(page, "deferred");
  const search = await openFilters(page);
  await search.fill("ab");
  await expect
    .poll(() => page.evaluate(() => window.libraryTest.pending.length))
    .toBe(1);
  await search.fill("abc");
  await page.evaluate(() =>
    window.libraryTest.pending[0]({ data: ["ab"], total: 1 }),
  );
  await expect(search).toHaveValue("abc");
  await expect
    .poll(() => page.evaluate(() => window.libraryTest.queries.length))
    .toBe(2);
  expect(
    await page.evaluate(
      () => window.libraryTest.queries[1].searchFilter?.value,
    ),
  ).toBe("abc");
});
test("optional CSS leaves host utilities unchanged and portals inherit instance theme", async ({
  page,
}) => {
  await mount(page);
  await expect(page.locator("#outside")).toBeVisible();
  await openFilters(page);
  const select = page.getByRole("combobox", { name: "Mixed types" });
  await select.click();
  const content = page.getByRole("listbox");
  await expect(content).toBeVisible();
  expect(
    await content.evaluate((element) =>
      element.closest(".instance-theme")?.getAttribute("lang"),
    ),
  ).toBe("pl");
  expect(
    await content.evaluate((element) =>
      getComputedStyle(element).getPropertyValue("--color-primary").trim(),
    ),
  ).toBe("rgb(11, 22, 33)");
});
test("select keeps string numeric and empty values distinct", async ({
  page,
}) => {
  await mount(page);
  await openFilters(page);
  for (const [label, value] of [
    ["String one", "1"],
    ["Numeric one", 1],
    ["Empty string", ""],
  ] as const) {
    await page.getByRole("combobox", { name: "Mixed types" }).click();
    await page.getByRole("option", { name: label, exact: true }).click();
    await expect
      .poll(() =>
        page.evaluate(
          () => window.libraryTest.queries.at(-1)?.filters[0].value,
        ),
      )
      .toBe(value);
  }
});
test("mobile filters close on Escape during a pending request", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile drawer boundary");
  await mount(page, "deferred");
  const trigger = page.getByRole("button", { name: "Filters", exact: true });
  await trigger.click();
  await page
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("pending");
  await expect
    .poll(() => page.evaluate(() => window.libraryTest.pending.length))
    .toBe(1);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});
