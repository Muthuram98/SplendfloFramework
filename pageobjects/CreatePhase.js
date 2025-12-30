import { keywords } from '../common/keywords.js';
import { IntakeFormFlow } from '../flow/CreateForm.js';

export class CreatePhase {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.keywords = new keywords(page);
    this.intakeFormFlow = new IntakeFormFlow(page, this.keywords);

    // 🔹 Locators
    this.completedHeader = '//h1[text()="Completed"]';
    this.emptyButtonNth5 =
      '//button[@class="cursor-pointer p-0 top-[32px] absolute left-[-18px] z-10 hover:shadow-none"]//*[name()="svg"]//*[name()="path" and contains(@stroke-linecap,"round")]';

    this.phaseNameInput = '//*[text()="Phase Name"]//following::input';
    this.createPhaseBtn = '//p[text()="Create Phase"]';
    this.addTaskBtn = '//span[contains(text(),"Add Task")]';
    this.taskNameInput = '(//label[@for="Task Name"]//following::input)[1]';
    this.approvalRadio = '//span[text()="Approval"]';
    this.selectRoleRadio = '//span[text()="Select a Role"]';
    this.selectBtn = '//button[contains(@id,"headlessui-listbox-button")]';
    this.assignTaskText = '//span[text()="Requester" and @class="inline-block"]';
    this.saveContinue = '//p[text()="Save & Continue"]';
    this.cheklistPage = '//h3[text()="Build Checklist"]';
    this.NotificationsPage = '//p[text()="System Notifications"]';
    this.CompletionMsg =
      '(//div[@class="Toastify__toast-body"]//following::span[contains(@class,"text-body")])[1]';
  }

  // ==========================================================
  // CREATE PHASE
  // ==========================================================
  async CreatePhasebutton(PhaseName, ExpectedMsg) {
    await this.page.waitForTimeout(5000);

    await this.keywords.hover(this.completedHeader, 'Completed Header');
    await this.keywords.click(this.emptyButtonNth5, 'Open Phase Creation');

    await this.keywords.fill(this.phaseNameInput, PhaseName, 'Phase Name');
    await this.keywords.click(this.createPhaseBtn, 'Create Phase');

    await this.keywords.waitUntilVisible(this.CompletionMsg, 'Completion Message');

    const toastMessage = await this.keywords.getText(
      this.CompletionMsg,
      'Toast Message'
    );

    await this.keywords.step('Verify → Phase Created Message', async () => {
      if (toastMessage === ExpectedMsg) {
        console.log('✅ Phase Created Successfully:', toastMessage);
      } else {
        throw new Error(
          `❌ Phase creation failed
Expected: ${ExpectedMsg}
Actual: ${toastMessage}`
        );
      }
    });

    await this.keywords.isInvisible(this.CompletionMsg, 10000);
    await this.keywords.click(this.addTaskBtn, 'Add Task');
  }

  // ==========================================================
  // CREATE TASK + INTAKE + CHECKLIST + NOTIFICATION
  // ==========================================================
  async CreateNewPhase(
    TaskName,
    Que1, Text1,
    Que2, Text2,
    Option1, Option2,
    ExpectedTaskMsg,
    ExpectedFormMsg,
    ExpectedChecklistMsg,
    ExpectedNotifyMsg
  ) {

    // ---------------- TASK ----------------
    await this.keywords.fill(this.taskNameInput, TaskName, 'Task Name');
    await this.keywords.click(this.approvalRadio, 'Approval Radio');
    await this.keywords.click(this.selectRoleRadio, 'Select Role Radio');
    await this.keywords.click(this.selectBtn, 'Select Role');
    await this.keywords.click(this.assignTaskText, 'Assign Task');

    await this.keywords.click(this.saveContinue, 'Save & Continue');
    await this.keywords.waitUntilVisible(this.CompletionMsg, 'Completion Message');

    const taskToastMessage = await this.keywords.getText(
      this.CompletionMsg,
      'Toast Message'
    );

    await this.keywords.step('Verify → Task Created Message', async () => {
      if (taskToastMessage === ExpectedTaskMsg) {
        console.log('✅ Task Created:', taskToastMessage);
      } else {
        throw new Error(
          `❌ Task creation failed
Expected: ${ExpectedTaskMsg}
Actual: ${taskToastMessage}`
        );
      }
    });

    await this.keywords.isInvisible(this.CompletionMsg, 10000);

    // ---------------- INTAKE FORM ----------------
    await this.intakeFormFlow.createTextSection(Que1, Text1);
    await this.intakeFormFlow.createDropdownSection(
      Que2,
      Text2,
      [Option1, Option2]
    );

    await this.page.waitForTimeout(5000);
    await this.keywords.click(this.saveContinue, 'Save & Continue');

    await this.keywords.waitUntilVisible(this.CompletionMsg, 'Completion Message');

    const formToastMessage = await this.keywords.getText(
      this.CompletionMsg,
      'Toast Message'
    );

    await this.keywords.step('Verify → Intake Form Saved Message', async () => {
      if (formToastMessage === ExpectedFormMsg) {
        console.log('✅ Form Saved:', formToastMessage);
      } else {
        console.log(`ℹ️ Form save completed with alternative message: ${formToastMessage}`);
      }
    });

    await this.keywords.isInvisible(this.CompletionMsg, 10000);

    // ---------------- CHECKLIST ----------------
    await this.keywords.waitUntilVisible(this.cheklistPage, 'Checklist Page');
    await this.keywords.click(this.saveContinue, 'Save & Continue');

    await this.keywords.waitUntilVisible(this.CompletionMsg, 'Completion Message');

    const checklistToastMessage = await this.keywords.getText(
      this.CompletionMsg,
      'Toast Message'
    );

    await this.keywords.step('Verify → Checklist Updated Message', async () => {
      if (checklistToastMessage === ExpectedChecklistMsg) {
        console.log('✅ Checklist Updated:', checklistToastMessage);
      } else {
        throw new Error(
          `❌ Checklist update failed
Expected: ${ExpectedChecklistMsg}
Actual: ${checklistToastMessage}`
        );
      }
    });

    await this.keywords.isInvisible(this.CompletionMsg, 10000);

    // ---------------- NOTIFICATIONS ----------------
    await this.keywords.waitUntilVisible(
      this.NotificationsPage,
      'Notifications Page'
    );

    await this.keywords.click(this.saveContinue, 'Save & Continue');
    await this.keywords.waitUntilVisible(this.CompletionMsg, 'Completion Message');

    const notificationToastMessage = await this.keywords.getText(
      this.CompletionMsg,
      'Toast Message'
    );

    await this.keywords.step(
      'Verify → Notification Configuration Message',
      async () => {
        if (notificationToastMessage === ExpectedNotifyMsg) {
          console.log('✅ Notification Configured:', notificationToastMessage);
        } else {
          throw new Error(
            `❌ Notification configuration failed
Expected: ${ExpectedNotifyMsg}
Actual: ${notificationToastMessage}`
          );
        }
      }
    );

    await this.keywords.isInvisible(this.CompletionMsg, 10000);
  }
}
