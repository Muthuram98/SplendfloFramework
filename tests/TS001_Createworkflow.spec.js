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

// Increase timeout to handle long UI waits
test.setTimeout(300000);

test('Spendflo workflow creation using Excel data', async ({ page }) => {

  const TestdataPath = './testdata/Testdata.xlsx';
  const sheetName = 'Sheet1';
  const dataset = 'Dataset1';

  /* =========================
     READ EXCEL DATA ONCE
  ========================== */
  const data = {
    Url: await Utils.getTestData(TestdataPath, sheetName, 'Url', dataset),
    Username: await Utils.getTestData(TestdataPath, sheetName, 'Username', dataset),
    Password: await Utils.getTestData(TestdataPath, sheetName, 'Password', dataset),

    WorkflowName: await Utils.getTestData(TestdataPath, sheetName, 'WorkflowName', dataset),
    WorkflowPopup: await Utils.getTestData(TestdataPath, sheetName, 'WorkflowPopup', dataset),

    IntakeSection1Name: await Utils.getTestData(TestdataPath, sheetName, 'IntakeSection1Name', dataset),
    Section1QueName: await Utils.getTestData(TestdataPath, sheetName, 'Section1QueName', dataset),
    IntakeSection2Name: await Utils.getTestData(TestdataPath, sheetName, 'IntakeSection2Name', dataset),
    Section2QueName: await Utils.getTestData(TestdataPath, sheetName, 'Section2QueName', dataset),
    Section2Option1: await Utils.getTestData(TestdataPath, sheetName, 'Section2Option1', dataset),
    Section2Option2: await Utils.getTestData(TestdataPath, sheetName, 'Section2Option2', dataset),

    TaskPopupMsg: await Utils.getTestData(TestdataPath, sheetName, 'TaskPopupMsg', dataset),
    FormPopupMsg: await Utils.getTestData(TestdataPath, sheetName, 'FormPopupMsg', dataset),
    ChecklistPopupMsg: await Utils.getTestData(TestdataPath, sheetName, 'ChecklistPopupMsg', dataset),
    NotificationPopupMsg: await Utils.getTestData(TestdataPath, sheetName, 'NotificationPopupMsg', dataset),

    PhaseName: await Utils.getTestData(TestdataPath, sheetName, 'PhaseName', dataset),
    PhasePopupMsg: await Utils.getTestData(TestdataPath, sheetName, 'PhasePopupMsg', dataset),

    TaskCreationPopup: await Utils.getTestData(TestdataPath, sheetName, 'TaskCreationPopup', dataset),

    // Task 1
    Task1Name: await Utils.getTestData(TestdataPath, sheetName, 'Task1Name', dataset),
    Task1Section1Name: await Utils.getTestData(TestdataPath, sheetName, 'Task1Section1Name', dataset),
    Task1Section1Que1: await Utils.getTestData(TestdataPath, sheetName, 'Task1Section1Que1', dataset),
    Task1Section2Name: await Utils.getTestData(TestdataPath, sheetName, 'Task1Section2Name', dataset),
    Task1Section2QueName: await Utils.getTestData(TestdataPath, sheetName, 'Task1Section2QueName', dataset),
    Task1Section2Option1: await Utils.getTestData(TestdataPath, sheetName, 'Task1Section2Option1', dataset),
    Task1Section2Option2: await Utils.getTestData(TestdataPath, sheetName, 'Task1Section2Option2', dataset),

    // Task 2
    Task2Name: await Utils.getTestData(TestdataPath, sheetName, 'Task2Name', dataset),
    Task2Section1Name: await Utils.getTestData(TestdataPath, sheetName, 'Task2Section1Name', dataset),
    Task2Section1Que1: await Utils.getTestData(TestdataPath, sheetName, 'Task2Section1Que1', dataset),
    Task2Section2Name: await Utils.getTestData(TestdataPath, sheetName, 'Task2Section2Name', dataset),
    Task2Section2QueName: await Utils.getTestData(TestdataPath, sheetName, 'Task2Section2QueName', dataset),
    Task2Section2Option1: await Utils.getTestData(TestdataPath, sheetName, 'Task2Section2Option1', dataset),
    Task2Section2Option2: await Utils.getTestData(TestdataPath, sheetName, 'Task2Section2Option2', dataset),

    // Task 3
    Task3Name: await Utils.getTestData(TestdataPath, sheetName, 'Task3Name', dataset),
    Task3Section1Name: await Utils.getTestData(TestdataPath, sheetName, 'Task3Section1Name', dataset),
    Task3Section1Que1: await Utils.getTestData(TestdataPath, sheetName, 'Task3Section1Que1', dataset),
    Task3Section2Name: await Utils.getTestData(TestdataPath, sheetName, 'Task3Section2Name', dataset),
    Task3Section2QueName: await Utils.getTestData(TestdataPath, sheetName, 'Task3Section2QueName', dataset),
    Task3Section2Option1: await Utils.getTestData(TestdataPath, sheetName, 'Task3Section2Option1', dataset),
    Task3Section2Option2: await Utils.getTestData(TestdataPath, sheetName, 'Task3Section2Option2', dataset),
    
    //Save and Publish messages

    SavePopupMsg: await Utils.getTestData(TestdataPath, sheetName, 'SavePopupMsg', dataset),
    PublishPopupMsg: await Utils.getTestData(TestdataPath, sheetName, 'PublishPopupMsg', dataset),
    PublishSuccessMsg: await Utils.getTestData(TestdataPath, sheetName, 'PublishSuccessMsg', dataset),  
  
  };

  /* =========================
     LOGIN
  ========================== */
  const loginPage = new LoginPage(page);
  await loginPage.navigate(data.Url);
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
  await addTask1.AddSeqNewTask();

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
  await addTask2.AddParalleNewTask();

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
  await createRequest.CreateNewRequest(data.WorkflowName);
});
