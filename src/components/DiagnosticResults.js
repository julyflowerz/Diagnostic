import React from 'react';
import { AlertTriangle, CheckCircle, DollarSign, Clock, Wrench, Info } from 'lucide-react';

function DiagnosticResults({ results }) {
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-400" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'high': return 'Immediate attention required';
      case 'medium': return 'Should be addressed soon';
      case 'low': return 'Routine maintenance';
      default: return 'Unknown severity';
    }
  };

  return (
    <div className="space-y-6">
      {/* Problem Summary */}
      <div className="p-4 bg-diagnostic-surface rounded-lg border border-diagnostic-border">
        <h3 className="font-semibold text-diagnostic-text mb-2 flex items-center">
          <Wrench className="w-4 h-4 mr-2 text-diagnostic-red" />
          Problem Identified
        </h3>
        <p className="text-lg font-medium text-diagnostic-red mb-1">
          {results.problem.name}
        </p>
        <p className="text-sm text-diagnostic-muted">
          System: {results.problem.system}
        </p>
      </div>

      {/* Diagnosis */}
      <div className="p-4 bg-diagnostic-surface rounded-lg border border-diagnostic-border">
        <h3 className="font-semibold text-diagnostic-text mb-3">Diagnosis</h3>
        <p className="text-diagnostic-text leading-relaxed">
          {results.diagnosis}
        </p>
      </div>

      {/* Affected Parts */}
      <div className="p-4 bg-diagnostic-surface rounded-lg border border-diagnostic-border">
        <h3 className="font-semibold text-diagnostic-text mb-3">Affected Components</h3>
        <div className="flex flex-wrap gap-2">
          {results.affectedParts.map((part, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-diagnostic-bg text-diagnostic-red border border-diagnostic-red rounded-full text-sm"
            >
              {part.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          ))}
        </div>
      </div>

      {/* Severity Assessment */}
      <div className={`p-4 rounded-lg border ${getSeverityColor(results.severity)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getSeverityIcon(results.severity)}
            <div className="ml-3">
              <h3 className="font-semibold">Severity Assessment</h3>
              <p className="text-sm mt-1">{getSeverityText(results.severity)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Estimate */}
      <div className="p-4 bg-diagnostic-surface rounded-lg border border-diagnostic-border">
        <h3 className="font-semibold text-diagnostic-text mb-3 flex items-center">
          <DollarSign className="w-4 h-4 mr-2 text-green-400" />
          Cost Estimate
        </h3>
        <p className="text-2xl font-bold text-green-400 mb-1">
          {results.estimatedCost}
        </p>
        <p className="text-sm text-diagnostic-muted">
          *Estimated range for parts and labor. Actual costs may vary.
        </p>
      </div>

      {/* Recommendations */}
      <div className="p-4 bg-diagnostic-surface rounded-lg border border-diagnostic-border">
        <h3 className="font-semibold text-diagnostic-text mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-diagnostic-red" />
          Recommended Actions
        </h3>
        <ul className="space-y-2">
          {results.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-diagnostic-text text-sm">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* DIY Safety Warning */}
      <div className="p-4 bg-diagnostic-bg border border-yellow-400 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-yellow-400 mb-1">DIY Safety Notice</h4>
            <p className="text-sm text-diagnostic-text leading-relaxed">
              While this diagnostic tool provides helpful guidance, always prioritize safety. 
              If you're unsure about any repair procedure, consult a professional mechanic. 
              Some repairs require specialized tools and knowledge.
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="p-4 bg-diagnostic-surface border border-diagnostic-border rounded-lg">
        <h3 className="font-semibold text-diagnostic-red mb-2">Next Steps</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <button className="btn-sharp bg-diagnostic-accent text-diagnostic-bg font-medium py-2 px-4 rounded-lg text-sm hover:bg-diagnostic-text">
            Find Local Mechanic
          </button>
          <button className="btn-sharp bg-diagnostic-surface text-diagnostic-text font-medium py-2 px-4 rounded-lg text-sm hover:bg-diagnostic-bg">
            Order Parts Online
          </button>
          <button className="btn-sharp bg-diagnostic-surface text-diagnostic-text font-medium py-2 px-4 rounded-lg text-sm hover:bg-diagnostic-bg">
            Save Diagnostic Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiagnosticResults;
