import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import CarViewer from './components/CarViewer';
import DiagnosticForm from './components/DiagnosticForm';
import ProblemSelector from './components/ProblemSelector';
import DiagnosticResults from './components/DiagnosticResults';
import { clearDiagnosticHistory, deleteDiagnosticResult, getDiagnosticHistory, saveDiagnosticResult } from './services/diagnosticStorage';
import { createDiagnosticJob, processDiagnosticJob } from './services/diagnosticQueue';
import { Activity, BookOpen, Car, CheckCircle, Clock, Database, GitBranch, Loader2, Shield, Wrench } from 'lucide-react';

const workflowSteps = [
  { id: 1, title: 'Vehicle', helper: 'Select the year, make, and model so the AI has context.' },
  { id: 2, title: 'Symptoms', helper: 'Pick the closest problem or use a system label from the vehicle panel.' },
  { id: 3, title: 'AI Diagnosis', helper: 'Submit a queue job and let OpenRouter analyze the issue.' },
  { id: 4, title: 'Results', helper: 'Review severity, checks, safety warnings, and OBD-II codes.' },
  { id: 5, title: 'History', helper: 'Save the report to the local browser database.' }
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

function App() {
  const [carInfo, setCarInfo] = useState({ year: '', make: '', model: '' });
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [highlightedPart, setHighlightedPart] = useState(null);
  const [history, setHistory] = useState([]);
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const environment = process.env.REACT_APP_ENV || 'development';

  useEffect(() => {
    setHistory(getDiagnosticHistory());
  }, []);

  const currentStep = useMemo(() => {
    if (diagnosticResults) return 4;
    if (job?.status === 'queued' || job?.status === 'processing') return 3;
    if (selectedProblem) return 3;
    if (carInfo.year && carInfo.make && carInfo.model) return 2;
    return 1;
  }, [carInfo, selectedProblem, diagnosticResults, job]);

  const handleSystemSelect = (systemId) => {
    setHighlightedPart(systemId);
    if (systemProblems[systemId]) {
      setSelectedProblem(systemProblems[systemId]);
      setError('');
    }
  };

  const validateForm = () => {
    if (!carInfo.year || !carInfo.make || !carInfo.model) {
      return 'Please complete Step 1 by selecting the vehicle year, make, and model.';
    }
    if (!selectedProblem) {
      return 'Please complete Step 2 by selecting a symptom or vehicle system.';
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

  return (
    <div className="min-h-screen bg-diagnostic-bg text-diagnostic-text">
      <header className="border-b border-diagnostic-border bg-gradient-to-r from-black via-diagnostic-surface to-black">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-diagnostic-border bg-diagnostic-surface p-3 shadow-red-edge">
                <Car className="h-8 w-8 text-diagnostic-red" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">AI Car Diagnostic Tool</h1>
                <p className="text-sm text-diagnostic-muted">Guided diagnostics, local database history, queue simulation, and OpenRouter LLM analysis.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <Badge icon={Database} label="localStorage DB" />
              <Badge icon={Activity} label="Queue Workflow" />
              <Badge icon={GitBranch} label="CI/CD Ready" />
              <Badge icon={Shield} label="Env Secured" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-8 px-4 py-8">
        <section className="card-sharp rounded-2xl p-5 shadow-red-edge-lg">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Step-by-Step Diagnostic Workflow</h2>
              <p className="text-sm text-diagnostic-muted">Follow the five steps below for a beginner-friendly diagnostic report.</p>
            </div>
            <span className="rounded-full border border-diagnostic-border px-3 py-1 text-xs uppercase text-diagnostic-red">Step {currentStep} of 5</span>
          </div>
          <div className="grid gap-3 md:grid-cols-5">
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
              <p className="mb-4 text-sm text-diagnostic-muted">Rotate the 3D view or choose a labeled system below to auto-select a symptom category.</p>
              <CarViewer highlightedPart={highlightedPart} onSystemSelect={handleSystemSelect} />
            </div>

            <ObdCodePanel />
          </section>

          <section className="space-y-6">
            <div className="card-sharp rounded-2xl p-5 shadow-red-edge-lg">
              <h2 className="mb-1 flex items-center text-xl font-bold"><Wrench className="mr-2 h-5 w-5 text-diagnostic-red" />Step 1: Vehicle Information</h2>
              <p className="mb-4 text-sm text-diagnostic-muted">Select basic vehicle information. This helps the AI tailor the diagnosis.</p>
              <DiagnosticForm carInfo={carInfo} setCarInfo={setCarInfo} />
            </div>

            <div className="card-sharp rounded-2xl p-5 shadow-red-edge-lg">
              <h2 className="mb-1 flex items-center text-xl font-bold"><BookOpen className="mr-2 h-5 w-5 text-diagnostic-red" />Step 2: Symptoms or Problem</h2>
              <p className="mb-4 text-sm text-diagnostic-muted">Choose the closest symptom. If you are unsure, click a system in the vehicle panel.</p>
              <ProblemSelector selectedProblem={selectedProblem} setSelectedProblem={setSelectedProblem} />
            </div>

            {error && <div role="alert" className="rounded-xl border border-red-500 bg-red-950/40 p-4 text-sm text-red-200">{error}</div>}
            {savedMessage && <div className="rounded-xl border border-green-500 bg-green-950/30 p-4 text-sm text-green-200">{savedMessage}</div>}

            <div className="card-sharp rounded-2xl p-5 shadow-red-edge-lg">
              <h2 className="mb-1 flex items-center text-xl font-bold"><Activity className="mr-2 h-5 w-5 text-diagnostic-red" />Step 3: Run AI Diagnosis</h2>
              <p className="mb-4 text-sm text-diagnostic-muted">Submitting creates a simulated queue job: Queued ? Processing ? Completed.</p>
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
                <h2 className="text-xl font-bold">Step 4: Diagnosis Results</h2>
                <p className="text-sm text-diagnostic-muted">Structured LLM output displayed as presentation-friendly cards.</p>
              </div>
              <button onClick={handleSaveResult} className="btn-sharp rounded-lg bg-diagnostic-red px-5 py-2 font-semibold text-white hover:bg-red-700">Save Result to History</button>
            </div>
            <DiagnosticResults results={diagnosticResults} />
          </section>
        )}

        <HistoryPanel history={history} onDelete={handleDeleteHistory} onClear={handleClearHistory} />
      </main>

      <footer className="border-t border-diagnostic-border bg-diagnostic-surface px-4 py-5 text-center text-sm text-diagnostic-muted">
        Environment: <span className="font-semibold uppercase text-diagnostic-red">{environment}</span> | API keys load from <code>process.env.REACT_APP_OPENROUTER_API_KEY</code> | Development / Staging / Production ready
      </footer>
    </div>
  );
}

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
          <h2 className="text-xl font-bold">Step 5: Diagnostic History</h2>
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
              <p className="font-semibold">{item.problem.name}</p>
              <p className="mt-2 line-clamp-3 text-sm text-diagnostic-muted">{item.diagnosis.diagnosis}</p>
              <button onClick={() => onDelete(item.id)} className="mt-4 text-sm text-diagnostic-red hover:text-red-300">Delete report</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default App;
