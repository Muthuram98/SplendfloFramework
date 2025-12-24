import { keywords } from '../common/keywords.js';
import { IntakeFormFlow } from '../flow/CreateForm.js'; // ✅ FIXED PATH

export class CreatePhase {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.keywords = new keywords(page);

    // ✅ INSTANTIATE FLOW
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
    this.CompletionMsg = '(//div[@class="Toastify__toast-body"]//following::span[contains(@class,"text-body")])[1]';

  }

  /**
   * Create phase, task, and intake sections
   */

  async CreatePhasebutton(PhaseName,ExpectedMsg) {

    await this.page.waitForTimeout(5000);

    // 🔹 Create Phase
    await this.keywords.hover(this.completedHeader, 'Completed Header');

    await this.keywords.click(
      this.emptyButtonNth5,
      'Open Phase Creation'
    );

     await this.keywords.fill(
      this.phaseNameInput,
      PhaseName,
      'Phase Name'
    );

    await this.keywords.click(
      this.createPhaseBtn,
      'Create Phase'
    );

    await this.keywords.waitUntilVisible(
      this.CompletionMsg,
      'Completion Message'
    );

    const toastMessage = await this.keywords.getText(
      this.CompletionMsg,
      'Toast Message'
    );

    if(toastMessage==ExpectedMsg) {
      console.log('✅ Phase Created Successfully with message:', toastMessage);
    } else {
      throw new Error(`❌ Phase Creation failed Received message: ${toastMessage}`);
    }

    await this.keywords.isInvisible(this.CompletionMsg, 10000);
    
    await this.keywords.click(this.addTaskBtn, 'Add Task');

  }

  async CreateNewPhase(TaskName,Que1,Text1,Que2,Text2,Option1,Option2,ExpectedTaskMsg,ExpectedFormMsg,ExpectedChecklistMsg,ExpectedNotifyMsg) {

    // 🔹 Add Task

    await this.keywords.fill(
      this.taskNameInput,
      TaskName,
      'Task Name'
    );

    await this.keywords.click(this.approvalRadio, 'Approval Radio');
    await this.keywords.click(this.selectRoleRadio, 'Select Role Radio');
    await this.keywords.click(this.selectBtn, 'Select Role');
    await this.keywords.click(this.assignTaskText, 'Assign Task To User');

    await this.keywords.click(this.saveContinue, 'Save & Continue');

    await this.keywords.waitUntilVisible(
      this.CompletionMsg,
      'Completion Message'
    );

    const toastMessage = await this.keywords.getText(
      this.CompletionMsg,
      'Toast Message'
    );

    if(toastMessage==ExpectedTaskMsg) {
      console.log('✅ Task updated successfully with message:', toastMessage);
    } else {
      throw new Error(`❌ Task Updation failed. Received message: ${toastMessage}`);
    }

    await this.keywords.isInvisible(this.CompletionMsg, 10000);

    // 🔹 Intake Form – Section 1
    await this.intakeFormFlow.createTextSection(
      Que1,
      Text1
    );

    // 🔹 Intake Form – Section 2
    await this.intakeFormFlow.createDropdownSection(
      Que2,
      Text2,
      [Option1, Option2]
    );

    await this.page.waitForTimeout(5000);

    await this.keywords.click(this.saveContinue, 'Save & Continue');

    await this.keywords.waitUntilVisible(
      this.CompletionMsg,
      'Completion Message'
    );

    const FormtoastMessage = await this.keywords.getText(
      this.CompletionMsg,
      'Toast Message'
    );

   if(FormtoastMessage==ExpectedFormMsg) {
      console.log('✅ Form Saved Successfully with message:', FormtoastMessage);
    } else {
      throw new Error(`❌ Form creation failed. Received message: ${FormtoastMessage}`);
    }

    await this.keywords.isInvisible(this.CompletionMsg, 10000);

    // await this.page.waitForTimeout(5000);

    await this.keywords.waitUntilVisible(
      this.cheklistPage,
      'Checklist Page'
    );
    
    await this.keywords.click(this.saveContinue, 'Save & Continue');

    await this.keywords.waitUntilVisible(
      this.CompletionMsg,
      'Completion Message'
    );

    const ChecklistToastMessage = await this.keywords.getText(
      this.CompletionMsg,
      'Toast Message'
    );

    if(ChecklistToastMessage==ExpectedChecklistMsg) {
      console.log('✅ Checklist Updated Successfully with message:', ChecklistToastMessage);
    } else {
      throw new Error(`❌ Checklist Updatation failed. Received message: ${ChecklistToastMessage}`);
    }

    await this.keywords.isInvisible(this.CompletionMsg, 10000);

    // await this.page.waitForTimeout(5000);
  
    await this.keywords.waitUntilVisible(
      this.NotificationsPage,
      'Notifications Page'
    );

    await this.keywords.click(this.saveContinue, 'Save & Continue');

    await this.keywords.waitUntilVisible(
      this.CompletionMsg,
      'Completion Message'
    );

    const NotificationToastMessage = await this.keywords.getText(
      this.CompletionMsg,
      'Toast Message'
    );

    if(NotificationToastMessage==ExpectedNotifyMsg) {
      console.log('✅ Notification set for Slack and Email with message:', NotificationToastMessage);
    } else {
      throw new Error(`❌ Notification set for Slack and Email is failed. Received message: ${NotificationToastMessage}`);
    }

    await this.keywords.isInvisible(this.CompletionMsg, 10000);

  }
}
