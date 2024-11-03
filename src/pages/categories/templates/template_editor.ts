import { chromium, expect, Locator } from "@playwright/test";
import { HPage } from "../../page";
import { LayerStyles, TTemplate } from "@core/fixture";
const categoriesList = require("../../../api/template_api");

export class TemplateEditor extends HPage {
  xpathAdsModal = "//div[contains(@class,'ant-modal-content')]";
  xpathcloseModalButton = "//button[contains(@class,'ant-modal-close')]";
  xpathLoading = "//svg[contains(@class,'ant-progress-circle')]";
  xpathTemplateMenu = "//a[@id='left-tabs-example-tab-TEMPLATE']";
  xpathCategoriesList =
    "//div[contains(.,'全て表示')]/preceding-sibling::h5[contains(@class,'header')]";
  xpathCategory = (index) =>
    `(//div[contains(.,'全て表示')]/preceding-sibling::h5[contains(@class,'header')])[${index}]`;
  xpathSidebarPageNumberSection = "//div[contains(@class,'ant-drawer-title')]";
  xpathSidebarThumnailPageSection = "//div[contains(@class,'page-card-item')]";
  xpathテキストMenu = "//span[contains(.,'テキスト')]/../../div";
  xpathテキストを追加btn =
    "(//p[contains(text(),'横書き')]/following-sibling::div/button)[1]";
  xpathDialogAds =
    "//div[contains(text(),'テンプレートを選択')]/../parent::div";
  xpathCloseDialogAds =
    "//div[contains(text(),'テンプレートを選択')]/button[contains(@class,'button-close')]";
  xpathFontSize =
    "//div[contains(@class,'font-size-input')]/div[@role='combobox']/div[contains(@class,'ant-select-selection__rendered')]/div[1]";
  xpathBold = `//*[@id="ac-editor-header-toolbar-child-1"]/div/div[2]/button`;
  xpathitalic = `//*[@id="ac-editor-header-toolbar-child-1"]/div/div[3]/button`;
  xpathUnderline = `//*[@id="ac-editor-header-toolbar-child-1"]/div/div[5]/button`;
  xpathInputFont = "(//input[contains(@class,'ant-select-search__field')])[3]";
  xpathCanvasContainer = "//div[@class='canvas-container']"
  /**
   * Use access to link.
   * @param domain: domain of the system
   * */
  async goToURL(domain: string) {
    await this.page.goto(domain);
  }

  /**
   * Open テキスト menu
   * @param domain: domain of the system
   * */
  async clickOnテキストを追加In横書き() {
    await this.clickToElement(this.xpathテキストを追加btn);
  }

  /**
   * Get thông tin của mỗi api
   * @param api
   * @returns
   */
  async getListCategoriesByAPI(page): Promise<TTemplate[]> {
    try {
      const res = await page.request.get(
        `https://data.api.design-ac.net/categories?lang=ja&role=user`
      );
      expect(res.status()).toBe(200);
      const response = await res.json();
      return response?.categories?.template;
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Get thông tin hiển thị của mỗi category ở màn hình nội dung
   * @returns
   */
  async getListCategory(): Promise<TTemplate[]> {
    const categories = [];
    const count = await this.genLoc(this.xpathCategoriesList).count();
    for (let i = 1; i <= count; i++) {
      const category = {
        name: await this.getTextContent(this.xpathCategory(i)),
      };
      categories.push(category);
    }
    return categories;
  }

  /**
   * Check if [Ads] is displayed, Click on [Close (x)] button
   * Check: In editor page, after the app finished loading template, in the left sidebar, menu テンプレート is opened
   * */
  async verifyDisplayTemplateMenu() {
    await this.page.locator(this.xpathLoading).waitFor({ state: "hidden" });
    await this.page.waitForLoadState();
    try {
      const adsVisible = this.page.locator(this.xpathAdsModal);
      if (adsVisible.isVisible()) {
        await this.page.locator(this.xpathcloseModalButton).click();
      }
    } catch (error) {
      console.error("Error clicking on close button:", error);
    }
    const hasActiveClass = await this.page
      .locator(this.xpathTemplateMenu)
      .evaluate((el) => el.classList.contains("active"));
    expect(hasActiveClass).toBe(true);
  }

  /**
   * Menu テンプレート is displaying the list of all template categories.
   * */
  async verifyCategoriesList() {
    const result = await this.getListCategoriesByAPI(this.page);
    const resultslistCategoriesByAPI = result.map(
      (item) => JSON.parse(item?.name)?.cat_name_jp
    );
    const listCategories = await this.getListCategory();
    expect(listCategories.length).toEqual(resultslistCategoriesByAPI.length);
    const resultsListCategories = listCategories.map((item) => item.name);
    resultsListCategories.forEach((el) => {
      expect(resultslistCategoriesByAPI).toContain(el);
    });
  }

  /**
   * In the right sidebar, it shows the list of 6 page thumbnails.
   * @param numberOfPage: Số lượng page thu nhỏ
   * */
  async verifyNumberOfPageOnSidebar(numberOfPage: number) {
    const numberOfPageSidebarSection = await this.page
      .locator(this.xpathSidebarPageNumberSection)
      .textContent();
    expect(numberOfPageSidebarSection).toEqual(`全${numberOfPage}ページ`);
    expect(
      await this.page.locator(this.xpathSidebarThumnailPageSection).count()
    ).toEqual(numberOfPage);
  }

  /**
   * Open テキスト menu
   * @param domain: domain of the system
   * */
  async openMenuテキスト() {
    // await this.page.locator(this.xpathLoading).waitFor({ state: "hidden" , timeout: 5000});
    await this.page.waitForTimeout(10000);
    const closeElements = [
      { locator: this.xpathDialogAds, closeButton: this.xpathCloseDialogAds },
      { locator: this.xpathAdsModal, closeButton: this.xpathcloseModalButton },
    ];
    for (const { locator, closeButton } of closeElements) {
      try {
        const elementVisible = this.page.locator(locator);
        if (await elementVisible.isVisible()) {
          await this.page.locator(closeButton).click();
          await this.page.waitForTimeout(2000);
        }
      } catch (error) {
        console.error(`Error clicking on close button for ${locator}:`, error);
      }
    }
    await this.page.locator(this.xpathテキストMenu).click();
  }

  /**
   * In the テキスト tab, section 横書き only has one button テキストを追加.
   * Hàm để kiểm tra số lượng của buttonテキストを追加 trong section 横書き
   * */
  async verifyNumberOfButton() {
    const buttonCount = await this.page
      .locator(this.xpathテキストを追加btn)
      .count();
    expect(buttonCount).toBe(1);
  }

  /**
   * Hàm để kiểm tra action khi hover vào button テキストを追加
   * */
  async checkHoverToButton() {
    await this.page.locator(this.xpathテキストを追加btn).hover();

    const cursorStyle = await this.page.evaluate((xpath) => {
      const button = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue as HTMLElement;
      return button ? window.getComputedStyle(button).cursor : null;
    }, this.xpathテキストを追加btn);
    expect(cursorStyle).toBe("pointer");
  }

  /**
   * Hàm edit style layer
   * @param data
   */
  async changeDesign(value: string) {
    await this.clickToElement(this.xpathFontSize);
    await this.page.locator(this.xpathInputFont).fill(value);
    await this.page.locator(this.xpathFontSize).press("Enter");
    await this.page.locator(this.xpathBold).click();
    await this.page.locator(this.xpathitalic).click();
    await this.page.locator(this.xpathUnderline).click();
  }

  /**
   * Hàm verify image canvas
   * @param path: Path của ảnh
   */
  async verifyCanvas(path: string) {
    await this.page.waitForLoadState();
    await expect(this.page).toHaveScreenshot(path);
    
  }
}
