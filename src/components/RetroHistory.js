import React from 'react';

const RetroHistory = ({ history, onDelete, onClear }) => {
  const calculateTotalCost = (parts) => {
    if (!parts || parts.length === 0) return '$0';
    
    const total = parts.reduce((sum, part) => {
      const cost = part.mechanicCost || part.diyCost || '$0';
      const num = parseInt(cost.replace(/[^0-9]/g, ''));
      return sum + num;
    }, 0);
    
    return `$${total.toLocaleString()}`;
  };

  return (
    <div className="retro-window">
      <div className="window-top">
        <span>DIAGNOSTIC HISTORY</span>
        <span>{history.length} RECORDS</span>
      </div>
      <div className="window-body">
        {history.length === 0 ? (
          <div className="text-center py-5">
            <div className="retro-empty-icon">📋</div>
            <div className="retro-empty-text">NO SCAN HISTORY</div>
            <div className="retro-empty-sub">Complete a scan to see your diagnostic history</div>
          </div>
        ) : (
          <div>
            <div className="history-actions mb-4">
              <button 
                className="retro-button retro-button-danger"
                onClick={onClear}
              >
                CLEAR ALL HISTORY
              </button>
            </div>
            
            <div className="history-grid">
              {history.map(record => (
                <div key={record.id} className="retro-card">
                  <div className="retro-card-header">
                    <div className="retro-card-title">
                      {record.vehicle?.year} {record.vehicle?.make} {record.vehicle?.model}
                    </div>
                    <div className="retro-card-subtitle">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="retro-card-body">
                    <div className="retro-details">
                      <div className="retro-detail-row">
                        <span className="retro-label">OBD-II CODE:</span>
                        <span className="retro-value">{record.code || 'NONE'}</span>
                      </div>
                      
                      {record.symptoms && (
                        <div className="retro-detail-row">
                          <span className="retro-label">SYMPTOMS:</span>
                          <span className="retro-value symptoms-text">
                            {record.symptoms.length > 100 ? `${record.symptoms.substring(0, 100)}...` : record.symptoms}
                          </span>
                        </div>
                      )}
                      
                      {record.diagnosis && (
                        <div className="retro-detail-row">
                          <span className="retro-label">DIAGNOSIS:</span>
                          <span className="retro-value diagnosis-text">
                            {record.diagnosis.diagnosis || record.diagnosis.summary || 'No diagnosis available'}
                          </span>
                        </div>
                      )}
                      
                      <div className="retro-detail-row">
                        <span className="retro-label">COST ESTIMATE:</span>
                        <span className="retro-value cost-text">
                          {calculateTotalCost(record.diagnosis?.likelyParts)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="retro-card-actions">
                      <button 
                        className="retro-button retro-button-danger"
                        onClick={() => onDelete(record.id)}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetroHistory;
