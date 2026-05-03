# Car Diagnostic Tool

A comprehensive 3D car diagnostic application that helps car enthusiasts identify and understand automotive problems with visual guidance.

## Features

- **3D Car Visualization**: Interactive 3D model with problem highlighting
- **Comprehensive Problem Database**: Covers engine, electrical, brakes, maintenance, exhaust, and transmission issues
- **Smart Diagnostics**: AI-powered analysis using OpenRouter API
- **Cost Estimates**: Provides estimated repair costs
- **Severity Assessment**: Categorizes issues by urgency
- **DIY-Friendly**: Designed to empower car enthusiasts to work on their own vehicles

## Technology Stack

- **Frontend**: React 18
- **3D Graphics**: Three.js with React Three Fiber
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **AI Integration**: OpenRouter API (Claude 3 Haiku)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd car-diagnostic-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Enter Vehicle Information**: Select the year, make, and model of your car
2. **Select Problem**: Choose from categorized problem types or describe your issue
3. **Run Diagnostic**: Click "Run Diagnostic" to analyze the problem
4. **View Results**: See the 3D model highlight affected areas and review detailed recommendations

## API Integration

The application integrates with OpenRouter API for advanced diagnostics. The API key is pre-configured, but you can update it in `src/services/apiService.js`:

```javascript
const OPENROUTER_API_KEY = 'your-api-key-here';
```

## Project Structure

```
src/
├── components/
│   ├── CarViewer.js          # 3D car model component
│   ├── DiagnosticForm.js     # Vehicle information form
│   ├── ProblemSelector.js    # Problem selection interface
│   └── DiagnosticResults.js  # Results display component
├── services/
│   └── apiService.js         # OpenRouter API integration
├── App.js                    # Main application component
├── App.css                   # Application styles
└── index.js                  # Application entry point
```

## Features in Detail

### 3D Visualization
- Interactive car model using Three.js
- Component highlighting for problem areas
- Orbit controls for viewing from different angles
- Real-time updates based on selected problems

### Problem Categories
- **Engine Issues**: Stuttering, won't start, overheating, check engine light
- **Electrical System**: Battery, alternator, starter problems
- **Brake System**: Noise, soft pedals, vibrations
- **Routine Maintenance**: Oil changes, tire service, fluid checks
- **Exhaust System**: Noise, fumes, leaks
- **Transmission**: Slipping, hard shifting

### Diagnostic Results
- Detailed problem analysis
- Affected component identification
- Cost estimates
- Severity assessment
- Step-by-step recommendations
- Safety warnings

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Safety Notice

This tool is designed to provide guidance and educational information. Always prioritize safety when working on vehicles. If you're unsure about any repair procedure, consult a professional mechanic. Some repairs require specialized tools and knowledge.

## Future Enhancements

- [ ] OBD-II code integration
- [ ] More detailed 3D models for specific car types
- [ ] Video tutorials for common repairs
- [ ] Parts ordering integration
- [ ] Mechanic finder service
- [ ] Maintenance schedule tracking
- [ ] Multi-language support
