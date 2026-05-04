import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Plane, RoundedBox } from '@react-three/drei';

const paintColor = '#f8fafc';
const trimColor = '#171717';
const glassColor = '#111827';
const highlightColor = '#dc2626';

function Material({ color, highlighted = false, metalness = 0.2, roughness = 0.45, transparent = false, opacity = 1 }) {
  return (
    <meshStandardMaterial
      color={highlighted ? highlightColor : color}
      emissive={highlighted ? highlightColor : '#000000'}
      emissiveIntensity={highlighted ? 0.35 : 0}
      metalness={metalness}
      roughness={roughness}
      transparent={transparent}
      opacity={opacity}
    />
  );
}

function AccordBody({ highlightedPart, hoodOpen }) {
  const hoodHighlighted = highlightedPart === 'engine' || highlightedPart === 'cooling_system';
  const batteryHighlighted = highlightedPart === 'battery';
  const hoodPosition = hoodOpen ? [1.58, 1.25, 0] : [1.72, 0.83, 0];
  const hoodRotation = hoodOpen ? [0, 0, -0.78] : [0, 0, -0.06];

  return (
    <group>
      <RoundedBox args={[5.8, 0.75, 1.9]} radius={0.16} smoothness={6} position={[0, 0.35, 0]}>
        <Material color={paintColor} />
      </RoundedBox>
      <RoundedBox args={[1.65, 0.18, 1.78]} radius={0.08} smoothness={5} position={hoodPosition} rotation={hoodRotation}>
        <Material color={paintColor} highlighted={hoodHighlighted} />
      </RoundedBox>
      <RoundedBox args={[1.25, 0.18, 1.72]} radius={0.08} smoothness={5} position={[-2.05, 0.78, 0]} rotation={[0, 0, 0.04]}>
        <Material color={paintColor} />
      </RoundedBox>
      <RoundedBox args={[2.35, 0.82, 1.62]} radius={0.16} smoothness={6} position={[-0.35, 1.13, 0]}>
        <Material color={paintColor} />
      </RoundedBox>
      <RoundedBox args={[0.88, 0.48, 1.5]} radius={0.08} smoothness={4} position={[0.64, 1.2, 0]} rotation={[0, 0, -0.18]}>
        <Material color={glassColor} transparent opacity={0.72} metalness={0} roughness={0.15} />
      </RoundedBox>
      <RoundedBox args={[0.9, 0.46, 1.5]} radius={0.08} smoothness={4} position={[-1.18, 1.2, 0]} rotation={[0, 0, 0.18]}>
        <Material color={glassColor} transparent opacity={0.72} metalness={0} roughness={0.15} />
      </RoundedBox>
      <Box args={[0.08, 0.5, 1.58]} position={[-0.28, 1.2, 0]}>
        <Material color={trimColor} />
      </Box>
      <RoundedBox args={[0.18, 0.38, 1.72]} radius={0.04} smoothness={4} position={[2.98, 0.43, 0]}>
        <Material color={trimColor} />
      </RoundedBox>
      <RoundedBox args={[0.16, 0.22, 0.52]} radius={0.04} smoothness={4} position={[3.08, 0.58, 0.52]}>
        <Material color="#fef3c7" />
      </RoundedBox>
      <RoundedBox args={[0.16, 0.22, 0.52]} radius={0.04} smoothness={4} position={[3.08, 0.58, -0.52]}>
        <Material color="#fef3c7" />
      </RoundedBox>
      <RoundedBox args={[0.18, 0.36, 1.72]} radius={0.05} smoothness={4} position={[-3.0, 0.4, 0]}>
        <Material color={paintColor} />
      </RoundedBox>
      <RoundedBox args={[0.15, 0.22, 0.48]} radius={0.04} smoothness={4} position={[-3.08, 0.55, 0.55]}>
        <Material color="#991b1b" />
      </RoundedBox>
      <RoundedBox args={[0.15, 0.22, 0.48]} radius={0.04} smoothness={4} position={[-3.08, 0.55, -0.55]}>
        <Material color="#991b1b" />
      </RoundedBox>
      <Box args={[0.58, 0.32, 0.64]} position={[1.75, 0.48, 0]}>
        <Material color="#a16207" highlighted={hoodHighlighted} />
      </Box>
      <Box args={[0.34, 0.26, 0.42]} position={[1.26, 0.54, -0.46]}>
        <Material color="#1f2937" highlighted={batteryHighlighted} />
      </Box>
    </group>
  );
}

function Wheels({ highlightedPart }) {
  const isHighlighted = highlightedPart === 'wheels' || highlightedPart === 'suspension';
  const wheelPositions = [[1.8, -0.03, 1.02], [1.8, -0.03, -1.02], [-1.85, -0.03, 1.02], [-1.85, -0.03, -1.02]];

  return (
    <group>
      {wheelPositions.map(position => (
        <group key={position.join('-')} position={position}>
          <Cylinder args={[0.43, 0.43, 0.28, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <Material color="#111111" highlighted={isHighlighted} roughness={0.7} />
          </Cylinder>
          <Cylinder args={[0.24, 0.24, 0.31, 24]} rotation={[Math.PI / 2, 0, 0]}>
            <Material color="#9ca3af" highlighted={isHighlighted} metalness={0.5} roughness={0.25} />
          </Cylinder>
        </group>
      ))}
    </group>
  );
}

function Exhaust({ highlightedPart }) {
  const isHighlighted = highlightedPart === 'exhaust';
  return (
    <group>
      <Cylinder args={[0.06, 0.06, 2.2, 12]} position={[-1.75, 0.02, 0.74]} rotation={[0, 0, Math.PI / 2]}>
        <Material color="#6b7280" highlighted={isHighlighted} metalness={0.55} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.11, 0.11, 0.45, 12]} position={[-3.1, 0.02, 0.74]} rotation={[0, Math.PI / 2, 0]}>
        <Material color="#9ca3af" highlighted={isHighlighted} metalness={0.6} roughness={0.25} />
      </Cylinder>
    </group>
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
  { id: 'engine', label: 'Engine / Front Hood', helper: 'Misfires, stalling, power loss' },
  { id: 'exhaust', label: 'Exhaust/O2 Sensor', helper: 'Smells, noise, emissions codes' },
  { id: 'battery', label: 'Battery', helper: 'No start, dim lights, charging' },
  { id: 'wheels', label: 'Wheels/Suspension', helper: 'Vibration, tire wear, clunks' },
  { id: 'cooling_system', label: 'Cooling System', helper: 'Overheating or coolant loss' }
];

function CarViewer({ highlightedPart, onSystemSelect }) {
  const [hoodOpen, setHoodOpen] = useState(false);

  useEffect(() => {
    if (highlightedPart === 'battery') {
      setHoodOpen(true);
    }
  }, [highlightedPart]);

  return (
    <div className="space-y-4">
      <div className="h-80 w-full overflow-hidden rounded-lg border border-diagnostic-border bg-diagnostic-bg md:h-96">
        <Canvas camera={{ position: [5.6, 2.7, 4.6], fov: 45 }} style={{ background: 'linear-gradient(to bottom, #020617, #050505)' }}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[8, 8, 5]} intensity={1.2} />
          <directionalLight position={[-5, 3, -4]} intensity={0.45} />
          <AccordBody highlightedPart={highlightedPart} hoodOpen={hoodOpen} />
          <Wheels highlightedPart={highlightedPart} />
          <Exhaust highlightedPart={highlightedPart} />
          <Ground />
          <OrbitControls enablePan enableZoom enableRotate minDistance={3.2} maxDistance={12} />
        </Canvas>
      </div>
      <div className="rounded-lg border border-neutral-800 bg-diagnostic-surface p-3 text-xs text-diagnostic-muted">
        1997 Honda Accord-inspired sedan view: open the hood to inspect engine-bay parts like the battery.
      </div>
      <button
        type="button"
        onClick={() => setHoodOpen(prev => !prev)}
        className="w-full rounded-lg border border-diagnostic-border bg-diagnostic-surface px-4 py-3 text-sm font-semibold text-diagnostic-text transition hover:bg-red-950/30"
      >
        {hoodOpen ? 'Close Hood' : 'Open Hood'}
      </button>
      <div className="grid gap-2 sm:grid-cols-2">
        {systemLabels.map(system => (
          <button key={system.id} type="button" onClick={() => onSystemSelect?.(system.id)} className={`rounded-lg border p-3 text-left transition ${highlightedPart === system.id ? 'border-diagnostic-red bg-red-950/30' : 'border-neutral-800 bg-diagnostic-surface hover:border-diagnostic-red'}`}>
            <p className="font-semibold text-diagnostic-text">{system.label}</p>
            <p className="text-xs text-diagnostic-muted">{system.helper}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CarViewer;
