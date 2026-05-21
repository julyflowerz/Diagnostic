import React, { useState } from 'react';

const obdCodes = [
  { code: 'NONE', description: 'No Check Engine Light - General Troubleshooting' },
  { code: 'P0137', description: 'O2 Sensor Circuit Low Voltage' },
  { code: 'P0420', description: 'Catalyst System Efficiency Below Threshold' },
  { code: 'P0300', description: 'Random/Multiple Cylinder Misfire' },
  { code: 'P0171', description: 'System Too Lean' },
  { code: 'P0455', description: 'EVAP Large Leak Detected' },
  { code: 'P0128', description: 'Coolant Thermostat Below Regulating Temperature' },
  { code: 'P0113', description: 'Intake Air Temperature Sensor High Input' },
  { code: 'P0442', description: 'EVAP Small Leak Detected' },
  { code: 'P0301', description: 'Cylinder 1 Misfire' },
  { code: 'P0507', description: 'Idle Control System RPM Higher Than Expected' }
];

const RetroDiagnosticForm = ({ 
  carInfo, 
  setCarInfo, 
  code, 
  setCode, 
  severity, 
  setSeverity, 
  symptoms, 
  setSymptoms, 
  recentRepairs, 
  setRecentRepairs, 
  mileage, 
  setMileage, 
  onSubmit, 
  onSaveToGarage, 
  onClear, 
  vehicleValidation 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const filteredCodes = obdCodes.filter(item => 
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCodeSelect = (selectedCode) => {
    setCode(selectedCode.code);
    setSearchTerm(`${selectedCode.code} — ${selectedCode.description}`);
    setShowDropdown(false);
  };

  const handleInputChange = (value) => {
    setSearchTerm(value);
    setShowDropdown(true);
    // If user is typing a new code that doesn't match, update the code state
    const match = obdCodes.find(item => item.code === value.toUpperCase());
    if (match) {
      setCode(match.code);
    } else if (value.length === 0) {
      setCode('');
    }
  };

  const selectedCodeDisplay = obdCodes.find(item => item.code === code);

  return (
    <div className="pixel-card h-100">
      <h2>VEHICLE DIAGNOSTIC</h2>
      
      <form id="diagnosticForm" onSubmit={handleSubmit}>
        {/* Vehicle Info Section */}
        <div className="mb-4">
          <h3 className="section-title mb-3" style={{ color: 'var(--retro-amber)', fontSize: '0.8rem' }}>
            VEHICLE INFO
          </h3>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small-text" htmlFor="year">YEAR</label>
              <input 
                id="year" 
                className="form-control retro-input" 
                value={carInfo.year}
                onChange={(e) => setCarInfo({...carInfo, year: e.target.value})}
                placeholder="1997"
              />
            </div>
            
            <div className="col-md-4">
              <label className="form-label small-text" htmlFor="make">MAKE</label>
              <select 
                id="make" 
                className="form-select retro-input"
                value={carInfo.make}
                onChange={(e) => setCarInfo({...carInfo, make: e.target.value})}
              >
                <option value="">Select Make</option>
                <option value="Honda">Honda</option>
                <option value="Toyota">Toyota</option>
                <option value="Ford">Ford</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Nissan">Nissan</option>
                <option value="Subaru">Subaru</option>
                <option value="Chrysler">Chrysler</option>
                <option value="Dodge">Dodge</option>
                <option value="Jeep">Jeep</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Audi">Audi</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Kia">Kia</option>
                <option value="Mazda">Mazda</option>
                <option value="Mitsubishi">Mitsubishi</option>
                <option value="Lexus">Lexus</option>
                <option value="Infiniti">Infiniti</option>
                <option value="Acura">Acura</option>
                <option value="Buick">Buick</option>
                <option value="Cadillac">Cadillac</option>
                <option value="Lincoln">Lincoln</option>
                <option value="GMC">GMC</option>
                <option value="Pontiac">Pontiac</option>
                <option value="Saturn">Saturn</option>
                <option value="Oldsmobile">Oldsmobile</option>
                <option value="Mercury">Mercury</option>
                <option value="Plymouth">Plymouth</option>
                <option value="Saab">Saab</option>
                <option value="Volvo">Volvo</option>
                <option value="Jaguar">Jaguar</option>
                <option value="Land Rover">Land Rover</option>
                <option value="Mini">Mini</option>
                <option value="Smart">Smart</option>
                <option value="Fiat">Fiat</option>
                <option value="Alfa Romeo">Alfa Romeo</option>
                <option value="Maserati">Maserati</option>
                <option value="Ferrari">Ferrari</option>
                <option value="Lamborghini">Lamborghini</option>
                <option value="Bentley">Bentley</option>
                <option value="Rolls-Royce">Rolls-Royce</option>
                <option value="Aston Martin">Aston Martin</option>
                <option value="McLaren">McLaren</option>
                <option value="Tesla">Tesla</option>
                <option value="Rivian">Rivian</option>
                <option value="Lucid">Lucid</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="col-md-5">
              <label className="form-label small-text" htmlFor="model">MODEL</label>
              <input 
                id="model" 
                className="form-control retro-input" 
                value={carInfo.model}
                onChange={(e) => setCarInfo({...carInfo, model: e.target.value})}
                placeholder="Civic, Accord, Camry, F-150..."
              />
            </div>
            
            <div className="col-12">
              <label className="form-label small-text" htmlFor="mileage">MILEAGE</label>
              <input 
                id="mileage" 
                className="form-control retro-input" 
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="185000"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Validation Feedback */}
        {vehicleValidation && (
          <div className="mb-3">
            {vehicleValidation.isValid ? (
              <div className="alert alert-success retro-alert">
                ✅ Vehicle validated: {carInfo.year} {carInfo.make} {carInfo.model}
              </div>
            ) : (
              <div className="alert alert-warning retro-alert">
                ⚠️ Vehicle not found in NHTSA database. {vehicleValidation.suggestedModel && `Did you mean ${carInfo.make} ${vehicleValidation.suggestedModel}?`}
              </div>
            )}
          </div>
        )}

        {/* Vehicle Action Buttons */}
        {carInfo.make && carInfo.model && carInfo.year && (
          <div className="mb-4">
            <div className="d-flex gap-2">
              <button 
                className="retro-button small" 
                type="button" 
                onClick={onSaveToGarage}
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              >
                🚗 SAVE VEHICLE TO GARAGE
              </button>
            </div>
          </div>
        )}

        {/* Diagnostic Info Section */}
        <div className="mb-4">
          <h3 className="section-title mb-3" style={{ color: 'var(--retro-amber)', fontSize: '0.8rem' }}>
            DIAGNOSTIC INFO
          </h3>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small-text" htmlFor="code">OBD-II CODE</label>
              <div className="position-relative">
                <input 
                  id="code" 
                  className="form-control retro-input" 
                  value={searchTerm || (selectedCodeDisplay ? `${selectedCodeDisplay.code} — ${selectedCodeDisplay.description}` : '')}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Type code or search..."
                  autoComplete="off"
                />
                {showDropdown && (
                  <div className="position-absolute w-100 bg-retro-dark-bg border border-retro-border rounded mt-1" 
                       style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                    {filteredCodes.length > 0 ? (
                      filteredCodes.map((item, index) => (
                        <div
                          key={item.code}
                          className="p-2 cursor-pointer hover-bg-retro-medium-bg small-text"
                          style={{ 
                            borderBottom: index < filteredCodes.length - 1 ? '1px solid var(--retro-border)' : 'none',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleCodeSelect(item)}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <div style={{ color: 'var(--retro-green)', fontWeight: 'bold' }}>
                            {item.code}
                          </div>
                          <div style={{ color: 'var(--retro-dim-text)', fontSize: '0.7rem' }}>
                            {item.description}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-muted small-text">
                        No codes found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="col-md-6">
              <label className="form-label small-text" htmlFor="severity">SEVERITY</label>
              <select 
                id="severity" 
                className="form-select retro-input"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div className="col-12">
              <label className="form-label small-text" htmlFor="symptoms">SYMPTOMS</label>
              <textarea 
                id="symptoms" 
                className="form-control retro-input" 
                rows="3" 
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Rough idle, bad MPG, hesitation, smell, ticking, overheating..."
              />
            </div>
          </div>
        </div>

        {/* Repair Info Section */}
        <div className="mb-4">
          <h3 className="section-title mb-3" style={{ color: 'var(--retro-amber)', fontSize: '0.8rem' }}>
            REPAIR INFO
          </h3>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small-text" htmlFor="recentRepairs">RECENT REPAIRS</label>
              <textarea 
                id="recentRepairs" 
                className="form-control retro-input" 
                rows="2" 
                value={recentRepairs}
                onChange={(e) => setRecentRepairs(e.target.value)}
                placeholder="New battery, O2 sensor, exhaust work, spark plugs..."
              />
            </div>
          </div>
        </div>
        
        <div className="d-flex flex-wrap gap-3 mt-4">
          <button className="retro-button" type="submit">RUN SCAN</button>
          <button 
            className="retro-button secondary" 
            type="button" 
            onClick={onSaveToGarage}
          >
            SAVE TO GARAGE
          </button>
          <button 
            className="retro-button danger" 
            type="button" 
            onClick={onClear}
          >
            CLEAR
          </button>
        </div>
      </form>
    </div>
  );
};

export default RetroDiagnosticForm;
