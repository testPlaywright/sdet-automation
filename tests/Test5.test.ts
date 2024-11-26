const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../Pages/LoginPage');
import * as fs from 'fs/promises';
import path from 'path';


async function loadTestData(user: string) {
    const data = await fs.readFile('./loginInfo.json', 'utf-8');
    return JSON.parse(data)[user];
}

test('Select Essay and add information in it ', async ({ page }) => {
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

    await test.step('2.Edit the essay using the edit button', async () => {
        await loginPage.editEssayButtonToUpdateInfo();
    });

    await test.step('3.Check the essay topic', async () => {
        await loginPage.verifyEssayCheckboxes();
    });

    await test.step('4.Select only Animals and School', async () => {
        await loginPage.fillInfoForAnimalCheckbox();
        await loginPage.fillInfoForSchoolCheckbox();
        await loginPage.clickNextPageButton();
    });

    await test.step('5. Check the response after saving', async () => {
        await loginPage.validateResponseCount();
    });
});