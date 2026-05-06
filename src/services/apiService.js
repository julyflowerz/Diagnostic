// API Service for OpenRouter Integration
// This service will handle communication with OpenRouter API for advanced diagnostics

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

class ApiService {
  constructor() {
    this.apiKey = OPENROUTER_API_KEY;
    this.baseUrl = OPENROUTER_API_URL;
  }

  async diagnoseCarProblem(carInfo, problem, commonProblems = []) {
    try {
      const prompt = this.buildDiagnosticPrompt(carInfo, problem, commonProblems);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Car Diagnostic Tool'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          messages: [
            {
              role: 'system',
              content: 'You are an expert automotive diagnostic technician with 20+ years of experience. Return beginner-friendly, safety-first, structured JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.parseDiagnosticResponse(data.choices[0].message.content, problem);
      
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to mock data if API fails
      return this.getMockDiagnosticResults(problem);
    }
  }

  buildDiagnosticPrompt(carInfo, problem, commonProblems = []) {
    return `
Please provide a detailed diagnostic analysis for the following car issue:

Vehicle Information:
- Year: ${carInfo.year}
- Make: ${carInfo.make}
- Model: ${carInfo.model}

Reported Problem:
- Issue: ${problem.name}
- Description: ${problem.description}
- System: ${problem.system}

Common Problems for this Vehicle:
${commonProblems.length > 0 ? commonProblems.map(p => `- ${p.problem} (${p.likelihood}% likelihood): ${p.symptoms.join(', ')}`).join('\n') : 'No specific common problems data available for this vehicle.'}

Please provide:
1. A concise diagnosis summary
2. Possible causes with likelihood percentages (e.g., "Battery failure - 75% likelihood")
3. List of potentially affected components
4. Recommended diagnostic checks
5. Repair recommendations
6. Estimated cost range (parts + labor)
7. Severity assessment (low/medium/high)
8. Estimated difficulty (easy/moderate/hard/professional)
9. Safety warnings
10. Whether the user should keep driving or stop driving
11. Related OBD-II codes

Format your response as a structured JSON object with the following keys:
{
  "diagnosis": "detailed explanation",
  "possibleCauses": ["cause1", "cause2", ...],
  "affectedParts": ["part1", "part2", ...],
  "recommendedChecks": ["check1", "check2", ...],
  "recommendations": ["repair1", "repair2", ...],
  "estimatedCost": "$min-$max",
  "severity": "low|medium|high",
  "estimatedDifficulty": "easy|moderate|hard|professional",
  "safetyWarnings": ["warning1", "warning2", ...],
  "driveAdvice": "safe to drive briefly|drive cautiously|stop driving",
  "relatedObdCodes": ["P0137", "P0300", ...]
}
`;
  }

  parseDiagnosticResponse(response, originalProblem) {
    try {
      // Try to parse as JSON first
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          problem: originalProblem,
          diagnosis: parsed.diagnosis || response,
          possibleCauses: parsed.possibleCauses || [
            'Component wear or failure',
            'Sensor, fluid, or electrical issue'
          ],
          affectedParts: parsed.affectedParts || originalProblem.affectedParts,
          recommendedChecks: parsed.recommendedChecks || [
            'Inspect related components',
            'Check dashboard warning lights and scan for OBD-II codes'
          ],
          recommendations: parsed.recommendations || [
            'Consult with a professional mechanic for accurate diagnosis',
            'Follow safety procedures when working on vehicles'
          ],
          estimatedCost: parsed.estimatedCost || originalProblem.estimatedCost,
          severity: parsed.severity || originalProblem.severity,
          estimatedDifficulty: parsed.estimatedDifficulty || 'moderate',
          safetyWarnings: parsed.safetyWarnings || [
            parsed.safetyNotes || 'Always prioritize safety when working on vehicles'
          ],
          safetyNotes: parsed.safetyNotes || 'Always prioritize safety when working on vehicles',
          driveAdvice: parsed.driveAdvice || 'drive cautiously',
          relatedObdCodes: parsed.relatedObdCodes || []
        };
      }
    } catch (error) {
      console.error('Error parsing API response:', error);
    }

    // Fallback: use the raw response
    return {
      problem: originalProblem,
      diagnosis: response,
      possibleCauses: [
        'Component wear or failure',
        'Sensor, fluid, or electrical issue'
      ],
      affectedParts: originalProblem.affectedParts,
      recommendedChecks: [
        'Inspect related components',
        'Check dashboard warning lights and scan for OBD-II codes'
      ],
      recommendations: [
        'Consult with a professional mechanic for accurate diagnosis',
        'Follow safety procedures when working on vehicles'
      ],
      estimatedCost: originalProblem.estimatedCost,
      severity: originalProblem.severity,
      estimatedDifficulty: 'moderate',
      safetyWarnings: ['Always prioritize safety when working on vehicles'],
      safetyNotes: 'Always prioritize safety when working on vehicles',
      driveAdvice: 'drive cautiously',
      relatedObdCodes: []
    };
  }

  getMockDiagnosticResults(problem) {
    // Enhanced mock data for testing
    const mockResults = {
      problem: problem,
      diagnosis: `Based on the symptoms of ${problem.name} in your vehicle, this issue appears to be related to the ${problem.system}. Common causes include wear and tear, fluid issues, or component failure. A thorough inspection is recommended to identify the exact cause.`,
      possibleCauses: [
        'Normal component wear',
        'Low or contaminated fluid',
        'Faulty sensor or electrical connection'
      ],
      affectedParts: problem.affectedParts,
      recommendedChecks: [
        'Inspect related components for visible damage',
        'Check fluid levels and condition if applicable',
        'Use an OBD-II scanner if a warning light is active'
      ],
      recommendations: [
        'Perform visual inspection of related components',
        'Check fluid levels and condition if applicable',
        'Listen for unusual noises during operation',
        'Test system functionality under different conditions',
        'Consider professional diagnostic scan if available'
      ],
      estimatedCost: problem.estimatedCost,
      severity: problem.severity,
      estimatedDifficulty: problem.severity === 'high' ? 'professional' : 'moderate',
      safetyWarnings: [
        'Use proper safety equipment',
        'Do not drive if braking, steering, overheating, or exhaust fumes are unsafe'
      ],
      safetyNotes: 'Always disconnect battery before working on electrical components. Use proper safety equipment and follow manufacturer guidelines.',
      driveAdvice: problem.severity === 'high' ? 'stop driving' : 'drive cautiously',
      relatedObdCodes: problem.system?.toLowerCase().includes('exhaust') ? ['P0137', 'P0420'] : ['P0300', 'P0171']
    };

    return mockResults;
  }

  async getOBDCodeInfo(code) {
    try {
      const prompt = `Provide detailed information about OBD code ${code}: what it means, common causes, symptoms, and repair recommendations.`;
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Car Diagnostic Tool'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          messages: [
            {
              role: 'system',
              content: 'You are an expert automotive diagnostic technician. Provide detailed OBD code information.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
      
    } catch (error) {
      console.error('OBD Code API Error:', error);
      return `Unable to fetch information for code ${code}. Please consult a professional mechanic or OBD code reference.`;
    }
  }
}

export default new ApiService();
