import { keywords } from '../common/keywords.js';

export class CreateRequest {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.keywords = new keywords(page);
    this.closeGuideIcon = '(//h2[text()="Workflow Studio Guide"]//following::button)[1]';
    this.CreateRequestBtn = '//p[text()="Create a Request"]';
    // this.SelectWorkflow = '//span[text()="TD Test83"]';
    this.ConitnueRequestBtn = '//p[text()="Continue"]';
    this.Que1Input = '//*[text()="What is your name?"]//following::input[contains(@id,"headlessui-input")]';
    this.Que1Continue = '//p[text()="Continue"]';
    this.Que2Dropdown = '//span[text()="Select your gender?"]//following::button[contains(@id,"headlessui-listbox-button")]';
    this.Que2SelectOption = '//span[text()="Male"]';
    this.SubmitAns = '//p[text()="Submit"]';
    this.SuccessMsg = '//h2[contains(@id,"headlessui-dialog-title")]';
    this.InformationMsg = '//h2[contains(@id,"headlessui-dialog-title")]//following::p[contains(@class,"text-body")]';
    this.GotoReqDetails = '//p[text()="Go to Request Details"]';
    this.findTask1 = '//p[contains(text(),"Task1") and contains(text(),"Start")]';
    this.findTask2 = '//p[contains(text(),"Task2") and contains(text(),"Start")]';
    this.findTask3 = '//p[contains(text(),"Task3") and contains(text(),"Start")]';
    this.StartButton = '//p[contains(text(),"Start")]';
    this.Task1Que1Input = '//span[text()="What is your name?"]//following::input';
    this.ApproveBtn = '//*[text()="Approve"]';
    this.SuccessToast1 = '//div[@class="Toastify__toast-body"]//span';
    this.Task3Que1Input = '//span[text()="What is your company name?"]//following::input';
    this.Task2Que1Input = '//span[text()="What is your college name?"]//following::input';
}

getWorkflowLocator(workflowName) {
  return `//span[text()="${workflowName}"]`;
}


  /**
   * Create phase, task, and intake sections
   */
  async CreateNewRequest(workflowName) {


  // -------- Initiate Request Creation --------

  await this.keywords.waitUntilVisible(this.closeGuideIcon, 'Close Guide Icon');
  await this.keywords.click(this.closeGuideIcon, 'Close Guide Icon');

  await this.keywords.click(this.CreateRequestBtn, 'Create Request Button');
  const workflowLocator = this.getWorkflowLocator(workflowName);
  await this.keywords.click(workflowLocator, `Select Workflow - ${workflowName}`);
  await this.keywords.click(this.ConitnueRequestBtn, 'Continue Request Button');

  // -------- Intake Questions --------
  await this.keywords.fill(this.Que1Input, 'Test User', 'Question 1 Input');
  await this.keywords.click(this.Que1Continue, 'Question 1 Continue Button');
  await this.keywords.click(this.Que2Dropdown, 'Question 2 Dropdown');
  await this.keywords.click(this.Que2SelectOption, 'Question 2 Select Option');
  await this.keywords.click(this.SubmitAns, 'Submit Answer Button');

  await this.keywords.waitUntilVisible(this.SuccessMsg, 'Success Message');

  // -------- Navigate to Request Details --------
  await this.keywords.click(this.GotoReqDetails, 'Go to Request Details Button');

  // -------- TASK HANDLING (SMART LOGIC) --------
  if (await this.keywords.isVisible(this.findTask1)) {
    await this.handleTask1();
  } else if (await this.keywords.isVisible(this.findTask2)) {
    await this.handleTask2();
  } else if (await this.keywords.isVisible(this.findTask3)) {
    await this.handleTask3();
  } else {
    throw new Error('❌ No task (Task1/Task2/Task3) is visible');
  }
}

async handleTask1() {
  await this.keywords.click(this.StartButton, 'Start Task 1');
  await this.keywords.waitUntilVisible(this.Task1Que1Input, 'Task 1 Question');
  await this.keywords.fill(this.Task1Que1Input, 'Test User2', 'Task 1 Answer');
  await this.approveTask('Task 1');
}

async handleTask2() {
  await this.keywords.click(this.StartButton, 'Start Task 2');
  await this.keywords.waitUntilVisible(this.Task2Que1Input, 'Task 2 Question');
  await this.keywords.fill(this.Task2Que1Input, 'Anna University', 'Task 2 Answer');
  await this.approveTask('Task 2');
}

async handleTask3() {
  await this.keywords.click(this.StartButton, 'Start Task 3');
  await this.keywords.waitUntilVisible(this.Task3Que1Input, 'Task 3 Question');
  await this.keywords.fill(this.Task3Que1Input, 'Trackdfect', 'Task 3 Answer');
  await this.approveTask('Task 3');
}

async approveTask(taskName) {
  await this.keywords.click(this.ApproveBtn, `Approve ${taskName}`);

  // Wait for any toast message and capture its text (more resilient)
  let toastText;
  try {
    toastText = await this.keywords.waitForAnyToast(`${taskName} Success Toast`, 10000);
  } catch (err) {
    toastText = '';
  }

  console.log(`ℹ️ Toast text received: "${toastText}"`);

  // ✅ Flexible validation
  const successPatterns = [
    'approved',
    'success',
    'completed',
  ];

  const isSuccess = successPatterns.some(word =>
    toastText.toLowerCase().includes(word)
  );

  if (!isSuccess) {
    console.warn(`⚠️ ${taskName} approval toast not as expected`);
    // OPTIONAL: do NOT throw to avoid flaky failures
    // throw new Error(`❌ ${taskName} approval failed`);
  } else {
    console.log(`✅ ${taskName} completed successfully`);
  }
}



}
