import { keywords } from '../common/keywords.js';
import { IntakeFormFlow } from '../flow/CreateForm.js'; 

export class IntakePage {
  constructor(page) {
    this.page = page;
    this.keywords = new keywords(page);
    this.intakeFlow = new IntakeFormFlow(page, this.keywords);

    this.intakeEditBtn =
      '(//span[text()="Intake Form"]//following::button[contains(@id,"headlessui-popover-button")])[1]';

    this.editButton = '//div[contains(@id,"headlessui-popover-panel")]';
    this.saveContinue = '//p[text()="Save & Continue"]';
    this.cheklistPage = '//h3[text()="Build Checklist"]';
    this.NotificationsPage = '//p[text()="System Notifications"]';
    this.CompletionMsg = '(//div[@class="Toastify__toast-body"]//following::span[contains(@class,"text-body")])[1]';
    // this.ClosePopup ='(//div[@class="Toastify__toast-body"]//following::button)[1]';
  }

  async IntakeEdit(Que1,Text1,Que2,Text2,Option1,Option2,ExpectedMsg,ExpectedFormMsg,ExpectedChecklistMsg,ExpectedNotifyMsg) {
    await this.keywords.click(this.intakeEditBtn, 'Intake Edit');
    await this.keywords.click(this.editButton, 'Edit Button');
    await this.keywords.click(this.saveContinue, 'Save & Continue');

    await this.keywords.waitUntilVisible(
      this.CompletionMsg,
      'Completion Message'
    );

    const toastMessage = await this.keywords.getText(
      this.CompletionMsg,
      'Toast Message'
    );

    if(toastMessage==ExpectedMsg) {
      console.log('✅ Task updated successfully with message:', toastMessage);
    } else {
      throw new Error(`❌ Task Updation failed. Received message: ${toastMessage}`);
    }

    await this.keywords.isInvisible(this.CompletionMsg, 10000);

    // 🔹 Section 1 (Text)
    await this.intakeFlow.createTextSection(
      Que1,
      Text1
    );

    // 🔹 Section 2 (Dropdown)
    await this.intakeFlow.createDropdownSection(
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
