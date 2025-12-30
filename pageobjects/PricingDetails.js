import { expect } from '@playwright/test';
import { keywords } from '../common/keywords.js';

export class PricingDetails {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.keywords = new keywords(page);

    /* =========================
       LOCATORS (ONLY STRINGS)
    ========================== */
  
    //Pricing details locators

    this.LineItemType = '(//span[text()="Line Item Type"]//following::span[contains(@class,"_sf-trigger-button-label_ttr")])[1]';
    this.OfferingName = '(//input[@name="Offering Name"])[1]';
    this.Plan = '(//input[@name="plan"])[1]';
    this.PricingModel = '(//span[text()="Pricing Model"]//following::span[contains(@class,"_sf-trigger-button-label_ttr")])[1]';
    this.StartDate = '(//input[@id="startDate"])[2]';
    this.EndDate = '(//input[@id="endDate"])[2]';
    this.Quantity = '(//input[@name="numberOfUnits"])[1]';
    this.UnitOfMeasure = '(//span[text()="Unit of Measure"]//following::span[contains(@class,"_sf-trigger-button-label_ttr")])[1]';
    this.Cost = '(//input[@name="cost"])[2]';
    this.Duration = '(//span[text()="Duration"]//following::span[contains(@class,"_sf-trigger-button-label_ttr")])[1]';
    this.EstimatedUsage = '(//input[@name="estimatedUnitsToBeUsed"])[1]';
    this.Amount = '(//input[@name="amount"])[1]';
      
  
    }


  async verifyLineItemType(expectedvalue,NewLineItemType) {

    const Newlocator = `//span[@class="inline-block" and text()="${NewLineItemType}"]`;

    await this.keywords.scrollIntoView(
      this.LineItemType,
      'Line Item Type'
    );

    await this.keywords.waitUntilVisible(
      this.LineItemType,
      'Line Item Type'
    );

    const Actualvalue = await this.keywords.getText(
      this.LineItemType,
      'Line Item Type'
    );

    await this.keywords.verifyFieldValue(
      Actualvalue,
      expectedvalue,
      'Line Item Type'
    );

    if (Actualvalue == null || Actualvalue.trim() === '') {

      await this.keywords.click(this.LineItemType,
        'LineItemType'
      ); 

      await this.keywords.click(Newlocator,
        'LineItemType'
      );
    }

  }

  async verifyOfferingName(expectedValue) {
    await this.keywords.scrollIntoView(
      this.OfferingName,
      'Offering Name'
    );

    await this.keywords.waitUntilVisible(
      this.OfferingName,
      'Offering Name'
    );

    const actualValue = await this.keywords.getAttribute(
      this.OfferingName,'value',
      'Offering Name'
    );

    await this.keywords.verifyFieldValue(
      actualValue,
      expectedValue,
      'Offering Name'
    );

    const Newlocator = '//div[contains(@id,"headlessui-listbox-option")]//button';

    const AddOfferingLocator = `/(//p[text()="Add Offering"])[1]`;
	
	if (actualValue == null || actualValue.trim() === '') {

      await this.keywords.click(this.OfferingName,
        'LineItemType'
      ); 

      await this.keywords.click(Newlocator,
        'LineItemType'
      );

      await this.keywords.click(AddOfferingLocator,
        'Add Offering'
      );

    }

  }

  async verifyPlan(expectedvalue,NewPlan) {

    await this.keywords.scrollIntoView(
      this.StartDate,
      'StartDate'
    );

    await this.keywords.waitUntilVisible(
      this.Plan,
      'Plan'
    );

    const Actualvalue = await this.keywords.getAttribute(
      this.Plan,
      'value',
      'Plan'
    );

    await this.keywords.verifyFieldValue(
      Actualvalue,
      expectedvalue,
      'Plan'
    );

     if (Actualvalue == null || Actualvalue.trim() === '') {

      await this.keywords.clearAndFill(
        this.Plan,
        NewPlan,
        'Plan'
      );
    }

  }

  async verifyPricingModel(expectedValue,NewPricingModel) {
    await this.keywords.scrollIntoView(
      this.PricingModel,
      'PricingModel'
    );

    await this.keywords.waitUntilVisible(
      this.PricingModel,
      'PricingModel'
    );

    const actualValue = await this.keywords.getText(
      this.PricingModel,
      'PricingModel'
    );

    await this.keywords.verifyFieldValue(
      actualValue,
      expectedValue,
      'PricingModel'
    );

    const Newlocator = `//span[@class="inline-block" and text()="${NewPricingModel}"]`;
	
	if (actualValue == null || actualValue.trim() === '' || actualValue == 'Select') {

      await this.keywords.click(this.PricingModel,
        'PricingModel'
      ); 

      await this.keywords.click(Newlocator,
        'PricingModel'
      );
    }

  }

  async verifyStartDate(expectedvalue) {
    await this.keywords.scrollIntoView(
      this.StartDate,
      'StartDate'
    );

    await this.keywords.waitUntilVisible(
      this.StartDate,
      'StartDate'
    );

    const Actualvalue = await this.keywords.getAttribute(
      this.StartDate,
      'value',
      'StartDate'
    );

    await this.keywords.verifyFieldValue(
      Actualvalue,
      expectedvalue,
      'StartDate'
    );
  }

  async verifyEndDate(expectedvalue) {
    await this.keywords.scrollIntoView(
      this.EndDate,
      'EndDate'
    );

    await this.keywords.waitUntilVisible(
      this.EndDate,
      'EndDate'
    );

    const Actualvalue = await this.keywords.getAttribute(
      this.EndDate,
      'value',
      'EndDate'
    );

    await this.keywords.verifyFieldValue(
      Actualvalue,
      expectedvalue,
      'EndDate'
    );
  }

  async verifyQuantity(expectedvalue, NewQuantity) {
    await this.keywords.scrollIntoView(
      this.Quantity,
      'Quantity'
    );

    await this.keywords.waitUntilVisible(
      this.Quantity,
      'Quantity'
    );

    const Actualvalue = await this.keywords.getAttribute(
      this.Quantity,
      'value',
      'Quantity'
    );

    await this.keywords.verifyFieldValue(
      Actualvalue,
      expectedvalue,
      'Quantity'
    );

    if (Actualvalue == null || Actualvalue.trim() === '') {

      await this.keywords.clearAndFill(
        this.Quantity,
        NewQuantity,
        'Quantity'
      );
    }
  }

  async verifyUnitOfMeasure(expectedValue, NewUnitOfMeasure) {
   
    await this.keywords.scrollIntoView(
      this.UnitOfMeasure,
      'UnitOfMeasure'
    );

    await this.keywords.waitUntilVisible(
      this.UnitOfMeasure,
      'UnitOfMeasure'
    );

    const actualValue = await this.keywords.getText(
      this.UnitOfMeasure,
      'UnitOfMeasure'
    );

    await this.keywords.verifyFieldValue(
      actualValue,
      expectedValue,
      'UnitOfMeasure'
    );
    const Newlocator = `//span[@class="inline-block" and text()="${NewUnitOfMeasure}"]`;

    if (actualValue == null || actualValue.trim() === '' || actualValue == 'Select') {

      await this.keywords.click(this.UnitOfMeasure,
        'UnitOfMeasure'
      );

      await this.keywords.click(Newlocator,
        'UnitOfMeasure'
      );
  }

}
  

  async verifyCost(expectedvalue, NewCost) {
    await this.keywords.scrollIntoView(
      this.Cost,
      'Cost'
    );

    await this.keywords.waitUntilVisible(
      this.Cost,
      'Cost'
    );

    const Actualvalue = await this.keywords.getAttribute(
      this.Cost,
      'value',
      'Cost'
    );

    await this.keywords.verifyFieldValue(
      Actualvalue,
      expectedvalue,
      'Cost'
    );

    if (Actualvalue == null || Actualvalue.trim() === '') {

      await this.keywords.clearAndFill(
        this.Cost,
        NewCost,
        'Cost'
      );
    }
  }

   async verifyEstimatedUsage(expectedvalue, NewEstimatedUsage) {
    await this.keywords.scrollIntoView(
      this.EstimatedUsage,
      'EstimatedUsage'
    );

    await this.keywords.waitUntilVisible(
      this.EstimatedUsage,
      'EstimatedUsage'
    );

    const Actualvalue = await this.keywords.getAttribute(
      this.EstimatedUsage,
      'value',
      'EstimatedUsage'
    );

    await this.keywords.verifyFieldValue(
      Actualvalue,
      expectedvalue,
      'EstimatedUsage'
    );

    if (Actualvalue == null || Actualvalue.trim() === '') {

      const element = this.page.locator(this.EstimatedUsage);
      if (await element.isEnabled()) {
        await this.keywords.clearAndFill(
          this.EstimatedUsage,
          NewEstimatedUsage,
          'EstimatedUsage'
        );
      } else {
        console.log('EstimatedUsage field is disabled, skipping fill');
      }
    }
  }

   async verifyAmount(expectedvalue, NewAmount) {
    await this.keywords.scrollIntoView(
      this.Amount,
      'Amount'
    );

    await this.keywords.waitUntilVisible(
      this.Amount,
      'Amount'
    );

    const Actualvalue = await this.keywords.getAttribute(
      this.Amount,
      'value',
      'Amount'
    );

    await this.keywords.verifyFieldValue(
      Actualvalue,
      expectedvalue,
      'Amount'
    );

    if (Actualvalue == null || Actualvalue.trim() === '') {

      await this.keywords.clearAndFill(
        this.Amount,
        NewAmount,
        'Amount'
      );
    }
  }






}
