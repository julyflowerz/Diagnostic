import React from 'react';

const RetroResults = ({ result, carInfo }) => {
  console.log("RetroResults received result:", result);
  console.log("RetroResults received carInfo:", carInfo);
  
  const generatePartSearchLinks = (year, make, model, searchQuery) => {
    const query = encodeURIComponent(`${year} ${make} ${model} ${searchQuery}`);
    return {
      rockauto: `https://www.rockauto.com/`,
      autozone: `https://www.autozone.com/searchresult?searchText=${query}`,
      oreilly: `https://www.oreillyauto.com/search?q=${query}`,
      google: `https://www.google.com/search?tbm=shop&q=${query}` 
    };
  };

  if (!result) {
    console.log("No result - showing empty state");
    return (
      <div className="pixel-card">
        <h2>SCAN RESULTS</h2>
        <div className="text-center py-4">
          <div className="retro-empty-text">NO SCAN RESULTS</div>
          <div className="retro-empty-sub">Run a diagnostic scan to see results</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-card">
      <h2>SCAN RESULTS</h2>
      <div className="results-panel">
        <div className="small-text">
          {/* Diagnosis Summary */}
          <div className="mb-4">
            <span style={{ color: 'var(--retro-amber)' }}>DIAGNOSIS SUMMARY:</span>
            <p className="mt-2">{result.diagnosis}</p>
          </div>
          
          {/* Affected Systems */}
          {result.affectedSystems && result.affectedSystems.length > 0 && (
            <div className="mb-4">
              <span style={{ color: 'var(--retro-amber)' }}>AFFECTED SYSTEMS:</span>
              <div className="mt-2">
                {result.affectedSystems.map((system, index) => (
                  <span key={index} className="retro-tag me-2">
                    {system.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Likely Repairs */}
          {result.likelyRepairs && result.likelyRepairs.length > 0 && (
            <div className="mb-4">
              <span style={{ color: 'var(--retro-amber)' }}>LIKELY REPAIRS:</span>
              <div className="mt-3">
                {result.likelyRepairs.map((repair, index) => (
                  <div key={index} className="retro-part-item mb-3">
                    <div className="part-header">
                      <div className="part-name">{repair.part}</div>
                      <div className="part-costs">
                        <span className="cost-badge diy">DIY: {repair.diyCost}</span>
                        <span className="cost-badge pro">PRO: {repair.mechanicCost}</span>
                        <span className="difficulty-badge">{repair.difficulty}</span>
                      </div>
                    </div>
                    
                    <div className="part-details">
                      <div className="part-recommendation">{repair.recommendation}</div>
                      
                      {/* Part Search Links */}
                      {carInfo.year && carInfo.make && carInfo.model && (
                        <div className="part-links mt-2">
                          <span className="links-label">SEARCH PARTS:</span>
                          <div className="link-buttons">
                            {(() => {
                              const links = generatePartSearchLinks(carInfo.year, carInfo.make, carInfo.model, repair.searchQuery);
                              return (
                                <>
                                  <a href={links.rockauto} target="_blank" rel="noopener noreferrer" className="retro-link">RockAuto</a>
                                  <a href={links.autozone} target="_blank" rel="noopener noreferrer" className="retro-link">AutoZone</a>
                                  <a href={links.oreilly} target="_blank" rel="noopener noreferrer" className="retro-link">O'Reilly</a>
                                  <a href={links.google} target="_blank" rel="noopener noreferrer" className="retro-link">Google Shopping</a>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Cost Estimates */}
          <div className="mb-4">
            <span style={{ color: 'var(--retro-amber)' }}>COST ESTIMATES:</span>
            <div className="mt-2 cost-estimate-grid">
              <div className="cost-item">
                <span className="cost-label">DIY ESTIMATE:</span>
                <span className="cost-value">{result.totalDiyEstimate}</span>
              </div>
              <div className="cost-item">
                <span className="cost-label">PROFESSIONAL:</span>
                <span className="cost-value">{result.totalMechanicEstimate}</span>
              </div>
            </div>
          </div>
          
          {/* Next Steps */}
          {result.nextSteps && result.nextSteps.length > 0 && (
            <div className="mb-4">
              <span style={{ color: 'var(--retro-amber)' }}>RECOMMENDED NEXT STEPS:</span>
              <ul className="mt-2 mb-0">
                {result.nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Disclaimer */}
          <div className="retro-disclaimer">
            <strong>DISCLAIMER:</strong> Estimates are based on common repair ranges. 
            Exact parts should be confirmed by VIN, trim, engine, and inspection. 
            Labor costs vary by location and shop rates.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetroResults;
