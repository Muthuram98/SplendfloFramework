// globalSetup.js
const Mail = require('../config/mail'); // Adjust the path as necessary
const { test } = require('@playwright/test'); // Import test from Playwright

let testResults = [];

module.exports = {
    globalSetup: async () => {
        // You can initialize things here if needed
    },
    globalTeardown: async () => {
        const mail = new Mail();
        const emailResults = { specs: [{ tests: testResults }] }; // Structure the results for email
        await mail.sendMail(emailResults); // Send email with results
        console.log('Test run completed. Results emailed.');
    },
    registerTestListeners: () => {
        test.on('testEnd', (testInfo) => {
            const result = {
                title: testInfo.title,
                status: testInfo.status,
                results: testInfo.status === 'passed' ? { status: 'passed' } : { status: 'failed' }
            };
            testResults.push(result);
            console.log(`Test completed: ${testInfo.title} - Status: ${testInfo.status}`);
        });
    }
};
