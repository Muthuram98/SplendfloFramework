import { allure } from 'allure-playwright';
import assert from 'node:assert/strict';
import { expect } from '@playwright/test';
import { mailConfig } from '../config/testConfiguration';

let newPage;

export class keywords {

  constructor(page) {
    this.page = page;
  }

  // 🔹 CENTRAL LOGGING (FIXED)
 async logs(stepName, text, isError = false) {
  const status = isError ? 'ERROR' : 'SUCCESS';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  console.log(`${isError ? '❌' : '✅'} ${text}`);

  if (!this.page || this.page.isClosed()) {
    console.warn('⚠️ Page closed. Screenshot skipped.');
    return;
  }

  try {
    const screenshot = await this.page.screenshot({
      type: 'png',
      timeout: 10000,
    });

    // 🔥 Attach OUTSIDE allure.step
    allure.attachment(
      `${stepName}-${status}-${timestamp}`,
      screenshot,
      {
        contentType: 'image/png',
      }
    );
  } catch (e) {
    console.warn(`⚠️ Screenshot failed: ${e.message}`);
  }
}


async pressEnterGlobal(stepName = 'Press Enter') {
  await allure.step(stepName, async () => {
    await this.page.waitForTimeout(300);
    await this.page.keyboard.press('Enter');
    await this.logs(stepName, 'Pressed Enter key globally');
  });
}


  // 🔹 CLICK
  async click(locator, stepName) {
  if (typeof locator !== 'string') {
    throw new Error(
      `Invalid locator passed to click(): ${JSON.stringify(locator)}`
    );
  }

  await allure.step(`Click on ${stepName}`, async () => {
    if (!this.page || this.page.isClosed()) {
      await this.logs(stepName, 'Page is closed before click', true);
      throw new Error('Cannot perform click: page is closed');
    }

    const element = this.page.locator(locator);
    try {
      await element.waitFor({ state: 'visible', timeout: 65000 });
    } catch (err) {
      if (err && /Target page, context or browser has been closed/.test(err.message)) {
        await this.logs(stepName, 'Target page/context/browser was closed during waitFor', true);
        throw new Error('Target page, context or browser has been closed');
      }
      throw err;
    }

    await element.click();
    await this.logs(stepName, `Clicked on ${stepName}`);
  });
}

async dragAndDrop(sourceLocator, targetLocator, stepName) {
  await allure.step(`Drag and drop - ${stepName}`, async () => {
    const source = this.page.locator(sourceLocator);
    const target = this.page.locator(targetLocator);

    await source.waitFor({ state: 'visible', timeout: 30000 });
    await target.waitFor({ state: 'visible', timeout: 30000 });

    await source.scrollIntoViewIfNeeded();

    const sourceBox = await source.boundingBox();
    const targetBox = await target.boundingBox();

    if (!sourceBox || !targetBox) {
      throw new Error('Source or target bounding box not found');
    }

    const startX = sourceBox.x + sourceBox.width / 2;
    const startY = sourceBox.y + sourceBox.height / 2;
    const endX = targetBox.x + targetBox.width / 2;
    const endY = targetBox.y + targetBox.height / 2;

    try {
      // Move to source & press
      await this.page.mouse.move(startX, startY);
      await this.page.mouse.down();

      // 🔹 Small progressive move (helps trigger drag state)
      await this.page.mouse.move(startX, startY + 40, { steps: 5 });

      // Ensure target is visible before final move
      await target.scrollIntoViewIfNeeded();

      // 🔹 Final smooth move to target
      await this.page.mouse.move(endX, endY, { steps: 20 });
    } finally {
      // 🔥 ALWAYS release mouse (prevents hangs)
      await this.page.mouse.up();
    }

    await this.logs(stepName, 'Drag and drop completed successfully');
  });
}



async hover(locator, stepName) {
  if (typeof locator !== 'string') {
    throw new Error(
      `Invalid locator passed to hover(): ${JSON.stringify(locator)}`
    );
  }

  await allure.step(`Hover on ${stepName}`, async () => {
    const element = this.page.locator(locator);
    await element.waitFor({ state: 'visible', timeout: 65000 });
    await element.hover();
    await this.logs(stepName, `Hovered on ${stepName}`);
  });
}

async refreshPage(
  timeout = 30000,
  waitUntil = 'domcontentloaded',
  description = 'Page Refresh'
) {
  try {
    console.log(`🔄 ${description}`);
    await this.page.reload({ timeout, waitUntil });
  } catch (error) {
    console.error(`❌ Failed to refresh page: ${error.message}`);
    throw error;
  }
}


  // 🔹 GET TEXT
  async getText(locator, stepName) {
  return await allure.step(`Get text from ${stepName}`, async () => {
    try {
      const element = this.page.locator(locator.toString());
      await element.waitFor({ state: 'visible', timeout: 65000 });

      const text = (await element.textContent())?.trim();
      await this.logs(stepName, `Text captured: ${text}`);
      return text;
    } catch (err) {
      await this.logs(stepName, `Unable to get text from ${stepName}`, true);
      throw err;
    }
  });
}

async getAttributeValue(locator, attributeName, stepName) {
  return await allure.step(`Get attribute "${attributeName}" from ${stepName}`, async () => {
    try {
      const element = this.page.locator(locator.toString());
      await element.waitFor({ state: 'visible', timeout: 65000 });

      const attributeValue = await element.getAttribute(attributeName);

      await this.logs(
        stepName,
        `Attribute "${attributeName}" value captured: ${attributeValue}`
      );

      return attributeValue;
    } catch (err) {
      await this.logs(
        stepName,
        `Unable to get attribute "${attributeName}" from ${stepName}`,
        true
      );
      throw err;
    }
  });
}



  // 🔹 CLEAR
  async clear(page, locator, stepName) {
    await allure.step(`Clear text on ${stepName}`, async () => {
      try {
        const element = page.locator(locator.toString());
        await element.waitFor({ state: 'visible', timeout: 65000 });
        await element.clear();
        await this.logs(page, stepName, `Cleared text`);
      } catch (err) {
        await this.logs(page, stepName, `Failed to clear text`, true);
        throw err;
      }
    });
  }

  async clearAndFill(locator, value, stepName) {
  if (typeof locator !== 'string') {
    throw new Error(
      `Invalid locator passed to clearAndFill(): ${JSON.stringify(locator)}`
    );
  }

  await allure.step(`Clear and enter text on ${stepName}`, async () => {
    try {
      const element = this.page.locator(locator);
      await element.waitFor({ state: 'visible', timeout: 65000 });

      // 🔹 Clear existing value
      await element.fill('');

      // 🔹 Enter new value
      await element.fill(value);

      await this.logs(stepName, `Cleared and entered value: ${value}`);
    } catch (err) {
      await this.logs(stepName, `Failed to clear and enter value`, true);
      throw err;
    }
  });
}


  // 🔹 FILL
  async fill(locator, value, stepName) {
  await allure.step(`Fill ${stepName}`, async () => {
    try {
      const element = this.page.locator(locator.toString());
      await element.waitFor({ state: 'visible', timeout: 65000 });
      await element.fill(value);
      await this.logs(stepName, `Entered value: ${value}`);
    } catch (err) {
      await this.logs(stepName, `Failed to enter value`, true);
      throw err;
    }
  });
}


  // 🔹 NAVIGATE
 async gotoUrl(url, stepName) {
  await allure.step(`Navigate to ${stepName}`, async () => {
    try {
      const finalUrl =
        typeof url === 'string'
          ? url
          : url?.text || url?.value || url?.Url;

      if (!finalUrl) {
        throw new Error(`Invalid URL: ${JSON.stringify(url)}`);
      }

      await this.page.goto(finalUrl);
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForLoadState('networkidle');
      await this.logs(stepName, `URL launched`);
    } catch (err) {
      await this.logs(stepName, `URL launch failed`, true);
      throw err;
    }
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
    await this.page.locator(locator).waitFor({
      state: 'hidden', // hidden or detached
      timeout
    });
    return true;
  } catch {
    return false;
  }
}


  // 🔹 DISPLAY CHECK
  async displaycheck(locator, stepName) {
    await allure.step(`Verify ${stepName} visibility`, async () => {
      try {
        const element = this.page.locator(locator.toString());
        await element.waitFor({ state: 'visible', timeout: 120000 });
        await expect.soft(element).toBeVisible();
        await this.logs(stepName, `Element is visible`);
      } catch (err) {
        await this.logs(stepName, `Element not visible`, true);
        throw err;
      }
    });
  }

  // 🔹 SCROLL
  async scrollIntoViewIfNeeded(locator) {
    const element = this.page.locator(locator.toString());
    await element.waitFor({ state: 'visible', timeout: 120000 });
    await element.scrollIntoViewIfNeeded();
  }

  // 🔹 SWITCH TAB
  async switchToTab(page, locator, stepName = 'Switch tab') {
    await allure.step(stepName, async () => {
      const popupPromise = page.waitForEvent('popup');
      await page.locator(locator).click();
      newPage = await popupPromise;
      await this.logs(page, stepName, `Switched to new tab`);
      return newPage;
    });
  }

  async waitUntilVisible(locator, stepName, timeout = 65000) {
  if (typeof locator !== 'string') {
    throw new Error(`Invalid locator: ${locator}`);
  }

  await allure.step(`Wait until visible - ${stepName}`, async () => {
    const element = this.page.locator(locator);

    await expect(element).toBeVisible({ timeout });

    await this.logs(stepName, 'Element is visible');
  });
}


  // 🔹 WAIT FOR TOAST WITH TEXT
  async waitForToast(expectedText, stepName = 'Wait for toast', timeout = 65000) {
    await allure.step(stepName, async () => {
      const baseLocator = '(//div[@class="Toastify__toast-body"]//following::span[contains(@class,"text-body")])';
      const locator = this.page.locator(baseLocator).filter({ hasText: expectedText });

      try {
        await locator.first().waitFor({ state: 'visible', timeout });
        await this.logs(stepName, `Toast displayed: ${expectedText}`);
      } catch (err) {
        await this.logs(stepName, `Toast not displayed: ${expectedText}`, true);
        throw err;
      }
    });
  }

  // 🔹 GET ALL TOAST TEXTS (DIAGNOSTIC)
  async getAllToasts() {
    try {
      const baseLocator = '(//div[@class="Toastify__toast-body"]//following::span[contains(@class,"text-body")])';
      const locator = this.page.locator(baseLocator);
      const texts = await locator.allTextContents();
      return texts.map(t => t.trim()).filter(Boolean);
    } catch (err) {
      return [];
    }
  }

  // 🔹 WAIT FOR ANY TOAST TO APPEAR AND RETURN ITS TEXT
  async waitForAnyToast(stepName = 'Wait for any toast', timeout = 65000) {
    const baseLocator = '(//div[@class="Toastify__toast-body"]//following::span[contains(@class,"text-body")])';
    const locator = this.page.locator(baseLocator).first();

    await allure.step(stepName, async () => {
      try {
        await locator.waitFor({ state: 'visible', timeout });
        const text = (await locator.textContent())?.trim();
        await this.logs(stepName, `Detected toast: ${text}`);
        return text;
      } catch (err) {
        await this.logs(stepName, 'No toast detected', true);
        throw err;
      }
    });
  }


}
