import base from '@playwright/test';

import { BasePage } from './basePage.methods';
import { Regression } from '../common/driver'

export const test = base.extend({
  email: async ({ }, use, testInfo) => {
    use(testInfo.project.use.email);
  },
  otp: async ({ }, use, testInfo) => {
    use(testInfo.project.use.otp);
  },
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },
  driverScript: async ({ page }, use) => {
    const driverScript = new Regression(page);
    await use(driverScript);
  }
});