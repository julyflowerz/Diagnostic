// NHTSA VPIC API service for vehicle data

// Fetch vehicle models for a specific make and year
export const getVehicleModels = async (make, year) => {
  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`);
    const data = await response.json();
    return data.Results || [];
  } catch (error) {
    console.error('Error fetching vehicle models:', error);
    return [];
  }
};

// Fetch vehicle makes for a specific year
export const getVehicleMakes = async (year) => {
  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForManufacturerName/honda?format=json`);
    const data = await response.json();
    return data.Results || [];
  } catch (error) {
    console.error('Error fetching vehicle makes:', error);
    return [];
  }
};

// Fetch vehicle details for specific make, model, and year
export const getVehicleDetails = async (make, model, year) => {
  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`);
    const data = await response.json();
    
    // Find the specific model
    const modelData = data.Results.find(item => 
      item.Model_Name.toLowerCase() === model.toLowerCase()
    );
    
    return modelData || null;
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
    return null;
  }
};

// Fetch all makes (useful for dropdown)
export const getAllMakes = async () => {
  try {
    const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json');
    const data = await response.json();
    return data.Results || [];
  } catch (error) {
    console.error('Error fetching all makes:', error);
    return [];
  }
};

// Get common vehicle types and their typical parts
export const getVehicleTypeParts = (make, model) => {
  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase();
  
  // Enhanced parts mapping based on vehicle type
  const vehicleTypeMappings = {
    // Honda specific mappings
    honda: {
      civic: {
        commonParts: ['spark plugs', 'oil filter', 'air filter', 'cabin air filter', 'brake pads', 'rotors'],
        engineTypes: ['1.6L', '1.8L', '2.0L', '1.5L Turbo'],
        specialFeatures: modelLower.includes('si') ? 'performance' : 'standard'
      },
      accord: {
        commonParts: ['spark plugs', 'oil filter', 'air filter', 'cabin air filter', 'brake pads', 'rotors', 'alternator'],
        engineTypes: ['2.4L', '3.0L V6', '3.5L V6', '1.5L Turbo', '2.0L Turbo'],
        specialFeatures: modelLower.includes('touring') ? 'premium' : 'standard'
      },
      crv: {
        commonParts: ['oil filter', 'air filter', 'cabin air filter', 'brake pads', 'rotors', 'wiper blades'],
        engineTypes: ['2.4L', '1.5L Turbo'],
        specialFeatures: 'suv'
      }
    },
    // Toyota specific mappings
    toyota: {
      camry: {
        commonParts: ['spark plugs', 'oil filter', 'air filter', 'cabin air filter', 'brake pads', 'rotors'],
        engineTypes: ['2.5L 4-cylinder', '3.5L V6'],
        specialFeatures: 'sedan'
      },
      corolla: {
        commonParts: ['spark plugs', 'oil filter', 'air filter', 'cabin air filter', 'brake pads', 'rotors'],
        engineTypes: ['1.8L 4-cylinder', '2.0L', '1.8L Hybrid'],
        specialFeatures: 'compact'
      }
    },
    // Ford specific mappings
    ford: {
      f150: {
        commonParts: ['oil filter', 'air filter', 'cabin air filter', 'brake pads', 'rotors', 'spark plugs'],
        engineTypes: ['3.3L V6', '5.0L V8', '2.7L EcoBoost', '3.5L EcoBoost'],
        specialFeatures: 'truck'
      },
      mustang: {
        commonParts: ['spark plugs', 'oil filter', 'air filter', 'brake pads', 'rotors', 'clutch kit'],
        engineTypes: ['2.3L EcoBoost', '5.0L V8', '5.2L V8'],
        specialFeatures: 'performance'
      }
    }
  };
  
  return vehicleTypeMappings[makeLower]?.[modelLower] || {
    commonParts: ['oil filter', 'air filter', 'spark plugs', 'brake pads'],
    engineTypes: ['Unknown'],
    specialFeatures: 'standard'
  };
};

// Get enhanced parts recommendations based on vehicle data
export const getEnhancedPartsRecommendations = (make, model, year, issueType) => {
  const vehicleInfo = getVehicleTypeParts(make, model);
  
  // Base parts recommendations with vehicle-specific enhancements
  const enhancedRecommendations = {
    P0137: {
      title: "O2 Sensor Circuit Low Voltage (Bank 1 Sensor 2)",
      categories: ["exhaust", "sensors", "emissions"],
      likelyParts: [
        {
          name: "Downstream Oxygen Sensor",
          diyCost: vehicleInfo.specialFeatures === 'performance' ? "$45-$150" : "$35-$120",
          mechanicCost: vehicleInfo.specialFeatures === 'performance' ? "$180-$400" : "$150-$350",
          laborHours: "0.5-1.0",
          difficulty: "Easy-Medium",
          explanation: `The downstream O2 sensor monitors catalytic converter efficiency for your ${year} ${make} ${model}. Low voltage typically indicates sensor failure or wiring issues.`,
          vehicleSpecific: `Compatible with ${vehicleInfo.engineTypes.join(' or ')} engines`
        },
        {
          name: "O2 Sensor Wiring Repair",
          diyCost: "$10-$40",
          mechanicCost: "$100-$250",
          laborHours: "0.5-1.5",
          difficulty: "Medium",
          explanation: "Damaged wiring or corroded connectors can cause low voltage readings. Requires electrical testing and repair.",
          vehicleSpecific: `Common issue on ${make} ${model} models with high mileage`
        }
      ]
    },
    P0300: {
      title: "Random/Multiple Cylinder Misfire Detected",
      categories: ["engine", "ignition", "fuel"],
      likelyParts: [
        {
          name: "Spark Plugs (Set of 4)",
          diyCost: vehicleInfo.specialFeatures === 'performance' ? "$40-$120" : "$20-$80",
          mechanicCost: vehicleInfo.specialFeatures === 'performance' ? "$180-$400" : "$120-$300",
          laborHours: "1.0-2.0",
          difficulty: "Easy-Medium",
          explanation: `Worn or fouled spark plugs are the most common cause of random misfires in your ${year} ${make} ${model}. Replace as a set for best results.`,
          vehicleSpecific: `Recommended for ${vehicleInfo.engineTypes.join(' or ')} engines`
        },
        {
          name: "Ignition Coils / Wires",
          diyCost: vehicleInfo.specialFeatures === 'performance' ? "$80-$350" : "$40-$250",
          mechanicCost: vehicleInfo.specialFeatures === 'performance' ? "$250-$800" : "$180-$600",
          laborHours: "1.0-2.0",
          difficulty: "Medium",
          explanation: "Failing ignition coils or spark plug wires can cause intermittent misfires across multiple cylinders.",
          vehicleSpecific: `${make} ${model} coil-on-plug systems may require special tools`
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
          mechanicCost: vehicleInfo.specialFeatures === 'performance' ? "$60-$120" : "$40-$100",
          laborHours: "0.5-1.0",
          difficulty: "Shop Service",
          explanation: "Unbalanced wheels cause vibration at highway speeds. Requires professional balancing equipment.",
          vehicleSpecific: `${model} typically requires dynamic balancing`
        },
        {
          name: "Wheel Alignment",
          diyCost: "$0 DIY not recommended",
          mechanicCost: vehicleInfo.specialFeatures === 'suv' ? "$100-$200" : "$80-$180",
          laborHours: "1.0",
          difficulty: "Shop Service",
          explanation: "Poor alignment causes pulling and uneven tire wear. Requires alignment rack.",
          vehicleSpecific: `${make} ${model} alignment specifications: Front toe -0.05° to 0.05°`
        }
      ]
    }
  };
  
  return enhancedRecommendations[issueType] || null;
};

// Validate vehicle data against NHTSA database
export const validateVehicle = async (make, model, year) => {
  try {
    const models = await getVehicleModels(make, year);
    const isValid = models.some(m => 
      m.Model_Name.toLowerCase() === model.toLowerCase()
    );
    
    return {
      isValid,
      availableModels: models.map(m => m.Model_Name),
      suggestedModel: !isValid && models.length > 0 ? models[0].Model_Name : null
    };
  } catch (error) {
    console.error('Error validating vehicle:', error);
    return { isValid: false, availableModels: [], suggestedModel: null };
  }
};
