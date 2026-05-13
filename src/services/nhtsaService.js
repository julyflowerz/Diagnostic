// NHTSA API Service
// This service fetches vehicle complaints, recalls, and product information from NHTSA APIs

class NHTSAService {
  constructor() {
    this.baseUrl = 'https://api.nhtsa.gov';
    this.cache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Helper method for caching
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Fetch vehicle complaints by make, model, and year
  async getComplaintsByVehicle(make, model, year) {
    try {
      const cacheKey = `complaints_${make}_${model}_${year}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const url = `${this.baseUrl}/complaints/complaintsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${year}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`NHTSA API request failed: ${response.status}`);
      }

      const data = await response.json();
      const processedData = this.processComplaintsData(data);
      
      this.setCachedData(cacheKey, processedData);
      return processedData;
    } catch (error) {
      console.error('Error fetching NHTSA complaints:', error);
      return this.getMockComplaintsData(make, model, year);
    }
  }

  // Fetch vehicle models for a given year and make
  async getVehicleModels(year, make) {
    try {
      const cacheKey = `models_${year}_${make}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const url = `${this.baseUrl}/products/vehicle/models?modelYear=${year}&make=${encodeURIComponent(make)}&issueType=c`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`NHTSA API request failed: ${response.status}`);
      }

      const data = await response.json();
      const models = data.results?.map(item => item.model) || [];
      
      this.setCachedData(cacheKey, models);
      return models;
    } catch (error) {
      console.error('Error fetching vehicle models:', error);
      return [];
    }
  }

  // Fetch recalls for a vehicle
  async getRecallsByVehicle(make, model, year) {
    try {
      const cacheKey = `recalls_${make}_${model}_${year}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const url = `${this.baseUrl}/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${year}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`NHTSA API request failed: ${response.status}`);
      }

      const data = await response.json();
      const processedData = this.processRecallsData(data);
      
      this.setCachedData(cacheKey, processedData);
      return processedData;
    } catch (error) {
      console.error('Error fetching NHTSA recalls:', error);
      return this.getMockRecallsData(make, model, year);
    }
  }

  // Process complaints data to extract useful information
  processComplaintsData(data) {
    if (!data.results || !Array.isArray(data.results)) {
      return {
        totalComplaints: 0,
        components: {},
        commonSymptoms: [],
        safetyIssues: [],
        summary: 'No complaint data available'
      };
    }

    const complaints = data.results;
    const components = {};
    const symptoms = [];
    const safetyIssues = [];

    complaints.forEach(complaint => {
      // Count by component
      const component = complaint.component || 'Unknown';
      components[component] = (components[component] || 0) + 1;

      // Extract symptoms from description
      const description = complaint.description || '';
      const symptomKeywords = this.extractSymptomKeywords(description);
      symptoms.push(...symptomKeywords);

      // Identify safety-related issues
      if (this.isSafetyRelated(complaint)) {
        safetyIssues.push({
          summary: complaint.summary,
          component: component,
          consequence: complaint.consequence
        });
      }
    });

    // Get most common symptoms
    const symptomCounts = {};
    symptoms.forEach(symptom => {
      symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
    });

    const commonSymptoms = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([symptom, count]) => ({ symptom, count }));

    return {
      totalComplaints: complaints.length,
      components: Object.entries(components)
        .sort(([,a], [,b]) => b - a)
        .reduce((acc, [component, count]) => {
          acc[component] = { count, percentage: Math.round((count / complaints.length) * 100) };
          return acc;
        }, {}),
      commonSymptoms,
      safetyIssues,
      summary: `Found ${complaints.length} complaints with ${Object.keys(components).length} different components affected.`
    };
  }

  // Process recalls data
  processRecallsData(data) {
    if (!data.results || !Array.isArray(data.results)) {
      return {
        totalRecalls: 0,
        recalls: [],
        summary: 'No recall data available'
      };
    }

    const recalls = data.results.map(recall => ({
      nhtsaCampaignNumber: recall.NHTSCACampaignNumber,
      component: recall.component,
      summary: recall.summary,
      consequence: recall.consequence,
      remedy: recall.remedy,
      startDate: recall.startDate
    }));

    return {
      totalRecalls: recalls.length,
      recalls,
      summary: `Found ${recalls.length} recalls for this vehicle.`
    };
  }

  // Extract symptom keywords from complaint descriptions
  extractSymptomKeywords(description) {
    const keywords = [
      'noise', 'vibration', 'shaking', 'stalling', 'dies', 'wont start', 'hard to start',
      'smoke', 'leak', 'overheating', 'brake', 'steering', 'acceleration', 'transmission',
      'engine', 'battery', 'electrical', 'light', 'warning', 'check engine', 'abs', 'airbag',
      'tire', 'wheel', 'suspension', 'exhaust', 'fuel', 'oil', 'coolant', 'radiator',
      'alternator', 'starter', 'spark plug', 'oxygen sensor', 'catalytic converter'
    ];

    const found = [];
    const lowerDesc = description.toLowerCase();
    
    keywords.forEach(keyword => {
      if (lowerDesc.includes(keyword)) {
        found.push(keyword);
      }
    });

    return found;
  }

  // Check if a complaint is safety-related
  isSafetyRelated(complaint) {
    const safetyKeywords = ['fire', 'crash', 'injury', 'death', 'safety', 'danger', 'hazard'];
    const text = `${complaint.summary} ${complaint.consequence}`.toLowerCase();
    
    return safetyKeywords.some(keyword => text.includes(keyword));
  }

  // Mock data for testing when API fails
  getMockComplaintsData(make, model, year) {
    const mockData = {
      totalComplaints: 45,
      components: {
        'Engine': { count: 15, percentage: 33 },
        'Transmission': { count: 12, percentage: 27 },
        'Brakes': { count: 8, percentage: 18 },
        'Electrical System': { count: 6, percentage: 13 },
        'Steering': { count: 4, percentage: 9 }
      },
      commonSymptoms: [
        { symptom: 'engine', count: 18 },
        { symptom: 'transmission', count: 14 },
        { symptom: 'brake', count: 9 },
        { symptom: 'electrical', count: 7 },
        { symptom: 'noise', count: 6 },
        { symptom: 'vibration', count: 5 }
      ],
      safetyIssues: [
        {
          summary: 'Engine stalls while driving',
          component: 'Engine',
          consequence: 'Loss of power steering and brakes, increased crash risk'
        }
      ],
      summary: `Mock data: Found 45 complaints for ${year} ${make} ${model}. Most common issues are engine and transmission related.`
    };

    return mockData;
  }

  getMockRecallsData(make, model, year) {
    return {
      totalRecalls: 2,
      recalls: [
        {
          nhtsaCampaignNumber: '23V123',
          component: 'Air Bags',
          summary: 'Air bag may not deploy properly',
          consequence: 'Increased risk of injury in crash',
          remedy: 'Dealers will replace air bag module free of charge',
          startDate: '2023-03-15'
        },
        {
          nhtsaCampaignNumber: '22V456',
          component: 'Fuel System',
          summary: 'Fuel pump may fail',
          consequence: 'Engine stall, increasing crash risk',
          remedy: 'Dealers will replace fuel pump free of charge',
          startDate: '2022-08-20'
        }
      ],
      summary: `Mock data: Found 2 recalls for ${year} ${make} ${model}.`
    };
  }

  // Get comprehensive vehicle report
  async getVehicleReport(make, model, year) {
    try {
      const [complaints, recalls] = await Promise.all([
        this.getComplaintsByVehicle(make, model, year),
        this.getRecallsByVehicle(make, model, year)
      ]);

      return {
        make,
        model,
        year,
        complaints,
        recalls,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating vehicle report:', error);
      throw error;
    }
  }

  // Search for specific symptoms in complaints
  async searchSymptoms(make, model, year, symptoms) {
    try {
      const complaints = await this.getComplaintsByVehicle(make, model, year);
      
      if (!complaints.totalComplaints) {
        return [];
      }

      const matchingSymptoms = complaints.commonSymptoms.filter(item =>
        symptoms.some(symptom => 
          item.symptom.toLowerCase().includes(symptom.toLowerCase())
        )
      );

      return matchingSymptoms;
    } catch (error) {
      console.error('Error searching symptoms:', error);
      return [];
    }
  }
}

export default new NHTSAService();
