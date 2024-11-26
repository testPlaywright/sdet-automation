const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../Pages/LoginPage');
import * as fs from 'fs/promises';

async function loadTestData(user: string) {
  const data = await fs.readFile('./loginInfo.json', 'utf-8');
  return JSON.parse(data)[user];
}

test('Fill out application form with address details', async ({ page }) => {
  test.setTimeout(100000);
  const testData = await loadTestData('user1');
  const loginPage = new LoginPage(page);
  const tempData = JSON.parse(await fs.readFile('./tempEmail.json', 'utf-8'));
  await test.step('1.Navigate to the application page', async () => {
    await loginPage.navigateToNewApplicationPage(testData.applicationPageUrl,tempData.email,testData.password);
  });

  await test.step('2.Fill all the mandatory address details', async () => {
    await loginPage.fillAddressDetails(
      testData.streetAddress,
      testData.state,
      testData.city,
      testData.zipCode,
      testData.country
    );
  });
});