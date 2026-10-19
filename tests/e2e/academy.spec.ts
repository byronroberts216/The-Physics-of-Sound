import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
test("lesson feedback, notes, bookmark and completion persist and export safely", async ({
  page,
}) => {
  await page.goto("/course/measurement");
  await page
    .getByRole("radio", { name: "The cable’s physical length", exact: true })
    .check();
  await expect(page.getByText(/Let’s examine that/).first()).toBeVisible();
  await page
    .getByRole("radio", {
      name: "The numerical value and reference unit",
      exact: true,
    })
    .check();
  await expect(page.getByText(/That’s it/).first()).toBeVisible();
  await page
    .getByLabel("Your notes", { exact: true })
    .fill("Measured finished wall to wall: 3.42 m.");
  await page
    .getByRole("button", { name: "Bookmark lesson", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Mark as studied", exact: true })
    .click();
  await page.reload();
  await expect(page.getByLabel("Your notes", { exact: true })).toHaveValue(
    "Measured finished wall to wall: 3.42 m.",
  );
  await expect(
    page.getByRole("button", { name: "Lesson completed", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/library");
  await expect(
    page.getByText("Measured finished wall to wall: 3.42 m.", { exact: true }),
  ).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export progress" }).click();
  const downloaded = await downloadPromise;
  const data = JSON.parse(await readFile((await downloaded.path())!, "utf8"));
  expect(data.completed).toContain("measurement");
  expect(data.notes.measurement).toContain("3.42");
  await page
    .locator('input[type="file"]')
    .setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"version":2}'),
    });
  await expect(page.getByRole("status").first()).toContainText(
    "Import not applied",
  );
  await expect(
    page.getByText("Measured finished wall to wall: 3.42 m.", { exact: true }),
  ).toBeVisible();
  data.notes.measurement = "Imported note: keep the unit.";
  await page
    .locator('input[type="file"]')
    .setInputFiles({
      name: "backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(data)),
    });
  await expect(
    page.getByRole("button", { name: "Replace with imported data" }),
  ).toBeVisible();
  await expect(
    page.getByText("Measured finished wall to wall: 3.42 m.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Replace with imported data" })
    .click();
  await expect(
    page.getByText("Imported note: keep the unit.", { exact: true }),
  ).toBeVisible();
});
test("labs expose correct values, stopped audio and keyboard-controllable models", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/labs");
  await expect(
    page.getByRole("button", { name: "Animate slowly" }),
  ).toBeVisible();
  await page
    .getByRole("slider", { name: "Frequency", exact: true })
    .fill("200");
  await expect(page.locator("#waves .readouts")).toContainText("1.715");
  await page.getByRole("button", { name: "Step ⅛ cycle" }).click();
  await expect(
    page.getByRole("slider", { name: "Cycle position" }),
  ).toHaveValue("0.125");
  await page.getByRole("slider", { name: "Phase difference" }).fill("180");
  await expect(page.locator("#interference .big-readout")).toContainText(
    "0.000",
  );
  await page
    .getByRole("slider", { name: "RMS pressure", exact: true })
    .fill("40");
  await expect(page.locator("#decibels .big-readout").first()).toContainText(
    "6.02",
  );
  await expect(page.getByText("Audio is off.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Play pure tone" }).click();
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  await page.getByRole("button", { name: "Stop audio" }).click();
  await expect(page.getByText("Audio is off.", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
test("room dimensions, modal midpoint and reflection geometry work with invalid input recovery", async ({
  page,
}) => {
  await page.goto("/workshop");
  await page.getByRole("spinbutton", { name: "Room length (m)" }).fill("5");
  await page.getByRole("spinbutton", { name: "Room width (m)" }).fill("4");
  await page.getByRole("spinbutton", { name: "Room height (m)" }).fill("3");
  await expect(page.locator(".room-lab .readouts")).toContainText("34.30");
  await page.getByRole("slider", { name: "Listener along length" }).fill("0.5");
  await expect(page.locator(".room-lab .readouts")).toContainText("0.000");
  await page.getByRole("spinbutton", { name: "Room length (m)" }).fill("");
  await expect(page.locator(".room-inputs [role=alert]")).toContainText(
    "Calculations are paused",
  );
  await expect(page.getByRole("tabpanel")).toHaveCount(0);
  await page.getByRole("spinbutton", { name: "Room length (m)" }).fill("5");
  await page.getByRole("tab", { name: "Room modes" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Reflection paths" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Extra delay", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Depth & treatment" }).click();
  await expect(page.getByText(/neither a cutoff frequency/)).toBeVisible();
});
test("glossary filters and planned content stays honest", async ({ page }) => {
  await page.goto("/glossary");
  await page.getByRole("searchbox").fill("Uncertainty");
  await expect(page.getByRole("status")).toHaveText(
    "1 terms in the available lessons",
  );
  await expect(
    page.getByText("A description of the remaining doubt", { exact: false }),
  ).toBeVisible();
  await page.goto("/course/isolation");
  await expect(
    page.getByText(/not yet written or scientifically reviewed/),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Mark as studied" }),
  ).toHaveCount(0);
});
test("core routes have no detected WCAG A/AA axe violations or horizontal overflow", async ({
  page,
}) => {
  test.setTimeout(120000);
  for (const route of [
    "/",
    "/course/measurement",
    "/labs",
    "/workshop",
    "/glossary",
    "/library",
    "/references",
  ]) {
    await page.goto(route);
    await expect(page.getByRole("main")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      audit.violations,
      `${route}: ${audit.violations.map((v) => v.id).join()}`,
    ).toEqual([]);
  }
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const light = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(light.violations).toEqual([]);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
