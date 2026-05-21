import React, { useEffect, useState } from 'react';
import './retro.css';
import RetroCarViewer3D from './components/RetroCarViewer3D';
import RetroDiagnosticForm from './components/RetroDiagnosticForm';
import RetroResults from './components/RetroResults';
import MechanicFinder from './components/MechanicFinder';
import RetroGarage from './components/RetroGarage';
import RetroHistory from './components/RetroHistory';
import { getDiagnosticHistory, saveDiagnosticResult, deleteDiagnosticResult, clearDiagnosticHistory } from './services/diagnosticStorage';
import { createDiagnosticJob, processDiagnosticJob } from './services/diagnosticQueue';
import { getEnhancedPartsRecommendations, validateVehicle, getVehicleTypeParts } from './services/vehicleApi';


// Diagnostic repair database
const diagnosticRepairMap = {
  P0137: {
    title: "O2 Sensor Circuit Low Voltage (Bank 1 Sensor 2)",
    categories: ["exhaust", "sensors", "emissions"],
    likelyParts: [
      {
        name: "Downstream Oxygen Sensor",
        diyCost: "$35-$120",
        mechanicCost: "$150-$350",
        laborHours: "0.5-1.0",
        difficulty: "Easy-Medium",
        explanation: "The downstream O2 sensor monitors catalytic converter efficiency. Low voltage typically indicates sensor failure or wiring issues."
      },
      {
        name: "O2 Sensor Wiring Repair",
        diyCost: "$10-$40",
        mechanicCost: "$100-$250",
        laborHours: "0.5-1.5",
        difficulty: "Medium",
        explanation: "Damaged wiring or corroded connectors can cause low voltage readings. Requires electrical testing and repair."
      },
      {
        name: "Exhaust Leak Repair",
        diyCost: "$20-$150",
        mechanicCost: "$150-$400",
        laborHours: "1.0-2.0",
        difficulty: "Medium",
        explanation: "Exhaust leaks before the O2 sensor can cause false low voltage readings by allowing oxygen into the system."
      }
    ]
  },
  P0420: {
    title: "Catalyst System Efficiency Below Threshold",
    categories: ["exhaust", "emissions", "sensors"],
    likelyParts: [
      {
        name: "Catalytic Converter",
        diyCost: "$150-$800",
        mechanicCost: "$600-$2500",
        laborHours: "1.5-3.0",
        difficulty: "Hard",
        explanation: "The catalytic converter may be failing or contaminated. Requires exhaust system work and proper diagnosis."
      },
      {
        name: "Upstream Oxygen Sensor",
        diyCost: "$45-$150",
        mechanicCost: "$150-$400",
        laborHours: "0.5-1.0",
        difficulty: "Medium",
        explanation: "Faulty upstream O2 sensor can incorrectly report catalyst efficiency issues."
      },
      {
        name: "Downstream Oxygen Sensor",
        diyCost: "$35-$120",
        mechanicCost: "$120-$350",
        laborHours: "0.5-1.0",
        difficulty: "Easy-Medium",
        explanation: "The downstream sensor monitors catalyst performance. Failure can trigger P0420 code."
      },
      {
        name: "Exhaust Manifold Gasket",
        diyCost: "$30-$80",
        mechanicCost: "$200-$500",
        laborHours: "1.5-2.5",
        difficulty: "Medium",
        explanation: "Exhaust leaks before the catalyst can cause false P0420 readings by affecting O2 sensor measurements."
      }
    ]
  },
  P0300: {
    title: "Random/Multiple Cylinder Misfire Detected",
    categories: ["engine", "ignition", "fuel"],
    likelyParts: [
      {
        name: "Spark Plugs (Set of 4)",
        diyCost: "$20-$80",
        mechanicCost: "$120-$300",
        laborHours: "1.0-2.0",
        difficulty: "Easy-Medium",
        explanation: "Worn or fouled spark plugs are the most common cause of random misfires. Replace as a set for best results."
      },
      {
        name: "Ignition Coils / Wires",
        diyCost: "$40-$250",
        mechanicCost: "$180-$600",
        laborHours: "1.0-2.0",
        difficulty: "Medium",
        explanation: "Failing ignition coils or spark plug wires can cause intermittent misfires across multiple cylinders."
      },
      {
        name: "Fuel Injectors",
        diyCost: "$150-$500",
        mechanicCost: "$300-$800",
        laborHours: "2.0-3.0",
        difficulty: "Hard",
        explanation: "Clogged or failing fuel injectors can cause misfires by delivering incorrect fuel amounts."
      },
      {
        name: "Vacuum Leak Repair",
        diyCost: "$15-$100",
        mechanicCost: "$150-$400",
        laborHours: "1.0-2.0",
        difficulty: "Medium",
        explanation: "Vacuum leaks can cause lean conditions leading to random misfires. Check hoses and intake gaskets."
      }
    ]
  },
  P0171: {
    title: "System Too Lean (Bank 1)",
    categories: ["fuel", "air_intake", "sensors"],
    likelyParts: [
      {
        name: "Mass Air Flow (MAF) Sensor",
        diyCost: "$80-$250",
        mechanicCost: "$150-$400",
        laborHours: "0.5-1.0",
        difficulty: "Easy-Medium",
        explanation: "Dirty or failing MAF sensor can under-report airflow, causing lean condition and poor performance."
      },
      {
        name: "Vacuum Hoses / Lines",
        diyCost: "$20-$80",
        mechanicCost: "$150-$350",
        laborHours: "1.0-2.0",
        difficulty: "Medium",
        explanation: "Cracked or disconnected vacuum hoses allow unmetered air into the engine, causing lean condition."
      },
      {
        name: "Intake Manifold Gasket",
        diyCost: "$40-$120",
        mechanicCost: "$300-$600",
        laborHours: "2.0-4.0",
        difficulty: "Hard",
        explanation: "Failed intake manifold gasket can cause significant vacuum leaks and lean running conditions."
      },
      {
        name: "Fuel Filter",
        diyCost: "$15-$40",
        mechanicCost: "$80-$150",
        laborHours: "0.5-1.0",
        difficulty: "Easy",
        explanation: "Clogged fuel filter can restrict fuel flow, causing lean condition under load."
      },
      {
        name: "O2 Sensor (Upstream)",
        diyCost: "$45-$150",
        mechanicCost: "$150-$400",
        laborHours: "0.5-1.0",
        difficulty: "Medium",
        explanation: "Faulty upstream O2 sensor can cause incorrect fuel trim adjustments leading to lean condition."
      }
    ]
  },
  P0455: {
    title: "Evaporative Emission System Large Leak Detected",
    categories: ["emissions", "fuel"],
    likelyParts: [
      {
        name: "Gas Cap",
        diyCost: "$15-$40",
        mechanicCost: "$20-$50",
        laborHours: "0.1",
        difficulty: "DIY",
        explanation: "Loose, damaged, or missing gas cap is the most common cause of P0455. Always check first."
      },
      {
        name: "EVAP Purge Valve",
        diyCost: "$40-$120",
        mechanicCost: "$150-$350",
        laborHours: "0.5-1.5",
        difficulty: "Medium",
        explanation: "Stuck open purge valve can cause large EVAP leaks. Requires testing and replacement."
      },
      {
        name: "EVAP Vent Valve",
        diyCost: "$45-$130",
        mechanicCost: "$150-$350",
        laborHours: "0.5-1.5",
        difficulty: "Medium",
        explanation: "Failed vent valve can cause system pressure issues and trigger large leak codes."
      },
      {
        name: "EVAP Hoses/Lines",
        diyCost: "$30-$80",
        mechanicCost: "$200-$500",
        laborHours: "1.0-2.0",
        difficulty: "Medium",
        explanation: "Cracked or disconnected EVAP hoses can cause large leaks. System smoke testing recommended."
      }
    ]
  },
  STEERING_SHAKE_PULL: {
    title: "Steering Wheel Shake / Vehicle Pulling",
    categories: ["wheels", "tires", "steering", "suspension"],
    likelyParts: [
      {
        name: "Wheel Balance",
        diyCost: "$0 DIY not recommended",
        mechanicCost: "$40-$100",
        laborHours: "0.5-1.0",
        difficulty: "Shop Service",
        explanation: "Unbalanced wheels cause vibration at highway speeds. Requires professional balancing equipment."
      },
      {
        name: "Wheel Alignment",
        diyCost: "$0 DIY not recommended",
        mechanicCost: "$80-$180",
        laborHours: "1.0",
        difficulty: "Shop Service",
        explanation: "Poor alignment causes pulling and uneven tire wear. Requires alignment rack."
      },
      {
        name: "Tie Rod End",
        diyCost: "$25-$90",
        mechanicCost: "$180-$450",
        laborHours: "1.0-2.0",
        difficulty: "Medium",
        explanation: "Worn tie rod ends cause loose steering and pulling. Requires alignment after replacement."
      },
      {
        name: "Tire Replacement",
        diyCost: "$80-$180 per tire",
        mechanicCost: "$120-$250 per tire installed",
        laborHours: "0.5-1.0",
        difficulty: "Shop Service",
        explanation: "Worn, damaged, or unevenly worn tires can cause shaking and pulling."
      },
      {
        name: "Wheel Bearing",
        diyCost: "$60-$150",
        mechanicCost: "$250-$500",
        laborHours: "1.5-2.5",
        difficulty: "Hard",
        explanation: "Worn wheel bearings can cause vibration and pulling. Requires press tools for replacement."
      }
    ]
  },
  ROUGH_IDLE_MISFIRE: {
    title: "Rough Idle / Misfire at Idle",
    categories: ["engine", "ignition", "air_intake"],
    likelyParts: [
      {
        name: "Spark Plugs",
        diyCost: "$20-$80",
        mechanicCost: "$120-$300",
        laborHours: "1.0-2.0",
        difficulty: "Easy-Medium",
        explanation: "Worn spark plugs commonly cause rough idle and misfires, especially when cold."
      },
      {
        name: "Ignition Coils",
        diyCost: "$40-$250",
        mechanicCost: "$180-$600",
        laborHours: "1.0-2.0",
        difficulty: "Medium",
        explanation: "Failing ignition coils cause intermittent misfires that are most noticeable at idle."
      },
      {
        name: "Idle Air Control (IAC) Valve",
        diyCost: "$50-$150",
        mechanicCost: "$150-$350",
        laborHours: "0.5-1.0",
        difficulty: "Easy-Medium",
        explanation: "Dirty or failing IAC valve can cause unstable idle and stalling."
      },
      {
        name: "Mass Air Flow (MAF) Sensor",
        diyCost: "$80-$250",
        mechanicCost: "$150-$400",
        laborHours: "0.5-1.0",
        difficulty: "Easy-Medium",
        explanation: "Dirty MAF sensor can cause incorrect fuel mixture at idle, leading to rough running."
      }
    ]
  },
  OVERHEATING: {
    title: "Engine Overheating",
    categories: ["cooling", "engine"],
    likelyParts: [
      {
        name: "Thermostat",
        diyCost: "$15-$40",
        mechanicCost: "$120-$250",
        laborHours: "0.5-1.0",
        difficulty: "Easy-Medium",
        explanation: "Stuck closed thermostat is the most common cause of overheating. Replace during cooling system service."
      },
      {
        name: "Radiator Fan / Motor",
        diyCost: "$80-$250",
        mechanicCost: "$200-$500",
        laborHours: "1.0-2.0",
        difficulty: "Medium",
        explanation: "Failed cooling fan causes overheating at idle or in traffic. Check fan operation."
      },
      {
        name: "Water Pump",
        diyCost: "$50-$200",
        mechanicCost: "$400-$800",
        laborHours: "2.0-3.0",
        difficulty: "Hard",
        explanation: "Failing water pump causes poor coolant circulation. Listen for bearing noise and check for leaks."
      },
      {
        name: "Radiator",
        diyCost: "$150-$600",
        mechanicCost: "$400-$1200",
        laborHours: "1.5-3.0",
        difficulty: "Medium",
        explanation: "Clogged or leaking radiator reduces cooling efficiency. Check for external and internal blockages."
      },
      {
        name: "Coolant Hose Replacement",
        diyCost: "$30-$100",
        mechanicCost: "$150-$400",
        laborHours: "1.0-2.0",
        difficulty: "Medium",
        explanation: "Aging coolant hoses can leak or collapse, causing overheating. Replace as a set."
      }
    ]
  },
  POOR_MPG_FUEL_SMELL: {
    title: "Poor Fuel Economy / Fuel Smell",
    categories: ["fuel", "engine", "emissions"],
    likelyParts: [
      {
        name: "Fuel Injectors",
        diyCost: "$150-$500",
        mechanicCost: "$300-$800",
        laborHours: "2.0-3.0",
        difficulty: "Hard",
        explanation: "Dirty or leaking fuel injectors can cause poor MPG and fuel smell. Professional cleaning recommended."
      },
      {
        name: "Fuel Filter",
        diyCost: "$15-$40",
        mechanicCost: "$80-$150",
        laborHours: "0.5-1.0",
        difficulty: "Easy",
        explanation: "Clogged fuel filter reduces fuel efficiency and can cause rich running."
      },
      {
        name: "Oxygen Sensor (Upstream)",
        diyCost: "$45-$150",
        mechanicCost: "$150-$400",
        laborHours: "0.5-1.0",
        difficulty: "Medium",
        explanation: "Faulty O2 sensor can cause rich fuel mixture, reducing MPG and causing fuel smell."
      },
      {
        name: "EVAP System Components",
        diyCost: "$50-$200",
        mechanicCost: "$200-$600",
        laborHours: "1.0-2.0",
        difficulty: "Medium",
        explanation: "EVAP leaks can cause fuel smell and affect fuel economy. Check purge/vent valves and hoses."
      }
    ]
  },
  BRAKE_SQUEAL_GRIND: {
    title: "Brake Squealing / Grinding Noise",
    categories: ["brakes", "wheels"],
    likelyParts: [
      {
        name: "Brake Pads",
        diyCost: "$30-$100 per axle",
        mechanicCost: "$150-$350 per axle",
        laborHours: "1.0-2.0",
        difficulty: "Medium",
        explanation: "Worn brake pads cause squealing and eventually grinding. Replace rotors if damaged."
      },
      {
        name: "Brake Rotors",
        diyCost: "$40-$120 each",
        mechanicCost: "$200-$450 per axle",
        laborHours: "1.0-2.0",
        difficulty: "Medium",
        explanation: "Warped or worn rotors cause pulsation and noise. Resurface or replace as needed."
      },
      {
        name: "Caliper Repair/Replacement",
        diyCost: "$80-$250",
        mechanicCost: "$300-$700",
        laborHours: "1.5-3.0",
        difficulty: "Hard",
        explanation: "Sticking calipers cause uneven wear and noise. May require rebuild or replacement."
      }
    ]
  }
};

// Helper function to generate part search links
function getPartSearchLinks(year, make, model, partName) {
  const query = encodeURIComponent(`${year} ${make} ${model} ${partName}`);

  return {
    rockauto: `https://www.rockauto.com/en/catalog/${make.toLowerCase()},${year}`,
    autozone: `https://www.autozone.com/searchresult?searchText=${query}`,
    oreilly: `https://www.oreillyauto.com/search?q=${query}`,
    google: `https://www.google.com/search?tbm=shop&q=${query}` 
  };
}

// Helper function to analyze symptoms and detect issues
function analyzeSymptoms(symptoms, selectedParts) {
  const symptomsLower = symptoms.toLowerCase();
  
  // Steering and wheel issues - specific to your example
  if (symptomsLower.includes('steering') && (symptomsLower.includes('shake') || symptomsLower.includes('vibrat') || symptomsLower.includes('shakes'))) {
    return {
      title: "Steering Wheel Vibration and Pull",
      categories: ["steering", "suspension", "wheels"],
      likelyParts: [
        {
          name: "Wheel Balance",
          diyCost: "$20-$60",
          mechanicCost: "$40-$120",
          difficulty: "Easy",
          description: "Balance weights may have fallen off or become imbalanced"
        },
        {
          name: "Wheel Alignment",
          diyCost: "$80-$150 (DIY kit)",
          mechanicCost: "$100-$200",
          difficulty: "Medium",
          description: "Front-end alignment needed due to wear or impact"
        },
        {
          name: "Tire Replacement",
          diyCost: "$400-$800",
          mechanicCost: "$450-$900",
          difficulty: "Medium",
          description: "Uneven tire wear or damaged tire causing vibration"
        },
        {
          name: "Tie Rod End",
          diyCost: "$60-$120",
          mechanicCost: "$150-$300",
          difficulty: "Hard",
          description: "Worn tie rod end affecting steering control"
        },
        {
          name: "Ball Joint",
          diyCost: "$80-$160",
          mechanicCost: "$200-$400",
          difficulty: "Hard",
          description: "Worn ball joint causing suspension issues"
        }
      ],
      diagnosis: "Steering wheel vibration and pulling to one side indicates wheel balance, alignment, or suspension component issues. Common causes include improper wheel balance, misaligned front end, worn tie rods, or damaged ball joints.",
      severity: "medium",
      estimatedLaborHours: "1-3 hours",
      confidence: 85
    };
  }
  
  // Rough idle/misfire
  if ((symptomsLower.includes('rough') || symptomsLower.includes('unstable')) && 
      (symptomsLower.includes('idle') || symptomsLower.includes('misfire'))) {
    return {
      title: "Engine Rough Idle or Misfire",
      categories: ["engine", "ignition", "fuel"],
      likelyParts: [
        {
          name: "Spark Plugs",
          diyCost: "$20-$60",
          mechanicCost: "$80-$150",
          difficulty: "Easy",
          description: "Worn or fouled spark plugs causing misfire"
        }
      ],
      diagnosis: "Engine rough idle indicates ignition or fuel system issues.",
      severity: "medium",
      estimatedLaborHours: "1-2 hours",
      confidence: 80
    };
  }
  
  // Overheating
  if (symptomsLower.includes('overheat') || symptomsLower.includes('hot') || 
      symptomsLower.includes('temperature') || symptomsLower.includes('cooling')) {
    return {
      title: "Engine Overheating",
      categories: ["cooling", "engine"],
      likelyParts: [
        {
          name: "Thermostat",
          diyCost: "$15-$40",
          mechanicCost: "$80-$150",
          difficulty: "Easy",
          description: "Stuck thermostat causing overheating"
        }
      ],
      diagnosis: "Engine overheating indicates cooling system failure.",
      severity: "high",
      estimatedLaborHours: "1-2 hours",
      confidence: 85
    };
  }
  
  // Poor MPG/fuel smell
  if ((symptomsLower.includes('mpg') || symptomsLower.includes('fuel economy') || 
       symptomsLower.includes('gas mileage')) || symptomsLower.includes('fuel smell')) {
    return {
      title: "Poor Fuel Economy or Fuel Smell",
      categories: ["fuel", "engine", "emissions"],
      likelyParts: [
        {
          name: "Oxygen Sensor",
          diyCost: "$35-$120",
          mechanicCost: "$150-$350",
          difficulty: "Easy",
          description: "Faulty O2 sensor affecting fuel mixture"
        }
      ],
      diagnosis: "Poor fuel economy indicates fuel system or sensor issues.",
      severity: "low",
      estimatedLaborHours: "1 hour",
      confidence: 75
    };
  }
  
  // Brake noise
  if (symptomsLower.includes('squeal') || symptomsLower.includes('grind') || 
      symptomsLower.includes('brake')) {
    return {
      title: "Brake System Noise",
      categories: ["brakes", "safety"],
      likelyParts: [
        {
          name: "Brake Pads",
          diyCost: "$30-$80",
          mechanicCost: "$100-$250",
          difficulty: "Medium",
          description: "Worn brake pads causing noise"
        }
      ],
      diagnosis: "Brake noise indicates worn brake components.",
      severity: "high",
      estimatedLaborHours: "1-2 hours",
      confidence: 90
    };
  }
  
  return null;
};

// Generate diagnostic result with proper structure
function generateDiagnosticResult(carInfo, code, symptoms, severity, recentRepairs) {
  const symptomsLower = symptoms.toLowerCase();
  let diagnosis = '';
  let affectedSystems = [];
  let likelyRepairs = [];
  let totalDiyEstimate = '';
  let totalMechanicEstimate = '';
  let nextSteps = [];

  // OBD-II Code matching
  if (code !== 'NONE') {
    switch (code) {
      case 'P0137':
        diagnosis = 'Downstream oxygen sensor circuit low voltage detected. This can cause poor fuel economy and failed emissions tests.';
        affectedSystems = ['engine', 'emissions', 'sensors'];
        likelyRepairs = [
          {
            part: 'Downstream Oxygen Sensor',
            diyCost: '$35-$160',
            mechanicCost: '$150-$400',
            difficulty: 'Medium',
            recommendation: 'Replace downstream O2 sensor and check for exhaust leaks.',
            searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} oxygen sensor`
          },
          {
            part: 'O2 Sensor Wiring',
            diyCost: '$10-$50',
            mechanicCost: '$50-$150',
            difficulty: 'Easy',
            recommendation: 'Inspect and repair damaged O2 sensor wiring and connectors.',
            searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} oxygen sensor wiring`
          }
        ];
        totalDiyEstimate = '$45-$210';
        totalMechanicEstimate = '$200-$550';
        nextSteps = ['Check for exhaust leaks', 'Test upstream O2 sensor', 'Clear codes and test drive'];
        break;

      case 'P0420':
        diagnosis = 'Catalyst system efficiency below threshold. Common cause is failed catalytic converter or oxygen sensor issues.';
        affectedSystems = ['engine', 'emissions', 'exhaust'];
        likelyRepairs = [
          {
            part: 'Catalytic Converter',
            diyCost: '$150-$900',
            mechanicCost: '$600-$2500',
            difficulty: 'Hard',
            recommendation: 'Replace catalytic converter if confirmed failed.',
            searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} catalytic converter`
          },
          {
            part: 'Oxygen Sensors',
            diyCost: '$70-$320',
            mechanicCost: '$200-$600',
            difficulty: 'Medium',
            recommendation: 'Test and replace faulty oxygen sensors first.',
            searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} oxygen sensors`
          },
          {
            part: 'Exhaust Leak Inspection',
            diyCost: '$0',
            mechanicCost: '$50-$200',
            difficulty: 'Easy',
            recommendation: 'Check for exhaust leaks before replacing converter.',
            searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} exhaust leak`
          }
        ];
        totalDiyEstimate = '$220-$1220';
        totalMechanicEstimate = '$850-$3300';
        nextSteps = ['Check for exhaust leaks', 'Test O2 sensors', 'Replace catalytic converter if needed'];
        break;

      case 'P0300':
        diagnosis = 'Random/multiple cylinder misfire detected. This can cause rough running, poor fuel economy, and damage to catalytic converter.';
        affectedSystems = ['engine', 'ignition', 'fuel'];
        likelyRepairs = [
          {
            part: 'Spark Plugs',
            diyCost: '$20-$100',
            mechanicCost: '$80-$200',
            difficulty: 'Easy',
            recommendation: 'Replace spark plugs and inspect ignition wires.',
            searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} spark plugs`
          },
          {
            part: 'Ignition Coils/Wires',
            diyCost: '$100-$300',
            mechanicCost: '$200-$600',
            difficulty: 'Hard',
            recommendation: 'Test and replace failing ignition coils or wires.',
            searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} ignition coils`
          },
          {
            part: 'Fuel Injector/Vacuum Leak',
            diyCost: '$20-$200',
            mechanicCost: '$100-$400',
            difficulty: 'Medium',
            recommendation: 'Check for vacuum leaks and clean fuel injectors.',
            searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} fuel injectors`
          }
        ];
        totalDiyEstimate = '$140-$600';
        totalMechanicEstimate = '$380-$1200';
        nextSteps = ['Check for vacuum leaks', 'Replace spark plugs', 'Test ignition system'];
        break;

      case 'P0171':
        diagnosis = 'System too lean (Bank 1). Engine is getting too much air or not enough fuel, causing poor performance.';
        affectedSystems = ['engine', 'fuel', 'air intake'];
        likelyRepairs = [
          {
            part: 'Vacuum Leak Repair',
            diyCost: '$10-$100',
            mechanicCost: '$50-$250',
            difficulty: 'Easy',
            recommendation: 'Inspect and repair vacuum hoses and intake gaskets.',
            searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} vacuum leak`
          },
          {
            part: 'MAF Sensor',
            diyCost: '$50-$150',
            mechanicCost: '$100-$300',
            difficulty: 'Easy',
            recommendation: 'Clean or replace mass air flow sensor.',
            searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} mass air flow sensor`
          },
          {
            part: 'Fuel Delivery Inspection',
            diyCost: '$0',
            mechanicCost: '$100-$400',
            difficulty: 'Medium',
            recommendation: 'Check fuel pressure and filter.',
            searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} fuel filter`
          }
        ];
        totalDiyEstimate = '$60-$250';
        totalMechanicEstimate = '$250-$950';
        nextSteps = ['Check for vacuum leaks', 'Clean MAF sensor', 'Check fuel pressure'];
        break;

      case 'P0455':
        diagnosis = 'EVAP system large leak detected. Usually caused by loose gas cap or EVAP system component failure.';
        affectedSystems = ['engine', 'emissions', 'fuel'];
        likelyRepairs = [
          {
            part: 'Gas Cap',
            diyCost: '$15-$50',
            mechanicCost: '$20-$80',
            difficulty: 'Easy',
            recommendation: 'Tighten or replace gas cap first.',
            searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} gas cap`
          },
          {
            part: 'EVAP Purge Valve',
            diyCost: '$30-$100',
            mechanicCost: '$100-$250',
            difficulty: 'Medium',
            recommendation: 'Test and replace EVAP purge valve if needed.',
            searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} evap purge valve`
          },
          {
            part: 'EVAP Hose Leak',
            diyCost: '$10-$80',
            mechanicCost: '$50-$200',
            difficulty: 'Easy',
            recommendation: 'Inspect and repair cracked EVAP hoses.',
            searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} evap hoses`
          }
        ];
        totalDiyEstimate = '$55-$230';
        totalMechanicEstimate = '$170-$530';
        nextSteps = ['Check/tighten gas cap', 'Inspect EVAP hoses', 'Test purge valve'];
        break;
    }
  }

  // Symptom-based matching for steering/wheel issues
  if (symptomsLower.includes('steering') && (symptomsLower.includes('shake') || symptomsLower.includes('vibrat') || symptomsLower.includes('shakes') || symptomsLower.includes('high speed'))) {
    diagnosis = `Analysis of symptoms: ${symptoms}. Steering wheel vibration and pulling to one side indicates wheel balance, alignment, or suspension component issues. Common causes include improper wheel balance, misaligned front end, worn tie rods, or damaged ball joints.`;
    affectedSystems = ['wheels', 'steering', 'suspension'];
    likelyRepairs = [
      {
        part: 'Wheel Balance',
        diyCost: '$0 - shop required',
        mechanicCost: '$40 - $100',
        difficulty: 'Shop service',
        recommendation: 'Start with a wheel balance if shaking happens at highway speeds.',
        searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} wheel balance`
      },
      {
        part: 'Wheel Alignment',
        diyCost: '$0 - shop required',
        mechanicCost: '$80 - $200',
        difficulty: 'Shop service',
        recommendation: 'Get alignment checked if vehicle pulls to one side.',
        searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} wheel alignment`
      },
      {
        part: 'Tire Inspection/Replacement',
        diyCost: '$400-$800',
        mechanicCost: '$450-$900',
        difficulty: 'Medium',
        recommendation: 'Inspect tires for uneven wear and damage.',
        searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} tires`
      },
      {
        part: 'Tie Rod End Inspection',
        diyCost: '$60-$120',
        mechanicCost: '$150-$300',
        difficulty: 'Hard',
        recommendation: 'Check tie rod ends for wear and play.',
        searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} tie rod end`
      },
      {
        part: 'Ball Joint Inspection',
        diyCost: '$80-$160',
        mechanicCost: '$200-$400',
        difficulty: 'Hard',
        recommendation: 'Inspect ball joints for wear and damage.',
        searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} ball joint`
      }
    ];
    totalDiyEstimate = '$540-$1080';
    totalMechanicEstimate = '$920-$1900';
    nextSteps = [
      'Check tire pressure',
      'Inspect tire wear',
      'Get wheels balanced',
      'Get alignment checked',
      'Inspect tie rods, ball joints, and wheel bearings'
    ];
  }

  // Default case for other symptoms
  if (!diagnosis && symptoms) {
    diagnosis = `Analysis of symptoms: ${symptoms}. General diagnostic recommended for accurate identification of issues.`;
    affectedSystems = ['general'];
    likelyRepairs = [
      {
        part: 'Diagnostic Service',
        diyCost: '$0',
        mechanicCost: '$100-$200',
        difficulty: 'Easy',
        recommendation: 'Professional diagnostic service to identify the issue.',
        searchQuery: `${carInfo.year} ${carInfo.make} ${carInfo.model} diagnostic service`
      }
    ];
    totalDiyEstimate = '$0';
    totalMechanicEstimate = '$100-$200';
    nextSteps = ['Professional diagnostic inspection', 'Check for common issues based on symptoms'];
  }

  return {
    diagnosis: diagnosis || 'Diagnostic analysis completed.',
    affectedSystems: affectedSystems,
    likelyRepairs: likelyRepairs,
    totalDiyEstimate: totalDiyEstimate || '$0',
    totalMechanicEstimate: totalMechanicEstimate || '$100-$200',
    nextSteps: nextSteps,
    timestamp: new Date().toISOString(),
    carInfo: carInfo,
    code: code,
    symptoms: symptoms,
    severity: severity
  };
}

function App() {
  const [carInfo, setCarInfo] = useState({ year: '', make: '', model: '' });
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [selectedParts, setSelectedParts] = useState([]);
  const [history, setHistory] = useState([]);
  const [garage, setGarage] = useState([]);
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [activeSection, setActiveSection] = useState('scan');
  const [vehicleValidation, setVehicleValidation] = useState(null);
  const [queueStatus, setQueueStatus] = useState('WAITING');

  useEffect(() => {
    setHistory(getDiagnosticHistory());
  }, []);

  // New form states for retro design
  const [code, setCode] = useState('NONE');
  const [severity, setSeverity] = useState('Medium');
  const [symptoms, setSymptoms] = useState('');
  const [recentRepairs, setRecentRepairs] = useState('');
  const [trim, setTrim] = useState('');
  const [mileage, setMileage] = useState('');

  // OBD-II code to category mapping
  const obdCodeMapping = {
    'NONE': [], // No auto-selection for general troubleshooting
    'P0137': ['exhaust', 'sensors'],
    'P0420': ['emissions', 'exhaust'],
    'P0300': ['engine', 'ignition'],
    'P0171': ['fuel', 'air_intake'],
    'P0128': ['cooling'],
    'P0113': ['air_intake', 'sensors'],
    'P0455': ['emissions', 'fuel'],
    'P0440': ['emissions', 'fuel'],
    'P0446': ['emissions', 'fuel'],
    'P0141': ['exhaust', 'sensors'],
    'P0401': ['exhaust', 'emissions'],
    'P0442': ['emissions', 'fuel'],
    'P0443': ['emissions', 'fuel'],
    'P0445': ['emissions', 'fuel'],
    'P0449': ['emissions', 'fuel'],
    'P0455': ['emissions', 'fuel'],
    'P0456': ['emissions', 'fuel'],
    'P0457': ['emissions', 'fuel']
  };

  useEffect(() => {
    setHistory(getDiagnosticHistory());
  }, []);

  // Auto-select categories based on OBD-II code
  useEffect(() => {
    if (code && obdCodeMapping[code]) {
      setSelectedParts(obdCodeMapping[code]);
    }
  }, [code]);

  const handleSystemSelect = (systemId) => {
    // Toggle selection - add if not selected, remove if already selected
    setSelectedParts(prev => {
      if (prev.includes(systemId)) {
        return prev.filter(part => part !== systemId);
      } else {
        return [...prev, systemId];
      }
    });
  };

  const validateVehicleData = async () => {
    if (carInfo.make && carInfo.model && carInfo.year) {
      const validation = await validateVehicle(carInfo.make, carInfo.model, carInfo.year);
      setVehicleValidation(validation);
    }
  };

  // Validate vehicle when car info changes
  useEffect(() => {
    validateVehicleData();
  }, [carInfo.make, carInfo.model, carInfo.year]);

  const handleDiagnostic = async () => {
    console.log("Run scan clicked");
    console.log("form data:", carInfo);
    console.log("symptoms:", symptoms);
    console.log("code:", code);
    console.log("severity:", severity);
    
    setError('');
    setSavedMessage('');
    setScanResult(null);
    setQueueStatus('PROCESSING');

    // Validate required fields
    if (!carInfo.year || !carInfo.make || !carInfo.model) {
      setError('Please enter vehicle information (Year, Make, Model)');
      setQueueStatus('WAITING');
      return;
    }

    if (!symptoms && code === 'NONE') {
      setError('Please enter symptoms or select an OBD-II code');
      setQueueStatus('WAITING');
      return;
    }

    // Generate proper scan result structure
    const result = generateDiagnosticResult(carInfo, code, symptoms, severity, recentRepairs);
    
    console.log("Generated scan result:", result);

    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Set the scan result
    console.log("Setting scanResult to state:", result);
    setScanResult(result);
    setSelectedParts(result.affectedSystems || []);
    setQueueStatus('COMPLETE');
    
    setSavedMessage('Diagnostic complete! Review the results below.');
    console.log("Scan result set to state:", result);
  };

  const handleSaveResult = () => {
    if (!scanResult) return;

    const record = saveDiagnosticResult({
      id: `diag_${Date.now()}`,
      vehicle: carInfo,
      code: code,
      symptoms: symptoms,
      diagnosis: scanResult,
      status: 'completed',
      timestamp: new Date().toISOString()
    });

    setHistory(getDiagnosticHistory());
    
    // Safe access to vehicle properties with fallbacks
    const year = record?.vehicle?.year || 'Unknown';
    const make = record?.vehicle?.make || 'Unknown';
    const model = record?.vehicle?.model || 'Unknown';
    
    setSavedMessage(`Saved diagnostic report for ${year} ${make} ${model}.`);
  };

  const handleRestoreDiagnostic = (savedDiagnostic) => {
    // Handle both old (carInfo) and new (vehicle) data structures
    const vehicleData = savedDiagnostic.vehicle || savedDiagnostic.carInfo || {};
    
    // Restore car information
    setCarInfo({
      year: vehicleData?.year || '',
      make: vehicleData?.make || '',
      model: vehicleData?.model || ''
    });
    
    // Restore diagnostic information
    setCode(savedDiagnostic.code || 'NONE');
    setSymptoms(savedDiagnostic.symptoms || '');
    setScanResult(savedDiagnostic.diagnosis);
    setSelectedParts(savedDiagnostic.diagnosis?.affectedSystems || []);
    setQueueStatus('COMPLETE');
    
    // Switch to scan section
    setActiveSection('scan');
    
    setSavedMessage(`Restored diagnostic from ${new Date(savedDiagnostic.timestamp).toLocaleDateString()}`);
  };

  const handleDeleteDiagnostic = (id) => {
    if (window.confirm('Are you sure you want to delete this diagnostic history?')) {
      deleteDiagnosticResult(id);
      setHistory(getDiagnosticHistory());
      setSavedMessage('Diagnostic history deleted');
    }
  };

  const handleDeleteHistory = (id) => {
    if (window.confirm('Are you sure you want to delete this diagnostic history?')) {
      deleteDiagnosticResult(id);
      setHistory(getDiagnosticHistory());
      setSavedMessage('Diagnostic history deleted');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all diagnostic history?')) {
      clearDiagnosticHistory();
      setHistory([]);
      setSavedMessage('All diagnostic history cleared');
    }
  };

  const handleSaveToGarage = () => {
    const garageEntry = {
      id: `garage_${Date.now()}`,
      carInfo: {
        year: carInfo.year || 'Unknown',
        make: carInfo.make || 'Unknown',
        model: carInfo.model || 'Unknown',
        trim: trim || '',
        mileage: mileage || ''
      },
      timestamp: new Date().toISOString(),
      type: 'garage'
    };
    
    setGarage([...garage, garageEntry]);
    
    // Safe access to carInfo properties with fallbacks
    const year = garageEntry.carInfo.year;
    const make = garageEntry.carInfo.make;
    const model = garageEntry.carInfo.model;
    
    setSavedMessage(`Vehicle saved to garage: ${year} ${make} ${model}`);
  };

  const resetDiagnostic = () => {
    setCode('NONE');
    setSeverity('Medium');
    setSymptoms('');
    setRecentRepairs('');
    setTrim('');
    setMileage('');
    setScanResult(null);
    setSelectedParts([]);
    setQueueStatus('WAITING');
    setError('');
  };

  const isRunning = queueStatus === 'PROCESSING';

  const environment = process.env.NODE_ENV || 'development';

  return (
    <div className="retro-body">
      <nav className="retro-navbar">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-auto">
              <div className="d-flex align-items-center">
                <div className="retro-logo me-3">🚗</div>
                <div>
                  <h1 className="retro-title mb-0">RETRO CAR DIAGNOSTIC</h1>
                  <div className="retro-subtitle">Advanced Diagnostic System v2.0</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <ul className="retro-nav-tabs">
            <li>
              <button 
                className={`retro-nav-tab ${activeSection === 'scan' ? 'active' : ''}`}
                onClick={() => setActiveSection('scan')}
              >
                SCAN
              </button>
            </li>
            <li>
              <button 
                className={`retro-nav-tab ${activeSection === 'mechanics' ? 'active' : ''}`}
                onClick={() => setActiveSection('mechanics')}
              >
                MECHANICS
              </button>
            </li>
            <li>
              <button 
                className={`retro-nav-tab ${activeSection === 'garage' ? 'active' : ''}`}
                onClick={() => setActiveSection('garage')}
              >
                GARAGE
              </button>
            </li>
            <li>
              <button 
                className={`retro-nav-tab ${activeSection === 'history' ? 'active' : ''}`}
                onClick={() => setActiveSection('history')}
              >
                HISTORY
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container-fluid px-3 px-lg-5 py-5">
        <section className="hero text-center mb-4">
          <h1 className="main-title">RETRO CAR DIAGNOSTIC</h1>
          <p className="lead">Advanced Vehicle Diagnostic System with AI-Powered Analysis</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <div className="badge-retro">
              <span className="badge-icon">🤖</span>
              <span className="badge-text">AI Analysis</span>
            </div>
            <div className="badge-retro">
              <span className="badge-icon">📊</span>
              <span className="badge-text">Real-time Processing</span>
            </div>
            <div className="badge-retro">
              <span className="badge-icon">🔧</span>
              <span className="badge-text">Expert Recommendations</span>
            </div>
          </div>
        </section>

        {activeSection === 'scan' && (
          <div className="row g-4">
            <div className="col-12">
              {/* 3D Vehicle Viewer at the very top */}
              <div className="retro-window">
                <div className="window-top">
                  <span>3D VEHICLE SYSTEM VIEWER</span>
                  <span>HIGHLIGHTED: {selectedParts.length > 0 ? selectedParts.join(', ').toUpperCase() : 'NONE'}</span>
                </div>
                <div className="window-body">
                  <RetroCarViewer3D selectedParts={selectedParts} onSystemSelect={handleSystemSelect} />
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              {/* Vehicle Info and Diagnostic Form */}
              <div className="retro-window">
                <div className="window-top">
                  <span>VEHICLE DIAGNOSTIC SCANNER</span>
                  <span>STATUS: {queueStatus.toUpperCase()}</span>
                </div>
                <div className="window-body">
                  <RetroDiagnosticForm
                    carInfo={carInfo}
                    setCarInfo={setCarInfo}
                    code={code}
                    setCode={setCode}
                    severity={severity}
                    setSeverity={setSeverity}
                    symptoms={symptoms}
                    setSymptoms={setSymptoms}
                    recentRepairs={recentRepairs}
                    setRecentRepairs={setRecentRepairs}
                    mileage={mileage}
                    setMileage={setMileage}
                    onSubmit={handleDiagnostic}
                    onSaveToGarage={handleSaveToGarage}
                    onClear={resetDiagnostic}
                    vehicleValidation={vehicleValidation}
                  />
                </div>
              </div>

              {/* Scan Results */}
              {scanResult && scanResult.likelyRepairs && scanResult.likelyRepairs.length > 0 && (
                <div className="retro-window mt-4">
                  <div className="window-top">
                    <span>SCAN RESULTS</span>
                    <span>DIAGNOSIS COMPLETE</span>
                  </div>
                  <div className="window-body">
                    <RetroResults result={scanResult} carInfo={carInfo} />
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-4">
              {/* Quick Stats */}
              <div className="retro-window">
                <div className="window-top">
                  <span>DIAGNOSTIC STATS</span>
                  <span>{history.length} RECORDS</span>
                </div>
                <div className="window-body">
                  <div className="text-center">
                    <div className="mb-3">
                      <div className="retro-stat-number">{history.length}</div>
                      <div className="retro-stat-label">Total Scans</div>
                    </div>
                    <div className="mb-3">
                      <div className="retro-stat-number">{garage.length}</div>
                      <div className="retro-stat-label">Vehicles</div>
                    </div>
                    <div className="mb-3">
                      <div className="retro-stat-number">{queueStatus === 'PROCESSING' ? 'RUNNING' : 'READY'}</div>
                      <div className="retro-stat-label">Scanner Status</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'mechanics' && (
          <div className="row g-4">
            <div className="col-12">
              <MechanicFinder />
            </div>
          </div>
        )}

        {activeSection === 'garage' && (
          <div className="row g-4">
            <div className="col-12">
              <RetroGarage 
                garage={garage} 
                onRestoreDiagnostic={handleRestoreDiagnostic} 
                onDeleteDiagnostic={handleDeleteDiagnostic} 
              />
            </div>
          </div>
        )}

        {activeSection === 'history' && (
          <div className="row g-4">
            <div className="col-12">
              <RetroHistory 
                history={history} 
                onDelete={handleDeleteHistory} 
                onClear={handleClearHistory} 
              />
            </div>
          </div>
        )}

        {/* Info bars - fixed position to prevent stacking */}
        <div className="info-bar-container">
          {error && (
            <div className="info-bar error">
              ERROR: {error}
            </div>
          )}
          {savedMessage && (
            <div className="info-bar success">
              {savedMessage}
            </div>
          )}
          {queueStatus === 'PROCESSING' && (
            <div className="info-bar processing">
              <div className="d-flex align-items-center">
                <div className="processing-spinner me-2"></div>
                AI DIAGNOSTIC ENGINE RUNNING...
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="scanlines"></div>
    </div>
  );
}

export default App;
