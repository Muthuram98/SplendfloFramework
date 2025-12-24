import { allure } from 'allure-playwright';
import { expect } from '@playwright/test';

let newPage;


export class keywords {
  constructor(page) {
    this.page = page;
  }

  /* =========================================================
     CORE STEP WRAPPER (MOST IMPORTANT)
  ========================================================= */
  async step(stepName, action) {
    return await allure.step(stepName, async () => {
      try {
        return await action();
      } catch (error) {
        await this.logs(stepName, error.message, true);
        throw error;
      }
    });
  }

  /* =========================================================
     CENTRAL LOGGING + SCREENSHOT
  ========================================================= */
  async logs(stepName, text, isError = false) {
    const status = isError ? 'ERROR' : 'SUCCESS';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    console.log(`${isError ? '❌' : '✅'} ${text}`);

    if (!this.page || this.page.isClosed()) {
      console.warn('⚠️ Page closed. Screenshot skipped.');
      return;
    }

    try {
      const screenshot = await this.page.screenshot({ type: 'png' });

      allure.attachment(
        `${stepName}-${status}-${timestamp}`,
        screenshot,
        'image/png'
      );
    } catch (e) {
      console.warn(`⚠️ Screenshot failed: ${e.message}`);
    }
  }

  /* =========================================================
     BASIC ACTIONS
  ========================================================= */

  async click(locator, stepName) {
    await this.step(`Click → ${stepName}`, async () => {
      const element = this.page.locator(locator);
      await element.waitFor({ state: 'visible', timeout: 65000 });
      await element.click();
      await this.logs(stepName, 'Clicked successfully');
    });
  }

  async fill(locator, value, stepName) {
    await this.step(`Fill → ${stepName}`, async () => {
      const element = this.page.locator(locator);
      await element.waitFor({ state: 'visible', timeout: 65000 });
      await element.fill(value);
      await this.logs(stepName, `Entered value: ${value}`);
    });
  }

  async clearAndFill(locator, value, stepName) {
    await this.step(`Clear & Fill → ${stepName}`, async () => {
      const element = this.page.locator(locator);
      await element.waitFor({ state: 'visible', timeout: 65000 });
      await element.fill('');
      await element.fill(value);
      await this.logs(stepName, `Updated value: ${value}`);
    });
  }

  async hover(locator, stepName) {
    await this.step(`Hover → ${stepName}`, async () => {
      const element = this.page.locator(locator);
      await element.waitFor({ state: 'visible', timeout: 65000 });
      await element.hover();
      await this.logs(stepName, 'Hovered successfully');
    });
  }

  async pressEnterGlobal(stepName = 'Press Enter') {
    await this.step(stepName, async () => {
      await this.page.keyboard.press('Enter');
      await this.logs(stepName, 'Pressed Enter key');
    });
  }

  /* =========================================================
     NAVIGATION
  ========================================================= */

  async gotoUrl(url, stepName) {
    await this.step(`Navigate → ${stepName}`, async () => {
      let finalUrl;
      if (typeof url === 'string') {
        finalUrl = url;
      } else if (url && typeof url === 'object') {
        // Handle ExcelJS cell values
        if (url.richText && Array.isArray(url.richText)) {
          finalUrl = url.richText.map(rt => rt.text || '').join('');
        } else if (url.text) {
          finalUrl = url.text;
        } else if (url.value) {
          finalUrl = String(url.value);
        } else {
          finalUrl = String(url);
        }
      } else {
        finalUrl = String(url);
      }
      console.log(`Navigating to URL: ${finalUrl}`);
      await this.page.goto(finalUrl, { baseURL: null });
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForLoadState('networkidle');
      await this.logs(stepName, 'Navigation successful');
    });
  }

  async refreshPage() {
    await this.step('Refresh Page', async () => {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await this.logs('Refresh Page', 'Page refreshed');
    });
  }

  /* =========================================================
     VISIBILITY / WAIT
  ========================================================= */

  async waitUntilVisible(locator, stepName, timeout = 65000) {
    await this.step(`Wait Until Visible → ${stepName}`, async () => {
      const element = this.page.locator(locator);
      await expect(element).toBeVisible({ timeout });
      await this.logs(stepName, 'Element is visible');
    });
  }

  async isVisible(locator, timeout = 3000) {
    try {
      await this.page.locator(locator).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async isInvisible(locator, timeout = 10000) {
    try {
      await this.page.locator(locator).waitFor({ state: 'hidden', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /* =========================================================
     TEXT & ATTRIBUTE
  ========================================================= */

  async getText(locator, stepName) {
    return await this.step(`Get Text → ${stepName}`, async () => {
      const element = this.page.locator(locator);
      await element.waitFor({ state: 'visible', timeout: 65000 });
      const text = (await element.textContent())?.trim();
      await this.logs(stepName, `Text captured: ${text}`);
      return text;
    });
  }

  async getAttributeValue(locator, attributeName, stepName) {
    return await this.step(`Get Attribute → ${stepName}`, async () => {
      const element = this.page.locator(locator);
      await element.waitFor({ state: 'visible', timeout: 65000 });
      const value = await element.getAttribute(attributeName);
      await this.logs(stepName, `Attribute value: ${value}`);
      return value;
    });
  }

  /* =========================================================
     DRAG & DROP
  ========================================================= */

  async dragAndDrop(sourceLocator, targetLocator, stepName) {
    await this.step(`Drag & Drop → ${stepName}`, async () => {
      const source = this.page.locator(sourceLocator);
      const target = this.page.locator(targetLocator);

      await source.waitFor({ state: 'visible', timeout: 30000 });
      await target.waitFor({ state: 'visible', timeout: 30000 });

      const s = await source.boundingBox();
      const t = await target.boundingBox();

      await this.page.mouse.move(s.x + s.width / 2, s.y + s.height / 2);
      await this.page.mouse.down();
      await this.page.mouse.move(t.x + t.width / 2, t.y + t.height / 2, { steps: 20 });
      await this.page.mouse.up();

      await this.logs(stepName, 'Drag and drop completed');
    });
  }

  /* =========================================================
     TOAST HANDLING
  ========================================================= */

  async waitForToast(expectedText, stepName = 'Validate Toast', timeout = 65000) {
    await this.step(`Toast Validation → ${expectedText}`, async () => {
      const locator = this.page
        .locator('//div[@class="Toastify__toast-body"]//span')
        .filter({ hasText: expectedText });

      await locator.first().waitFor({ state: 'visible', timeout });
      await this.logs(stepName, `Toast displayed: ${expectedText}`);
    });
  }

  async waitForAnyToast(stepName = 'Wait for any toast', timeout = 65000) {
    return await this.step(stepName, async () => {
      const locator = this.page.locator('//div[@class="Toastify__toast-body"]//span').first();
      await locator.waitFor({ state: 'visible', timeout });
      const text = (await locator.textContent())?.trim();
      await this.logs(stepName, `Toast detected: ${text}`);
      return text;
    });
  }

  /* =========================================================
     TAB SWITCH
  ========================================================= */

  async switchToTab(page, locator, stepName = 'Switch Tab') {
    return await this.step(stepName, async () => {
      const popupPromise = page.waitForEvent('popup');
      await page.locator(locator).click();
      newPage = await popupPromise;
      await this.logs(stepName, 'Switched to new tab');
      return newPage;
    });
  }
}
