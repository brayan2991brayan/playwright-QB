export interface LoginCredentials {
  username: string;
  password: string;
}

export interface OrderData {
  customer?: string;
  dateReceived?: string;
  dueDate?: string;
  orderReviewer?: string;
  specialInstructions?: string;
}

export interface SampleData {
  labId: string;
  sampleType?: string;
  description?: string;
  source?: string;
  timeOfCollection?: string;
  pointOfCollection?: string;
}

export interface TestData {
  assay: string;
  technician?: string;
  status?: string;
  estimatedStartDate?: string;
  estimatedCompleteDate?: string;
  results?: string;
  comments?: string;
}

export class TestDataFactory {
  static getLoginCredentials(): LoginCredentials {
    return {
      username: process.env.QBENCH_USERNAME || 'test@example.com',
      password: process.env.QBENCH_PASSWORD || 'password123'
    };
  }

  static getOrderData(): OrderData {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      customer: 'Test Customer',
      dateReceived: today.toISOString().split('T')[0],
      dueDate: tomorrow.toISOString().split('T')[0],
      orderReviewer: 'QA Engineer',
      specialInstructions: 'Test order created by automated test'
    };
  }

  static getSampleData(): SampleData {
    const timestamp = Date.now();
    return {
      labId: `TEST-${timestamp}`,
      sampleType: 'Test Sample Type',
      description: 'Test sample created by automated test',
      source: 'Test Source',
      timeOfCollection: new Date().toISOString(),
      pointOfCollection: 'Test Collection Point'
    };
  }

  static getTestData(): TestData {
    return {
      assay: 'Test Assay',
      technician: 'QA Engineer',
      status: 'NOT STARTED',
      estimatedStartDate: new Date().toISOString().split('T')[0],
      estimatedCompleteDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      results: '',
      comments: 'Test created by automated test'
    };
  }

  static getDuplicateSampleData(): SampleData {
    return {
      labId: 'DUPLICATE-001', // This should cause a validation error
      sampleType: 'Test Sample Type',
      description: 'Duplicate sample for error testing',
      source: 'Test Source'
    };
  }
}
