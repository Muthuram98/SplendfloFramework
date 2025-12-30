import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/LoginPage';
import Utils from '../utils/ExcelReader';

export function LrpBase(){

test('LrpBase', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const filePath = "./testdata/TestExecution.xlsx";
    const TestdataPath = "./testdata/Testdata.xlsx";

    const url = await Utils.getValueByTestcaseID(filePath, 'Sheet1', 'Regression_Suite', 'Environment');

    const Username = await Utils.getTestData(TestdataPath, 'Sheet1', 'Username', 'Dataset1');
    const Password = await Utils.getTestData(TestdataPath, 'Sheet1', 'Password', 'Dataset1');

    console.log('Username:', Username);
    console.log('Password:', Password);

    await page.goto(url);

    // Option A: Call the properties directly
    await loginPage.usernameInput.fill(Username);
    await loginPage.passwordInput.fill(Password);
    await loginPage.loginButton.click();

    // Option B: Use the action methods (Recommended)
    await loginPage.searchInput.click();
    
    await loginPage.searchInput.waitFor({ state: 'visible' });
    
    await loginPage.searchInput.fill('Booking');

});

}