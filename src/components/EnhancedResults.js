import React from 'react';

const EnhancedResults = ({ diagnosticResults, carInfo }) => {
  if (!diagnosticResults) {
    return (
      <div className="pixel-card h-100">
        <h2>DIAGNOSTIC RESULTS</h2>
        <div className="text-center py-5">
          <div className="mb-3">🔧</div>
          <p className="small-text text-muted">
            Complete the diagnostic form to see repair recommendations
          </p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'diy': case 'easy': case 'easy-medium':
        return 'var(--retro-green)';
      case 'medium': case 'hard':
        return 'var(--retro-amber)';
      case 'shop service':
        return '#ff6b35';
      default:
        return 'var(--retro-dim-text)';
    }
  };

  const getPartSearchLinks = (year, make, model, partName) => {
    const query = encodeURIComponent(`${year} ${make} ${model} ${partName}`);

    return {
      rockauto: `https://www.rockauto.com/en/catalog/${make.toLowerCase()},${year}`,
      autozone: `https://www.autozone.com/searchresult?searchText=${query}`,
      oreilly: `https://www.oreillyauto.com/search?q=${query}`,
      google: `https://www.google.com/search?tbm=shop&q=${query}` 
    };
  };

  return (
    <div className="pixel-card h-100">
      <h2>LIKELY REPAIRS</h2>
      
      <div className="mb-3">
        <h5 className="text-warning mb-2">{diagnosticResults.system}</h5>
        <div className="small-text text-muted mb-3">
          Based on: {diagnosticResults.code !== 'NONE' ? `Code ${diagnosticResults.code}` : 'Symptoms & Categories'}
        </div>
      </div>

      <div className="repair-list">
        {diagnosticResults.likelyRepairs && diagnosticResults.likelyRepairs.map((repair, index) => {
          const searchLinks = carInfo?.year && carInfo?.make && carInfo?.model 
            ? getPartSearchLinks(carInfo.year, carInfo.make, carInfo.model, repair.name)
            : null;

          return (
            <div key={index} className="repair-card p-3 border border-retro-border rounded mb-3">
              <div className="mb-2">
                <h6 className="mb-1" style={{ color: 'var(--retro-green)' }}>
                  {repair.name}
                </h6>
                <div className="small-text text-muted mb-2">
                  {repair.explanation}
                </div>
                {repair.vehicleSpecific && (
                  <div className="small-text text-info mb-2" style={{ fontSize: '0.7rem' }}>
                    🚗 {repair.vehicleSpecific}
                  </div>
                )}
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <div className="small-text text-muted">DIY COST:</div>
                  <div className="fw-bold text-success">{repair.diyCost}</div>
                </div>
                <div className="col-6">
                  <div className="small-text text-muted">MECHANIC COST:</div>
                  <div className="fw-bold text-warning">{repair.mechanicCost}</div>
                </div>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <div className="small-text text-muted">LABOR TIME:</div>
                  <div className="small-text">{repair.laborHours} hours</div>
                </div>
                <div className="col-6">
                  <div className="small-text text-muted">DIFFICULTY:</div>
                  <div className="small-text" style={{ color: getDifficultyColor(repair.difficulty) }}>
                    {repair.difficulty}
                  </div>
                </div>
              </div>

              {searchLinks && (
                <div className="border-top pt-2 mt-2">
                  <div className="small-text text-muted mb-2">SEARCH PARTS:</div>
                  <div className="d-flex flex-wrap gap-1">
                    <a 
                      href={searchLinks.rockauto} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="retro-button small"
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                    >
                      RockAuto
                    </a>
                    <a 
                      href={searchLinks.autozone} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="retro-button small"
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                    >
                      AutoZone
                    </a>
                    <a 
                      href={searchLinks.oreilly} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="retro-button small"
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                    >
                      O'Reilly
                    </a>
                    <a 
                      href={searchLinks.google} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="retro-button small"
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                    >
                      Google Shop
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 p-2 bg-retro-dark-bg rounded">
        <div className="small-text text-center text-muted">
          ⚠️ Estimates are based on common repair ranges. Exact parts should be confirmed by VIN, trim, engine, and inspection.
        </div>
      </div>

      {diagnosticResults.symptoms && (
        <div className="mt-3 p-2 border border-retro-border rounded">
          <div className="small-text text-muted mb-1">REPORTED SYMPTOMS:</div>
          <div className="small-text">"{diagnosticResults.symptoms}"</div>
        </div>
      )}
    </div>
  );
};

export default EnhancedResults;
