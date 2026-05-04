const REPAIR_API_BASE_URL = process.env.REACT_APP_REPAIR_PRICING_API_URL || 'https://api.vehicledatabases.com/vehicle-repairs/v2';
const REPAIR_API_KEY = process.env.REACT_APP_REPAIR_PRICING_API_KEY;

const repairKeywordsBySystem = {
  Engine: ['engine', 'spark', 'fuel', 'timing', 'oil', 'water pump', 'thermostat', 'radiator'],
  'Engine/Electrical': ['engine', 'starter', 'alternator', 'battery', 'ignition'],
  Electrical: ['battery', 'alternator', 'starter', 'ignition'],
  Exhaust: ['exhaust', 'catalytic', 'oxygen', 'emissions'],
  Brakes: ['brake', 'rotor', 'caliper'],
  'Wheels/Suspension': ['wheel', 'tire', 'alignment', 'axle', 'suspension'],
  'Cooling System': ['coolant', 'radiator', 'thermostat', 'water pump'],
  Transmission: ['transmission', 'clutch']
};

const normalizeVin = (vin) => vin?.trim().toUpperCase();

const getCostBucket = (repair) => {
  const independent = repair.costs?.independent || [];
  const dealer = repair.costs?.dealer || [];
  const preferred = independent.length ? independent : dealer;
  return preferred.find(cost => cost.name === 'total') || null;
};

const matchesProblem = (repair, problem) => {
  const title = repair.title?.toLowerCase() || '';
  const problemText = `${problem.name || ''} ${problem.description || ''} ${problem.system || ''}`.toLowerCase();
  const systemKeywords = repairKeywordsBySystem[problem.system] || [];

  return systemKeywords.some(keyword => title.includes(keyword.toLowerCase())) ||
    problemText.split(/\W+/).filter(word => word.length > 4).some(word => title.includes(word));
};

export const getRepairPricingForVin = async (vin) => {
  const normalizedVin = normalizeVin(vin);

  if (!normalizedVin || normalizedVin.length !== 17 || !REPAIR_API_KEY) {
    return null;
  }

  const response = await fetch(`${REPAIR_API_BASE_URL}/${normalizedVin}`, {
    headers: {
      'x-authkey': REPAIR_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`Repair pricing request failed: ${response.status}`);
  }

  const payload = await response.json();
  return payload?.data || null;
};

export const findBestRepairPrice = (repairData, problem) => {
  const repairs = repairData?.repair || [];
  const matchedRepair = repairs.find(repair => matchesProblem(repair, problem));
  const repair = matchedRepair || repairs.find(item => getCostBucket(item));
  const totalCost = repair ? getCostBucket(repair) : null;

  if (!repair || !totalCost) {
    return null;
  }

  return {
    source: 'Vehicle Databases Repair API',
    title: repair.title,
    description: repair.description,
    currency: repairData.currency || 'USD',
    low: totalCost.low,
    average: totalCost.average,
    high: totalCost.high,
    formattedRange: `$${totalCost.low}-${totalCost.high}`
  };
};

export const enrichDiagnosisWithRepairPricing = async (vehicle, problem, diagnosis) => {
  try {
    const repairData = await getRepairPricingForVin(vehicle.vin);
    const repairPrice = findBestRepairPrice(repairData, problem);

    if (!repairPrice) {
      return diagnosis;
    }

    return {
      ...diagnosis,
      estimatedCost: repairPrice.formattedRange,
      repairPricing: repairPrice,
      recommendations: [
        ...(diagnosis.recommendations || []),
        `Compare local mechanic quotes against the ${repairPrice.source} average for ${repairPrice.title}.`
      ]
    };
  } catch (error) {
    console.error('Repair Pricing API Error:', error);
    return diagnosis;
  }
};
