import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/CarViewer', () => function MockCarViewer({ onSystemSelect }) {
  return <button onClick={() => onSystemSelect('engine')}>Engine</button>;
});

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('renders the main app workflow', () => {
    render(<App />);

    expect(screen.getByText(/AI Car Diagnostic Tool/i)).toBeTruthy();
    expect(screen.getByText(/Step-by-Step Diagnostic Workflow/i)).toBeTruthy();
    expect(screen.getByText(/Common OBD-II Codes/i)).toBeTruthy();
  });

  test('validates required vehicle fields', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Run AI Diagnosis/i }));

    expect(screen.getByRole('alert').textContent).toMatch(/vehicle year, make, and model/i);
  });

  test('displays saved diagnostic history from localStorage', () => {
    window.localStorage.setItem('carDiagnosticHistory', JSON.stringify([
      {
        id: 'saved-1',
        vehicle: { year: '2020', make: 'Toyota', model: 'Camry' },
        problem: { name: 'Engine Concern' },
        diagnosis: { diagnosis: 'Saved diagnostic summary.' },
        timestamp: '2026-01-01T00:00:00.000Z',
        status: 'completed'
      }
    ]));

    render(<App />);

    expect(screen.getByText(/2020 Toyota Camry/i)).toBeTruthy();
    expect(screen.getByText(/Saved diagnostic summary/i)).toBeTruthy();
  });
});
