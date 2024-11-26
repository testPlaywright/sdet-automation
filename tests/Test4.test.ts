const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../Pages/LoginPage');
import * as fs from 'fs/promises';
import path from 'path';


async function loadTestData(user: string) {
    const data = await fs.readFile('./loginInfo.json', 'utf-8');
    return JSON.parse(data)[user];
}

test('Upload the transcript', async ({ page }) => {
    test.setTimeout(100000);
    const testData = await loadTestData('user1');
    const loginPage = new LoginPage(page);
    const tempData = JSON.parse(await fs.readFile('./tempEmail.json', 'utf-8'));
    const filePath = path.join(__dirname, 'MySchoolTranscript.pdf');

    await test.step('1.Navigate to the application page', async () => {
        await loginPage.navigateToNewApplicationPage(testData.applicationPageUrl, tempData.email, testData.password);
        await loginPage.clickReturnHome();
        await loginPage.navigateUrl(testData.applicationPageUrl);
        await loginPage.clickViewApplication();
    });

    await test.step('2.Edit the highSchool information activites using the edit button', async () => {
        await loginPage.editHighSchoolInformation();
    });

    await test.step('3.Enter all the details and upload transcript', async () => {
        await loginPage.fillHighSchoolInfo(
            testData.highSchoolName,
            testData.highSchoolStreetAddress,
            testData.highSchoolCity,
            testData.highSchoolState,
            testData.highSchoolZipCode,
            testData.gpa,
            testData.yearOfHighSchool
        );
        await loginPage.clickUpload(filePath);
        await loginPage.clickNextPageButton();
    });
});