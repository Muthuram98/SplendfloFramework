import { keywords } from '../common/keywords.js';

export class CreateRequest {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.keywords = new keywords(page);

    // this.closeGuideIcon = '(//h2[text()="Workflow Studio Guide"]//following::button)[1]';
    // this.CreateRequestBtn = '//p[text()="Create a Request"]';
    // this.ConitnueRequestBtn = '//p[text()="Continue"]';

    // // Intake
    // this.Que1Input =
    //   '//*[text()="What is your name?"]//following::input[contains(@id,"headlessui-input")]';
    // this.ContinueButton = '//p[text()="Continue"]';
    // this.Que2Dropdown =
    //   '//span[text()="Select your gender?"]//following::button[contains(@id,"headlessui-listbox-button")]';
    // this.Que2SelectOption = '//span[text()="Male"]';
    // this.Que3SelectOption = '//span[text()="India"]';
    // this.Que4DateInput = '(//span[text()="Enter your Joining Date"]//following::input)[1]';
    // this.SubmitAns = '//p[text()="Submit"]';

    // // Success
    // this.SuccessMsg = '//h2[contains(@id,"headlessui-dialog-title")]';
    // this.GotoReqDetails = '//p[text()="Go to Request Details"]';

    // // Tasks
    // this.findTask1 = '//p[contains(text(),"Task1") and contains(text(),"Start")]';
    // this.findTask2 = '//p[contains(text(),"Task2") and contains(text(),"Start")]';
    // this.findTask3 = '//p[contains(text(),"Task3") and contains(text(),"Start")]';

    // this.StartButton = '//p[contains(text(),"Start")]';
    // this.ApproveBtn = '//*[text()="Approve"]';

    // // Task Inputs
    // this.Task1Que1Input = '//span[text()="What is your name?"]//following::input';
    // this.Task2Que1Input = '//span[text()="What is your college name?"]//following::input';
    // this.Task3Que1Input = '//span[text()="What is your company name?"]//following::input';

    this.closeGuideIcon = '(//h2[text()="Workflow Studio Guide"]//following::button)[1]';
    this.CreateRequestBtn = '//p[text()="Create a Request"]';
    this.ConitnueRequestBtn = '//p[text()="Continue"]';
    this.ContinueButton = '//p[text()="Continue"]';
    this.SubmitAns = '//p[text()="Submit"]';

    this.SuccessMsg = '//h2[contains(@id,"headlessui-dialog-title")]';
    this.GotoReqDetails = '//p[text()="Go to Request Details"]';

    this.StartButton = '//p[contains(text(),"Start")]';
    this.ApproveBtn = '//*[text()="Approve"]';

  }

    // ===========================
  // DYNAMIC LOCATORS
  // ===========================

  getWorkflowLocator(workflowName) {
    return `//span[text()="${workflowName}"]`;
  }

  getQuestionInput(questionText) {
    return `//*[text()="${questionText}"]//following::input[contains(@id,"headlessui-input")]`;
  }

  getDropdownByQuestion(questionText) {
    return `//*[text()="${questionText}"]//following::button[contains(@id,"headlessui-listbox-button")]`;
  }

  getDropdownOption(optionText) {
    return `//span[text()="${optionText}"]`;
  }

  getTaskByName(taskName) {
    return `//p[contains(text(),"${taskName}") and contains(text(),"Start")]`;
  }

  getTaskQuestionInput(questionText) {
    return `//span[text()="${questionText}"]//following::input`;
  }


  getWorkflowLocator(workflowName) {
    return `//span[text()="${workflowName}"]`;
  }

  // ===========================
  // MAIN FLOW
  // ===========================
  async CreateNewRequest(data) {

  if (await this.keywords.isVisible(this.closeGuideIcon, 10000)) {
    await this.keywords.click(this.closeGuideIcon, 'Close Guide Icon');
  }

  await this.keywords.click(this.CreateRequestBtn, 'Create Request');

  await this.keywords.click(
    this.getWorkflowLocator(data.WorkflowName),
    `Select Workflow - ${data.WorkflowName}`
  );

  await this.keywords.click(this.ConitnueRequestBtn, 'Continue');

  // -------- Intake Questions --------

  await this.keywords.fill(
    this.getQuestionInput(data.Section1QueName),
    data.Section1Answer,
    data.Section1QueName
  );

  await this.keywords.click(this.ContinueButton, 'Continue');

  await this.keywords.click(
    this.getDropdownByQuestion(data.Section2QueName),
    data.Section2QueName
  );

  await this.keywords.click(
    this.getDropdownOption(data.Section2Answer),
    data.Section2Answer
  );

  await this.keywords.click(this.ContinueButton, 'Continue');

  await this.keywords.click(
    this.getDropdownOption(data.Section3Answer),
    data.Section3Answer
  );

  await this.keywords.click(this.ContinueButton, 'Continue');

  await this.keywords.fill(
    this.getTaskQuestionInput(data.Section4QueName),
    data.Section4Answer,
    data.Section4QueName
  );

  await this.keywords.click(this.SubmitAns, 'Submit');

  await this.keywords.waitUntilVisible(this.SuccessMsg, data.WorkflowPopup);

  await this.keywords.click(this.GotoReqDetails, 'Go To Request Details');

  await this.handleAllTasks(data);
}


  // ===========================
  // TASK EXECUTION LOOP
  // ===========================
  async handleAllTasks(data) {
    const maxIterations = 10; // safety guard
    let iteration = 0;

    while (iteration < maxIterations) {
      iteration++;

      if (await this.keywords.isVisible(this.findTask1)) {
        await this.handleTask1(data);
        await this.waitAfterTask();
        continue;
      }

      if (await this.keywords.isVisible(this.findTask2)) {
        await this.handleTask2(data);
        await this.waitAfterTask();
        continue;
      }

      if (await this.keywords.isVisible(this.findTask3)) {
        await this.handleTask3(data);
        await this.waitAfterTask();
        continue;
      }

      console.log('✅ All tasks completed');
      break;
    }
  }

  async waitAfterTask() {
    await this.page.waitForTimeout(2000);
  }

  // ===========================
  // TASK HANDLERS
  // ===========================
  async handleTask1(data) {
  await this.keywords.click(this.StartButton, `Start ${data.Task1Name}`);

  await this.keywords.waitUntilVisible(
    this.getTaskQuestionInput(data.Task1Section1Que1),
    data.Task1Section1Que1
  );

  await this.keywords.fill(
    this.getTaskQuestionInput(data.Task1Section1Que1),
    data.Task1Answer,
    data.Task1Section1Que1
  );

  await this.approveTask(data.Task1Name);
}


  async handleTask2(data) {
  await this.keywords.click(this.StartButton, `Start ${data.Task2Name}`);

  await this.keywords.waitUntilVisible(
    this.getTaskQuestionInput(data.Task2Section1Que1),
    data.Task2Section1Que1
  );

  await this.keywords.fill(
    this.getTaskQuestionInput(data.Task2Section1Que1),
    data.Task2Answer,
    data.Task2Section1Que1
  );

  await this.approveTask(data.Task2Name);
}


  async handleTask3(data) {
  await this.keywords.click(this.StartButton, `Start ${data.Task3Name}`);

  await this.keywords.waitUntilVisible(
    this.getTaskQuestionInput(data.Task3Section1Que1),
    data.Task3Section1Que1
  );

  await this.keywords.fill(
    this.getTaskQuestionInput(data.Task3Section1Que1),
    data.Task3Answer,
    data.Task3Section1Que1
  );

  await this.approveTask(data.Task3Name);
}


  // ===========================
  // APPROVAL
  // ===========================
  async approveTask(taskName) {
    await this.keywords.click(this.ApproveBtn, `Approve ${taskName}`);

    let toastText = '';
    try {
      toastText = await this.keywords.waitForAnyToast(
        `${taskName} Toast`,
        10000
      );
    } catch {}

    console.log(`ℹ️ ${taskName} toast: ${toastText}`);

    const successWords = ['approved', 'success', 'completed'];

    if (
      !successWords.some(word =>
        toastText.toLowerCase().includes(word)
      )
    ) {
      console.warn(`⚠️ ${taskName} approval message not clear`);
    } else {
      console.log(`✅ ${taskName} completed`);
    }
  }
}
