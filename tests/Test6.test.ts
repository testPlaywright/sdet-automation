const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../Pages/LoginPage');
import * as fs from 'fs/promises';
import path from 'path';


async function loadTestData(user: string) {
    const data = await fs.readFile('./loginInfo.json', 'utf-8');
    return JSON.parse(data)[user];
}

test('Submit the application ', async ({ page }) => {
    test.setTimeout(100000);
    const testData = await loadTestData('user1');
    const loginPage = new LoginPage(page);
    const tempData = JSON.parse(await fs.readFile('./tempEmail.json', 'utf-8'));

    await test.step('1.Navigate to the application page', async () => {
        await loginPage.navigateToNewApplicationPage(testData.applicationPageUrl, tempData.email, testData.password);
        await loginPage.clickReturnHome();
        await loginPage.navigateUrl(testData.applicationPageUrl);
        await loginPage.clickViewApplication();
    });

    await test.step('2.User clicks the submit button', async () => {
        await loginPage.submitTheApplicationButton();
    });

     await test.step('3.Validate editing is not allowed', async () => {
         await loginPage.completeTheApplication();
         await loginPage.editButtonNotVisible();
    });
   
});