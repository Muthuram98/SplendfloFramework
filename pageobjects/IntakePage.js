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

  async IntakeEdit(
  Que1, Text1,
  Que2, Text2, Option1, Option2,
  Que3, Text3, Choice1, Choice2,IntakeSection4Name,Section4QueName,
  ExpectedMsg, ExpectedFormMsg,
  ExpectedChecklistMsg, ExpectedNotifyMsg
) {
  await this.keywords.click(this.intakeEditBtn, 'Intake Edit');
  await this.keywords.click(this.editButton, 'Edit Button');
  await this.keywords.click(this.saveContinue, 'Save & Continue');

  // ===============================
  // VERIFY – TASK UPDATED MESSAGE
  // ===============================
  await this.keywords.waitUntilVisible(this.CompletionMsg, 'Completion Message');

  const toastMessage = await this.keywords.getText(
    this.CompletionMsg,
    'Toast Message'
  );

  await this.keywords.step('Verify → Task Update Message', async () => {
    if (toastMessage === ExpectedMsg) {
      console.log('✅ Task updated successfully:', toastMessage);
    } else {
      throw new Error(
        `❌ Task Updation failed.
Expected: ${ExpectedMsg}
Actual: ${toastMessage}`
      );
    }
  });

  await this.keywords.isInvisible(this.CompletionMsg, 10000);

  // ===============================
  // BUILD INTAKE FORM
  // ===============================
  await this.intakeFlow.createTextSection(Que1, Text1);

  await this.intakeFlow.createDropdownSection(
    Que2,
    Text2,
    [Option1, Option2]
  );

  await this.intakeFlow.createSingleChoice(
    Que3,
    Text3,
    [Choice1, Choice2]
  );

  await this.intakeFlow.createDateSection(IntakeSection4Name,Section4QueName);

  await this.page.waitForTimeout(5000);
  await this.keywords.click(this.saveContinue, 'Save & Continue');

  // ===============================
  // VERIFY – FORM SAVED MESSAGE
  // ===============================
  await this.keywords.waitUntilVisible(this.CompletionMsg, 'Completion Message');

  const FormtoastMessage = await this.keywords.getText(
    this.CompletionMsg,
    'Toast Message'
  );

  await this.keywords.step('Verify → Intake Form Saved Message', async () => {
    if (FormtoastMessage === ExpectedFormMsg) {
      console.log('✅ Form saved successfully:', FormtoastMessage);
    } else {
      throw new Error(
        `❌ Form creation failed.
Expected: ${ExpectedFormMsg}
Actual: ${FormtoastMessage}`
      );
    }
  });

  await this.keywords.isInvisible(this.CompletionMsg, 10000);

  // ===============================
  // CHECKLIST PAGE
  // ===============================
  await this.keywords.waitUntilVisible(this.cheklistPage, 'Checklist Page');
  await this.keywords.click(this.saveContinue, 'Save & Continue');

  await this.keywords.waitUntilVisible(this.CompletionMsg, 'Completion Message');

  const ChecklistToastMessage = await this.keywords.getText(
    this.CompletionMsg,
    'Toast Message'
  );

  await this.keywords.step('Verify → Checklist Updated Message', async () => {
    if (ChecklistToastMessage === ExpectedChecklistMsg) {
      console.log('✅ Checklist updated:', ChecklistToastMessage);
    } else {
      throw new Error(
        `❌ Checklist update failed.
Expected: ${ExpectedChecklistMsg}
Actual: ${ChecklistToastMessage}`
      );
    }
  });

  await this.keywords.isInvisible(this.CompletionMsg, 10000);

  // ===============================
  // NOTIFICATIONS PAGE
  // ===============================
  await this.keywords.waitUntilVisible(
    this.NotificationsPage,
    'Notifications Page'
  );

  await this.keywords.click(this.saveContinue, 'Save & Continue');

  await this.keywords.waitUntilVisible(this.CompletionMsg, 'Completion Message');

  const NotificationToastMessage = await this.keywords.getText(
    this.CompletionMsg,
    'Toast Message'
  );

  await this.keywords.step('Verify → Notification Configuration Message', async () => {
    if (NotificationToastMessage === ExpectedNotifyMsg) {
      console.log(
        '✅ Notification configured successfully:',
        NotificationToastMessage
      );
    } else {
      throw new Error(
        `❌ Notification configuration failed.
Expected: ${ExpectedNotifyMsg}
Actual: ${NotificationToastMessage}`
      );
    }
  });

  await this.keywords.isInvisible(this.CompletionMsg, 10000);
}

}
