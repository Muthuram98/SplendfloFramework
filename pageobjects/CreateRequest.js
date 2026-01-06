import { keywords } from '../common/keywords.js';

export class CreateRequest {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.keywords = new keywords(page);

    // Static locators
    this.closeGuideIcon =
      '(//h2[text()="Workflow Studio Guide"]//following::button)[1]';

    this.CreateRequestBtn = '//p[text()="Create a Request"]';
    this.ContinueButton = '//p[text()="Continue"]';
    this.SubmitAns = '//p[text()="Submit"]';

    this.SuccessMsg = '//h2[contains(@id,"headlessui-dialog-title")]';
    this.GotoReqDetails = '//p[text()="Go to Request Details"]';

    this.StartButton = '//p[contains(text(),"Start")]';
    this.ApproveBtn = '//*[text()="Approve"]';
  }

  /* ===========================
     DYNAMIC LOCATORS
  =========================== */

  getWorkflowLocator(workflowName) {
    return `//span[text()="${workflowName}"]`;
  }

  getQuestionInput(questionText) {
    return `(//*[contains(text(),"${questionText}")]//following::input[1])`;
  }

  getDateInputByQuestion(questionText) {
    return `(//*[contains(text(),"${questionText}")]//following::input)[1]`;
  }

  getDropdownByQuestion(questionText) {
    return `(//*[contains(text(),"${questionText}")]//following::button)[1]`;
  }

  getDropdownOption(optionText) {
    return `//span[contains(text(),"${optionText}")]`;
  }

  getTaskByName(taskName) {
    return `//p[contains(text(),"${taskName}") and contains(text(),"Start")]`;
  }

  getTaskQuestionInput(questionText) {
    return `//span[text()="${questionText}"]//following::input`;
  }

  getRadioOption(questionText, optionText) {
  return `//*[contains(text(),"${questionText}")]//following::*[contains(text(),"${optionText}")]`;
}

  getSelectByQuestion(questionText) {
    return `//*[contains(text(),"${questionText}")]//following::select[1]`;
  }

  /* ===========================
     MAIN FLOW
  =========================== */

  async CreateNewRequest(data) {
    // Close guide popup if present
    if (await this.keywords.isVisible(this.closeGuideIcon, 5000)) {
      await this.keywords.click(this.closeGuideIcon, 'Close Guide');
    }

    await this.keywords.click(this.CreateRequestBtn, 'Create Request');

    await this.keywords.click(
      this.getWorkflowLocator(data.WorkflowName),
      `Select Workflow → ${data.WorkflowName}`
    );

    await this.keywords.click(this.ContinueButton, 'Continue');

    /* ===========================
       INTAKE QUESTIONS (FIXED)
    =========================== */

   /* ===========================
   INTAKE QUESTIONS (STRAIGHT)
=========================== */

// SECTION 1 → TEXT
if (data.Section1QueName && data.Section1Answer) {
  await this.keywords.fill(
    this.getQuestionInput(data.Section1QueName),
    data.Section1Answer,
    data.Section1QueName
  );

  await this.keywords.click(this.ContinueButton, 'Continue');
}

// SECTION 2 → DROPDOWN
if (data.Section2QueName && data.Section2Answer) {
  await this.keywords.click(
    this.getDropdownByQuestion(data.Section2QueName),
    data.Section2QueName
  );

  await this.keywords.click(
    this.getDropdownOption(data.Section2Answer),
    data.Section2Answer
  );

  await this.keywords.click(this.ContinueButton, 'Continue');
}

// SECTION 3 → RADIO
if (data.Section3QueName && data.Section3Answer) {
  await this.keywords.click(
    this.getRadioOption(
      data.Section3QueName,
      data.Section3Answer
    ),
    `${data.Section3QueName} → ${data.Section3Answer}`
  );

  await this.keywords.click(this.ContinueButton, 'Continue');
}

// SECTION 4 → DATE
if (data.Section4QueName && data.Section4Answer) {
  await this.keywords.fill(
    this.getDateInputByQuestion(data.Section4QueName),
    data.Section4Answer,
    data.Section4QueName
  );

  await this.keywords.click(this.SubmitAns, 'Submit');
}
  
    await this.keywords.waitUntilVisible(
      this.SuccessMsg,
      data.WorkflowPopup
    );

    // await this.keywords.click(
    //   this.GotoReqDetails,
    //   'Go To Request Details'
    // );

    await this.handleAllTasks(data);
  }

  /* ===========================
     TASK EXECUTION
  =========================== */

  async handleAllTasks(data) {
    const tasks = [
      data.Task1Name,
      data.Task2Name,
      data.Task3Name
    ].filter(Boolean);

    for (const taskName of tasks) {
      const taskLocator = this.getTaskByName(taskName);

      if (await this.keywords.isVisible(taskLocator, 5000)) {
        await this.keywords.click(
          this.StartButton,
          `Start ${taskName}`
        );

        await this.handleTaskByName(taskName, data);
        await this.waitAfterTask();
      }
    }

    console.log('✅ All tasks completed');
  }

  async waitAfterTask() {
    await this.page.waitForTimeout(2000);
  }

  /* ===========================
     GENERIC TASK HANDLER
  =========================== */

  async handleTaskByName(taskName, data) {
    let question = '';
    let answer = '';

    switch (taskName) {
      case data.Task1Name:
        question = data.Task1Section1Que1;
        answer = data.Task1Answer;
        break;

      case data.Task2Name:
        question = data.Task2Section1Que1;
        answer = data.Task2Answer;
        break;

      case data.Task3Name:
        question = data.Task3Section1Que1;
        answer = data.Task3Answer;
        break;
    }

    await this.keywords.waitUntilVisible(
      this.getTaskQuestionInput(question),
      question
    );

    await this.keywords.fill(
      this.getTaskQuestionInput(question),
      answer,
      question
    );

    await this.approveTask(taskName);
  }

  /* ===========================
     APPROVAL
  =========================== */

  async approveTask(taskName) {
    await this.keywords.click(
      this.ApproveBtn,
      `Approve ${taskName}`
    );

    let toastText = '';
    try {
      toastText = await this.keywords.waitForAnyToast(
        `${taskName} Toast`,
        10000
      );
    } catch {}

    console.log(`ℹ️ ${taskName} toast → ${toastText}`);
  }
}
