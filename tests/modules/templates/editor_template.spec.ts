import test from "@playwright/test";
import data from "./editor_template.json";
import { TemplateEditor } from "@tp_pages/templates/template_editor";
import { TemplateDetails } from "@tp_pages/templates/template_details";

test.describe("Function: Editor template", () => {
  let editorPage: TemplateEditor;
  let detailPage: TemplateDetails;

  test.beforeEach(async ({ page }) => {
    detailPage = new TemplateDetails(page);
  });

  test("@TC_Template_01 Open a single-page template", async ({ page, context }) => {
    await test.step("As a guest user, access this template detail page", async () => {
      await detailPage.goToURL(data.singlePageItemUrl);
      await page.waitForLoadState();
      const categoryName = await detailPage.getTemplateCategoryName();
      await detailPage.checkSimilarTemplatesCategory(categoryName);
    });
    await test.step("In template detail page, click button このテンプレートを編集 to open editor page.", async () => {
      const newPage = await detailPage.clickOnEditbtn(context);
      await newPage.waitForLoadState();
      editorPage = new TemplateEditor(newPage);
      await editorPage.verifyDisplayTemplateMenu();
      await editorPage.verifyCategoriesList();
      await editorPage.verifyCanvas(data.data.path_1);
    });
  });

  test("@TC_Template_02 Open a multi-page template (Multi-page template is a template that has two or more pages)", async ({ context }) => {
    await test.step("As a guest user, access this template detail page", async () => {
      await detailPage.goToURL(data.multiplePageItemUrl);
      const numberOfPages = await detailPage.getThumnailNumber();
      await detailPage.verifyNumberOfThumnailPages(numberOfPages);
      const categoryName = await detailPage.getTemplateCategoryName();
      await detailPage.checkSimilarTemplatesCategory(categoryName);
    });
    await test.step("In template detail page, click template thumbnail to open editor page", async () => {
      const numberOfPages = await detailPage.getThumnailNumber();
      const newPage = await detailPage.clickOnThumbnail(context);
      await newPage.waitForLoadState();
      editorPage = new TemplateEditor(newPage);
      await editorPage.verifyDisplayTemplateMenu();
      await editorPage.verifyCategoriesList();
      await editorPage.verifyNumberOfPageOnSidebar(numberOfPages);
      await editorPage.verifyCanvas(data.data.path_2);
    });
  });

  test("@TC_Template_03 Change style of a textbox", async ({ page }) => {
    editorPage = new TemplateEditor(page);
    await test.step("As a guest user, open a blank design at link ", async () => {
      await editorPage.goToURL(data.blankDesignUrl);
    });
    await test.step("Open menu テキスト, then click テキストを追加 in section 横書き to add new textbox to the design.", async () => {
      await editorPage.openMenuテキスト();
      await editorPage.verifyNumberOfButton();
      await editorPage.checkHoverToButton();
      await editorPage.clickOnテキストを追加In横書き();
      await editorPage.changeDesign(data.data["font-size"]);
      await editorPage.verifyCanvas(data.data.path_3);
    });
  });
});
