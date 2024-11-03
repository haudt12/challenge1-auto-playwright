import {
  BrowserContext,
  expect,
  FrameLocator,
  Locator,
  Page,
  Response,
} from "@playwright/test";

export class HPage {
  page: Page;
  readonly domain: string;

  // constructor(browserContext: BrowserContext, domain: string) {
  constructor(page: Page, domain?: string) {
    this.page = page;
    this.domain = domain ?? "";
  }
  setPage(page: Page) {
    this.page = page;
  }

  genLoc(selector: string) {
    if (!this.page) {
      throw new Error("Page is not initialized");
    }
    return this.page.locator(selector);
  }

  async getTextContent(locator: string, page = this.page): Promise<string> {
    return (await page.locator(locator).textContent()).trim();
  }

  /**
   * Use access to link.
   * @param domain: domain of the system
   * */
  async clickToElement(locator: string) {
    await this.page.locator(locator).click();
  }
}