const os = require('node:os');
const path = require('node:path');
const { mkdirSync } = require('fs');
const dotenv = require('dotenv');
const {
  browserMode,
  browserName,
  expectTimeout,
  numberOfWorkers,
  parallelMode
} = require('./config/testConfiguration');

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.aws' });

// Timestamp for Allure results
const timestamp = new Date();
const shortDate = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}-${String(timestamp.getDate()).padStart(2, '0')}`;
const shortTime = `${String(timestamp.getHours()).padStart(2, '0')}-${String(timestamp.getMinutes()).padStart(2, '0')}`;
const formattedTimestamp = `${shortDate}_${shortTime}`;

const allureResultsDir = path.join(
  'reports',
  'allure-results',
  `Test_Report-${formattedTimestamp}`
);

// const playwrightOutputDir = path.join(
//   'reports',
//   'playwright-output',
//   `run-${formattedTimestamp}`
// );


// Ensure results directory exists
mkdirSync(allureResultsDir, { recursive: true });

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './runner',
  outputDir: allureResultsDir,
  globalTeardown: './global-teardown.js',
  retries: 0,
  forbidOnly: true,
  fullyParallel: parallelMode(),
  // Increased test timeout to accommodate longer per-step waits in keywords
  // Some helper methods use waits up to 120s; ensure test-level timeout
  // exceeds those values.
  timeout: 120000,

  expect: {
    timeout: expectTimeout(),
  },

  // outputDir: playwrightOutputDir, // ✅ SEPARATE DIR

reporter: [
  [
    'allure-playwright',
    {
      detail: true,
      resultsDir: allureResultsDir,
      suiteTitle: false,
      environmentInfo: {
        os_platform: os.platform(),
        os_release: os.release(),
        os_version: os.version(),
        NodeVersion: process.version,
      },
    },
  ],
],


  use: {
    browserName: browserName(),

    // ✅ Reuse workflow state
    // storageState: 'storage/workflow-state.json',

    headless: !!process.env.CI,
    viewport: null,
    actionTimeout: 5000,
    navigationTimeout: 60000,
    video: 'retain-on-failure', // or 'on', 'off'
    // screenshot: 'only-on-failure',
    trace: 'retain-on-failure',

    launchOptions: {
      args: ['--start-maximized'],
    },
  },

  workers: numberOfWorkers(),

  projects: [
    {
      name: 'staging',
      use: {
        baseURL: process.env.WEB_APP_URL,
      },
    },
  ],
};

module.exports = config;
