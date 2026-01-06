import { test } from '@playwright/test';
import { keywords } from '../common/keywords.js';
import { LoginPage } from '../pageobjects/SplendfloLogin.js';
import Utils from '../utils/ExcelReader.js';
import { CreateWorkflowPage } from '../pageobjects/CreateWorkflowPage.js';
import { IntakePage } from '../pageobjects/IntakePage.js';
import { CreatePhase } from '../pageobjects/CreatePhase.js';
import { AddTask } from '../pageobjects/AddTask.js';
import { CreateRequest } from '../pageobjects/CreateRequest.js';
import { SaveAndPublish } from '../pageobjects/SaveAndPublish.js';
import { TestContext } from '../utils/TestContext.js';
import { readExecutionSheet } from '../utils/ExcelReader.js';


// Increase timeout to handle long UI waits
test.setTimeout(600000);

const TEST_ID = 'TS001_Createworkflow';

function parseDatasets(datasetStr) {
  if (!datasetStr) return [1]; // default
  const str = datasetStr.toString().trim();
  if (str.includes(',')) {
    return str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  } else if (str.includes('-')) {
    const parts = str.split('-').map(s => parseInt(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const [start, end] = parts;
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
  }
  const num = parseInt(str);
  return isNaN(num) ? [1] : [num];
}

const executionData = readExecutionSheet('./testdata/TestExecution.xlsx', 'Sheet1');
const row = executionData.find(r => r.testCaseId === TEST_ID);

function generateRandomWorkflowName(baseName) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${baseName}_${timestamp}`;
}

if (row && row.flag === 'Yes') {
  const datasets = parseDatasets(row.dataset);
  console.log('Parsed datasets for TS001:', datasets);
  for (const datasetNumber of datasets) {
    test(`${TEST_ID} - Spendflo workflow creation using Excel data - Dataset${datasetNumber}`, async ({ page }) => {
      TestContext.environment = row.environment;
      TestContext.testDataFile = row.testDataFile;
      TestContext.sheetName = row.sheetName;
      TestContext.dataset = datasetNumber;

      const url = TestContext.environment;
      const TestdataPath = TestContext.testDataFile;
      const sheetName = TestContext.sheetName;
      const dataset = 'Dataset' + datasetNumber;


  /* =========================
     READ EXCEL DATA ONCE
  ========================== */
  const data = await Utils.getAllTestData(TestdataPath, sheetName, dataset);

  data.WorkflowName = generateRandomWorkflowName(data.WorkflowName);
  // data.Url = url; // Override with environment URL

  /* =========================
     LOGIN
  ========================== */
  const loginPage = new LoginPage(page);
  await loginPage.navigate(url);
  await loginPage.login(data.Username, data.Password);

  /* =========================
     WORKFLOW CREATION
  ========================== */
  const workflowPage = new CreateWorkflowPage(page);
  await workflowPage.openWorkflowConfiguration();
  await workflowPage.createWorkflow(
    data.WorkflowName,
    data.WorkflowPopup
  );

  /* =========================
     INTAKE FORM
  ========================== */
  const intakePage = new IntakePage(page);
  await intakePage.IntakeEdit(
    data.IntakeSection1Name,
    data.Section1QueName,
    data.IntakeSection2Name,
    data.Section2QueName,
    data.Section2Option1,
    data.Section2Option2,
    data.IntakeSection3Name,
    data.Section3QueName,
    data.Section3Option1,
    data.Section3Option2,
    data.IntakeSection4Name,
    data.Section4QueName,
    data.TaskPopupMsg,
    data.FormPopupMsg,
    data.ChecklistPopupMsg,
    data.NotificationPopupMsg
  );

  /* =========================
     PHASE + TASKS
  ========================== */
 
  const createPhase = new CreatePhase(page);
  await createPhase.CreatePhasebutton(data.PhaseName, data.PhasePopupMsg);

  // Task 1 (Sequential)
  await createPhase.CreateNewPhase(
    data.Task1Name,
    data.Task1Section1Name,
    data.Task1Section1Que1,
    data.Task1Section2Name,
    data.Task1Section2QueName,
    data.Task1Section2Option1,
    data.Task1Section2Option2,
    data.TaskCreationPopup,
    data.FormPopupMsg,
    data.ChecklistPopupMsg,
    data.NotificationPopupMsg
  );

  const addTask1 = new AddTask(page);
  await addTask1.AddSeqNewTask(data);

  // Task 2 (Parallel)
  await createPhase.CreateNewPhase(
    data.Task2Name,
    data.Task2Section1Name,
    data.Task2Section1Que1,
    data.Task2Section2Name,
    data.Task2Section2QueName,
    data.Task2Section2Option1,
    data.Task2Section2Option2,
    data.TaskCreationPopup,
    data.FormPopupMsg,
    data.ChecklistPopupMsg,
    data.NotificationPopupMsg
  );

  const addTask2 = new AddTask(page);
  await addTask2.AddParalleNewTask(data);

  // Task 3
  await createPhase.CreateNewPhase(
    data.Task3Name,
    data.Task3Section1Name,
    data.Task3Section1Que1,
    data.Task3Section2Name,
    data.Task3Section2QueName,
    data.Task3Section2Option1,
    data.Task3Section2Option2,
    data.TaskCreationPopup,
    data.FormPopupMsg,
    data.ChecklistPopupMsg,
    data.NotificationPopupMsg
  );

  const SaveAndPublishPage = new SaveAndPublish(page);
  await SaveAndPublishPage.SavePublish(data.SavePopupMsg,data.PublishPopupMsg,data.PublishSuccessMsg);

  /* =========================
     CREATE REQUEST
  ========================== */

  const keywordsPage = new keywords(page);
  await keywordsPage.refreshPage();

  const createRequest = new CreateRequest(page);
  await createRequest.CreateNewRequest(data);
    });
  }
}
