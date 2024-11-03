import fs from "fs";
import path from "path";
import type { Screenshot } from "@core/fixture";
import { chromium, expect } from "@playwright/test";
import { Locator, Page } from "@playwright/test";

export class SnapshotFixture {
  private s3Enabled: boolean;
  private s3Bucket: string;
  private s3Region: string;
  /**
   * Verify screenshot.
   * If not pass selector, this function will take a fullscreen shot
   * @param page
   * @param selector
   * @param snapshotName
   * @param screenshotOptions
   * @param snapshotOptions
   * @param needClosePage
   */
  public async verify({
    page,
    selector,
    snapshotName,
    screenshotOptions,
    snapshotOptions = { maxDiffPixelRatio: 0.005 },
    sizeCheck = false,
  }: Screenshot) {
    let sizeWindow: { width: number; height: number };
    const screenshotDir = process.env.ENV == "local" ? "local-snapshot" : "";
    if (selector) {
      const locator =
        typeof selector === "string" ? page.locator(selector) : selector;
      if (sizeCheck) {
        const sizeElement: { width: number; height: number } =
          await locator.evaluate(async (ele) => {
            const box = ele.getBoundingClientRect();
            return { width: box.width, height: box.height };
          });

        sizeWindow = await page.evaluate(async () => {
          return new Promise((resolve) => {
            resolve({
              width: window.screen.width,
              height: window.screen.height,
            });
          });
        });
        //Check size element để set viewport chụp ảnh
        const finalWidth =
          sizeElement.width > sizeWindow.width
            ? sizeElement.width + 200
            : sizeWindow.width;
        const finalHeight =
          sizeElement.height > sizeWindow.height
            ? sizeElement.height + 200
            : sizeWindow.height;
        if (
          finalWidth !== sizeWindow.width ||
          finalHeight !== sizeWindow.height
        ) {
          await page.setViewportSize({
            height: Math.floor(finalHeight),
            width: Math.floor(finalWidth),
          });
        }
      }
      expect
        .soft(await locator.screenshot(screenshotOptions))
        .toMatchSnapshot(
          [screenshotDir, snapshotName.replace(/_/g, "-")],
          snapshotOptions
        );
      if (sizeCheck) {
        await page.setViewportSize({
          height: sizeWindow.height,
          width: sizeWindow.width,
        });
      }
    } else {
      expect
        .soft(await page.screenshot(screenshotOptions))
        .toMatchSnapshot(
          [screenshotDir, snapshotName.replace(/_/g, "-")],
          snapshotOptions
        );
    }
  }
}
