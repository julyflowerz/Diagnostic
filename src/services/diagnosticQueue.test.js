jest.mock('./apiService', () => ({
  __esModule: true,
  default: {
    diagnoseCarProblem: jest.fn(async () => ({
      diagnosis: 'Queued AI diagnosis.',
      affectedParts: ['engine'],
      severity: 'medium'
    }))
  }
}));

import { createDiagnosticJob, processDiagnosticJob } from './diagnosticQueue';
import apiService from './apiService';

describe('diagnosticQueue', () => {
  test('creates a queued diagnostic job', () => {
    const job = createDiagnosticJob(
      { year: '2020', make: 'Toyota', model: 'Camry' },
      { name: 'Engine Concern' }
    );

    expect(job.status).toBe('queued');
    expect(job.vehicle.model).toBe('Camry');
  });

  test('processes queued job through status updates to completed', async () => {
    const job = createDiagnosticJob(
      { year: '2020', make: 'Toyota', model: 'Camry' },
      { name: 'Engine Concern' }
    );
    const statuses = [];

    const completedJob = await processDiagnosticJob(job, updatedJob => statuses.push(updatedJob.status));

    expect(statuses).toContain('queued');
    expect(statuses).toContain('processing');
    expect(statuses).toContain('completed');
    expect(completedJob.status).toBe('completed');
    expect(completedJob.diagnosis.diagnosis).toBe('Queued AI diagnosis.');
    expect(apiService.diagnoseCarProblem).toHaveBeenCalled();
  });
});
