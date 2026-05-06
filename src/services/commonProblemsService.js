// Common Problems API Service
// This service fetches common car problems based on make, model, and year

class CommonProblemsService {
  constructor() {
    // Using a mock API for demonstration - in production this would connect to a real automotive database
    this.mockDatabase = this.initializeMockDatabase();
  }

  initializeMockDatabase() {
    return {
      'Toyota': {
        'Camry': {
          '2020': [
            { problem: 'Battery failure', frequency: 15, symptoms: ['slow cranking', 'dashboard lights dim'] },
            { problem: 'Oxygen sensor failure', frequency: 12, symptoms: ['check engine light', 'poor fuel economy'] },
            { problem: 'Transmission hesitation', frequency: 8, symptoms: ['delayed shifting', 'jerking'] },
            { problem: 'Power steering leak', frequency: 6, symptoms: ['whining noise', 'stiff steering'] },
            { problem: 'AC compressor failure', frequency: 5, symptoms: ['no cold air', 'strange noises'] }
          ],
          '2019': [
            { problem: 'Battery failure', frequency: 14, symptoms: ['slow cranking', 'dashboard lights dim'] },
            { problem: 'Oxygen sensor failure', frequency: 13, symptoms: ['check engine light', 'poor fuel economy'] },
            { problem: 'Transmission hesitation', frequency: 9, symptoms: ['delayed shifting', 'jerking'] }
          ]
        },
        'Corolla': {
          '2020': [
            { problem: 'Battery failure', frequency: 16, symptoms: ['slow cranking', 'dashboard lights dim'] },
            { problem: 'Mass airflow sensor', frequency: 10, symptoms: ['stalling', 'rough idle'] },
            { problem: 'CV joint wear', frequency: 7, symptoms: ['clicking noise', 'vibration'] }
          ]
        }
      },
      'Honda': {
        'Civic': {
          '2020': [
            { problem: 'Battery failure', frequency: 18, symptoms: ['slow cranking', 'dashboard lights dim'] },
            { problem: 'AC compressor failure', frequency: 11, symptoms: ['no cold air', 'belt noise'] },
            { problem: 'Power steering pump leak', frequency: 8, symptoms: ['whining noise', 'stiff steering'] },
            { problem: 'Ignition coil failure', frequency: 6, symptoms: ['misfiring', 'poor performance'] }
          ]
        },
        'Accord': {
          '2020': [
            { problem: 'Battery failure', frequency: 15, symptoms: ['slow cranking', 'dashboard lights dim'] },
            { problem: 'Transmission issues', frequency: 12, symptoms: ['slipping', 'delayed engagement'] },
            { problem: 'AC compressor failure', frequency: 9, symptoms: ['no cold air', 'noises'] }
          ]
        }
      },
      'Ford': {
        'F-150': {
          '2020': [
            { problem: 'Battery failure', frequency: 14, symptoms: ['slow cranking', 'electrical issues'] },
            { problem: 'Transmission shift issues', frequency: 11, symptoms: ['harsh shifting', 'delayed engagement'] },
            { problem: 'Fuel pump failure', frequency: 8, symptoms: ['stalling', 'no start'] },
            { problem: 'Wheel bearing wear', frequency: 7, symptoms: ['grinding noise', 'vibration'] }
          ]
        },
        'Mustang': {
          '2020': [
            { problem: 'Battery failure', frequency: 13, symptoms: ['slow cranking', 'electrical issues'] },
            { problem: 'Transmission issues', frequency: 10, symptoms: ['harsh shifting', 'slipping'] },
            { problem: 'Clutch wear', frequency: 8, symptoms: ['slipping', 'difficulty shifting'] }
          ]
        }
      },
      'Chevrolet': {
        'Silverado': {
          '2020': [
            { problem: 'Battery failure', frequency: 15, symptoms: ['slow cranking', 'electrical issues'] },
            { problem: 'Transmission issues', frequency: 12, symptoms: ['slipping', 'harsh shifting'] },
            { problem: 'Fuel injector problems', frequency: 9, symptoms: ['misfiring', 'poor fuel economy'] },
            { problem: 'Water pump leak', frequency: 6, symptoms: ['coolant leak', 'overheating'] }
          ]
        },
        'Malibu': {
          '2020': [
            { problem: 'Battery failure', frequency: 16, symptoms: ['slow cranking', 'electrical issues'] },
            { problem: 'Transmission hesitation', frequency: 10, symptoms: ['delayed shifting', 'jerking'] },
            { problem: 'AC compressor failure', frequency: 8, symptoms: ['no cold air', 'noises'] }
          ]
        }
      }
    };
  }

  async getCommonProblems(make, model, year) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const problems = this.mockDatabase[make]?.[model]?.[year] || [];
      
      if (problems.length === 0) {
        // Return generic problems if specific data not found
        return this.getGenericProblems();
      }

      // Calculate percentages based on frequency
      const totalFrequency = problems.reduce((sum, problem) => sum + problem.frequency, 0);
      
      return problems.map(problem => ({
        ...problem,
        likelihood: Math.round((problem.frequency / totalFrequency) * 100),
        severity: this.determineSeverity(problem.frequency),
        commonSymptoms: problem.symptoms
      }));

    } catch (error) {
      console.error('Error fetching common problems:', error);
      return this.getGenericProblems();
    }
  }

  getGenericProblems() {
    return [
      { 
        problem: 'Battery failure', 
        frequency: 15, 
        likelihood: 25,
        severity: 'medium',
        symptoms: ['slow cranking', 'dashboard lights dim', 'electrical issues'] 
      },
      { 
        problem: 'Brake system wear', 
        frequency: 12, 
        likelihood: 20,
        severity: 'high',
        symptoms: ['squealing noise', 'reduced braking', 'pedal pulsation'] 
      },
      { 
        problem: 'Tire wear/pressure issues', 
        frequency: 10, 
        likelihood: 17,
        severity: 'medium',
        symptoms: ['uneven wear', 'vibration', 'pulling to one side'] 
      },
      { 
        problem: 'Engine sensor issues', 
        frequency: 8, 
        likelihood: 13,
        severity: 'medium',
        symptoms: ['check engine light', 'poor performance', 'reduced fuel economy'] 
      },
      { 
        problem: 'Suspension wear', 
        frequency: 7, 
        likelihood: 12,
        severity: 'low',
        symptoms: ['bumpy ride', 'clunking noises', 'uneven tire wear'] 
      },
      { 
        problem: 'AC system issues', 
        frequency: 5, 
        likelihood: 8,
        severity: 'low',
        symptoms: ['no cold air', 'strange noises', 'weak airflow'] 
      },
      { 
        problem: 'Electrical system faults', 
        frequency: 3, 
        likelihood: 5,
        severity: 'medium',
        symptoms: ['flickering lights', 'blown fuses', 'intermittent failures'] 
      }
    ];
  }

  determineSeverity(frequency) {
    if (frequency >= 12) return 'high';
    if (frequency >= 8) return 'medium';
    return 'low';
  }

  async getProblemDetails(make, model, year, problemName) {
    const problems = await this.getCommonProblems(make, model, year);
    return problems.find(p => p.problem.toLowerCase().includes(problemName.toLowerCase())) || null;
  }

  // In production, this would call a real API
  async callRealApi(make, model, year) {
    const response = await fetch(`https://api.automotive-database.com/v1/common-problems?make=${make}&model=${model}&year=${year}`, {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_AUTOMOTIVE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return response.json();
  }
}

export default new CommonProblemsService();
