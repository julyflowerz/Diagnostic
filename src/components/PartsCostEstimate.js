import React from 'react';

const PartsCostEstimate = ({ selectedCode }) => {
  // Detailed parts and cost estimates for common OBD-II codes
  const partsDatabase = {
    'P0137': {
      title: 'O2 Sensor Circuit Low Voltage (Bank 1 Sensor 2)',
      likelyParts: [
        {
          name: 'Downstream Oxygen Sensor (O2)',
          description: 'Bank 1 Sensor 2 - Post-catalytic converter sensor',
          partPrice: '$45-120',
          laborCost: '$65-95',
          totalTime: '1-2 hours',
          difficulty: 'Easy',
          totalCost: '$110-215',
          probability: 'High (70%)'
        },
        {
          name: 'O2 Sensor Wiring Harness',
          description: 'Repair damaged wiring or connector',
          partPrice: '$25-60',
          laborCost: '$85-150',
          totalTime: '1-2.5 hours',
          difficulty: 'Medium',
          totalCost: '$110-210',
          probability: 'Medium (20%)'
        },
        {
          name: 'Exhaust System Repair',
          description: 'Fix exhaust leak affecting sensor readings',
          partPrice: '$150-400',
          laborCost: '$200-350',
          totalTime: '2-4 hours',
          difficulty: 'Hard',
          totalCost: '$350-750',
          probability: 'Low (10%)'
        }
      ]
    },
    'P0420': {
      title: 'Catalyst System Efficiency Below Threshold',
      likelyParts: [
        {
          name: 'Catalytic Converter',
          description: 'Main catalytic converter replacement',
          partPrice: '$400-1200',
          laborCost: '$150-300',
          totalTime: '2-3 hours',
          difficulty: 'Hard',
          totalCost: '$550-1500',
          probability: 'High (60%)'
        },
        {
          name: 'Upstream O2 Sensor',
          description: 'Bank 1 Sensor 1 - Pre-catalytic converter sensor',
          partPrice: '$55-150',
          laborCost: '$65-95',
          totalTime: '1-1.5 hours',
          difficulty: 'Easy',
          totalCost: '$120-245',
          probability: 'Medium (25%)'
        },
        {
          name: 'Downstream O2 Sensor',
          description: 'Bank 1 Sensor 2 - Post-catalytic converter sensor',
          partPrice: '$45-120',
          laborCost: '$65-95',
          totalTime: '1-2 hours',
          difficulty: 'Easy',
          totalCost: '$110-215',
          probability: 'Medium (10%)'
        },
        {
          name: 'Exhaust Leak Repair',
          description: 'Fix exhaust leaks before catalytic converter',
          partPrice: '$50-200',
          laborCost: '$150-300',
          totalTime: '2-3 hours',
          difficulty: 'Medium',
          totalCost: '$200-500',
          probability: 'Low (5%)'
        }
      ]
    },
    'P0300': {
      title: 'Random/Multiple Cylinder Misfire',
      likelyParts: [
        {
          name: 'Spark Plugs (Set of 4)',
          description: 'Complete spark plug replacement',
          partPrice: '$30-80',
          laborCost: '$80-150',
          totalTime: '1-2 hours',
          difficulty: 'Easy',
          totalCost: '$110-230',
          probability: 'High (40%)'
        },
        {
          name: 'Ignition Coils',
          description: 'One or more ignition coil replacement',
          partPrice: '$60-250',
          laborCost: '$85-200',
          totalTime: '1-2.5 hours',
          difficulty: 'Medium',
          totalCost: '$145-450',
          probability: 'Medium (30%)'
        },
        {
          name: 'Fuel Injectors',
          description: 'Clean or replace fuel injectors',
          partPrice: '$150-500',
          laborCost: '$200-400',
          totalTime: '2-4 hours',
          difficulty: 'Hard',
          totalCost: '$350-900',
          probability: 'Medium (20%)'
        },
        {
          name: 'Vacuum Leak Repair',
          description: 'Find and fix vacuum leaks',
          partPrice: '$20-100',
          laborCost: '$150-300',
          totalTime: '2-3 hours',
          difficulty: 'Medium',
          totalCost: '$170-400',
          probability: 'Low (10%)'
        }
      ]
    },
    'P0171': {
      title: 'System Too Lean (Bank 1)',
      likelyParts: [
        {
          name: 'Mass Air Flow (MAF) Sensor',
          description: 'Clean or replace MAF sensor',
          partPrice: '$80-250',
          laborCost: '$65-95',
          totalTime: '0.5-1 hour',
          difficulty: 'Easy',
          totalCost: '$145-345',
          probability: 'High (35%)'
        },
        {
          name: 'Vacuum Lines/Hoses',
          description: 'Replace cracked vacuum hoses',
          partPrice: '$30-80',
          laborCost: '$150-250',
          totalTime: '2-3 hours',
          difficulty: 'Medium',
          totalCost: '$180-330',
          probability: 'Medium (25%)'
        },
        {
          name: 'Intake Manifold Gasket',
          description: 'Replace intake manifold gasket',
          partPrice: '$40-120',
          laborCost: '$200-400',
          totalTime: '3-5 hours',
          difficulty: 'Hard',
          totalCost: '$240-520',
          probability: 'Medium (20%)'
        },
        {
          name: 'Fuel Filter',
          description: 'Replace fuel filter',
          partPrice: '$15-40',
          laborCost: '$50-80',
          totalTime: '0.5-1 hour',
          difficulty: 'Easy',
          totalCost: '$65-120',
          probability: 'Low (10%)'
        },
        {
          name: 'Fuel Pump',
          description: 'Replace fuel pump',
          partPrice: '$250-600',
          laborCost: '$300-500',
          totalTime: '3-4 hours',
          difficulty: 'Hard',
          totalCost: '$550-1100',
          probability: 'Low (10%)'
        }
      ]
    },
    'P0455': {
      title: 'EVAP Large Leak Detected',
      likelyParts: [
        {
          name: 'Gas Cap',
          description: 'Replace faulty gas cap',
          partPrice: '$15-40',
          laborCost: '$0',
          totalTime: '5 minutes',
          difficulty: 'DIY',
          totalCost: '$15-40',
          probability: 'High (50%)'
        },
        {
          name: 'EVAP Purge Valve',
          description: 'Replace EVAP purge valve',
          partPrice: '$40-120',
          laborCost: '$85-150',
          totalTime: '1-2 hours',
          difficulty: 'Medium',
          totalCost: '$125-270',
          probability: 'Medium (25%)'
        },
        {
          name: 'EVAP Vent Valve',
          description: 'Replace EVAP vent valve',
          partPrice: '$45-130',
          laborCost: '$85-150',
          totalTime: '1-2 hours',
          difficulty: 'Medium',
          totalCost: '$130-280',
          probability: 'Medium (15%)'
        },
        {
          name: 'EVAP Hoses/Lines',
          description: 'Replace cracked EVAP hoses',
          partPrice: '$30-80',
          laborCost: '$150-300',
          totalTime: '2-3 hours',
          difficulty: 'Medium',
          totalCost: '$180-380',
          probability: 'Low (10%)'
        }
      ]
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'DIY': return 'var(--retro-green)';
      case 'Easy': return 'var(--retro-green)';
      case 'Medium': return 'var(--retro-amber)';
      case 'Hard': return '#dc2626';
      default: return 'var(--retro-dim-text)';
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability.includes('High')) return 'var(--retro-green)';
    if (probability.includes('Medium')) return 'var(--retro-amber)';
    if (probability.includes('Low')) return '#dc2626';
    return 'var(--retro-dim-text)';
  };

  const partsInfo = partsDatabase[selectedCode];

  if (!selectedCode || selectedCode === 'NONE') {
    return (
      <div className="pixel-card h-100">
        <h2>LIKELY PARTS & COST</h2>
        <div className="text-center py-5">
          <div className="mb-3">🔧</div>
          <p className="small-text text-muted">
            {selectedCode === 'NONE' 
              ? 'Select problem categories below to see likely parts and cost estimates'
              : 'Select an OBD-II code to see likely parts and cost estimates'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-card h-100">
      <h2>LIKELY PARTS & COST</h2>
      
      <div className="mb-3">
        <h5 className="text-warning mb-2">{partsInfo?.title}</h5>
        <div className="small-text text-muted mb-3">
          *These are estimates only. Actual costs may vary by location and vehicle condition.
        </div>
      </div>

      <div className="parts-list">
        {partsInfo?.likelyParts.map((part, index) => (
          <div key={index} className="part-card p-3 border border-retro-border rounded mb-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="flex-grow-1">
                <h6 className="mb-1" style={{ color: 'var(--retro-green)' }}>
                  {part.name}
                </h6>
                <div className="small-text text-muted mb-2">
                  {part.description}
                </div>
              </div>
              <div className="text-end">
                <div className="badge bg-success small-text mb-1">
                  {part.probability}
                </div>
              </div>
            </div>

            <div className="row g-2 mb-2">
              <div className="col-6">
                <div className="small-text text-muted">PART PRICE:</div>
                <div className="fw-bold">{part.partPrice}</div>
              </div>
              <div className="col-6">
                <div className="small-text text-muted">LABOR COST:</div>
                <div className="fw-bold">{part.laborCost}</div>
              </div>
            </div>

            <div className="row g-2 mb-2">
              <div className="col-6">
                <div className="small-text text-muted">TIME:</div>
                <div className="small-text">{part.totalTime}</div>
              </div>
              <div className="col-6">
                <div className="small-text text-muted">DIFFICULTY:</div>
                <div className="small-text" style={{ color: getDifficultyColor(part.difficulty) }}>
                  {part.difficulty}
                </div>
              </div>
            </div>

            <div className="border-top pt-2 mt-2">
              <div className="d-flex justify-content-between align-items-center">
                <div className="small-text text-muted">ESTIMATED TOTAL:</div>
                <div className="fw-bold" style={{ color: 'var(--retro-amber)', fontSize: '1.1rem' }}>
                  {part.totalCost}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 p-2 bg-retro-dark-bg rounded">
        <div className="small-text text-center text-muted">
          💡 Tip: Get multiple quotes from mechanics for accurate pricing
        </div>
      </div>
    </div>
  );
};

export default PartsCostEstimate;
