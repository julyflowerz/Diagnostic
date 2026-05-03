import React, { useState } from 'react';
import { AlertTriangle, Wrench, Battery, Zap, Droplet, Wind, Gauge } from 'lucide-react';

const problemCategories = [
  {
    id: 'engine',
    name: 'Engine Issues',
    icon: Wrench,
    color: 'text-red-400',
    problems: [
      {
        id: 'engine_stutter',
        name: 'Engine Stuttering/Hesitation',
        description: 'Engine hesitates or stutters during acceleration',
        severity: 'medium',
        system: 'Engine',
        affectedParts: ['engine', 'fuel_system'],
        estimatedCost: '$200-800'
      },
      {
        id: 'engine_wont_start',
        name: 'Engine Won\'t Start',
        description: 'Engine cranks but doesn\'t start or no response at all',
        severity: 'high',
        system: 'Engine/Electrical',
        affectedParts: ['battery', 'engine', 'starter'],
        estimatedCost: '$150-1200'
      },
      {
        id: 'overheating',
        name: 'Overheating',
        description: 'Temperature gauge runs high or engine overheats',
        severity: 'high',
        system: 'Cooling System',
        affectedParts: ['engine', 'cooling_system'],
        estimatedCost: '$100-1500'
      },
      {
        id: 'check_engine',
        name: 'Check Engine Light',
        description: 'Check engine light is illuminated on dashboard',
        severity: 'medium',
        system: 'Engine/Electrical',
        affectedParts: ['engine', 'sensors'],
        estimatedCost: '$50-500'
      }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical System',
    icon: Zap,
    color: 'text-yellow-400',
    problems: [
      {
        id: 'battery_dead',
        name: 'Dead Battery',
        description: 'Car won\'t start, lights are dim or won\'t work',
        severity: 'high',
        system: 'Electrical',
        affectedParts: ['battery'],
        estimatedCost: '$100-400'
      },
      {
        id: 'alternator',
        name: 'Alternator Issues',
        description: 'Battery dies while driving, dimming lights',
        severity: 'high',
        system: 'Electrical',
        affectedParts: ['alternator', 'battery'],
        estimatedCost: '$300-800'
      },
      {
        id: 'starter',
        name: 'Starter Problems',
        description: 'Clicking sound when trying to start, no crank',
        severity: 'high',
        system: 'Electrical',
        affectedParts: ['starter', 'battery'],
        estimatedCost: '$200-600'
      }
    ]
  },
  {
    id: 'brakes',
    name: 'Brake System',
    icon: AlertTriangle,
    color: 'text-orange-400',
    problems: [
      {
        id: 'brake_noise',
        name: 'Brake Noise',
        description: 'Squealing, grinding, or scraping noises when braking',
        severity: 'medium',
        system: 'Brakes',
        affectedParts: ['brakes', 'wheels'],
        estimatedCost: '$150-500'
      },
      {
        id: 'brake_soft',
        name: 'Soft/Spongy Brakes',
        description: 'Brake pedal goes to floor, reduced braking power',
        severity: 'high',
        system: 'Brakes',
        affectedParts: ['brakes', 'brake_fluid'],
        estimatedCost: '$100-800'
      },
      {
        id: 'brake_vibration',
        name: 'Brake Vibration',
        description: 'Steering wheel or brake pedal vibrates when braking',
        severity: 'medium',
        system: 'Brakes',
        affectedParts: ['brakes', 'wheels'],
        estimatedCost: '$200-600'
      }
    ]
  },
  {
    id: 'maintenance',
    name: 'Routine Maintenance',
    icon: Droplet,
    color: 'text-blue-400',
    problems: [
      {
        id: 'oil_change',
        name: 'Oil Change Needed',
        description: 'Due for routine oil change service',
        severity: 'low',
        system: 'Engine',
        affectedParts: ['engine'],
        estimatedCost: '$30-100'
      },
      {
        id: 'tire_rotation',
        name: 'Tire Rotation/Balance',
        description: 'Uneven tire wear, vibration at highway speeds',
        severity: 'low',
        system: 'Wheels/Suspension',
        affectedParts: ['wheels', 'suspension'],
        estimatedCost: '$50-150'
      },
      {
        id: 'fluid_check',
        name: 'Fluid Top-Up Needed',
        description: 'Low coolant, brake fluid, or other fluids',
        severity: 'low',
        system: 'Various',
        affectedParts: ['cooling_system', 'brakes'],
        estimatedCost: '$20-100'
      }
    ]
  },
  {
    id: 'exhaust',
    name: 'Exhaust System',
    icon: Wind,
    color: 'text-gray-400',
    problems: [
      {
        id: 'exhaust_noise',
        name: 'Loud Exhaust Noise',
        description: 'Loud rumbling or hissing from exhaust area',
        severity: 'medium',
        system: 'Exhaust',
        affectedParts: ['exhaust', 'muffler'],
        estimatedCost: '$150-1000'
      },
      {
        id: 'exhaust_smell',
        name: 'Exhaust Smell Inside',
        description: 'Smell of exhaust fumes inside the vehicle',
        severity: 'high',
        system: 'Exhaust',
        affectedParts: ['exhaust'],
        estimatedCost: '$200-1500'
      }
    ]
  },
  {
    id: 'transmission',
    name: 'Transmission',
    icon: Gauge,
    color: 'text-purple-400',
    problems: [
      {
        id: 'transmission_slip',
        name: 'Transmission Slipping',
        description: 'Engine revs but car doesn\'t accelerate properly',
        severity: 'high',
        system: 'Transmission',
        affectedParts: ['transmission'],
        estimatedCost: '$500-3000'
      },
      {
        id: 'transmission_shift',
        name: 'Hard Shifting',
        description: 'Jerky or rough gear changes',
        severity: 'medium',
        system: 'Transmission',
        affectedParts: ['transmission'],
        estimatedCost: '$200-1500'
      }
    ]
  }
];

function ProblemSelector({ selectedProblem, setSelectedProblem }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-diagnostic-red bg-diagnostic-bg border-diagnostic-red';
      case 'medium': return 'text-yellow-400 bg-diagnostic-bg border-yellow-400';
      case 'low': return 'text-green-400 bg-diagnostic-bg border-green-400';
      default: return 'text-diagnostic-muted bg-diagnostic-bg border-diagnostic-muted';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {problemCategories.map(category => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className={`p-4 rounded-lg border transition-all duration-200 btn-sharp ${
                expandedCategory === category.id
                  ? 'bg-diagnostic-accent text-diagnostic-bg'
                  : 'bg-diagnostic-surface text-diagnostic-text hover:bg-diagnostic-bg'
              }`}
            >
              <Icon className={`w-6 h-6 mb-2 ${category.color}`} />
              <p className="text-sm font-medium">{category.name}</p>
            </button>
          );
        })}
      </div>

      {expandedCategory && (
        <div className="space-y-2 mt-4">
          {problemCategories
            .find(cat => cat.id === expandedCategory)
            ?.problems.map(problem => (
              <button
                key={problem.id}
                onClick={() => handleProblemSelect(problem)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 card-sharp ${
                  selectedProblem?.id === problem.id
                    ? 'bg-diagnostic-accent text-diagnostic-bg'
                    : 'bg-diagnostic-surface text-diagnostic-text hover:bg-diagnostic-bg'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-diagnostic-text">{problem.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded border ${getSeverityColor(problem.severity)}`}>
                    {problem.severity}
                  </span>
                </div>
                <p className="text-sm text-diagnostic-muted mb-2">{problem.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-diagnostic-muted">System: {problem.system}</span>
                  <span className="text-xs text-diagnostic-red font-medium">
                    Est. {problem.estimatedCost}
                  </span>
                </div>
              </button>
            ))}
        </div>
      )}

      {selectedProblem && (
        <div className="p-4 bg-diagnostic-surface border border-diagnostic-border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-diagnostic-red">Selected Problem:</p>
              <p className="text-sm text-diagnostic-text">{selectedProblem.name}</p>
            </div>
            <button
              onClick={() => setSelectedProblem(null)}
              className="text-diagnostic-muted hover:text-diagnostic-text text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProblemSelector;
