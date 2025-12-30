export class BasePageLocators {
    /**
       * constructor
        @param {} page
       */
    constructor(page) {
        this.page = page;
        this.emailField = page.locator("//input[@name='email']");
        this.passwordField = page.locator('#login-password');
        this.loginButton = page.locator('#auth-login-btn');
    }

  /**
   * Method to get the locator for a menu item by its name
   * @param {string} itemName - The name of the menu item
   * @returns {Locator} - The locator for the specified menu item
   */
  getMenuItemLocator(itemName) {
    return this.page.locator(
      `//span[text()='${itemName}']`);
  }
  getVerificationOtpLocator(index){
    return this.page.locator(`(//input)[${index}]`);
  }

  getVerificationOtpLocator(index){
    return this.page.locator(`(//input)[${index}]`);
  }
}
