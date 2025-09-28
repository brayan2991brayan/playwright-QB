import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class TestPage extends BasePage {
  readonly addTestButton: string;
  readonly assayDropdown: string;
  readonly technicianDropdown: string;
  readonly statusDropdown: string;
  readonly commentsField: string;
  readonly saveTestButton: string;
  readonly testsTable: string;

  constructor(page: Page) {
    super(page);
    this.addTestButton = '.btn:has-text("Add Test"), button:has-text("Add Test")';
    this.assayDropdown = 'select[data-qbench-attr="assay"]';
    this.technicianDropdown = 'select[data-qbench-attr="tech"]';
    this.statusDropdown = 'select[data-qbench-attr="status"]';
    this.commentsField = 'textarea[data-qbench-attr="comments"]';
    this.saveTestButton = 'button[type="submit"], .btn-primary:has-text("Save")';
    this.testsTable = 'table, .qbench-paginated-entities-table';
  }

  async createTest(testData: {
    assay: string;
    technician?: string;
    status?: string;
    comments?: string;
  }): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTestsList(): Promise<void> {
    // Stay on current page after login - QBench interface should be available
    await this.page.waitForLoadState('networkidle');
  }
}
