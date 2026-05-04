import React from 'react';
import { AlertTriangle, CheckCircle, DollarSign, Gauge, ListChecks, Route, ShieldAlert, Wrench } from 'lucide-react';

const formatPart = (part) => part?.replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase());

function DiagnosticResults({ results }) {
  const severityClass = {
    high: 'border-red-500 bg-red-950/30 text-red-200',
    medium: 'border-yellow-500 bg-yellow-950/30 text-yellow-200',
    low: 'border-green-500 bg-green-950/30 text-green-200'
  }[results.severity] || 'border-neutral-700 bg-diagnostic-surface text-diagnostic-text';

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard icon={Gauge} title="Severity" value={results.severity || 'unknown'} className={severityClass} />
        <MetricCard icon={DollarSign} title="Estimated Cost" value={results.estimatedCost || 'Varies'} />
        <MetricCard icon={Route} title="Drive Advice" value={results.driveAdvice || 'drive cautiously'} />
      </div>

      <ResultCard icon={Wrench} title="Diagnosis Summary">
        <p className="leading-relaxed text-diagnostic-text">{results.diagnosis}</p>
      </ResultCard>

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

      <div className="grid gap-4 lg:grid-cols-2">
        <ResultList icon={AlertTriangle} title="Possible Causes" items={results.possibleCauses} />
        <ResultList icon={ListChecks} title="Recommended Checks" items={results.recommendedChecks} />
        <ResultList icon={CheckCircle} title="Repair Recommendations" items={results.recommendations} />
        <ResultList icon={ShieldAlert} title="Safety Warnings" items={results.safetyWarnings} warning />
      </div>

      <ResultCard icon={Wrench} title="Affected Components">
        <div className="flex flex-wrap gap-2">
          {(results.affectedParts || []).map(part => (
            <span key={part} className="rounded-full border border-diagnostic-red bg-diagnostic-bg px-3 py-1 text-sm text-diagnostic-red">{formatPart(part)}</span>
          ))}
        </div>
      </ResultCard>

      <div className="grid gap-4 md:grid-cols-2">
        <ResultCard icon={Gauge} title="Estimated Difficulty">
          <p className="text-lg font-bold capitalize text-diagnostic-red">{results.estimatedDifficulty || 'moderate'}</p>
        </ResultCard>
        <ResultCard icon={ListChecks} title="Related OBD-II Codes">
          <div className="flex flex-wrap gap-2">
            {(results.relatedObdCodes?.length ? results.relatedObdCodes : ['No specific code returned']).map(code => (
              <span key={code} className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-diagnostic-muted">{code}</span>
            ))}
          </div>
        </ResultCard>
      </div>
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

function ResultList({ icon: Icon, title, items = [], warning = false }) {
  return (
    <ResultCard icon={Icon} title={title}>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-2 text-sm text-diagnostic-text">
            {warning ? <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" /> : <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </ResultCard>
  );
}

export default DiagnosticResults;
