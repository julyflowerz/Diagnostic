import React from 'react';

const carMakes = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz',
  'Audi', 'Volkswagen', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Lexus', 'Acura',
  'Infiniti', 'Cadillac', 'Buick', 'GMC', 'Jeep', 'Dodge', 'Chrysler', 'Porsche',
  'Volvo', 'Jaguar', 'Land Rover', 'Tesla', 'Mitsubishi', 'Mini'
];

const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

function DiagnosticForm({ carInfo, setCarInfo }) {
  const handleInputChange = (field, value) => {
    setCarInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="vehicle-year" className="block text-sm font-medium text-diagnostic-text mb-2">
          Year
        </label>
        <select
          id="vehicle-year"
          value={carInfo.year}
          onChange={(e) => handleInputChange('year', e.target.value)}
          className="w-full px-4 py-2 input-sharp rounded-lg"
        >
          <option value="" className="bg-diagnostic-bg">Select Year</option>
          {years.map(year => (
            <option key={year} value={year} className="bg-diagnostic-bg">{year}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="vehicle-make" className="block text-sm font-medium text-diagnostic-text mb-2">
          Make
        </label>
        <select
          id="vehicle-make"
          value={carInfo.make}
          onChange={(e) => handleInputChange('make', e.target.value)}
          className="w-full px-4 py-2 input-sharp rounded-lg"
        >
          <option value="" className="bg-diagnostic-bg">Select Make</option>
          {carMakes.map(make => (
            <option key={make} value={make} className="bg-diagnostic-bg">{make}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="vehicle-model" className="block text-sm font-medium text-diagnostic-text mb-2">
          Model
        </label>
        <input
          id="vehicle-model"
          type="text"
          value={carInfo.model}
          onChange={(e) => handleInputChange('model', e.target.value)}
          placeholder="e.g., Camry, F-150, Civic"
          className="w-full px-4 py-2 input-sharp rounded-lg"
        />
      </div>

      <div>
        <label htmlFor="vehicle-vin" className="block text-sm font-medium text-diagnostic-text mb-2">
          VIN for real repair pricing
        </label>
        <input
          id="vehicle-vin"
          type="text"
          value={carInfo.vin || ''}
          onChange={(e) => handleInputChange('vin', e.target.value)}
          placeholder="Optional 17-character VIN"
          maxLength={17}
          className="w-full px-4 py-2 input-sharp rounded-lg uppercase"
        />
        <p className="mt-2 text-xs text-diagnostic-muted">
          Optional: Vehicle Databases repair pricing requires a VIN and API key.
        </p>
      </div>

      {(carInfo.year || carInfo.make || carInfo.model) && (
        <div className="p-3 bg-diagnostic-surface border border-diagnostic-border rounded-lg">
          <p className="text-sm text-diagnostic-red font-medium">
            {carInfo.year && `${carInfo.year} `}
            {carInfo.make && `${carInfo.make} `}
            {carInfo.model && carInfo.model}
            {carInfo.vin && ` • VIN ${carInfo.vin.toUpperCase()}`}
          </p>
        </div>
      )}
    </div>
  );
}

export default DiagnosticForm;
