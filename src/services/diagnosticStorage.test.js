import { clearDiagnosticHistory, deleteDiagnosticResult, getDiagnosticHistory, saveDiagnosticResult } from './diagnosticStorage';

const sampleResult = {
  id: 'test-1',
  vehicle: { year: '2020', make: 'Toyota', model: 'Camry' },
  problem: { name: 'Engine Stuttering', system: 'Engine' },
  diagnosis: { diagnosis: 'Likely ignition or fuel delivery issue.' },
  status: 'completed'
};

describe('diagnosticStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('saves and returns diagnostic history', () => {
    saveDiagnosticResult(sampleResult);

    expect(getDiagnosticHistory()).toHaveLength(1);
    expect(getDiagnosticHistory()[0].vehicle.model).toBe('Camry');
  });

  test('deletes a diagnostic result by id', () => {
    saveDiagnosticResult(sampleResult);

    const updatedHistory = deleteDiagnosticResult('test-1');

    expect(updatedHistory).toHaveLength(0);
  });

  test('clears all diagnostic history', () => {
    saveDiagnosticResult(sampleResult);

    expect(clearDiagnosticHistory()).toEqual([]);
    expect(getDiagnosticHistory()).toEqual([]);
  });
});
