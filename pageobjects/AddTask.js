import { keywords } from '../common/keywords.js';

export class AddTask {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.keywords = new keywords(page);

    // Static locators
    this.AddTaskBtn = '//span[text()="Add Task"]';
    this.ParallelTask =
      '(//button[contains(@id,"headlessui-popover-button") and @class="p-1 rounded-full"])[2]';
    this.SequentialTask =
      '(//button[contains(@id,"headlessui-popover-button") and @class="p-1 rounded-full"])[3]';
  }

  // ===========================
  // DYNAMIC LOCATORS
  // ===========================

  getTaskName(taskName) {
    return `//span[text()="${taskName}"]`;
  }

  // ===========================
  // ADD SEQUENTIAL TASK
  // ===========================
  async AddSeqNewTask(data) {
    const taskLocator = this.getTaskName(data.Task1Name);

    await this.keywords.waitUntilVisible(taskLocator, data.Task1Name);
    await this.keywords.hover(taskLocator, data.Task1Name);

    await this.keywords.click(
      this.SequentialTask,
      `Add Sequential Task after ${data.Task1Name}`
    );

    await this.keywords.click(this.AddTaskBtn, 'Add Task Button');
  }

  // ===========================
  // ADD PARALLEL TASK
  // ===========================
  async AddParalleNewTask(data) {
    
    const taskLocator = this.getTaskName(data.Task1Name);

    await this.keywords.waitUntilVisible(taskLocator, data.Task1Name);
    await this.keywords.hover(taskLocator, data.Task1Name);

    await this.keywords.click(
      this.ParallelTask,
      `Add Parallel Task to ${data.Task1Name}`
    );

    await this.keywords.click(this.AddTaskBtn, 'Add Task Button');
  }
}
