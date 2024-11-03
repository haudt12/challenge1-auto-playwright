import { Locator, Page, PageScreenshotOptions } from "@playwright/test";

type TTemplate = {
  id: number
  name: string
  type: number;
  cat_slug: string;
  banner_url: string | null;
  description: string;
  keywords: string;
  introduction: string;
  representative_template_id: number;
  meta_title: null | string;
  group_category: string;
};

export type LayerStyles = {
  font?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type Screenshot = {
  page: Page;
  selector?: string | Locator;
  iframe?: string;
  screenshotOptions?: PageScreenshotOptions;
  snapshotOptions?: SnapshotOptions;
  combineOptions?: ToHaveScreenshotOptions;
  sizeCheck?: boolean;
  snapshotName: string;
};

export type SnapshotOptions = {
  threshold?: number;
  maxDiffPixels?: number;
  maxDiffPixelRatio?: number;
};

export type ToHaveScreenshotOptions = {
  animations?: "disabled" | "allow";
  caret?: "hide" | "initial";
  clip?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fullPage?: boolean;
  mask?: Array<Locator>;
  maxDiffPixelRatio?: number;
  maxDiffPixels?: number;
  omitBackground?: boolean;
  scale?: "css" | "device";
  threshold?: number;
  timeout?: number;
  expectToPass?: {
    timeout?: number;
    intervals?: number[];
  };
  hideElements?: Locator[];
};

