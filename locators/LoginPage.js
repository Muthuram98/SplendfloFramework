
export class LoginPage {
    constructor(page) {
        this.page = page;
        // Store locators as properties
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.searchInput = page.getByRole('textbox', { name: 'Search' });
    }

}