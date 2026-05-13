// Diagnostic Engine
// This service provides intelligent diagnostic reasoning with confidence scoring

import nhtsaService from './nhtsaService';
import commonProblemsService from './commonProblemsService';

class DiagnosticEngine {
  constructor() {
    this.confidenceThresholds = {
      high: 80,
      medium: 60,
      low: 40
    };
  }

  // Main diagnostic function
  async diagnoseVehicle(vehicleInfo, symptoms, obdCode = null, previousHistory = []) {
    try {
      // Gather all data sources
      const [nhtsaData, commonProblems] = await Promise.all([
        nhtsaService.getVehicleReport(vehicleInfo.make, vehicleInfo.model, vehicleInfo.year),
        commonProblemsService.getCommonProblems(vehicleInfo.make, vehicleInfo.model, vehicleInfo.year)
      ]);

      // Extract symptoms from user input
      const extractedSymptoms = this.extractSymptoms(symptoms);
      
      // Generate possible causes
      const possibleCauses = await this.generatePossibleCauses(
        vehicleInfo,
        extractedSymptoms,
        obdCode,
        nhtsaData,
        commonProblems,
        previousHistory
      );

      // Score and rank causes by confidence
      const scoredCauses = this.scoreCauses(possibleCauses, vehicleInfo, extractedSymptoms, obdCode);
      
      // Generate final diagnosis
      const diagnosis = this.generateDiagnosis(scoredCauses, vehicleInfo, extractedSymptoms, nhtsaData);

      return {
        ...diagnosis,
        vehicleInfo,
        symptoms: extractedSymptoms,
        obdCode,
        nhtsaData,
        commonProblems,
        confidenceBreakdown: this.getConfidenceBreakdown(scoredCauses),
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Diagnostic engine error:', error);
      throw new Error('Failed to generate diagnosis');
    }
  }

  // Extract symptoms from user description
  extractSymptoms(symptomText) {
    if (!symptomText) return [];

    const symptomPatterns = {
      engine: [
        'stall', 'die', 'wont start', 'hard start', 'crank', 'turn over',
        'misfire', 'rough idle', 'hesitation', 'loss of power', 'surge'
      ],
      transmission: [
        'slip', 'shift', 'jerks', 'hesitation', 'clunk', 'grind',
        'stuck in gear', 'no drive', 'no reverse'
      ],
      brakes: [
        'squeal', 'grind', 'pulse', 'soft', 'spongy', 'pull',
        'vibration', 'warped', 'fade'
      ],
      electrical: [
        'battery', 'alternator', 'starter', 'light', 'flicker',
        'dead', 'jump', 'electrical', 'short'
      ],
      cooling: [
        'overheat', 'hot', 'coolant', 'leak', 'steam', 'radiator',
        'temperature', 'gauge', 'fan'
      ],
      steering: [
        'pull', 'wander', 'loose', 'tight', 'noise', 'vibration',
        'power steering', 'wheel'
      ],
      suspension: [
        'bounce', 'rattle', 'clunk', 'squeak', 'harsh', 'bottom out',
        'strut', 'shock', 'bush'
      ],
      exhaust: [
        'smell', 'smoke', 'loud', 'rattle', 'muffler', 'catalytic',
        'converter', 'exhaust'
      ],
      tires: [
        'vibration', 'pull', 'wear', 'flat', 'leak', 'pressure',
        'tire', 'cupping', 'feather'
      ]
    };

    const extracted = [];
    const lowerText = symptomText.toLowerCase();

    Object.entries(symptomPatterns).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          extracted.push({
            category,
            keyword,
            severity: this.assessSymptomSeverity(keyword, lowerText)
          });
        }
      });
    });

    return extracted;
  }

  // Assess symptom severity
  assessSymptomSeverity(keyword, context) {
    const highSeverityKeywords = ['stall', 'overheat', 'fire', 'smoke', 'crash', 'fail'];
    const mediumSeverityKeywords = ['pull', 'vibration', 'noise', 'leak', 'slip'];
    
    if (highSeverityKeywords.some(hs => context.includes(hs))) return 'high';
    if (mediumSeverityKeywords.some(ms => context.includes(ms))) return 'medium';
    return 'low';
  }

  // Generate possible causes from all data sources
  async generatePossibleCauses(vehicleInfo, symptoms, obdCode, nhtsaData, commonProblems, previousHistory) {
    const causes = [];

    // From common problems database
    commonProblems.forEach(problem => {
      causes.push({
        name: problem.problem,
        source: 'common_problems',
        likelihood: problem.likelihood,
        symptoms: problem.symptoms,
        severity: problem.severity,
        component: this.inferComponent(problem.problem)
      });
    });

    // From NHTSA complaints
    if (nhtsaData.complaints.totalComplaints > 0) {
      Object.entries(nhtsaData.complaints.components).forEach(([component, data]) => {
        causes.push({
          name: `${component} failure (based on complaints)`,
          source: 'nhtsa_complaints',
          likelihood: data.percentage,
          symptoms: this.inferSymptomsFromComponent(component),
          severity: this.inferSeverityFromComponent(component),
          component
        });
      });
    }

    // From OBD code
    if (obdCode) {
      const obdCause = this.getCauseFromOBDCode(obdCode);
      if (obdCause) {
        causes.push({
          name: obdCause.name,
          source: 'obd_code',
          likelihood: 85, // High confidence for specific OBD codes
          symptoms: obdCause.symptoms,
          severity: obdCause.severity,
          component: obdCause.component
        });
      }
    }

    // From symptom matching
    symptoms.forEach(symptom => {
      const symptomCauses = this.getCausesFromSymptom(symptom);
      symptomCauses.forEach(cause => {
        causes.push({
          name: cause.name,
          source: 'symptom_matching',
          likelihood: cause.baseLikelihood,
          symptoms: [symptom.keyword],
          severity: symptom.severity,
          component: cause.component
        });
      });
    });

    // From previous history
    previousHistory.forEach(history => {
      if (this.isRelevantHistory(history, vehicleInfo, symptoms)) {
        causes.push({
          name: `Recurring issue: ${history.diagnosis}`,
          source: 'previous_history',
          likelihood: 70,
          symptoms: history.symptoms,
          severity: history.severity,
          component: history.component
        });
      }
    });

    return causes;
  }

  // Score and rank causes by confidence
  scoreCauses(causes, vehicleInfo, symptoms, obdCode) {
    const scored = causes.map(cause => {
      let confidence = cause.likelihood || 50;
      
      // Boost for OBD code match
      if (obdCode && cause.source === 'obd_code') {
        confidence += 15;
      }
      
      // Boost for symptom matching
      const symptomMatch = this.calculateSymptomMatch(cause.symptoms, symptoms);
      confidence += symptomMatch * 20;
      
      // Boost for common problems
      if (cause.source === 'common_problems') {
        confidence += 10;
      }
      
      // Boost for NHTSA complaints
      if (cause.source === 'nhtsa_complaints') {
        confidence += 5;
      }
      
      // Adjust for mileage
      if (vehicleInfo.mileage) {
        confidence += this.getMileageAdjustment(cause.component, vehicleInfo.mileage);
      }
      
      // Cap at 100
      confidence = Math.min(100, Math.max(0, confidence));
      
      return {
        ...cause,
        confidence: Math.round(confidence),
        confidenceLevel: this.getConfidenceLevel(confidence),
        reasoning: this.generateReasoning(cause, symptoms, obdCode, confidence)
      };
    });

    // Sort by confidence and remove duplicates
    return scored
      .sort((a, b) => b.confidence - a.confidence)
      .filter((cause, index, array) => 
        array.findIndex(c => c.name === cause.name) === index
      )
      .slice(0, 10); // Top 10 causes
  }

  // Calculate symptom match percentage
  calculateSymptomMatch(causeSymptoms, userSymptoms) {
    if (!causeSymptoms || !userSymptoms.length) return 0;
    
    const matches = userSymptoms.filter(userSymptom =>
      causeSymptoms.some(causeSymptom =>
        causeSymptom.toLowerCase().includes(userSymptom.keyword.toLowerCase()) ||
        userSymptom.keyword.toLowerCase().includes(causeSymptom.toLowerCase())
      )
    );
    
    return matches.length / userSymptoms.length;
  }

  // Get mileage adjustment for component
  getMileageAdjustment(component, mileage) {
    const adjustments = {
      'Battery': mileage > 80000 ? -10 : 0,
      'Transmission': mileage > 100000 ? 10 : 0,
      'Engine': mileage > 120000 ? 15 : 0,
      'Brakes': mileage > 50000 ? 5 : 0,
      'Suspension': mileage > 80000 ? 10 : 0
    };
    
    return adjustments[component] || 0;
  }

  // Get confidence level
  getConfidenceLevel(confidence) {
    if (confidence >= this.confidenceThresholds.high) return 'high';
    if (confidence >= this.confidenceThresholds.medium) return 'medium';
    if (confidence >= this.confidenceThresholds.low) return 'low';
    return 'very_low';
  }

  // Generate reasoning for each cause
  generateReasoning(cause, symptoms, obdCode, confidence) {
    const reasons = [];
    
    if (cause.source === 'common_problems') {
      reasons.push('Common problem for this vehicle');
    }
    
    if (cause.source === 'nhtsa_complaints') {
      reasons.push('Based on NHTSA complaint data');
    }
    
    if (obdCode && cause.source === 'obd_code') {
      reasons.push('Directly matches OBD code');
    }
    
    const symptomMatch = this.calculateSymptomMatch(cause.symptoms, symptoms);
    if (symptomMatch > 0.5) {
      reasons.push('Strong symptom match');
    } else if (symptomMatch > 0.25) {
      reasons.push('Partial symptom match');
    }
    
    return reasons.join(', ');
  }

  // Generate final diagnosis
  generateDiagnosis(scoredCauses, vehicleInfo, symptoms, nhtsaData) {
    const topCauses = scoredCauses.slice(0, 5);
    const highestConfidence = topCauses[0]?.confidence || 0;
    
    return {
      primaryDiagnosis: topCauses[0] || null,
      possibleCauses: topCauses,
      confidence: highestConfidence,
      summary: this.generateSummary(topCauses, vehicleInfo, symptoms),
      recommendations: this.generateRecommendations(topCauses, symptoms),
      safetyConcerns: this.identifySafetyConcerns(topCauses, nhtsaData),
      nextSteps: this.generateNextSteps(topCauses),
      estimatedDifficulty: this.estimateDifficulty(topCauses),
      estimatedCost: this.estimateCost(topCauses),
      driveAdvice: this.getDriveAdvice(topCauses)
    };
  }

  // Generate diagnosis summary
  generateSummary(causes, vehicleInfo, symptoms) {
    if (!causes.length) {
      return 'Unable to determine specific cause. Please provide more details about the symptoms.';
    }
    
    const top = causes[0];
    const symptomDesc = symptoms.length > 0 ? 
      `Based on symptoms like ${symptoms.map(s => s.keyword).join(', ')}` : 
      'Based on available information';
    
    return `${symptomDesc}, the most likely issue is ${top.name.toLowerCase()} with ${top.confidence}% confidence. ${top.reasoning}.`;
  }

  // Generate recommendations
  generateRecommendations(causes, symptoms) {
    const recommendations = [];
    
    if (causes.length > 0) {
      const top = causes[0];
      recommendations.push(`Focus inspection on ${top.component}`);
      
      if (top.confidence >= 80) {
        recommendations.push(`High likelihood of ${top.name.toLowerCase()} - consider professional inspection`);
      } else if (top.confidence >= 60) {
        recommendations.push(`Moderate likelihood - check ${top.component} first`);
      } else {
        recommendations.push('Multiple possible causes - systematic diagnosis recommended');
      }
    }
    
    recommendations.push('Scan for additional OBD codes if available');
    recommendations.push('Check recent maintenance history');
    
    return recommendations;
  }

  // Identify safety concerns
  identifySafetyConcerns(causes, nhtsaData) {
    const concerns = [];
    
    causes.forEach(cause => {
      if (cause.severity === 'high' || cause.severity === 'critical') {
        concerns.push(`${cause.name} - ${cause.severity} severity`);
      }
    });
    
    if (nhtsaData.safetyIssues.length > 0) {
      concerns.push(...nhtsaData.safetyIssues.map(issue => 
        `NHTSA safety issue: ${issue.summary}`
      ));
    }
    
    return concerns;
  }

  // Generate next steps
  generateNextSteps(causes) {
    const steps = [];
    
    if (causes.length > 0) {
      const top = causes[0];
      
      steps.push(`Inspect ${top.component} for visible damage`);
      steps.push('Check related sensors and connections');
      
      if (top.source === 'obd_code') {
        steps.push('Clear OBD code and test drive to verify fix');
      }
    }
    
    steps.push('Document all findings');
    steps.push('Consult repair manual if needed');
    
    return steps;
  }

  // Helper methods
  inferComponent(problemName) {
    const componentMap = {
      'battery': 'Battery',
      'alternator': 'Electrical',
      'starter': 'Electrical',
      'transmission': 'Transmission',
      'engine': 'Engine',
      'brake': 'Brakes',
      'suspension': 'Suspension',
      'steering': 'Steering',
      'exhaust': 'Exhaust',
      'cooling': 'Cooling System'
    };
    
    const lower = problemName.toLowerCase();
    for (const [key, component] of Object.entries(componentMap)) {
      if (lower.includes(key)) return component;
    }
    
    return 'Unknown';
  }

  inferSymptomsFromComponent(component) {
    const symptomMap = {
      'Engine': ['stalling', 'misfire', 'loss of power', 'rough idle'],
      'Transmission': ['slipping', 'harsh shifting', 'no engagement'],
      'Brakes': ['squealing', 'grinding', 'pulling', 'soft pedal'],
      'Battery': ['no start', 'slow cranking', 'electrical issues'],
      'Electrical': ['flickering lights', 'dead battery', 'electrical failures'],
      'Cooling System': ['overheating', 'coolant loss', 'steam'],
      'Steering': ['pulling', 'loose steering', 'noise'],
      'Suspension': ['bouncing', 'clunking', 'rough ride'],
      'Exhaust': ['loud noise', 'smell', 'poor performance']
    };
    
    return symptomMap[component] || ['general malfunction'];
  }

  inferSeverityFromComponent(component) {
    const severityMap = {
      'Brakes': 'high',
      'Steering': 'high',
      'Engine': 'high',
      'Cooling System': 'high',
      'Transmission': 'medium',
      'Electrical': 'medium',
      'Suspension': 'medium',
      'Exhaust': 'low',
      'Battery': 'medium'
    };
    
    return severityMap[component] || 'medium';
  }

  getCauseFromOBDCode(code) {
    const obdDatabase = {
      'P0137': {
        name: 'Oxygen Sensor Circuit Low Voltage (Bank 1 Sensor 2)',
        component: 'Exhaust',
        symptoms: ['poor fuel economy', 'check engine light', 'emissions issue'],
        severity: 'medium'
      },
      'P0300': {
        name: 'Random/Multiple Cylinder Misfire Detected',
        component: 'Engine',
        symptoms: ['misfire', 'rough idle', 'loss of power', 'check engine light'],
        severity: 'high'
      },
      'P0420': {
        name: 'Catalyst System Efficiency Below Threshold',
        component: 'Exhaust',
        symptoms: ['poor performance', 'check engine light', 'emissions issue'],
        severity: 'medium'
      },
      'P0171': {
        name: 'System Too Lean (Bank 1)',
        component: 'Engine',
        symptoms: ['rough idle', 'stalling', 'poor performance'],
        severity: 'medium'
      }
    };
    
    return obdDatabase[code] || null;
  }

  getCausesFromSymptom(symptom) {
    const symptomDatabase = {
      'stall': [
        { name: 'Fuel pump failure', component: 'Engine', baseLikelihood: 60 },
        { name: 'Crankshaft position sensor', component: 'Engine', baseLikelihood: 70 },
        { name: 'Mass airflow sensor', component: 'Engine', baseLikelihood: 50 }
      ],
      'vibration': [
        { name: 'Wheel balance issue', component: 'Wheels', baseLikelihood: 65 },
        { name: 'CV joint wear', component: 'Drivetrain', baseLikelihood: 55 },
        { name: 'Engine mount', component: 'Engine', baseLikelihood: 45 }
      ],
      'noise': [
        { name: 'Brake pad wear', component: 'Brakes', baseLikelihood: 60 },
        { name: 'Wheel bearing', component: 'Wheels', baseLikelihood: 50 },
        { name: 'Exhaust leak', component: 'Exhaust', baseLikelihood: 45 }
      ]
    };
    
    return symptomDatabase[symptom.keyword] || [];
  }

  isRelevantHistory(history, vehicleInfo, symptoms) {
    // Check if history is for same vehicle
    if (history.vehicle?.make !== vehicleInfo.make || 
        history.vehicle?.model !== vehicleInfo.model) {
      return false;
    }
    
    // Check if symptoms are similar
    if (symptoms.length === 0) return false;
    
    return symptoms.some(symptom =>
      history.symptoms?.some(historySymptom =>
        symptom.category === historySymptom.category
      )
    );
  }

  estimateDifficulty(causes) {
    if (!causes.length) return 'moderate';
    
    const difficultyMap = {
      'Battery': 'easy',
      'Brakes': 'moderate',
      'Electrical': 'hard',
      'Engine': 'hard',
      'Transmission': 'professional',
      'Suspension': 'moderate',
      'Steering': 'hard',
      'Exhaust': 'moderate',
      'Cooling System': 'moderate'
    };
    
    const top = causes[0];
    return difficultyMap[top.component] || 'moderate';
  }

  estimateCost(causes) {
    if (!causes.length) return '$100-500';
    
    const costMap = {
      'Battery': '$150-400',
      'Brakes': '$200-800',
      'Electrical': '$300-1000',
      'Engine': '$500-3000',
      'Transmission': '$800-4000',
      'Suspension': '$300-1500',
      'Steering': '$400-2000',
      'Exhaust': '$200-1200',
      'Cooling System': '$250-1500'
    };
    
    const top = causes[0];
    return costMap[top.component] || '$200-800';
  }

  getDriveAdvice(causes) {
    if (!causes.length) return 'drive cautiously';
    
    const top = causes[0];
    
    if (top.severity === 'critical' || top.confidence >= 90) {
      return 'stop driving';
    } else if (top.severity === 'high' || top.confidence >= 70) {
      return 'drive cautiously';
    } else {
      return 'safe to drive briefly';
    }
  }

  getConfidenceBreakdown(causes) {
    const breakdown = {
      high: causes.filter(c => c.confidenceLevel === 'high').length,
      medium: causes.filter(c => c.confidenceLevel === 'medium').length,
      low: causes.filter(c => c.confidenceLevel === 'low').length,
      very_low: causes.filter(c => c.confidenceLevel === 'very_low').length
    };
    
    return breakdown;
  }
}

export default new DiagnosticEngine();
