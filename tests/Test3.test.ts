const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../Pages/LoginPage');
import * as fs from 'fs/promises';


async function loadTestData(user: string) {
    const data = await fs.readFile('./loginInfo.json', 'utf-8');
    return JSON.parse(data)[user];
}

test('Add extracullicular activities', async ({ page }) => {
    test.setTimeout(100000);
    const testData = await loadTestData('user1');
    const activities = testData.extracurricularActivities;
    const loginPage = new LoginPage(page);
    const tempData = JSON.parse(await fs.readFile('./tempEmail.json', 'utf-8'));

    await test.step('1.Navigate to the application page', async () => {
        await loginPage.navigateToNewApplicationPage(testData.applicationPageUrl, tempData.email, testData.password);
        await loginPage.clickReturnHome();
        await loginPage.navigateUrl(testData.applicationPageUrl);
        await loginPage.clickViewApplication();
    });

    await test.step('3. Edit the extracullicular activites using the edit button', async () => {
        await loginPage.editExtracurricularActivities();
    });

    await test.step('4. Add one entry and click next page and verify error message', async () => {
        
        await loginPage.addEntriesForExtraCurricular();
        await loginPage.fillExtracurricularDetails(
            activities[0].activity,
            activities[0].years,
            activities[0].leadership,
            activities[0].description,
            0,
            0
        );
        await loginPage.clickNextPageButton();
        await loginPage.verifyErrorMessage();
    });

    await test.step('5. Add remaining activities', async () => {
         
        for (let i = 1; i < activities.length; i++) {
            await loginPage.addEntriesForExtraCurricular();
            await loginPage.fillExtracurricularDetails(
                activities[i].activity,
                activities[i].years,
                activities[i].leadership,
                activities[i].description,
                i,
                i
            );
        }
    });

    await test.step('6. Verify error message is hidden', async () => {
        await loginPage.verifyErrorMessageHidden();
         await loginPage.clickNextPageButton();
    });
});