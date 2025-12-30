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
      await element.waitFor({ state: 'visible', timeout: 120000 });
      await element.click();
      await this.logs(stepName, 'Clicked successfully');
    });
  }

  async getAttribute(locator, attributeName, stepName) {
  let attributeValue;

  await this.step(`Get Attribute → ${stepName}`, async () => {
    const element = this.page.locator(locator);

    // Wait until element is visible
    await element.waitFor({
      state: 'visible',
      timeout: 120000,
    });

    // Get attribute value
    attributeValue = await element.getAttribute(attributeName);

    await this.logs(
      stepName,
      `Attribute '${attributeName}' value is '${attributeValue}'`
    );
  });

  return attributeValue;
}

async allureLog(title, htmlMessage) {
  const { allure } = await import('allure-playwright');

  allure.attachment(
    title,
    htmlMessage
  );
}


// async verifyFieldValue(actualValue, expectedValue, fieldName) {
//   await this.step(`Verify → ${fieldName}`, async () => {
//     const actual = (actualValue ?? '').trim();
//     const expected = (expectedValue ?? '').trim();

//     // Case 1: Expected EMPTY
//     if (expected === '') {
//       if (actual === '') {
//         await this.allureLog(
//           fieldName,
//           `<span style="color:green;font-weight:bold;">✅ ${fieldName} is EMPTY as expected</span>`
//         );
//       } else {
//         await this.allureLog(
//           fieldName,
//           `<span style="color:red;font-weight:bold;">❌ ${fieldName} verification failed</span><br/>
//            <b>Expected:</b> EMPTY<br/>
//            <b>Actual:</b> ${actual}`
//         );
//         throw new Error(`${fieldName} verification failed`);
//       }
//     }

//     // Case 2: Expected value exists
//     else {
//       if (actual.includes(expected)) {
//         await this.allureLog(
//           fieldName,
//           `<span style="color:green;font-weight:bold;">✅ ${fieldName} verified successfully</span><br/>
//            <b>Expected to contain:</b> ${expected}<br/>
//            <b>Actual:</b> ${actual}`
//         );
//       } else {
//         await this.allureLog(
//           fieldName,
//           `<span style="color:red;font-weight:bold;">❌ ${fieldName} verification failed</span><br/>
//            <b>Expected to contain:</b> ${expected}<br/>
//            <b>Actual:</b> ${actual}`
//         );
//         throw new Error(`${fieldName} verification failed`);
//       }
//     }
//   });
// }

async verifyFieldValue(actualValue, expectedValue, fieldName) {
  const actual = (actualValue ?? '').trim();
  const expected = (expectedValue ?? '').trim();

  try {
    await this.step(`Verify → ${fieldName}`, async () => {

      // Case 1: Expected EMPTY
      if (expected === '') {
        if (actual === '') {
          await this.allureLog(
            fieldName,
            `<span style="color:green;font-weight:bold;">
              ✅ ${fieldName} is EMPTY as expected
            </span>`
          );
        } else {
          await this.allureLog(
            fieldName,
            `<span style="color:red;font-weight:bold;">
              ❌ ${fieldName} mismatch
            </span><br/>
            <b>Expected:</b> EMPTY<br/>
            <b>Actual:</b> ${actual}`
          );

          // 🔥 force step failure
          throw new Error(`${fieldName} mismatch`);
        }
      }

      // Case 2: Expected value exists
      else {
        if (actual.includes(expected)) {
          await this.allureLog(
            fieldName,
            `<span style="color:green;font-weight:bold;">
              ✅ ${fieldName} verified successfully
            </span><br/>
            <b>Expected to contain:</b> ${expected}<br/>
            <b>Actual:</b> ${actual}`
          );
        } else {
          await this.allureLog(
            fieldName,
            `<span style="color:red;font-weight:bold;">
              ❌ ${fieldName} mismatch
            </span><br/>
            <b>Expected to contain:</b> ${expected}<br/>
            <b>Actual:</b> ${actual}`
          );

          // 🔥 force step failure
          throw new Error(`${fieldName} mismatch`);
        }
      }
    });
  } catch (err) {
    // ✅ swallow error → test continues
    console.warn(`⚠️ Soft verification failed: ${err.message}`);
  }
}


  async fill(locator, value, stepName) {
    await this.step(`Fill → ${stepName}`, async () => {
      const element = this.page.locator(locator);
      await element.waitFor({ state: 'visible', timeout: 120000 });
      await element.fill(value);
      await this.logs(stepName, `Entered value: ${value}`);
    });
  }

  async clearAndFill(locator, value, stepName) {
    await this.step(`Clear & Fill → ${stepName}`, async () => {
      const element = this.page.locator(locator);
      await element.waitFor({ state: 'visible', timeout: 120000 });
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
      try {
        await this.page.reload({ waitUntil: 'domcontentloaded', timeout: 10000 });
        await this.logs('Refresh Page', 'Page refreshed');
      } catch (error) {
        await this.logs('Refresh Page', `Page reload failed: ${error.message}`);
        // Optionally, continue without refreshing
      }
    });
  }

  /* =========================================================
     VISIBILITY / WAIT
  ========================================================= */

  async waitUntilVisible(locator, stepName, timeout = 120000) {
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

//   async scrollIntoView(locator, elementName = 'Element') {
//   try {
//     const element = this.page.locator(locator);

//     // Wait until element is attached to DOM
//     await element.waitFor({
//       state: 'attached',
//       timeout: 20000,
//     });

//     // Scroll into view
//     await element.scrollIntoViewIfNeeded();

//     console.log(`Scrolled into view: ${elementName}`);
//   } catch (error) {
//     throw new Error(
//       `Failed to scroll into view: ${elementName}. Reason: ${error.message}`
//     );
//   }
// }

async scrollIntoView(locator, elementName = 'Element') {
  try {
    const element = this.page.locator(locator);

    // Wait until element exists in DOM
    await element.waitFor({ state: 'attached', timeout: 20000 });

    // Force scroll using JS (handles upward + downward)
    await this.page.evaluate(el => {
      el.scrollIntoView({
        behavior: 'instant',
        block: 'center',
        inline: 'nearest'
      });
    }, await element.elementHandle());

    console.log(`Scrolled into view: ${elementName}`);
  } catch (error) {
    throw new Error(
      `Failed to scroll into view: ${elementName}. Reason: ${error.message}`
    );
  }
}


  /* =========================================================
     TEXT & ATTRIBUTE
  ========================================================= */

  async getText(locator, stepName) {
    return await this.step(`Get Text → ${stepName}`, async () => {
      const element = this.page.locator(locator);
      await element.waitFor({ state: 'visible', timeout: 120000 });
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

    await source.scrollIntoViewIfNeeded();
    await target.scrollIntoViewIfNeeded();

    const sourceBox = await source.boundingBox();
    const targetBox = await target.boundingBox();

    if (!sourceBox || !targetBox) {
      throw new Error('❌ Unable to retrieve bounding box');
    }

    const sourceX = sourceBox.x + sourceBox.width / 2;
    const sourceY = sourceBox.y + sourceBox.height / 2;

    const targetX = targetBox.x + targetBox.width / 2;
    const targetY = targetBox.y + targetBox.height / 2;

    await this.page.mouse.move(sourceX, sourceY);
    await this.page.mouse.down();
    await this.page.mouse.move(targetX, targetY, { steps: 30 });
    await this.page.mouse.up();

    await this.logs(
      stepName,
      '<span style="color:green;font-weight:bold;">✅ Drag and drop completed</span>'
    );
  });
}


  /* =========================================================
     TOAST HANDLING
  ========================================================= */

  async waitForToast(expectedText, stepName = 'Validate Toast', timeout = 120000) {
    await this.step(`Toast Validation → ${expectedText}`, async () => {
      const locator = this.page
        .locator('//div[@class="Toastify__toast-body"]//span')
        .filter({ hasText: expectedText });

      await locator.first().waitFor({ state: 'visible', timeout });
      await this.logs(stepName, `Toast displayed: ${expectedText}`);
    });
  }

  async waitForAnyToast(stepName = 'Wait for any toast', timeout = 120000) {
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
