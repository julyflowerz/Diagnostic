import React, { useState, useEffect } from 'react';

const carMakes = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz',
  'Audi', 'Volkswagen', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Lexus', 'Acura',
  'Infiniti', 'Cadillac', 'Buick', 'GMC', 'Jeep', 'Dodge', 'Chrysler', 'Porsche',
  'Volvo', 'Jaguar', 'Land Rover', 'Tesla', 'Mitsubishi', 'Mini'
];

const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const engineTypes = ['4-Cylinder', 'V6', 'V8', 'Hybrid', 'Electric', 'Diesel', 'Turbo 4-Cylinder', 'Turbo V6'];

const symptomConditions = [
  'Cold Start', 'Idle', 'Acceleration', 'Braking', 'Turning', 'Highway Speed', 'After Warm-up', 'All the Time'
];

const warningLights = [
  'Check Engine Light', 'Battery Light', 'Oil Pressure Light', 'Temperature Warning', 'Brake Warning',
  'ABS Light', 'Airbag Light', 'Traction Control', 'TPMS (Tire Pressure)', 'No Warning Lights'
];

const severityLevels = [
  { value: 'low', label: 'Low - Minor annoyance', color: 'text-green-600' },
  { value: 'medium', label: 'Medium - Should be checked soon', color: 'text-yellow-600' },
  { value: 'high', label: 'High - Serious concern', color: 'text-orange-600' },
  { value: 'critical', label: 'Critical - Stop driving', color: 'text-red-600' }
];

function DiagnosticForm({ carInfo, setCarInfo }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field, value) => {
    setCarInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setCarInfo(prev => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Vehicle Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-diagnostic-text">Vehicle Information</h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="vehicle-year" className="block text-sm font-medium text-diagnostic-text mb-2">
              Year *
            </label>
            <select
              id="vehicle-year"
              value={carInfo.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              className="w-full px-4 py-2 input-sharp rounded-lg"
              required
            >
              <option value="" className="bg-diagnostic-bg">Select Year</option>
              {years.map(year => (
                <option key={year} value={year} className="bg-diagnostic-bg">{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="vehicle-make" className="block text-sm font-medium text-diagnostic-text mb-2">
              Make *
            </label>
            <select
              id="vehicle-make"
              value={carInfo.make}
              onChange={(e) => handleInputChange('make', e.target.value)}
              className="w-full px-4 py-2 input-sharp rounded-lg"
              required
            >
              <option value="" className="bg-diagnostic-bg">Select Make</option>
              {carMakes.map(make => (
                <option key={make} value={make} className="bg-diagnostic-bg">{make}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="vehicle-model" className="block text-sm font-medium text-diagnostic-text mb-2">
              Model *
            </label>
            <input
              id="vehicle-model"
              type="text"
              value={carInfo.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              placeholder="e.g., Camry, Accord, F-150"
              className="w-full px-4 py-2 input-sharp rounded-lg"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="vehicle-engine" className="block text-sm font-medium text-diagnostic-text mb-2">
              Engine/Trim
            </label>
            <select
              id="vehicle-engine"
              value={carInfo.engine || ''}
              onChange={(e) => handleInputChange('engine', e.target.value)}
              className="w-full px-4 py-2 input-sharp rounded-lg"
            >
              <option value="" className="bg-diagnostic-bg">Select Engine Type</option>
              {engineTypes.map(engine => (
                <option key={engine} value={engine} className="bg-diagnostic-bg">{engine}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="vehicle-mileage" className="block text-sm font-medium text-diagnostic-text mb-2">
              Mileage
            </label>
            <input
              id="vehicle-mileage"
              type="number"
              value={carInfo.mileage || ''}
              onChange={(e) => handleInputChange('mileage', e.target.value)}
              placeholder="e.g., 75000"
              className="w-full px-4 py-2 input-sharp rounded-lg"
              min="0"
              max="500000"
            />
          </div>
        </div>
      </div>

      {/* Problem Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-diagnostic-text">Problem Details</h3>
        
        <div>
          <label htmlFor="obd-code" className="block text-sm font-medium text-diagnostic-text mb-2">
            OBD-II Code (if available)
          </label>
          <input
            id="obd-code"
            type="text"
            value={carInfo.obdCode || ''}
            onChange={(e) => handleInputChange('obdCode', e.target.value.toUpperCase())}
            placeholder="e.g., P0137, P0300"
            className="w-full px-4 py-2 input-sharp rounded-lg uppercase"
            maxLength={10}
          />
          <p className="mt-2 text-xs text-diagnostic-muted">
            Optional but recommended for more accurate diagnosis
          </p>
        </div>

        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-diagnostic-text mb-2">
            Symptoms Description *
          </label>
          <textarea
            id="symptoms"
            value={carInfo.symptoms || ''}
            onChange={(e) => handleInputChange('symptoms', e.target.value)}
            placeholder="Describe the problem in detail... (e.g., car shakes when braking, engine stalls at idle, strange noise from front left)"
            className="w-full px-4 py-2 input-sharp rounded-lg"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-diagnostic-text mb-2">
            When does the issue occur?
          </label>
          <div className="grid gap-2 sm:grid-cols-3">
            {symptomConditions.map(condition => (
              <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(carInfo.whenOccurs || []).includes(condition)}
                  onChange={() => handleMultiSelect('whenOccurs', condition)}
                  className="rounded border-diagnostic-border bg-diagnostic-surface text-diagnostic-red focus:ring-diagnostic-red"
                />
                <span className="text-sm text-diagnostic-text">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-diagnostic-text mb-2">
            Warning Lights
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {warningLights.map(light => (
              <label key={light} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(carInfo.warningLights || []).includes(light)}
                  onChange={() => handleMultiSelect('warningLights', light)}
                  className="rounded border-diagnostic-border bg-diagnostic-surface text-diagnostic-red focus:ring-diagnostic-red"
                />
                <span className="text-sm text-diagnostic-text">{light}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-diagnostic-text mb-2">
            Severity Level *
          </label>
          <div className="space-y-2">
            {severityLevels.map(level => (
              <label key={level.value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-neutral-800 bg-diagnostic-surface hover:border-diagnostic-red">
                <input
                  type="radio"
                  name="severity"
                  value={level.value}
                  checked={carInfo.severity === level.value}
                  onChange={(e) => handleInputChange('severity', e.target.value)}
                  className="text-diagnostic-red focus:ring-diagnostic-red"
                  required
                />
                <span className={`text-sm font-medium ${level.color}`}>{level.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-diagnostic-red hover:text-red-400 transition"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
        
        {showAdvanced && (
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="recent-repairs" className="block text-sm font-medium text-diagnostic-text mb-2">
                Recent Repairs
              </label>
              <textarea
                id="recent-repairs"
                value={carInfo.recentRepairs || ''}
                onChange={(e) => handleInputChange('recentRepairs', e.target.value)}
                placeholder="List any recent repairs or maintenance..."
                className="w-full px-4 py-2 input-sharp rounded-lg"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="user-notes" className="block text-sm font-medium text-diagnostic-text mb-2">
                Additional Notes
              </label>
              <textarea
                id="user-notes"
                value={carInfo.userNotes || ''}
                onChange={(e) => handleInputChange('userNotes', e.target.value)}
                placeholder="Any other information that might help with diagnosis..."
                className="w-full px-4 py-2 input-sharp rounded-lg"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Summary */}
      {(carInfo.year || carInfo.make || carInfo.model) && (
        <div className="p-4 bg-diagnostic-surface border border-diagnostic-border rounded-lg">
          <h4 className="text-sm font-semibold text-diagnostic-red mb-2">Vehicle Summary</h4>
          <div className="space-y-1 text-sm text-diagnostic-text">
            <p>
              {carInfo.year && `${carInfo.year} `}
              {carInfo.make && `${carInfo.make} `}
              {carInfo.model && carInfo.model}
              {carInfo.engine && ` • ${carInfo.engine}`}
              {carInfo.mileage && ` • ${parseInt(carInfo.mileage).toLocaleString()} miles`}
            </p>
            {carInfo.obdCode && <p>OBD Code: {carInfo.obdCode}</p>}
            {carInfo.severity && (
              <p className={`font-medium ${severityLevels.find(l => l.value === carInfo.severity)?.color}`}>
                Severity: {severityLevels.find(l => l.value === carInfo.severity)?.label}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DiagnosticForm;
