import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Plane, Box, Cylinder, RoundedBox } from '@react-three/drei';

const paintColor = '#f8fafc';
const highlightColor = '#dc2626';


function RetroMaterial({ color, highlighted = false, metalness = 0.2, roughness = 0.45, transparent = false, opacity = 1 }) {
  return (
    <meshStandardMaterial
      color={highlighted ? highlightColor : color}
      emissive={highlighted ? highlightColor : '#000000'}
      emissiveIntensity={highlighted ? 0.35 : 0}
      metalness={metalness}
      roughness={roughness}
      transparent={transparent}
      opacity={opacity}
      map={null}
      metalnessMap={null}
      roughnessMap={null}
      normalMap={null}
      aoMap={null}
    />
  );
}

function RetroCarBody({ selectedParts, hoodOpen, diagnosticResults }) {
  // Expanded category highlighting for engine bay components
  const engineCategories = ['engine', 'ignition', 'air_intake', 'sensors', 'electrical', 'starting', 'charging', 'vtec', 'ecu'];
  const coolingCategories = ['cooling', 'hvac'];
  const batteryCategories = ['battery', 'charging', 'electrical'];
  
  const userHoodHighlight = selectedParts.some(part => engineCategories.includes(part)) || selectedParts.some(part => coolingCategories.includes(part));
  const userBatteryHighlight = selectedParts.some(part => batteryCategories.includes(part));
  
  // Check diagnostic results for highlighting
  const diagnosticEngineCategories = diagnosticResults && diagnosticResults.affectedParts && 
    diagnosticResults.affectedParts.some(part => engineCategories.includes(part));
  const diagnosticCoolingCategories = diagnosticResults && diagnosticResults.affectedParts && 
    diagnosticResults.affectedParts.some(part => coolingCategories.includes(part));
  const diagnosticBatteryCategories = diagnosticResults && diagnosticResults.affectedParts && 
    diagnosticResults.affectedParts.some(part => batteryCategories.includes(part));
  
  const hoodHighlighted = userHoodHighlight || diagnosticEngineCategories || diagnosticCoolingCategories;
  const batteryHighlighted = userBatteryHighlight || diagnosticBatteryCategories;
  const hoodPosition = hoodOpen ? [1.58, 1.25, 0] : [1.72, 0.83, 0];
  const hoodRotation = hoodOpen ? [0, 0, -0.78] : [0, 0, -0.06];

  return (
    <group>
      <RoundedBox args={[5.8, 0.75, 1.9]} radius={0.16} smoothness={6} position={[0, 0.35, 0]}>
        <RetroMaterial color={paintColor} />
      </RoundedBox>
      <RoundedBox args={[1.65, 0.18, 1.78]} radius={0.08} smoothness={5} position={hoodPosition} rotation={hoodRotation}>
        <RetroMaterial color={paintColor} highlighted={hoodHighlighted} />
      </RoundedBox>
      <RoundedBox args={[1.25, 0.18, 1.72]} radius={0.08} smoothness={5} position={[-2.05, 0.78, 0]} rotation={[0, 0, 0.04]}>
        <RetroMaterial color={paintColor} />
      </RoundedBox>
      <RoundedBox args={[2.35, 0.82, 1.62]} radius={0.16} smoothness={6} position={[-0.35, 1.13, 0]}>
        <RetroMaterial color={paintColor} />
      </RoundedBox>
      <RoundedBox args={[0.88, 0.48, 1.5]} radius={0.08} smoothness={4} position={[0.64, 1.2, 0]} rotation={[0, 0, -0.18]}>
        <RetroMaterial color="#111827" transparent opacity={0.72} metalness={0} roughness={0.15} />
      </RoundedBox>
      <RoundedBox args={[0.9, 0.46, 1.5]} radius={0.08} smoothness={4} position={[-1.18, 1.2, 0]} rotation={[0, 0, 0.18]}>
        <RetroMaterial color="#111827" transparent opacity={0.72} metalness={0} roughness={0.15} />
      </RoundedBox>
      <Box args={[0.08, 0.5, 1.58]} position={[-0.28, 1.2, 0]}>
        <RetroMaterial color="#171717" />
      </Box>
      <RoundedBox args={[0.18, 0.38, 1.72]} radius={0.04} smoothness={4} position={[2.98, 0.43, 0]}>
        <RetroMaterial color="#171717" />
      </RoundedBox>
      <RoundedBox args={[0.16, 0.22, 0.52]} radius={0.04} smoothness={4} position={[3.08, 0.58, 0.52]}>
        <RetroMaterial color="#fef3c7" />
      </RoundedBox>
      <RoundedBox args={[0.16, 0.22, 0.52]} radius={0.04} smoothness={4} position={[3.08, 0.58, -0.52]}>
        <RetroMaterial color="#fef3c7" />
      </RoundedBox>
      <RoundedBox args={[0.18, 0.36, 1.72]} radius={0.05} smoothness={4} position={[-3.0, 0.4, 0]}>
        <RetroMaterial color={paintColor} />
      </RoundedBox>
      <RoundedBox args={[0.15, 0.22, 0.48]} radius={0.04} smoothness={4} position={[-3.08, 0.55, 0.55]}>
        <RetroMaterial color="#991b1b" />
      </RoundedBox>
      <RoundedBox args={[0.15, 0.22, 0.48]} radius={0.04} smoothness={4} position={[-3.08, 0.55, -0.55]}>
        <RetroMaterial color="#991b1b" />
      </RoundedBox>
      <Box args={[0.58, 0.32, 0.64]} position={[1.75, 0.48, 0]}>
        <RetroMaterial color="#a16207" highlighted={hoodHighlighted} />
      </Box>
      <Box args={[0.34, 0.26, 0.42]} position={[1.26, 0.54, -0.46]}>
        <RetroMaterial color="#1f2937" highlighted={batteryHighlighted} />
      </Box>
    </group>
  );
}

function RetroWheels({ selectedParts, diagnosticResults }) {
  // Expanded categories for wheel-related systems
  const wheelCategories = ['wheels', 'tires', 'suspension', 'brakes', 'steering', 'drivetrain', 'transmission'];
  
  const userHighlight = selectedParts.some(part => wheelCategories.includes(part));
  const diagnosticHighlight = diagnosticResults && diagnosticResults.affectedParts && 
    diagnosticResults.affectedParts.some(part => wheelCategories.includes(part));
  const isHighlighted = userHighlight || diagnosticHighlight;
  const wheelPositions = [[1.8, -0.03, 1.02], [1.8, -0.03, -1.02], [-1.85, -0.03, 1.02], [-1.85, -0.03, -1.02]];

  return (
    <group>
      {wheelPositions.map(position => (
        <group key={position.join('-')} position={position}>
          <Cylinder args={[0.43, 0.43, 0.28, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <RetroMaterial color="#111111" highlighted={isHighlighted} roughness={0.7} />
          </Cylinder>
          <Cylinder args={[0.24, 0.24, 0.31, 24]} rotation={[Math.PI / 2, 0, 0]}>
            <RetroMaterial color="#9ca3af" highlighted={isHighlighted} metalness={0.5} roughness={0.25} />
          </Cylinder>
        </group>
      ))}
    </group>
  );
}

function RetroExhaust({ selectedParts, diagnosticResults }) {
  // Expanded categories for exhaust-related systems
  const exhaustCategories = ['exhaust', 'emissions', 'turbo', 'fuel'];
  
  const userHighlight = selectedParts.some(part => exhaustCategories.includes(part));
  const diagnosticHighlight = diagnosticResults && diagnosticResults.affectedParts && 
    diagnosticResults.affectedParts.some(part => exhaustCategories.includes(part));
  const isHighlighted = userHighlight || diagnosticHighlight;
  return (
    <group>
      <Cylinder args={[0.06, 0.06, 2.2, 12]} position={[-1.75, 0.02, 0.74]} rotation={[0, 0, Math.PI / 2]}>
        <RetroMaterial color="#6b7280" highlighted={isHighlighted} metalness={0.55} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.11, 0.11, 0.45, 12]} position={[-3.1, 0.02, 0.74]} rotation={[0, Math.PI / 2, 0]}>
        <RetroMaterial color="#9ca3af" highlighted={isHighlighted} metalness={0.6} roughness={0.25} />
      </Cylinder>
    </group>
  );
}

function FallbackCar({ selectedParts, hoodOpen, diagnosticResults }) {
  return (
    <>
      <RetroCarBody selectedParts={selectedParts} hoodOpen={hoodOpen} diagnosticResults={diagnosticResults} />
      <RetroWheels selectedParts={selectedParts} diagnosticResults={diagnosticResults} />
      <RetroExhaust selectedParts={selectedParts} diagnosticResults={diagnosticResults} />
    </>
  );
}

function Ground() {
  return (
    <Plane args={[20, 20]} position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#050505" />
    </Plane>
  );
}

const systemLabels = [
  { id: 'engine', label: 'ENGINE', helper: 'Misfires, stalling, power loss' },
  { id: 'exhaust', label: 'EXHAUST', helper: 'Smells, noise, emissions codes' },
  { id: 'battery', label: 'BATTERY', helper: 'No start, dim lights, charging' },
  { id: 'wheels', label: 'WHEELS', helper: 'Vibration, tire wear, clunks' },
  { id: 'cooling', label: 'COOLING', helper: 'Overheating, coolant leaks' },
  { id: 'transmission', label: 'TRANSMISSION', helper: 'Slipping, hard shifts, delayed' },
  { id: 'brakes', label: 'BRAKES', helper: 'Grinding, ABS light, soft pedal' },
  { id: 'suspension', label: 'SUSPENSION', helper: 'Bouncing, rough ride, knocking' },
  { id: 'steering', label: 'STEERING', helper: 'Loose steering, vibration, leaks' },
  { id: 'fuel', label: 'FUEL SYSTEM', helper: 'Poor MPG, fuel smell, injectors' },
  { id: 'ignition', label: 'IGNITION', helper: 'Misfires, rough idle, no-start' },
  { id: 'air_intake', label: 'AIR INTAKE', helper: 'Vacuum leaks, MAF sensor, airflow' },
  { id: 'sensors', label: 'SENSORS', helper: 'O2, crank, MAP sensor issues' },
  { id: 'electrical', label: 'ELECTRICAL', helper: 'Wiring, fuses, alternator' },
  { id: 'emissions', label: 'EMISSIONS', helper: 'Catalytic, EVAP, smog failures' },
  { id: 'starting', label: 'STARTING', helper: 'Starter motor, ignition switch' },
  { id: 'charging', label: 'CHARGING', helper: 'Alternator, voltage drop, drain' },
  { id: 'drivetrain', label: 'DRIVETRAIN', helper: 'CV axles, differential, vibration' },
  { id: 'tires', label: 'TIRES', helper: 'Alignment, pressure, uneven wear' },
  { id: 'hvac', label: 'HVAC / AC', helper: 'Compressor, blower, refrigerant' },
  { id: 'turbo', label: 'TURBO / BOOST', helper: 'Boost leaks, wastegate, overboost' },
  { id: 'vtec', label: 'VTEC / TIMING', helper: 'Oil pressure, cam timing, VTEC' },
  { id: 'ecu', label: 'ECU / TUNING', helper: 'Limp mode, bad tune, sensors' }
];

function PixelatedCanvas({ children }) {
  const canvasRef = useRef();
  
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const renderer = canvas.querySelector('canvas');
      if (renderer) {
        // Apply pixelated rendering effects
        renderer.style.imageRendering = "pixelated";
        renderer.style.imageRendering = "crisp-edges";
      }
    }
  }, []);

  return (
    <div ref={canvasRef} className="h-64 w-full overflow-hidden rounded-lg border border-retro-border bg-retro-dark-bg">
      {children}
    </div>
  );
}

function RetroCarViewer3D({ selectedParts, onSystemSelect, diagnosticResults }) {
  const [hoodOpen, setHoodOpen] = useState(false);

  useEffect(() => {
    if (selectedParts.includes('battery')) {
      setHoodOpen(true);
    }
  }, [selectedParts]);

  return (
    <div className="pixel-card h-100">
      <h2>3D VEHICLE VIEWER</h2>
      
      <div className="car-stage-3d pixelated-3d">
        <PixelatedCanvas>
          <Canvas 
            camera={{ 
              position: [0, 1.2, 8], 
              fov: 60,
              near: 0.001,
              far: 1000
            }} 
            style={{ 
              background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
              imageRendering: 'pixelated'
            }}
            gl={{ 
              antialias: false,
              alpha: false
            }}
            dpr={0.5}
          >
            <ambientLight intensity={0.55} />
            <directionalLight position={[8, 8, 5]} intensity={1.2} />
            <directionalLight position={[-5, 3, -4]} intensity={0.45} />
            <FallbackCar selectedParts={selectedParts} hoodOpen={hoodOpen} diagnosticResults={diagnosticResults} />
            <Ground />
            <OrbitControls 
              enablePan 
              enableZoom 
              enableRotate 
              target={[0, 0.8, 0]}
              minDistance={4}
              maxDistance={12}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </PixelatedCanvas>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          type="button"
          onClick={() => setHoodOpen(prev => !prev)}
          className="retro-button"
          style={{ fontSize: '0.7rem', padding: '0.5rem 1rem' }}
        >
          {hoodOpen ? 'CLOSE HOOD' : 'OPEN HOOD'}
        </button>
        <div className="small-text" style={{ color: 'var(--retro-dim-text)' }}>
          Rotate to inspect • Click systems below
        </div>
      </div>
      
      <div className="mt-3">
        <div className="category-grid">
          {systemLabels.map(system => {
            const isJdmCategory = ['turbo', 'vtec', 'ecu'].includes(system.id);
            const isSelected = selectedParts.includes(system.id);
            return (
              <button
                key={system.id}
                className={`system-button ${isSelected ? 'active' : ''} ${isJdmCategory ? 'jdm-category' : ''}`}
                onClick={() => onSystemSelect(system.id)}
              >
                <span className="system-label">{system.label}</span>
                <span className="system-helper">{system.helper}</span>
                {isSelected && <span className="selected-indicator">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RetroCarViewer3D;
