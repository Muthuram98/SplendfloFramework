import { keywords } from '../common/keywords.js';

export class AddTask {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.keywords = new keywords(page);

    this.TaskName = '//span[text()="Task1"]';
    this.AddTaskBtn = '//span[text()="Add Task"]';
    this.ParallelTask = '(//button[contains(@id,"headlessui-popover-button") and @class="p-1 rounded-full"])[2]';
    this.SequentialTask = '(//button[contains(@id,"headlessui-popover-button") and @class="p-1 rounded-full"])[3]';


}

  /**
   * Create phase, task, and intake sections
   */
  async AddSeqNewTask() {

    await this.keywords.waitUntilVisible(
      this.TaskName,
      'Task Name'
    );

    await this.keywords.hover(this.TaskName, 'Task Name');

     await this.keywords.click(this.SequentialTask, 'Add sequential Task');

    await this.keywords.click(this.AddTaskBtn, 'Add Task Button');

  }

   async AddParalleNewTask() {

    await this.keywords.waitUntilVisible(
      this.TaskName,
      'Task Name'
    );

    await this.keywords.hover(this.TaskName, 'Task Name');

     await this.keywords.click(this.ParallelTask, 'Add Parallel Task');

     await this.keywords.click(this.AddTaskBtn, 'Add Task Button');

  }
}
