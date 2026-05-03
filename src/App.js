import React, { useState } from 'react';
import './App.css';
import CarViewer from './components/CarViewer';
import DiagnosticForm from './components/DiagnosticForm';
import ProblemSelector from './components/ProblemSelector';
import DiagnosticResults from './components/DiagnosticResults';
import { Car, Wrench, CheckCircle } from 'lucide-react';

function App() {
  const [carInfo, setCarInfo] = useState({
    year: '',
    make: '',
    model: ''
  });
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [highlightedPart, setHighlightedPart] = useState(null);

  const handleDiagnostic = async () => {
    if (!carInfo.year || !carInfo.make || !carInfo.model || !selectedProblem) {
      alert('Please fill in all car information and select a problem');
      return;
    }

    // Simulate API call - replace with actual OpenRouter integration
    const mockResults = {
      problem: selectedProblem,
      diagnosis: `Based on the symptoms of ${selectedProblem.name} in your ${carInfo.year} ${carInfo.make} ${carInfo.model}, the issue appears to be related to the ${selectedProblem.system}.`,
      affectedParts: selectedProblem.affectedParts,
      recommendations: [
        'Check the related components for wear and tear',
        'Inspect fluid levels if applicable',
        'Consider professional inspection if symptoms persist'
      ],
      severity: selectedProblem.severity,
      estimatedCost: selectedProblem.estimatedCost
    };

    setDiagnosticResults(mockResults);
    setHighlightedPart(selectedProblem.affectedParts[0]);
  };

  const resetDiagnostic = () => {
    setCarInfo({ year: '', make: '', model: '' });
    setSelectedProblem(null);
    setDiagnosticResults(null);
    setHighlightedPart(null);
  };

  return (
    <div className="min-h-screen bg-diagnostic-bg text-diagnostic-text">
      <header className="bg-diagnostic-surface shadow-lg border-b border-diagnostic-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Car className="w-8 h-8 text-diagnostic-red" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-diagnostic-text to-diagnostic-red bg-clip-text text-transparent">
                Car Diagnostic Tool
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-diagnostic-muted">
              <Wrench className="w-4 h-4" />
              <span>Empowering Car Enthusiasts</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - 3D Car Viewer */}
          <div className="card-sharp rounded-xl shadow-red-edge-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Car className="w-5 h-5 mr-2 text-diagnostic-red" />
              3D Vehicle View
            </h2>
            <CarViewer highlightedPart={highlightedPart} />
            {highlightedPart && (
              <div className="mt-4 p-3 bg-diagnostic-surface border border-diagnostic-border rounded-lg">
                <p className="text-diagnostic-red text-sm font-medium">
                  <span className="font-semibold">Highlighted:</span> {highlightedPart}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Diagnostic Interface */}
          <div className="space-y-6">
            {/* Car Information Form */}
            <div className="card-sharp rounded-xl shadow-red-edge-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-diagnostic-red" />
                Vehicle Information
              </h2>
              <DiagnosticForm carInfo={carInfo} setCarInfo={setCarInfo} />
            </div>

            {/* Problem Selection */}
            {carInfo.year && carInfo.make && carInfo.model && (
              <div className="card-sharp rounded-xl shadow-red-edge-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Wrench className="w-5 h-5 mr-2 text-diagnostic-red" />
                  Select Problem
                </h2>
                <ProblemSelector 
                  selectedProblem={selectedProblem} 
                  setSelectedProblem={setSelectedProblem} 
                />
              </div>
            )}

            {/* Action Buttons */}
            {selectedProblem && (
              <div className="flex space-x-4">
                <button
                  onClick={handleDiagnostic}
                  className="flex-1 btn-sharp bg-diagnostic-accent text-diagnostic-bg font-semibold py-3 px-6 rounded-lg flex items-center justify-center hover:bg-diagnostic-text"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Run Diagnostic
                </button>
                <button
                  onClick={resetDiagnostic}
                  className="btn-sharp bg-diagnostic-surface text-diagnostic-text font-semibold py-3 px-6 rounded-lg hover:bg-diagnostic-bg"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Diagnostic Results */}
            {diagnosticResults && (
              <div className="card-sharp rounded-xl shadow-red-edge-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  Diagnostic Results
                </h2>
                <DiagnosticResults results={diagnosticResults} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
