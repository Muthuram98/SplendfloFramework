import { expect } from '@playwright/test';
import { keywords } from '../common/keywords.js';

export class CreateWorkflowPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.keywords = new keywords(page);

    this.Settings ='(//button[@type="button"])[2]';
    // 🔹 Locators
    this.configureWorkflowText = 'text=Configure Workflows';
    this.addWorkflowBtn = 'button:has-text("+ Add Workflow")';
    this.createNewWorkflowBtn = 'button:has-text("Create a New Workflow")';
    this.workflowNameInput = '//input[@name="workflowName"]';
    this.createWorkflowBtn = 'button:has-text("Create Workflow")';
    this.workflowGuideHeading = 'role=heading[name="Workflow Studio Guide"]';
    this.closeGuideIcon = '(//h2[text()="Workflow Studio Guide"]//following::button)[1]';
    // 🔹 Phase & Task creation locators
    this.emptyButtonNth5 = '//button[@class="cursor-pointer p-0 top-[32px] absolute left-[-18px] z-10 hover:shadow-none"]//*[name()="svg"]//*[name()="path" and contains(@stroke-linecap,"round")]';
    this.phaseNameInput = 'role=textbox[name="Type here"]';
    this.createPhaseBtn = 'role=button[name="Create Phase"]';

    this.addTaskBtn =
      '[data-testid^="rf__node-PHASE_ADD_BUTTON_ID"] >> role=button[name="+ Add Task |"]';

    this.taskNameInput = 'role=textbox[name="Enter task name"]';
    this.approvalRadio = 'role=radio[name="Approval"]';
    this.selectRoleRadio = 'role=radio[name="Select a Role"]';
    this.selectBtn = 'role=button[name="Select"]';
    this.assignTaskText = 'text=Assigns the task to the user';
    this.CompletedHeader = '//h1[text()="Completed"]';
    this.ToastMsg = '//div[@class="Toastify"]//span';
    this.CompletionMsg = '(//div[@class="Toastify__toast-body"]//following::span[contains(@class,"text-body")])[1]';

  }

  /**
   * Navigate to workflow configuration section
   */
  async openWorkflowConfiguration() {
  await this.keywords.click(
    this.Settings,
    'Settings'
  );

  await this.keywords.click(
    this.configureWorkflowText,
    'Configure Workflows'
  );
}


  /**
   * Create a new workflow
   * @param {string} workflowName
   * @param {string} ExpectedMsg
   */
  async createWorkflow(workflowName,ExpectedMsg) {

    await this.keywords.click(
      this.addWorkflowBtn,
      'Add Workflow'
    );

    await this.keywords.click(
      this.createNewWorkflowBtn,
      'Create New Workflow'
    );

    await this.keywords.fill(
      this.workflowNameInput,
      workflowName,
      'Workflow Name'
    );

    await this.keywords.click(
      this.createWorkflowBtn,
      'Create Workflow'
    );

  await this.keywords.click(
    this.closeGuideIcon,
    'Close Workflow Guide'
  );

    // await this.page.waitForTimeout(5000);

    await this.keywords.waitUntilVisible(
      this.CompletionMsg,
      'Completion Message'
    );

    const toastMessage = await this.keywords.getText(
      this.CompletionMsg,
      'Toast Message'
    );

    if(toastMessage==ExpectedMsg) {
      console.log('✅ Workflow created successfully');
    } else {
      throw new Error(`❌ Workflow creation failed. Received message: ${toastMessage}`);

    }

    await this.keywords.isInvisible(this.CompletionMsg, 10000);

  }
}
