const STORAGE_KEY = 'carDiagnosticHistory';

const readHistory = () => {
  try {
    const rawHistory = window.localStorage.getItem(STORAGE_KEY);
    return rawHistory ? JSON.parse(rawHistory) : [];
  } catch (error) {
    console.error('Unable to read diagnostic history:', error);
    return [];
  }
};

const writeHistory = (history) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const saveDiagnosticResult = (result) => {
  const history = readHistory();
  const record = {
    id: result.id || `diagnostic-${Date.now()}`,
    vehicle: result.vehicle,
    problem: result.problem,
    diagnosis: result.diagnosis,
    timestamp: result.timestamp || new Date().toISOString(),
    status: result.status || 'completed'
  };

  const updatedHistory = [record, ...history.filter(item => item.id !== record.id)];
  writeHistory(updatedHistory);
  return record;
};

export const getDiagnosticHistory = () => readHistory();

export const deleteDiagnosticResult = (id) => {
  const updatedHistory = readHistory().filter(item => item.id !== id);
  writeHistory(updatedHistory);
  return updatedHistory;
};

export const clearDiagnosticHistory = () => {
  writeHistory([]);
  return [];
};

export const diagnosticStorageNotes = {
  purpose: 'This browser localStorage service acts as a small local database for class demonstration.',
  futureReplacement: 'The same function names could later call Firebase, SQL Server, MongoDB, or PostgreSQL through a backend API without changing most UI code.'
};
