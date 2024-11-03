import { BrowserContext, chromium, expect } from "@playwright/test";
import { HPage } from "../../page";
import { TTemplate } from "@core/fixture";

export class TemplateDetails extends HPage {
  xpathこのテンプレートを編集btn =
    "//span[contains(.,'このテンプレートを編集')]/parent::button";
  xpathFigCaptionList = "//figcaption[contains(@class,'image-figcaption')]";
  xpathCloseModal = "//button[@aria-label='Close']";
  xpathCurrentCategoryName = "//span[contains(.,'カテゴリー')]/span/a";
  xpathFigcaptionIndex = (index) =>
    `(//figcaption[contains(@class,'image-figcaption')])[${index}]`;
  xpathTextCategory = "//span[contains(.,'カテゴリー')]/a";
  xpathTemplateThumbnail =
    "//div[contains(@class,'template-preview-modal-left-content-image')]";
  xpathNumberOfPageSection =
    "(//div[contains(@class,'template-preview-modal-left-content-image')]/following-sibling::div)[1]";
  xpathListOfPage = "//ul[contains(@class,'react-multi-carousel-track')]/li";
  xpathModalBody = "//div[contains(@class,'ant-modal-body')]";

  /**
   * Use access to link.
   * @param domain: domain of the system
   * */
  async goToURL(domain: string) {
    await this.page.goto(domain);
  }

  /**
   * Check category của similar template có giống với category truyền vào
   * @param categoryName
   */
  async checkSimilarTemplatesCategory(categoryName: string) {
    const count = await this.genLoc(this.xpathFigCaptionList)?.count();
    await this.page.waitForLoadState();
    for (let i = 1; i <= count; i++) {
      await this.page.locator(this.xpathFigcaptionIndex(i))?.click();
      await this.page.locator(this.xpathModalBody).waitFor({state: 'visible'});
      const templateCategoryName = await this.page
        .locator(this.xpathTextCategory)
        ?.textContent();
      expect(templateCategoryName).toEqual(categoryName);
      await this.page.locator(this.xpathCloseModal).click();
      await this.page.locator(this.xpathModalBody).waitFor({state: 'hidden'});
    }
    // const fylerKeywords = await this.page.locator(this.xpathCurrentCategoryName).textContent();
    // const listTemplateNames = await this.getListTemplateNames();
    // listTemplateNames.forEach((el) => {
    //   expect(el).toContain(fylerKeywords);
    // });
  }

  /**
   * Lấy số lượng page của template
   * @returns numberOfPage
   */
  async getThumnailNumber() {
    const numberOfPageSectionText = await this.page
      .locator(this.xpathNumberOfPageSection)
      ?.textContent();
    const numberOfPage = Number(numberOfPageSectionText?.split("/")?.[1]);
    return numberOfPage;
  }

  /**
   * Check list of page thumbnails are displayed below the template thumbnail.
   * @param
   * */
  async verifyNumberOfThumnailPages(numberOfPage: number) {
    const numberOfThumnailPages = await this.page
      .locator(this.xpathListOfPage)
      .count();
    expect(numberOfThumnailPages).toEqual(numberOfPage);
    console.log(numberOfPage);
  }
  /**
   * Get thông tin hiển thị của mỗi template ở màn detail
   * @returns
   */
  async getListTemplateNames(): Promise<string[]> {
    const count = await this.genLoc(this.xpathFigCaptionList).count();
    const listTemplateNames = [];
    for (let i = 1; i <= count; i++) {
      const templateName = await this.getTextContent(
        this.xpathFigcaptionIndex(i)
      );
      listTemplateNames.push(templateName);
    }
    return listTemplateNames;
  }

  /**
   * User click on [Edit] button.
   * @param
   * */
  async clickOnEditbtn(context: BrowserContext) {
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      await this.page.locator(this.xpathこのテンプレートを編集btn).click(),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  /**
   * Click on template thumbnail to open editor page
   * @param context BrowserContext
   * @returns
   */
  async clickOnThumbnail(context: BrowserContext) {
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      await this.page.locator(this.xpathTemplateThumbnail).click(),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  /**
   * Lấy tên category của template
   * @returns categoryName
   */
  async getTemplateCategoryName() {
    const categoryName = await this.page
      .locator(this.xpathCurrentCategoryName)
      .textContent();
    return categoryName;
  }
}
