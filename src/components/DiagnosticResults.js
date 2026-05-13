import React from 'react';
import { AlertTriangle, CheckCircle, DollarSign, Gauge, ListChecks, Route, ShieldAlert, Wrench, TrendingUp, Brain, Target } from 'lucide-react';

const formatPart = (part) => part?.replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase());

function DiagnosticResults({ results }) {
  const severityClass = {
    high: 'border-red-500 bg-red-950/30 text-red-200',
    medium: 'border-yellow-500 bg-yellow-950/30 text-yellow-200',
    low: 'border-green-500 bg-green-950/30 text-green-200'
  }[results.severity] || 'border-neutral-700 bg-diagnostic-surface text-diagnostic-text';

  const confidenceClass = {
    high: 'border-green-500 bg-green-950/30 text-green-200',
    medium: 'border-yellow-500 bg-yellow-950/30 text-yellow-200',
    low: 'border-orange-500 bg-orange-950/30 text-orange-200',
    very_low: 'border-red-500 bg-red-950/30 text-red-200'
  }[results.confidenceLevel] || 'border-neutral-700 bg-diagnostic-surface text-diagnostic-text';

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    if (confidence >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-5">
      {/* Confidence and Primary Diagnosis */}
      {results.primaryDiagnosis && (
        <div className="grid gap-4 lg:grid-cols-2">
          <MetricCard 
            icon={Brain} 
            title="Confidence" 
            value={`${results.confidence || 0}%`} 
            className={confidenceClass}
          />
          <MetricCard 
            icon={Target} 
            title="Primary Diagnosis" 
            value={results.primaryDiagnosis.name || 'Unknown'} 
            className="border-diagnostic-red bg-red-950/20 text-diagnostic-red"
          />
        </div>
      )}

      {/* Traditional Metrics */}
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard icon={Gauge} title="Severity" value={results.severity || 'unknown'} className={severityClass} />
        <MetricCard icon={DollarSign} title="Estimated Cost" value={results.estimatedCost || 'Varies'} />
        <MetricCard icon={Route} title="Drive Advice" value={results.driveAdvice || 'drive cautiously'} />
      </div>

      {/* Diagnosis Summary with Confidence */}
      <ResultCard icon={Wrench} title="Diagnosis Summary">
        <div className="space-y-3">
          <p className="leading-relaxed text-diagnostic-text">{results.summary || results.diagnosis}</p>
          {results.confidence && (
            <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-diagnostic-bg p-3">
              <span className="text-sm font-medium text-diagnostic-text">Diagnostic Confidence</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-neutral-800">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{ width: `${results.confidence}%` }}
                  />
                </div>
                <span className={`font-bold ${getConfidenceColor(results.confidence)}`}>
                  {results.confidence}%
                </span>
              </div>
            </div>
          )}
        </div>
      </ResultCard>

      {results.commonProblems && results.commonProblems.length > 0 && (
        <ResultCard icon={TrendingUp} title="Common Problems for This Vehicle">
          <div className="space-y-3">
            {results.commonProblems.map((problem, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border border-neutral-800 bg-diagnostic-bg p-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-diagnostic-red">{problem.problem}</h4>
                  <p className="text-sm text-diagnostic-muted">{problem.symptoms.join(', ')}</p>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-lg font-bold text-diagnostic-red">{problem.likelihood}%</div>
                  <div className="text-xs text-diagnostic-muted">likelihood</div>
                </div>
              </div>
            ))}
          </div>
        </ResultCard>
      )}

      {results.repairPricing && (
        <ResultCard icon={DollarSign} title="Real Mechanic Average Pricing">
          <div className="space-y-2">
            <p className="text-lg font-bold text-diagnostic-red">{results.repairPricing.title}</p>
            <p className="text-sm text-diagnostic-muted">
              Source: {results.repairPricing.source} • Currency: {results.repairPricing.currency}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <PriceBox label="Low" value={results.repairPricing.low} />
              <PriceBox label="Average" value={results.repairPricing.average} />
              <PriceBox label="High" value={results.repairPricing.high} />
            </div>
          </div>
        </ResultCard>
      )}

      {/* Possible Causes with Confidence Scores */}
      {results.possibleCauses && results.possibleCauses.length > 0 && (
        <ResultCard icon={AlertTriangle} title="Possible Causes (Ranked by Confidence)">
          <div className="space-y-3">
            {results.possibleCauses.map((cause, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border border-neutral-800 bg-diagnostic-bg p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-diagnostic-red">{cause.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      cause.confidence >= 80 ? 'border-green-500 bg-green-950/30 text-green-300' :
                      cause.confidence >= 60 ? 'border-yellow-500 bg-yellow-950/30 text-yellow-300' :
                      cause.confidence >= 40 ? 'border-orange-500 bg-orange-950/30 text-orange-300' :
                      'border-red-500 bg-red-950/30 text-red-300'
                    }`}>
                      {cause.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-diagnostic-muted mt-1">{cause.reasoning}</p>
                  {cause.symptoms && cause.symptoms.length > 0 && (
                    <p className="text-xs text-diagnostic-muted mt-1">
                      Symptoms: {cause.symptoms.join(', ')}
                    </p>
                  )}
                </div>
                <div className="ml-4 text-right">
                  <div className={`text-lg font-bold ${getConfidenceColor(cause.confidence)}`}>
                    #{index + 1}
                  </div>
                  <div className="text-xs text-diagnostic-muted">rank</div>
                </div>
              </div>
            ))}
          </div>
        </ResultCard>
      )}

      {/* Recommendations and Next Steps */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ResultList icon={ListChecks} title="Recommended Checks" items={results.recommendations || results.recommendedChecks} />
        <ResultList icon={CheckCircle} title="Repair Recommendations" items={results.recommendations} />
      </div>

      {/* Safety Concerns */}
      {results.safetyConcerns && results.safetyConcerns.length > 0 && (
        <ResultList icon={ShieldAlert} title="Safety Concerns" items={results.safetyConcerns} warning />
      )}

      {/* Next Steps */}
      {results.nextSteps && results.nextSteps.length > 0 && (
        <ResultList icon={Target} title="Next Steps" items={results.nextSteps} />
      )}
    </div>
  );
}

function MetricCard({ icon: Icon, title, value, className = 'border-neutral-800 bg-diagnostic-surface text-diagnostic-text' }) {
  return (
    <article className={`rounded-xl border p-4 ${className}`}>
      <Icon className="mb-3 h-6 w-6 text-diagnostic-red" />
      <p className="text-xs uppercase tracking-wide text-diagnostic-muted">{title}</p>
      <p className="mt-1 text-xl font-black capitalize">{value}</p>
    </article>
  );
}

function ResultCard({ icon: Icon, title, children }) {
  return (
    <article className="rounded-xl border border-neutral-800 bg-diagnostic-surface p-4">
      <h3 className="mb-3 flex items-center font-bold"><Icon className="mr-2 h-5 w-5 text-diagnostic-red" />{title}</h3>
      {children}
    </article>
  );
}

function PriceBox({ label, value }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-diagnostic-bg p-3">
      <p className="text-xs uppercase tracking-wide text-diagnostic-muted">{label}</p>
      <p className="text-xl font-black text-diagnostic-text">${value}</p>
    </div>
  );
}

function ResultList({ icon: Icon, title, items = [], warning = false, showLikelihood = false }) {
  return (
    <ResultCard icon={Icon} title={title}>
      <ul className="space-y-2">
        {items.map((item, index) => {
          // Parse likelihood if present
          let text = item;
          let likelihood = null;
          
          if (showLikelihood && typeof item === 'string') {
            const match = item.match(/^(.+?)\s*-\s*(\d+)%\s*likelihood$/i);
            if (match) {
              text = match[1];
              likelihood = match[2];
            }
          }
          
          return (
            <li key={`${item}-${index}`} className="flex gap-2 text-sm text-diagnostic-text">
              {warning ? <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" /> : <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />}
              <span className="flex-1">{text}</span>
              {likelihood && (
                <span className="flex-shrink-0 rounded-full border border-diagnostic-red bg-red-950/20 px-2 py-1 text-xs font-semibold text-diagnostic-red">
                  {likelihood}%
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </ResultCard>
  );
}

export default DiagnosticResults;
