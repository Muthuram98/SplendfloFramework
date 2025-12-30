import { keywords } from '../common/keywords.js';

export class SaveAndPublish {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.keywords = new keywords(page);

    // 🔹 Login page locators
    this.SaveWorkflow = '//p[text()="Save"]';
    this.CompletionMsg = '(//div[@class="Toastify__toast-body"]//following::span[contains(@class,"text-body")])[1]';
    this.PublishButton = '//p[text()="Publish"]';
    this.PublishPopupText = '//h2[contains(@id,"headlessui-dialog-title")]//following::p[contains(@class,"text-body")]';
    this.versionDescription = '//h2[contains(@id,"headlessui-dialog-title")]//following::textarea';
    this.ConfirmPublishBtn = '//h2[contains(@id,"headlessui-dialog-title")]//following::p[text()="Publish"]';
  }


  async SavePublish(SavePopupMsg,PublishPopupMsg,PublishSuccessMsg) {

    // await this.keywords.click(this.SaveWorkflow, 'Save Workflow');

    // try {
    //   await this.keywords.waitForToast(SavePopupMsg, 'Completion Message');
    // } catch (err) {
    //   const toasts = await this.keywords.getAllToasts();
    //   throw new Error(`Expected save toast '${SavePopupMsg}' not found. Detected toasts: ${JSON.stringify(toasts)}`);
    // }

    // const toastMessage = await this.keywords.getText(this.CompletionMsg, 'Toast Message');

    // if (toastMessage == SavePopupMsg) {
    //   console.log('✅ Workflow Saved Successfully with message:', toastMessage);
    // } else {
    //   throw new Error(`❌ Workflow Save failed. Received message: ${toastMessage}`);
    // }

    // await this.keywords.isInvisible(this.CompletionMsg, 10000);

    await this.keywords.waitUntilVisible(
      this.PublishButton,
      'Publish Workflow'
    );

    await this.keywords.click(
      this.PublishButton,
      'Publish Workflow'
    );

    const popupText = await this.keywords.getText(
      this.PublishPopupText,
      'Publish popup Text'
    );

    if(popupText===PublishPopupMsg) {
      console.log('✅ Publish popup displayed successfully');
    } else {
      throw new Error('❌ Publish popup not displayed');
    } 

    await this.keywords.fill(
      this.versionDescription,
      'Initial Publish',
      'Version Description'
    );

    await this.keywords.click(
      this.ConfirmPublishBtn,
      'Confirm Publish Button'
    );

    try {
      await this.keywords.waitForToast(PublishSuccessMsg, 'Completion Message');
    } catch (err) {
      const toasts = await this.keywords.getAllToasts();
      throw new Error(`Expected publish toast '${PublishSuccessMsg}' not found. Detected toasts: ${JSON.stringify(toasts)}`);
    }

    const publishToastMessage = await this.keywords.getText(this.CompletionMsg, 'Toast Message');

    if (publishToastMessage == PublishSuccessMsg) {
      console.log('✅ Workflow Published Successfully with message:', publishToastMessage);
    } else {
      throw new Error(`❌ Workflow Publish failed. Received message: ${publishToastMessage}`);
    }

    await this.keywords.isInvisible(this.CompletionMsg, 10000);
    
  }
}
