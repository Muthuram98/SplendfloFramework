import { expect } from '@playwright/test';
import { keywords } from '../common/keywords.js';


export class SpendflowPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.keywords = new keywords(page);

    /* =========================
       LOCATORS (ONLY STRINGS)
    ========================== */
    this.vendorManagement = '//h5[text()="Vendor Management"]';
    this.agreements = '(//h5[text()="Agreements"])[1]';
    this.addAgreementBtn = '//p[text()="+ Add Agreement"]';
    this.continueBtn = '//p[text()="Continue"]';
    this.popuppage = '//h2[contains(@id,"headlessui-dialog-title")]';
    this.AddagreementPage = '//h2[text()="Add an Agreement"]';
    this.fileInput = 'input[type="file"]';

    this.vendorNameField = '//p[text()="Vendor Name"]//following::input';
    this.saveAndContinueBtn = '//p[text()="Save & Continue"]';

    this.agreementDetailsText = '//p[text()="Agreement Details"]';
    this.agreementStartDate = '(//input[@id="startDate"])[1]';
    this.agreementEndDate = '(//input[@id="endDate"])[1]';

    this.FirstQuoteInput = '//input[@name="firstQuote"]';
    this.contractedValueInput = '(//input[@name="cost"])[1]';

    this.agreementDuration =
      '//span[normalize-space()="Agreement Duration"]/ancestor::label/following-sibling::p';

    this.PaymentTerms =
      '(//span[text()="Payment Terms"]//following::span[contains(@class,"_sf-trigger-button-label_ttr")])[1]';

    this.BillingFrequency =
      '(//span[text()="Billing Frequency"]//following::span[contains(@class,"_sf-trigger-button-label_ttr")])[1]';
    
    this.ProcuredSpendflo = '(//*[text()="Procured by Spendflo"]//following::span[contains(@class,"_sf-trigger-button-label_ttr")])[1]';

    this.AgreementOwner = '//input[@name="Agreement Owner"]';

    this.AgreementOwnerselect = '//div[contains(@id,"headlessui-listbox-option") and @role="option"]';

    this.AutoRenewfield = '(//span[text()="Does this auto renew?"]//following::span[contains(@class,"_sf-trigger-button-label_ttr")])[1]';


    //Pricing details locators

    this.LineItemType = '(//span[text()="Line Item Type"]//following::span[contains(@class,"_sf-trigger-button-label_ttr")])[1]';
    this.OfferingName = '(//input[@name="Offering Name"])[1]';
    
  
    }

    

  /* =========================
     NAVIGATION
  ========================== */

  async navigateToAgreements() {
    await this.keywords.click(this.vendorManagement, 'Vendor Management');
    await this.keywords.click(this.agreements, 'Agreements');
  }

  /* =========================
     AGREEMENT CREATION
  ========================== */

  async addAgreement(filePath) {
    await this.keywords.click(this.addAgreementBtn, 'Add Agreement');
    await this.page.setInputFiles(this.fileInput, filePath);
    await this.keywords.click(this.continueBtn, 'Continue');

    await this.keywords.isInvisible(this.popuppage, 30000);
    await this.keywords.waitUntilVisible(
      this.AddagreementPage,
      'Add Agreement Page'
    );
  }

  async clickSaveAndContinue() {
    await this.keywords.waitUntilVisible(
      this.saveAndContinueBtn,
      'Save & Continue Button'
    );

    await this.keywords.click(
      this.saveAndContinueBtn,
      'Save & Continue Button'
    );

    await this.page.waitForLoadState('networkidle');
  }

  /* =========================
     VERIFICATIONS (USING COMMON METHOD)
  ========================== */

  async verifyVendorName(expectedVendorName) {
    const actualVendorName = await this.keywords.getAttribute(
      this.vendorNameField,
      'value',
      'Vendor Name'
    );

    await this.keywords.verifyFieldValue(
      actualVendorName,
      expectedVendorName,
      'Vendor Name'
    );

    if (actualVendorName == null || actualVendorName.trim() === '') {

      await this.keywords.clearAndFill(
        this.vendorNameField,
        NewVendorName,
        'Select Vendor Name'
      );
    }


  }

  async verifyAgreementDetailsText(expectedText) {

    await this.keywords.waitUntilVisible(
      this.agreementDetailsText,
      'Agreement Details Text'
    );

    const actualText = await this.keywords.getText(
      this.agreementDetailsText,
      'Agreement Details Text'
    );

    await this.keywords.verifyFieldValue(
      actualText,
      expectedText,
      'Agreement Details Text'
    );
  }

  async verifyAgreementStartDate(expectedDate,NewAgreementStartDate) {
    await this.keywords.scrollIntoView(
      this.agreementStartDate,
      'Agreement Start Date'
    );

    const actualDate = await this.keywords.getAttribute(
      this.agreementStartDate,
      'value',
      'Agreement Start Date'
    );

    await this.keywords.verifyFieldValue(
      actualDate,
      expectedDate,
      'Agreement Start Date'
    );

    if (actualDate == null || actualDate.trim() === '') {

      await this.keywords.clearAndFill(
        this.agreementStartDate,
        NewAgreementStartDate,
        'NewExepectedDate'
      );
    }
  }

  async verifyAgreementEndDate(expectedEndDate,NewAgreementEndDate) {
    await this.keywords.scrollIntoView(
      this.agreementEndDate,
      'Agreement End Date'
    );

    const actualEndDate = await this.keywords.getAttribute(
      this.agreementEndDate,
      'value',
      'Agreement End Date'
    );

    await this.keywords.verifyFieldValue(
      actualEndDate,
      expectedEndDate,
      'Agreement End Date'
    );

    if (actualEndDate == null || actualEndDate.trim() === '') {

      await this.keywords.clearAndFill(
        this.agreementEndDate,
        NewAgreementEndDate,
        'NewAgreementEndDate'
      );
    }
  }

  async verifyFirstQuote(expectedFirstQuote,NewFirstQuote) {
    await this.keywords.scrollIntoView(
      this.FirstQuoteInput,
      'First Quote'
    );

    const actualFirstQuote = await this.keywords.getAttribute(
      this.FirstQuoteInput,
      'value',
      'First Quote'
    );

    await this.keywords.verifyFieldValue(
      actualFirstQuote,
      expectedFirstQuote,
      'First Quote'
    );

    if (actualFirstQuote == null || actualFirstQuote.trim() === '') {

      await this.keywords.clearAndFill(
        this.FirstQuoteInput,
        NewFirstQuote,
        'NewFirstQuote'
      );
    }

  }

  async verifyContractedValue(expectedContractedValue,NewContractedValue) {
    await this.keywords.scrollIntoView(
      this.contractedValueInput,
      'Contracted Value'
    );

    const actualContractedValue = await this.keywords.getAttribute(
      this.contractedValueInput,
      'value',
      'Contracted Value'
    );

    await this.keywords.verifyFieldValue(
      actualContractedValue,
      expectedContractedValue,
      'Contracted Value'
    );

    if (actualContractedValue == null || actualContractedValue.trim() === '') {

      await this.keywords.clearAndFill(
        this.contractedValueInput,
        NewContractedValue,
        'NewContractedValue'
      );
    }

  }

  async verifyAgreementDuration(expectedDuration,NewAgreementDuration) {

    await this.keywords.scrollIntoView(
      this.agreementDuration,
      'Agreement Duration'
    );

    const actualDuration = await this.keywords.getText(
      this.agreementDuration,
      'Agreement Duration'
    );

    await this.keywords.verifyFieldValue(
      actualDuration,
      expectedDuration,
      'Agreement Duration'
    );

    if (actualDuration == null || actualDuration.trim() === '') {

      await this.keywords.clearAndFill(
        this.agreementDuration,
        NewAgreementDuration,
        'NewAgreementDuration'
      );
    }

  }

  async verifyPaymentTerm(expectedValue,NewPaymentTerms) {

    const Newlocator = `//span[@class="inline-block" and text()="${NewPaymentTerms}"]`;

    await this.keywords.scrollIntoView(this.PaymentTerms, 'Payment Terms');
    await this.keywords.waitUntilVisible(this.PaymentTerms, 'Payment Terms');

    const actualValue = await this.keywords.getText(
      this.PaymentTerms,
      'Payment Terms'
    );

    await this.keywords.verifyFieldValue(
      actualValue,
      expectedValue,
      'Payment Terms'
    );

    if (actualValue == null || actualValue.trim() === '') {

      await this.keywords.click(this.PaymentTerms,
        'PaymentTerms'
      ); 

      await this.keywords.click(Newlocator,
        'PaymentTerms'
      );
    }
  }

  async verifyBillingFrequency(expectedValue,NewBillingFrequency) {

    const Newlocator = `//span[@class="inline-block" and text()="${NewBillingFrequency}"]`;

    await this.keywords.scrollIntoView(
      this.BillingFrequency,
      'Billing Frequency'
    );
    await this.keywords.waitUntilVisible(
      this.BillingFrequency,
      'Billing Frequency'
    );

    const actualValue = await this.keywords.getText(
      this.BillingFrequency,
      'Billing Frequency'
    );

    await this.keywords.verifyFieldValue(
      actualValue,
      expectedValue,
      'Billing Frequency'
    );

    if (actualValue == null || actualValue.trim() === '') {

      await this.keywords.click(this.BillingFrequency,
        'BillingFrequency'
      ); 

      await this.keywords.click(Newlocator,
        'PaymentTerms'
      );
    }
  }

  async verifyProcuredBySpendflo(expectedValue,NewProcuredBySpendflo) {

    const Newlocator = `//span[@class="inline-block" and text()="${NewProcuredBySpendflo}"]`;

    await this.keywords.scrollIntoView(this.ProcuredSpendflo, 'Procured by Spendflo');
    await this.keywords.waitUntilVisible(this.ProcuredSpendflo, 'Procured by Spendflo');

    await expect(this.page.locator(this.ProcuredSpendflo)).toHaveText(expectedValue);

    const actualSpenflo = await this.keywords.getText(
      this.ProcuredSpendflo,
      'Procured by Spendflo'
    );

    if (actualSpenflo == null || actualSpenflo.trim() === '') {

      await this.keywords.click(this.ProcuredSpendflo,
        'NewProcuredBySpendflo'
      ); 

      await this.keywords.click(Newlocator,
        'NewProcuredBySpendflo'
      );
    }

  }

  async verifyAgreementOwner(expectedAgrreementOwner,NewAgreementOwner) {

    await this.keywords.scrollIntoView(
      this.AgreementOwner,
      'Agreement Owner'
    );

    const actualAgreementOwner = await this.keywords.getAttribute(
      this.AgreementOwner,
      'value',
      'Agreement Owner'
    );

    await this.keywords.verifyFieldValue(
      actualAgreementOwner,
      expectedAgrreementOwner,
      'Agreement Owner'
    );


    if (actualAgreementOwner == null || actualAgreementOwner.trim() === '') {

      await this.keywords.clearAndFill( 
        this.AgreementOwner,
        NewAgreementOwner,
        'NewAgreementOwner'
      );

      await this.keywords.click(this.AgreementOwnerselect,
        'AgreementOwnerselect'
      );

    }

  }

  async verifyAutorenew(expectedValue) {
    await this.keywords.scrollIntoView(
      this.AutoRenewfield,
      'Auto Renew'
    );
    await this.keywords.waitUntilVisible(
      this.AutoRenewfield,
      'Auto Renew'
    );

    const actualValue = await this.keywords.getText(
      this.AutoRenewfield,
      'Auto Renew'
    );

    await this.keywords.verifyFieldValue(
      actualValue,
      expectedValue,
      'Auto Renew'
    );

  }


}
