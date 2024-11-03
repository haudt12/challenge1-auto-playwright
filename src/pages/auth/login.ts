import { chromium } from "@playwright/test";
import { HPage } from "@pages/page";

export class LoginPage extends HPage {
  xpathEmail = "//input[contains(@autocomplete,'username')]";
  xpathPassword = "//input[contains(@autocomplete,'current-password')]";
  xpathSignIn = "//button[normalize-space()='Sign in']";
  xpathMenu = "//button[@aria-label='open drawer']";

  /**
   * Use access to link.
   * @param domain: domain of the system
   * */
  async goToURL(domain: string) {
    await this.page.goto(domain);
  }
}