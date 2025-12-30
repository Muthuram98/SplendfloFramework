import { keywords } from '../common/keywords.js';

export class IntakeFormFlow {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {keywords} keywordsInstance
   */
  constructor(page, keywordsInstance) {
    this.page = page;
    this.keywords = keywordsInstance;

    /* =========================
       LOCATORS
    ========================= */

    // Section
    this.addSectionBtn = '//*[text()="Add Section"]';
    this.sectionNameInput = '//*[text()="Build Form"]//following::input';

    // Field
    this.addFieldBtn = '//button[@class="px-2"]';
    this.searchFieldInput = '//input[contains(@id,"headlessui-input")]';

    // Drag & Drop
    this.draggableItem = '//div[@aria-roledescription="draggable"]';
    this.dropPlaceholder = '//img[@alt="place-holder image"]';

    // Question Configuration
    this.questionTitleInput = '//input[@name="title"]';
    this.responseRequiredToggle =
      '(//span[text()="Response required"]//following::button[contains(@id,"headlessui-switch")])[1]';
    this.saveQuestionBtn =
      '//h2[contains(text(),"Configure Question")]//following::p[text()="Save"]';

    // Dropdown Options
    this.addOptionBtn = '//p[text()="+ Add Option"]';
    this.optionInput =
      '//*[text()="Add Options"]//following::input[contains(@id,"headlessui-input")]';
  }

  /* =========================
     CREATE TEXT SECTION
  ========================= */
  async createTextSection(sectionName, questionText) {

    await this.keywords.click(this.addSectionBtn, 'Add Section');

    await this.keywords.clearAndFill(
      this.sectionNameInput,
      sectionName,
      'Section Name'
    );

    await this.keywords.click(this.addFieldBtn, 'Add Field');

    await this.keywords.clearAndFill(
      this.searchFieldInput,
      'Short Text',
      'Search Field'
    );

    await this.keywords.dragAndDrop(
      this.draggableItem,
      this.dropPlaceholder,
      'Drag Text Field'
    );

    await this.keywords.waitUntilVisible(
      this.questionTitleInput,
      'Question Input'
    );

    await this.keywords.fill(
      this.questionTitleInput,
      questionText,
      'Question Input'
    );

    await this.keywords.click(
      this.responseRequiredToggle,
      'Response Required Toggle'
    );

    await this.keywords.click(
      this.saveQuestionBtn,
      'Save Question'
    );
  }

  /* =========================
     CREATE DROPDOWN SECTION
  ========================= */
  async createDropdownSection(sectionName, questionText, options = []) {

    await this.keywords.click(this.addSectionBtn, 'Add Section');

    await this.keywords.fill(
      this.sectionNameInput,
      sectionName,
      'Section Name'
    );

    await this.keywords.click(this.addFieldBtn, 'Add Field');

    await this.keywords.fill(
      this.searchFieldInput,
      'Dropdown',
      'Search Field'
    );

    await this.keywords.dragAndDrop(
      this.draggableItem,
      this.dropPlaceholder,
      'Drag Dropdown Field'
    );

    await this.keywords.waitUntilVisible(
      this.questionTitleInput,
      'Dropdown Question'
    );

    await this.keywords.fill(
      this.questionTitleInput,
      questionText,
      'Dropdown Question'
    );

    for (const option of options) {
      await this.keywords.click(this.addOptionBtn, 'Add Option');
      await this.keywords.fill(
        this.optionInput,
        option,
        'Option Input'
      );
      await this.keywords.pressEnterGlobal('Confirm Option');
    }

    await this.keywords.click(
      this.saveQuestionBtn,
      'Save Question'
    );
  }

  // Create Singlechoice Question

  async createSingleChoice(sectionName, questionText, options = []) {

    await this.keywords.click(this.addSectionBtn, 'Add Section');

    await this.keywords.fill(
      this.sectionNameInput,
      sectionName,
      'Section Name'
    );

    await this.keywords.click(this.addFieldBtn, 'Add Field');

    await this.keywords.fill(
      this.searchFieldInput,
      'Single Choice',
      'Search Field'
    );

    await this.keywords.dragAndDrop(
      this.draggableItem,
      this.dropPlaceholder,
      'Drag Dropdown Field'
    );

    await this.keywords.waitUntilVisible(
      this.questionTitleInput,
      'Dropdown Question'
    );

    await this.keywords.fill(
      this.questionTitleInput,
      questionText,
      'Dropdown Question'
    );

    for (const option of options) {
      await this.keywords.click(this.addOptionBtn, 'Add Option');
      await this.keywords.fill(
        this.optionInput,
        option,
        'Option Input'
      );
      await this.keywords.pressEnterGlobal('Confirm Option');
    }

    await this.keywords.click(
      this.saveQuestionBtn,
      'Save Question'
    );
  }

  async createDateSection(sectionName, questionText) {

    await this.keywords.click(this.addSectionBtn, 'Add Section');

    await this.keywords.clearAndFill(
      this.sectionNameInput,
      sectionName,
      'Section Name'
    );

    await this.keywords.click(this.addFieldBtn, 'Add Field');

    await this.keywords.clearAndFill(
      this.searchFieldInput,
      'Date',
      'Search Field'
    );

    await this.keywords.dragAndDrop(
      this.draggableItem,
      this.dropPlaceholder,
      'Drag Date Field'
    );

    await this.keywords.waitUntilVisible(
      this.questionTitleInput,
      'Question Input'
    );

    await this.keywords.fill(
      this.questionTitleInput,
      questionText,
      'Question Input'
    );

    await this.keywords.click(
      this.responseRequiredToggle,
      'Response Required Toggle'
    );

    await this.keywords.click(
      this.saveQuestionBtn,
      'Save Question'
    );
  }
}
