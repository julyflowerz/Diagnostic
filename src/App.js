import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import CarViewer from './components/CarViewer';
import DiagnosticForm from './components/DiagnosticForm';
import ProblemSelector from './components/ProblemSelector';
import DiagnosticResults from './components/DiagnosticResults';
import { clearDiagnosticHistory, deleteDiagnosticResult, getDiagnosticHistory, saveDiagnosticResult, getGarage } from './services/diagnosticStorage';
import { createDiagnosticJob, processDiagnosticJob } from './services/diagnosticQueue';
import { Activity, BookOpen, Car, CheckCircle, Clock, Database, GitBranch, Loader2, Shield, Wrench, Home, History, AlertCircle } from 'lucide-react';

const workflowSteps = [
  { id: 1, title: 'Vehicle & Symptoms', helper: 'Enter vehicle details and describe the issue thoroughly.' },
  { id: 2, title: 'AI Diagnosis', helper: 'Advanced diagnostic engine analyzes your specific vehicle and symptoms.' },
  { id: 3, title: 'Results', helper: 'Review confidence-scored diagnosis with safety warnings and recommendations.' },
  { id: 4, title: 'History', helper: 'Save the report to your diagnostic history and garage.' }
];

const obdCodes = [
  { code: 'P0137', title: 'Low O2 Sensor Voltage', meaning: 'The oxygen sensor may be reporting too little voltage, often related to exhaust or fuel mixture issues.' },
  { code: 'P0300', title: 'Random Misfire', meaning: 'The engine is misfiring randomly, which may cause shaking, poor power, or flashing warning lights.' },
  { code: 'P0420', title: 'Catalyst Efficiency Low', meaning: 'The catalytic converter system is not cleaning exhaust as expected.' },
  { code: 'P0171', title: 'System Too Lean', meaning: 'The engine may be getting too much air or not enough fuel.' }
];

const systemProblems = {
  engine: { id: 'system_engine', name: 'Engine Concern', description: 'User selected the engine system from the vehicle panel', severity: 'medium', system: 'Engine', affectedParts: ['engine'], estimatedCost: '$100-1200' },
  exhaust: { id: 'system_exhaust', name: 'Exhaust/O2 Sensor Concern', description: 'User selected exhaust or oxygen sensor system from the vehicle panel', severity: 'medium', system: 'Exhaust', affectedParts: ['exhaust', 'sensors'], estimatedCost: '$150-1500' },
  battery: { id: 'system_battery', name: 'Battery/Electrical Concern', description: 'User selected the battery or electrical system from the vehicle panel', severity: 'medium', system: 'Electrical', affectedParts: ['battery', 'alternator'], estimatedCost: '$100-800' },
  wheels: { id: 'system_wheels', name: 'Wheels/Suspension Concern', description: 'User selected wheels or suspension from the vehicle panel', severity: 'medium', system: 'Wheels/Suspension', affectedParts: ['wheels', 'suspension'], estimatedCost: '$80-1200' },
  cooling_system: { id: 'system_cooling', name: 'Cooling System Concern', description: 'User selected the cooling system from the vehicle panel', severity: 'high', system: 'Cooling System', affectedParts: ['cooling_system', 'engine'], estimatedCost: '$100-1500' }
};

// Helper components
function Badge({ icon: Icon, label }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-diagnostic-border bg-diagnostic-surface px-3 py-2 text-diagnostic-muted">
      <Icon className="h-4 w-4 text-diagnostic-red" />
      <span>{label}</span>
    </div>
  );
}

function ObdCodePanel() {
  return (
    <section className="card-sharp rounded-2xl p-5 shadow-red-edge-lg">
      <h2 className="mb-2 flex items-center text-xl font-bold"><Clock className="mr-2 h-5 w-5 text-diagnostic-red" />Common OBD-II Codes</h2>
      <p className="mb-4 text-sm text-diagnostic-muted">These examples help explain how onboard diagnostics connect symptoms to repair research.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {obdCodes.map(item => (
          <article key={item.code} className="rounded-xl border border-neutral-800 bg-diagnostic-surface p-4">
            <h3 className="font-bold text-diagnostic-red">{item.code}: {item.title}</h3>
            <p className="mt-2 text-sm text-diagnostic-muted">{item.meaning}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function HistoryPanel({ history, onDelete, onClear }) {
  return (
    <section className="card-sharp rounded-2xl p-5 shadow-red-edge-lg">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Diagnostic History</h2>
          <p className="text-sm text-diagnostic-muted">Saved reports are stored in localStorage as a simple browser database.</p>
        </div>
        {history.length > 0 && <button onClick={onClear} className="rounded-lg border border-diagnostic-border px-4 py-2 text-sm text-diagnostic-red hover:bg-red-950/20">Clear History</button>}
      </div>
      {history.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-diagnostic-surface p-6 text-center text-diagnostic-muted">No saved diagnostic reports yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {history.map(item => (
            <article key={item.id} className="rounded-xl border border-neutral-800 bg-diagnostic-surface p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-diagnostic-red">{item.vehicle.year} {item.vehicle.make} {item.vehicle.model}</h3>
                  <p className="text-sm text-diagnostic-muted">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
                <span className="rounded-full border border-green-500 px-2 py-1 text-xs text-green-300">{item.status}</span>
              </div>
              <p className="font-semibold">{item.problem?.name || 'Diagnostic Report'}</p>
              <p className="mt-2 line-clamp-3 text-sm text-diagnostic-muted">{item.diagnosis?.summary || item.diagnosis?.diagnosis || 'No summary available'}</p>
              <button onClick={() => onDelete(item.id)} className="mt-4 text-sm text-diagnostic-red hover:text-red-300">Delete report</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function App() {
  const [carInfo, setCarInfo] = useState({ year: '', make: '', model: '' });
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [highlightedPart, setHighlightedPart] = useState(null);
  const [history, setHistory] = useState([]);
  const [garage, setGarage] = useState([]);
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [activeTab, setActiveTab] = useState('diagnostic');

  const environment = process.env.REACT_APP_ENV || 'development';

  useEffect(() => {
    setHistory(getDiagnosticHistory());
    setGarage(getGarage());
  }, []);

  const currentStep = useMemo(() => {
    if (diagnosticResults) return 3;
    if (job?.status === 'queued' || job?.status === 'processing') return 2;
    if (carInfo.symptoms && carInfo.severity) return 2;
    if (carInfo.year && carInfo.make && carInfo.model) return 1;
    return 1;
  }, [carInfo, diagnosticResults, job]);

  const handleSystemSelect = (systemId) => {
    setHighlightedPart(systemId);
    if (systemProblems[systemId]) {
      setSelectedProblem(systemProblems[systemId]);
      setError('');
    }
  };

  const validateForm = () => {
    if (!carInfo.year || !carInfo.make || !carInfo.model) {
      return 'Please complete the vehicle information (year, make, and model).';
    }
    if (!carInfo.symptoms) {
      return 'Please describe the symptoms you are experiencing.';
    }
    if (!carInfo.severity) {
      return 'Please select the severity level of the issue.';
    }
    return '';
  };

  const handleDiagnostic = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setError('');
    setSavedMessage('');
    setDiagnosticResults(null);

    const queuedJob = createDiagnosticJob(carInfo, selectedProblem);
    setJob(queuedJob);

    const completedJob = await processDiagnosticJob(queuedJob, setJob);

    if (completedJob?.status === 'completed' && completedJob.diagnosis) {
      setDiagnosticResults(completedJob.diagnosis);
      setHighlightedPart(completedJob.diagnosis?.affectedParts?.[0] || selectedProblem.affectedParts?.[0]);
    } else {
      setError('The diagnostic job failed. Please try again or check your API configuration.');
    }
  };

  const handleSaveResult = () => {
    if (!diagnosticResults) return;

    const record = saveDiagnosticResult({
      id: job?.id,
      vehicle: carInfo,
      problem: selectedProblem,
      diagnosis: diagnosticResults,
      status: 'completed'
    });

    setHistory(getDiagnosticHistory());
    setSavedMessage(`Saved diagnostic report for ${record.vehicle.year} ${record.vehicle.make} ${record.vehicle.model}.`);
  };

  const handleDeleteHistory = (id) => {
    setHistory(deleteDiagnosticResult(id));
  };

  const handleClearHistory = () => {
    setHistory(clearDiagnosticHistory());
  };

  const resetDiagnostic = () => {
    setCarInfo({ year: '', make: '', model: '' });
    setSelectedProblem(null);
    setDiagnosticResults(null);
    setHighlightedPart(null);
    setJob(null);
    setError('');
    setSavedMessage('');
  };

  const isRunning = job?.status === 'queued' || job?.status === 'processing';

  // Tab components
  const DiagnosticTab = () => (
    <div className="space-y-8">
      <section className="card-sharp rounded-2xl p-5 shadow-red-edge-lg">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Step-by-Step Diagnostic Workflow</h2>
            <p className="text-sm text-diagnostic-muted">Follow the steps below for an advanced diagnostic report.</p>
          </div>
          <span className="rounded-full border border-diagnostic-border px-3 py-1 text-xs uppercase text-diagnostic-red">Step {currentStep} of 4</span>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {workflowSteps.map(step => (
            <div key={step.id} className={`rounded-xl border p-3 ${currentStep >= step.id ? 'border-diagnostic-red bg-red-950/20' : 'border-neutral-800 bg-diagnostic-surface'}`}>
              <div className="mb-2 flex items-center gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${currentStep >= step.id ? 'bg-diagnostic-red text-white' : 'bg-neutral-800 text-diagnostic-muted'}`}>{step.id}</span>
                <h3 className="font-semibold">{step.title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-diagnostic-muted">{step.helper}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_1.15fr]">
        <section className="space-y-6">
          <div className="card-sharp rounded-2xl p-5 shadow-red-edge-lg">
            <h2 className="mb-2 flex items-center text-xl font-bold"><Car className="mr-2 h-5 w-5 text-diagnostic-red" />Vehicle Systems</h2>
            <p className="mb-4 text-sm text-diagnostic-muted">Rotate the 3D view or choose a labeled system below to highlight components.</p>
            <CarViewer highlightedPart={highlightedPart} onSystemSelect={handleSystemSelect} />
          </div>

          <ObdCodePanel />
        </section>

        <section className="space-y-6">
          <div className="card-sharp rounded-2xl p-5 shadow-red-edge-lg">
            <h2 className="mb-1 flex items-center text-xl font-bold"><Wrench className="mr-2 h-5 w-5 text-diagnostic-red" />Step 1: Vehicle & Symptoms</h2>
            <p className="mb-4 text-sm text-diagnostic-muted">Enter detailed vehicle information and symptoms for accurate diagnosis.</p>
            <DiagnosticForm carInfo={carInfo} setCarInfo={setCarInfo} />
          </div>

          {error && <div role="alert" className="rounded-xl border border-red-500 bg-red-950/40 p-4 text-sm text-red-200">{error}</div>}
          {savedMessage && <div className="rounded-xl border border-green-500 bg-green-950/30 p-4 text-sm text-green-200">{savedMessage}</div>}

          <div className="card-sharp rounded-2xl p-5 shadow-red-edge-lg">
            <h2 className="mb-1 flex items-center text-xl font-bold"><Activity className="mr-2 h-5 w-5 text-diagnostic-red" />Step 2: Run AI Diagnosis</h2>
            <p className="mb-4 text-sm text-diagnostic-muted">Advanced diagnostic engine analyzes your vehicle, symptoms, and NHTSA data.</p>
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              {['queued', 'processing', 'completed'].map(status => (
                <div key={status} className={`rounded-lg border p-3 text-center text-sm capitalize ${job?.status === status || (status === 'completed' && diagnosticResults) ? 'border-diagnostic-red bg-red-950/20 text-white' : 'border-neutral-800 bg-diagnostic-surface text-diagnostic-muted'}`}>{status}</div>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={handleDiagnostic} disabled={isRunning} className="btn-sharp flex flex-1 items-center justify-center rounded-lg bg-diagnostic-accent px-6 py-3 font-semibold text-diagnostic-bg hover:bg-diagnostic-text disabled:cursor-not-allowed disabled:opacity-60">
                {isRunning ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
                {isRunning ? 'AI Diagnosis Running...' : 'Run AI Diagnosis'}
              </button>
              <button onClick={resetDiagnostic} className="btn-sharp rounded-lg bg-diagnostic-surface px-6 py-3 font-semibold text-diagnostic-text hover:bg-diagnostic-bg">Start New Diagnosis</button>
            </div>
          </div>
        </section>
      </div>

      {diagnosticResults && (
        <section className="card-sharp rounded-2xl p-5 shadow-red-edge-lg">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Step 3: Diagnosis Results</h2>
              <p className="text-sm text-diagnostic-muted">Confidence-scored diagnosis with safety warnings and recommendations.</p>
            </div>
            <button onClick={handleSaveResult} className="btn-sharp rounded-lg bg-diagnostic-red px-5 py-2 font-semibold text-white hover:bg-red-700">Save Result to History</button>
          </div>
          <DiagnosticResults results={diagnosticResults} />
        </section>
      )}
    </div>
  );

  const GarageTab = () => (
    <div className="space-y-6">
      <div className="card-sharp rounded-2xl p-5 shadow-red-edge-lg">
        <h2 className="text-xl font-bold mb-4">My Garage</h2>
        {garage.length === 0 ? (
          <div className="text-center py-8">
            <Home className="mx-auto h-12 w-12 text-diagnostic-muted mb-4" />
            <p className="text-diagnostic-muted">No vehicles in your garage yet.</p>
            <p className="text-sm text-diagnostic-muted">Complete a diagnostic to automatically save your vehicle.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {garage.map(vehicle => (
              <div key={vehicle.id} className="rounded-xl border border-neutral-800 bg-diagnostic-surface p-4">
                <h3 className="font-semibold text-diagnostic-red">{vehicle.nickname}</h3>
                <p className="text-sm text-diagnostic-text">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                {vehicle.mileage && <p className="text-xs text-diagnostic-muted">{parseInt(vehicle.mileage).toLocaleString()} miles</p>}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-diagnostic-muted">{vehicle.diagnosticCount || 0} diagnostics</span>
                  <span className="text-xs text-diagnostic-muted">Updated: {new Date(vehicle.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const HistoryTab = () => (
    <HistoryPanel history={history} onDelete={handleDeleteHistory} onClear={handleClearHistory} />
  );

  return (
    <div className="min-h-screen bg-diagnostic-bg text-diagnostic-text">
      {/* Header */}
      <header className="border-b border-diagnostic-border bg-gradient-to-r from-black via-diagnostic-surface to-black">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-diagnostic-border bg-diagnostic-surface p-3 shadow-red-edge">
                <Car className="h-8 w-8 text-diagnostic-red" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">AI Car Diagnostic Tool</h1>
                <p className="text-sm text-diagnostic-muted">Advanced diagnostics with NHTSA data, confidence scoring, and vehicle history tracking.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <Badge icon={Database} label="Smart Storage" />
              <Badge icon={Activity} label="Confidence Scoring" />
              <Badge icon={GitBranch} label="NHTSA Data" />
              <Badge icon={Shield} label="Safety Focused" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-diagnostic-border bg-diagnostic-surface">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('diagnostic')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'diagnostic'
                  ? 'border-diagnostic-red text-diagnostic-red'
                  : 'border-transparent text-diagnostic-muted hover:text-diagnostic-text'
              }`}
            >
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Diagnostic
              </div>
            </button>
            <button
              onClick={() => setActiveTab('garage')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'garage'
                  ? 'border-diagnostic-red text-diagnostic-red'
                  : 'border-transparent text-diagnostic-muted hover:text-diagnostic-text'
              }`}
            >
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                My Garage ({garage.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'history'
                  ? 'border-diagnostic-red text-diagnostic-red'
                  : 'border-transparent text-diagnostic-muted hover:text-diagnostic-text'
              }`}
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History ({history.length})
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto space-y-8 px-4 py-8">
        {activeTab === 'diagnostic' && <DiagnosticTab />}
        {activeTab === 'garage' && <GarageTab />}
        {activeTab === 'history' && <HistoryTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-diagnostic-border bg-diagnostic-surface px-4 py-5 text-center text-sm text-diagnostic-muted">
        Environment: <span className="font-semibold uppercase text-diagnostic-red">{environment}</span> | 
        Powered by NHTSA APIs & Advanced AI | 
        Confidential & Secure
      </footer>
    </div>
  );
}

export default App;
