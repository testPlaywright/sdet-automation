const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: 'https://apply.mykaleidoscope.com',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    timeout: 60000,
    use: {
      timeout: 60000,
    },
  },
});