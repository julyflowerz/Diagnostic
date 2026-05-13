const STORAGE_KEY = 'carDiagnosticHistory';
const GARAGE_KEY = 'carGarage';

const readHistory = () => {
  try {
    const rawHistory = window.localStorage.getItem(STORAGE_KEY);
    return rawHistory ? JSON.parse(rawHistory) : [];
  } catch (error) {
    console.error('Unable to read diagnostic history:', error);
    return [];
  }
};

const readGarage = () => {
  try {
    const rawGarage = window.localStorage.getItem(GARAGE_KEY);
    return rawGarage ? JSON.parse(rawGarage) : [];
  } catch (error) {
    console.error('Unable to read garage:', error);
    return [];
  }
};

const writeHistory = (history) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

const writeGarage = (garage) => {
  window.localStorage.setItem(GARAGE_KEY, JSON.stringify(garage));
};

// Generate unique vehicle ID
const generateVehicleId = (vehicle) => {
  const base = `${vehicle.make}_${vehicle.model}_${vehicle.year}`;
  const clean = base.toLowerCase().replace(/\s+/g, '_');
  return clean;
};

export const saveDiagnosticResult = (result) => {
  const history = readHistory();
  const record = {
    id: result.id || `diagnostic-${Date.now()}`,
    vehicle: result.vehicle,
    symptoms: result.symptoms,
    obdCode: result.obdCode,
    diagnosis: result.diagnosis,
    confidence: result.diagnosis?.confidence || 0,
    primaryDiagnosis: result.diagnosis?.primaryDiagnosis,
    timestamp: result.timestamp || new Date().toISOString(),
    status: result.status || 'completed',
    severity: result.vehicle?.severity,
    mileage: result.vehicle?.mileage
  };

  const updatedHistory = [record, ...history.filter(item => item.id !== record.id)];
  writeHistory(updatedHistory);
  
  // Also update vehicle in garage
  if (result.vehicle) {
    updateVehicleInGarage(result.vehicle, record);
  }
  
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

// Garage management functions
export const saveVehicleToGarage = (vehicle) => {
  const garage = readGarage();
  const vehicleId = generateVehicleId(vehicle);
  
  const vehicleRecord = {
    id: vehicleId,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    engine: vehicle.engine,
    mileage: vehicle.mileage,
    nickname: vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    diagnosticCount: 0,
    lastDiagnostic: null,
    commonIssues: [],
    repairs: []
  };
  
  const existingIndex = garage.findIndex(v => v.id === vehicleId);
  if (existingIndex >= 0) {
    garage[existingIndex] = { ...garage[existingIndex], ...vehicleRecord, updatedAt: new Date().toISOString() };
  } else {
    garage.push(vehicleRecord);
  }
  
  writeGarage(garage);
  return vehicleRecord;
};

export const getGarage = () => {
  return readGarage();
};

export const deleteVehicleFromGarage = (vehicleId) => {
  const garage = readGarage();
  const updatedGarage = garage.filter(vehicle => vehicle.id !== vehicleId);
  writeGarage(updatedGarage);
  return updatedGarage;
};

export const updateVehicleInGarage = (vehicle, diagnosticResult) => {
  const garage = readGarage();
  const vehicleId = generateVehicleId(vehicle);
  const index = garage.findIndex(v => v.id === vehicleId);
  
  if (index >= 0) {
    const vehicleRecord = garage[index];
    vehicleRecord.diagnosticCount = (vehicleRecord.diagnosticCount || 0) + 1;
    vehicleRecord.lastDiagnostic = diagnosticResult.timestamp;
    vehicleRecord.updatedAt = new Date().toISOString();
    
    // Track common issues
    if (diagnosticResult.primaryDiagnosis) {
      const issueName = diagnosticResult.primaryDiagnosis.name;
      const existingIssue = vehicleRecord.commonIssues.find(issue => issue.name === issueName);
      
      if (existingIssue) {
        existingIssue.count += 1;
        existingIssue.lastOccurred = diagnosticResult.timestamp;
      } else {
        vehicleRecord.commonIssues.push({
          name: issueName,
          count: 1,
          firstOccurred: diagnosticResult.timestamp,
          lastOccurred: diagnosticResult.timestamp,
          component: diagnosticResult.primaryDiagnosis.component
        });
      }
    }
    
    garage[index] = vehicleRecord;
    writeGarage(garage);
  }
};

export const getVehicleHistory = (vehicleId) => {
  const history = readHistory();
  return history.filter(record => {
    const recordVehicleId = generateVehicleId(record.vehicle);
    return recordVehicleId === vehicleId;
  });
};

export const addRepairToVehicle = (vehicleId, repair) => {
  const garage = readGarage();
  const index = garage.findIndex(v => v.id === vehicleId);
  
  if (index >= 0) {
    const repairRecord = {
      id: `repair-${Date.now()}`,
      ...repair,
      completedAt: new Date().toISOString()
    };
    
    garage[index].repairs.push(repairRecord);
    garage[index].updatedAt = new Date().toISOString();
    
    writeGarage(garage);
    return repairRecord;
  }
  
  return null;
};

export const getPreviousDiagnoses = (vehicle, symptoms) => {
  const history = readHistory();
  const vehicleId = generateVehicleId(vehicle);
  
  return history
    .filter(record => {
      const recordVehicleId = generateVehicleId(record.vehicle);
      return recordVehicleId === vehicleId;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5); // Last 5 diagnoses
};

export const diagnosticStorageNotes = {
  purpose: 'This browser localStorage service acts as a small local database for class demonstration.',
  futureReplacement: 'The same function names could later call Firebase, SQL Server, MongoDB, or PostgreSQL through a backend API without changing most UI code.',
  garageFeatures: 'Garage functionality allows users to save vehicles and track diagnostic history across multiple sessions.'
};
