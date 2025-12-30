import { expect } from '@playwright/test';
import { keywords } from '../common/keywords.js';

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.keywords = new keywords(page);

    // 🔹 Login page locators
    this.emailInput = '[data-test-id="input-identifier"]';
    this.passwordInput = '[data-test-id="input-password"]';
    this.submitBtn = '[data-test-id="submit-btn"]';

    // 🔹 Post-login locators
    this.userProfileIcon = 'img[alt="UserCircleUnfilled"]';
    this.loggedInEmailText =
      '//img[@alt="UserCircleUnfilled"]/following::p[contains(@class,"text-caption")]';
  }

  /**
   * Navigate to login page
   * @param {string | { text?: string }} url
   */
  async navigate(url) {
    await this.keywords.gotoUrl(url, 'Login Page');
  }

  /**
   * Perform login with validations
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {

    // 🔹 Enter username
    await this.keywords.fill(
      this.emailInput,
      username,
      'Username'
    );

    // 🔹 Continue
    await this.keywords.click(
      this.submitBtn,
      'Continue'
    );

    // 🔹 Enter password
    await this.keywords.fill(
      this.passwordInput,
      password,
      'Password'
    );

    // 🔹 Login
    await this.keywords.click(
      this.submitBtn,
      'Login'
    );

    // 🔹 Wait for dashboard
    await this.page.waitForLoadState('networkidle');

    // 🔹 Open user profile
    await this.keywords.click(
      this.userProfileIcon,
      'User Profile Icon'
    );

    // 🔹 Get logged-in email
    const loggedInEmail = await this.keywords.getText(
      this.loggedInEmailText,
      'Logged In Email'
    );

    // 🔹 Close profile
    await this.keywords.click(
      this.userProfileIcon,
      'Close User Profile'
    );

    // 🔹 Assertion
    expect(loggedInEmail).toContain(username);
  }
}
