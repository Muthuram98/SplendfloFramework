import { test } from '@playwright/test';
import { readExecutionSheet } from '../utils/ExcelReader.js';
import { ExecutionRegistry } from '../utils/ExecutionRegistry.js';
const path = require('path');

// Execution control
const executionData = readExecutionSheet(
  './testdata/TestExecution.xlsx',
  'Sheet1'
);

// Store enabled tests
const enabledTestIds = executionData
  .filter(row => row.flag === 'Yes')
  .map(row => row.testCaseId);

ExecutionRegistry.enabledTests = enabledTestIds;

// 🔹 Static imports (MANDATORY)
import '../tests/TS001_Createworkflow.spec.js';
import '../tests/TS002_AddAggrement.spec.js';

// Global hook
test.beforeEach(async ({}, testInfo) => {
  // Note: TestContext is not used here, as each test sets it internally if needed
});
