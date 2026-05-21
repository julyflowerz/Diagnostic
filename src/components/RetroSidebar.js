import React from 'react';

const RetroSidebar = ({ garage, history, onRestoreDiagnostic, onDeleteDiagnostic }) => {
  return (
    <div className="pixel-card h-100">
      <h2>MY GARAGE & HISTORY</h2>
      
      <div className="mb-4">
        <h3 className="section-title mb-3" style={{ color: 'var(--retro-amber)', fontSize: '0.8rem' }}>
          GARAGE ({garage.length})
        </h3>
        {garage.length > 0 ? (
          garage.map((item, index) => (
            <div key={item.id} className="sidebar-item p-2 border border-retro-border rounded mb-2">
              <div className="fw-bold" style={{ color: 'var(--retro-green)' }}>
                {item.carInfo?.year || 'Unknown'} {item.carInfo?.make || 'Unknown'} {item.carInfo?.model || 'Unknown'}
              </div>
              <div className="small-text text-muted">
                {item.carInfo?.trim && `${item.carInfo.trim} • `}{item.carInfo?.mileage && `${item.carInfo.mileage} miles`}
              </div>
              <div className="small-text text-muted">
                Added {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Unknown date'}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted py-4">
            <div className="mb-3">🚗</div>
            <p className="small-text">No vehicles in garage</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="section-title mb-3" style={{ color: 'var(--retro-amber)', fontSize: '0.8rem' }}>
          DIAGNOSTIC HISTORY ({history.length})
        </h3>
        {history.length > 0 ? (
          history.map((item, index) => (
            <div key={item.id} className="sidebar-item p-2 border border-retro-border rounded mb-2">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <div className="fw-bold" style={{ color: 'var(--retro-green)' }}>
                    {item.vehicle?.year || item.carInfo?.year || 'Unknown'} {item.vehicle?.make || item.carInfo?.make || 'Unknown'} {item.vehicle?.model || item.carInfo?.model || 'Unknown'}
                  </div>
                  <div className="small-text text-muted">
                    {item.code && item.code !== 'NONE' ? item.code : 'No Code'} • {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Unknown date'}
                  </div>
                  {item.diagnosis && (
                    <>
                      <div className="small-text" style={{ color: 'var(--retro-dim-text)' }}>
                        {item.diagnosis.system}
                      </div>
                      {item.diagnosis.estimatedCost && (
                        <div className="small-text" style={{ color: 'var(--retro-amber)' }}>
                          💰 {item.diagnosis.estimatedCost}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="d-flex gap-1">
                  {onRestoreDiagnostic && (
                    <button 
                      className="retro-button small"
                      onClick={() => onRestoreDiagnostic(item)}
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                    >
                      RESTORE
                    </button>
                  )}
                  {onDeleteDiagnostic && (
                    <button 
                      className="retro-button small btn-danger"
                      onClick={() => onDeleteDiagnostic(item.id)}
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                    >
                      DELETE
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted py-4">
            <div className="mb-3">📋</div>
            <p className="small-text">No diagnostic history</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetroSidebar;
