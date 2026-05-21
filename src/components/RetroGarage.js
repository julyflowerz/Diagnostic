import React from 'react';

const RetroGarage = ({ garage, onRestoreDiagnostic, onDeleteDiagnostic }) => {
  return (
    <div className="retro-window">
      <div className="window-top">
        <span>MY GARAGE</span>
        <span>{garage.length} VEHICLES</span>
      </div>
      <div className="window-body">
        {garage.length === 0 ? (
          <div className="text-center py-5">
            <div className="retro-empty-icon">🚗</div>
            <div className="retro-empty-text">NO VEHICLES IN GARAGE</div>
            <div className="retro-empty-sub">Complete a scan to save your first vehicle</div>
          </div>
        ) : (
          <div className="garage-grid">
            {garage.map(vehicle => (
              <div key={vehicle.id} className="retro-card">
                <div className="retro-card-header">
                  <div className="retro-card-title">
                    {vehicle.carInfo?.year} {vehicle.carInfo?.make} {vehicle.carInfo?.model}
                  </div>
                  <div className="retro-card-subtitle">
                    {vehicle.nickname || 'Vehicle'}
                  </div>
                </div>
                
                <div className="retro-card-body">
                  <div className="retro-details">
                    <div className="retro-detail-row">
                      <span className="retro-label">MILEAGE:</span>
                      <span className="retro-value">
                        {vehicle.carInfo?.mileage ? `${parseInt(vehicle.carInfo.mileage).toLocaleString()} mi` : 'Not specified'}
                      </span>
                    </div>
                    
                    {vehicle.lastDiagnosis && (
                      <div className="retro-detail-row">
                        <span className="retro-label">LAST DIAGNOSIS:</span>
                        <span className="retro-value diagnosis-text">{vehicle.lastDiagnosis}</span>
                      </div>
                    )}
                    
                    {vehicle.estimatedCost && (
                      <div className="retro-detail-row">
                        <span className="retro-label">ESTIMATED COST:</span>
                        <span className="retro-value cost-text">{vehicle.estimatedCost}</span>
                      </div>
                    )}
                    
                    <div className="retro-detail-row">
                      <span className="retro-label">DATE SAVED:</span>
                      <span className="retro-value">
                        {new Date(vehicle.timestamp || vehicle.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="retro-card-actions">
                    <button 
                      className="retro-button retro-button-primary"
                      onClick={() => onRestoreDiagnostic(vehicle)}
                    >
                      VIEW DETAILS
                    </button>
                    <button 
                      className="retro-button retro-button-danger"
                      onClick={() => onDeleteDiagnostic(vehicle.id)}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RetroGarage;
