// API Service for OpenRouter Integration
// This service will handle communication with OpenRouter API for advanced diagnostics

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

class ApiService {
  constructor() {
    this.apiKey = OPENROUTER_API_KEY;
    this.baseUrl = OPENROUTER_API_URL;
  }

  async diagnoseCarProblem(carInfo, problem) {
    try {
      const prompt = this.buildDiagnosticPrompt(carInfo, problem);
      
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
              content: 'You are an expert automotive diagnostic technician with 20+ years of experience. Provide detailed, accurate diagnostic information for car problems. Always prioritize safety and provide practical advice.'
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

  buildDiagnosticPrompt(carInfo, problem) {
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

Please provide:
1. A detailed diagnosis of the likely cause
2. List of potentially affected components
3. Recommended diagnostic steps
4. Repair recommendations
5. Estimated cost range (parts + labor)
6. Severity assessment (low/medium/high)
7. Safety considerations

Format your response as a structured JSON object with the following keys:
{
  "diagnosis": "detailed explanation",
  "affectedParts": ["part1", "part2", ...],
  "recommendations": ["step1", "step2", ...],
  "estimatedCost": "$min-$max",
  "severity": "low|medium|high",
  "safetyNotes": "important safety information"
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
          affectedParts: parsed.affectedParts || originalProblem.affectedParts,
          recommendations: parsed.recommendations || [
            'Consult with a professional mechanic for accurate diagnosis',
            'Follow safety procedures when working on vehicles'
          ],
          estimatedCost: parsed.estimatedCost || originalProblem.estimatedCost,
          severity: parsed.severity || originalProblem.severity,
          safetyNotes: parsed.safetyNotes || 'Always prioritize safety when working on vehicles'
        };
      }
    } catch (error) {
      console.error('Error parsing API response:', error);
    }

    // Fallback: use the raw response
    return {
      problem: originalProblem,
      diagnosis: response,
      affectedParts: originalProblem.affectedParts,
      recommendations: [
        'Consult with a professional mechanic for accurate diagnosis',
        'Follow safety procedures when working on vehicles'
      ],
      estimatedCost: originalProblem.estimatedCost,
      severity: originalProblem.severity,
      safetyNotes: 'Always prioritize safety when working on vehicles'
    };
  }

  getMockDiagnosticResults(problem) {
    // Enhanced mock data for testing
    const mockResults = {
      problem: problem,
      diagnosis: `Based on the symptoms of ${problem.name} in your vehicle, this issue appears to be related to the ${problem.system}. Common causes include wear and tear, fluid issues, or component failure. A thorough inspection is recommended to identify the exact cause.`,
      affectedParts: problem.affectedParts,
      recommendations: [
        'Perform visual inspection of related components',
        'Check fluid levels and condition if applicable',
        'Listen for unusual noises during operation',
        'Test system functionality under different conditions',
        'Consider professional diagnostic scan if available'
      ],
      estimatedCost: problem.estimatedCost,
      severity: problem.severity,
      safetyNotes: 'Always disconnect battery before working on electrical components. Use proper safety equipment and follow manufacturer guidelines.'
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
