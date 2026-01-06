import os from 'node:os';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import {
  browserName,
  browserMode,
  parallelMode,
  testTimeout,
  expectTimeout,
  numberOfWorkers,
} from './config/testConfiguration.js';

dotenv.config();
dotenv.config({ path: '.env.aws' });

/* ---------------- TIMESTAMP ---------------- */
const now = new Date();
const date = now.toISOString().split('T')[0];
const time = `${now.getHours()}-${now.getMinutes()}`;
const timestamp = `${date}_${time}`;

/* ---------------- ALLURE DIR ---------------- */
const allureResultsDir = path.join(
  process.cwd(),
  'reports',
  'allure-results',
  `Test_Report-${timestamp}`
);

// Ensure directory exists
fs.mkdirSync(allureResultsDir, { recursive: true });

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './runner',

  forbidOnly: true,
  retries: 0,

  // ✅ Global teardown
  globalTeardown: './global-teardown.js',

  fullyParallel: parallelMode(),
  workers: numberOfWorkers(),
  timeout: testTimeout() * 1000,
  expect: {
    timeout: expectTimeout() * 1000,
  },

  /* ---------------- REPORTERS ---------------- */
  reporter: [
    // ✅ JSON (for mail)
    ['json', { outputFile: 'test-results.json' }],

    // ✅ Allure (timestamped under reports/)
    [
      'allure-playwright',
      {
        resultsDir: allureResultsDir,
        detail: true,
        suiteTitle: false,
        environmentInfo: {
          OS: os.platform(),
          OS_Version: os.release(),
          Node: process.version,
          Browser: browserName(),
        },
      },
    ],
  ],

  /* ---------------- USE ---------------- */
  use: {
    browserName: browserName(),
    headless: browserMode(),

    viewport: null,
    actionTimeout: expectTimeout() * 1000,
    navigationTimeout: 60000,

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    launchOptions: {
      args: browserName() === 'chromium' ? ['--start-maximized'] : [],
    },
  },

  projects: [
    {
      name: 'staging',
      use: {
        baseURL: process.env.WEB_APP_URL,
      },
    },
  ],
};

export default config;
