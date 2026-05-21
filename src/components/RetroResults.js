import React from 'react';

const RetroResults = ({ diagnosticResults, queueStatus }) => {
  return (
    <div className="pixel-card">
      <h2>SCAN RESULTS</h2>
      <div id="resultsPanel" className="results-panel">
        {diagnosticResults ? (
          <div className="small-text">
            <div className="mb-3">
              <span style={{ color: 'var(--retro-amber)' }}>DIAGNOSIS:</span>
              <p className="mt-2">{diagnosticResults.diagnosis}</p>
            </div>
            
            {diagnosticResults.severity && (
              <div className="mb-3">
                <span style={{ color: 'var(--retro-amber)' }}>SEVERITY:</span>
                <span className={`ms-2 status-${diagnosticResults.severity.toLowerCase()}`}>
                  {diagnosticResults.severity.toUpperCase()}
                </span>
              </div>
            )}
            
            {diagnosticResults.affectedParts && diagnosticResults.affectedParts.length > 0 && (
              <div className="mb-3">
                <span style={{ color: 'var(--retro-amber)' }}>AFFECTED PARTS:</span>
                <ul className="mt-2 mb-0">
                  {diagnosticResults.affectedParts.map((part, index) => (
                    <li key={index}>{part}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {diagnosticResults.recommendations && (
              <div className="mb-3">
                <span style={{ color: 'var(--retro-amber)' }}>RECOMMENDATIONS:</span>
                <ul className="mt-2 mb-0">
                  {diagnosticResults.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {diagnosticResults.estimatedCost && (
              <div className="mb-3">
                <span style={{ color: 'var(--retro-amber)' }}>ESTIMATED COST:</span>
                <span className="ms-2">{diagnosticResults.estimatedCost}</span>
              </div>
            )}
            
            {diagnosticResults.obdCodes && diagnosticResults.obdCodes.length > 0 && (
              <div className="mb-3">
                <span style={{ color: 'var(--retro-amber)' }}>OBD-II CODES:</span>
                <ul className="mt-2 mb-0">
                  {diagnosticResults.obdCodes.map((code, index) => (
                    <li key={index}>
                      <span style={{ color: 'var(--retro-green)' }}>{code.code}</span>: {code.meaning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="small-text">Run a scan to see the diagnosis.</p>
        )}
      </div>
    </div>
  );
};

export default RetroResults;
