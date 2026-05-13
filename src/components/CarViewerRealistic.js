import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced car material with realistic properties
const CarMaterial = ({ color = '#f5f5f5', metalness = 0.7, roughness = 0.2, clearcoat = 0.5, clearcoatRoughness = 0.1 }) => {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      clearcoat={clearcoat}
      clearcoatRoughness={clearcoatRoughness}
      envMapIntensity={1.5}
    />
  );
};

// Glass material for windows
const GlassMaterial = ({ opacity = 0.85, color = '#1a1a1a' }) => {
  return (
    <meshPhysicalMaterial
      color={color}
      opacity={opacity}
      transparent
      metalness={0.1}
      roughness={0.1}
      envMapIntensity={0.5}
    />
  );
};

// Chrome/metal material for trim and accents
const ChromeMaterial = () => {
  return (
    <meshStandardMaterial
      color="#c0c0c0"
      metalness={0.9}
      roughness={0.1}
      envMapIntensity={2.0}
    />
  );
};

// Tire material
const TireMaterial = () => {
  return (
    <meshStandardMaterial
      color="#1a1a1a"
      roughness={0.8}
      metalness={0.1}
    />
  );
};

// Brake light material
const BrakeLightMaterial = () => {
  return (
    <meshStandardMaterial
      color="#cc0000"
      emissive="#cc0000"
      emissiveIntensity={0.8}
      toneMapped={false}
    />
  );
};

// Headlight material
const HeadlightMaterial = () => {
  return (
    <meshStandardMaterial
      color="#ffffff"
      emissive="#ffffff"
      emissiveIntensity={0.4}
      toneMapped={false}
    />
  );
};

// Realistic Honda Accord 2021 Model
function HondaAccord2021({ highlightedPart, hoodOpen, scale = 1.5 }) {
  const groupRef = useRef();
  
  // Hood animation
  useEffect(() => {
    if (groupRef.current) {
      const hood = groupRef.current.children.find(child => child.userData.isHood);
      if (hood) {
        const targetRotation = hoodOpen ? -Math.PI / 4 : 0;
        hood.rotation.x = THREE.MathUtils.lerp(hood.rotation.x, targetRotation, 0.1);
      }
    }
  }, [hoodOpen]);

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={[0, -0.6, 0]}>
      {/* Main Body - More realistic shape */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.8, 1.9]} />
        <CarMaterial 
          color="#e8e8e8" 
          metalness={0.7} 
          roughness={0.2} 
          clearcoat={0.5} 
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Hood - More realistic shape */}
      <mesh 
        position={[2.0, 0.9, 0]} 
        rotation={[0, hoodOpen ? -Math.PI / 4 : 0, 0]}
        userData={{ isHood: true }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.2, 0.1, 1.8]} />
        <CarMaterial 
          color="#e8e8e8" 
          metalness={0.7} 
          roughness={0.2} 
          clearcoat={0.5} 
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Trunk Lid */}
      <mesh position={[-2.2, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.1, 1.8]} />
        <CarMaterial 
          color="#e8e8e8" 
          metalness={0.7} 
          roughness={0.2} 
          clearcoat={0.5} 
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Roof - More realistic slope */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.6, 1.6]} />
        <CarMaterial 
          color="#e8e8e8" 
          metalness={0.7} 
          roughness={0.2} 
          clearcoat={0.5} 
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Front Windshield - More realistic angle */}
      <mesh position={[0.8, 1.3, 0]} rotation={[0, 0, -0.2]} receiveShadow>
        <boxGeometry args={[0.8, 0.5, 1.4]} />
        <GlassMaterial opacity={0.85} />
      </mesh>

      {/* Rear Windshield */}
      <mesh position={[-1.4, 1.3, 0]} rotation={[0, 0, 0.2]} receiveShadow>
        <boxGeometry args={[0.85, 0.5, 1.4]} />
        <GlassMaterial opacity={0.85} />
      </mesh>

      {/* Side Windows - More realistic positioning */}
      <mesh position={[0.8, 1.1, 0.7]} receiveShadow>
        <boxGeometry args={[0.25, 0.35, 0.7]} />
        <GlassMaterial opacity={0.8} />
      </mesh>

      <mesh position={[-1.4, 1.1, 0.7]} receiveShadow>
        <boxGeometry args={[0.25, 0.35, 0.7]} />
        <GlassMaterial opacity={0.8} />
      </mesh>

      {/* Front Grille - Honda signature design */}
      <mesh position={[2.45, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 0.35, 1.6]} />
        <CarMaterial 
          color="#1a1a1a" 
          metalness={0.8} 
          roughness={0.15}
        />
      </mesh>

      {/* Honda Logo Area */}
      <mesh position={[2.45, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.1, 0.3]} />
        <ChromeMaterial />
      </mesh>

      {/* Headlights - More realistic shape */}
      <mesh position={[2.48, 0.7, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.2, 0.35]} />
        <HeadlightMaterial />
      </mesh>

      <mesh position={[2.48, 0.7, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.2, 0.35]} />
        <HeadlightMaterial />
      </mesh>

      {/* Tail Lights - Honda signature LED strip */}
      <mesh position={[-2.48, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.08, 1.4]} />
        <BrakeLightMaterial />
      </mesh>

      {/* Wheels - More realistic positioning */}
      <Wheel position={[1.6, -0.4, 0.85]} highlighted={highlightedPart === 'wheels' || highlightedPart === 'suspension'} />
      <Wheel position={[1.6, -0.4, -0.85]} highlighted={highlightedPart === 'wheels' || highlightedPart === 'suspension'} />
      <Wheel position={[-1.6, -0.4, 0.85]} highlighted={highlightedPart === 'wheels' || highlightedPart === 'suspension'} />
      <Wheel position={[-1.6, -0.4, -0.85]} highlighted={highlightedPart === 'wheels' || highlightedPart === 'suspension'} />

      {/* Side Mirrors - More realistic shape */}
      <mesh position={[0.9, 1.1, 0.95]} castShadow receiveShadow>
        <boxGeometry args={[0.18, 0.12, 0.35]} />
        <CarMaterial 
          color="#e8e8e8" 
          metalness={0.7} 
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0.9, 1.1, -0.95]} castShadow receiveShadow>
        <boxGeometry args={[0.18, 0.12, 0.35]} />
        <CarMaterial 
          color="#e8e8e8" 
          metalness={0.7} 
          roughness={0.2}
        />
      </mesh>

      {/* Door Handles - More realistic */}
      <mesh position={[0.3, 0.65, 0.92]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.1, 0.25]} />
        <ChromeMaterial />
      </mesh>

      <mesh position={[0.3, 0.65, -0.92]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.1, 0.25]} />
        <ChromeMaterial />
      </mesh>

      {/* Chrome Trim Line */}
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 0.02, 1.7]} />
        <ChromeMaterial />
      </mesh>

      {/* Front Bumper */}
      <mesh position={[2.4, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.4, 1.8]} />
        <CarMaterial 
          color="#2a2a2a" 
          metalness={0.6} 
          roughness={0.3}
        />
      </mesh>

      {/* Rear Bumper */}
      <mesh position={[-2.4, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.4, 1.8]} />
        <CarMaterial 
          color="#2a2a2a" 
          metalness={0.6} 
          roughness={0.3}
        />
      </mesh>

      {/* Side Skirts */}
      <mesh position={[0, 0.2, 0.92]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.15, 0.08]} />
        <CarMaterial 
          color="#1a1a1a" 
          metalness={0.6} 
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, 0.2, -0.92]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.15, 0.08]} />
        <CarMaterial 
          color="#1a1a1a" 
          metalness={0.6} 
          roughness={0.3}
        />
      </mesh>

      {/* Engine Components (visible when hood is open) */}
      {hoodOpen && (
        <group>
          {/* Engine Block - More realistic */}
          <mesh position={[1.3, 0.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.35, 0.7]} />
            <CarMaterial 
              color="#4a4a4a" 
              metalness={0.8} 
              roughness={0.3}
              highlighted={highlightedPart === 'engine'}
            />
          </mesh>

          {/* Battery - More realistic */}
          <mesh position={[0.9, 0.7, -0.45]} castShadow receiveShadow>
            <boxGeometry args={[0.35, 0.25, 0.45]} />
            <CarMaterial 
              color="#1a1a1a" 
              highlighted={highlightedPart === 'battery'}
            />
          </mesh>

          {/* Air Intake */}
          <mesh position={[1.9, 0.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.25, 0.25, 0.35]} />
            <CarMaterial 
              color="#3a3a3a" 
              metalness={0.7} 
              roughness={0.3}
            />
          </mesh>

          {/* Radiator */}
          <mesh position={[2.1, 0.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.15, 0.4, 0.8]} />
            <CarMaterial 
              color="#2a2a2a" 
              metalness={0.7} 
              roughness={0.3}
              highlighted={highlightedPart === 'cooling_system'}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Enhanced Wheel Component
function Wheel({ position, highlighted = false }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.01);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <group position={position} rotation={[0, 0, rotation]}>
      {/* Tire */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.22, 32]} />
        <TireMaterial />
      </mesh>

      {/* Rim - More realistic design */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.22, 16]} />
        <ChromeMaterial />
      </mesh>

      {/* Wheel Spokes - More detailed */}
      {[0, Math.PI / 3, 2 * Math.PI / 3, Math.PI, 4 * Math.PI / 3, 5 * Math.PI / 3].map((angle, index) => (
        <mesh 
          key={index} 
          rotation={[0, 0, angle]} 
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[0.03, 0.22, 0.03]} />
          <ChromeMaterial />
        </mesh>
      ))}

      {/* Center Cap */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.24, 16]} />
        <ChromeMaterial />
      </mesh>
    </group>
  );
}

// Ground Plane
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#0a0a0a" />
    </mesh>
  );
}

// Loading Component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-diagnostic-red mx-auto mb-4"></div>
        <p className="text-diagnostic-text">Loading 3D Model...</p>
      </div>
    </div>
  );
}

// Main CarViewerRealistic Component
function CarViewerRealistic({ highlightedPart, onSystemSelect }) {
  const [hoodOpen, setHoodOpen] = useState(false);

  useEffect(() => {
    if (highlightedPart === 'battery' || highlightedPart === 'engine' || highlightedPart === 'cooling_system') {
      setHoodOpen(true);
    }
  }, [highlightedPart]);

  return (
    <div className="space-y-4">
      <div className="h-80 w-full overflow-hidden rounded-lg border border-diagnostic-border bg-diagnostic-bg md:h-96">
        <Canvas 
          camera={{ position: [6, 3.5, 4], fov: 45 }} 
          style={{ background: 'linear-gradient(to bottom, #020617, #050505)' }}
          shadows
        >
          <Suspense fallback={<LoadingFallback />}>
            <Stage environment="city" intensity={0.6} preset="rembrandt">
              <HondaAccord2021 highlightedPart={highlightedPart} hoodOpen={hoodOpen} />
              <Ground />
            </Stage>
            <OrbitControls 
              enablePan 
              enableZoom 
              enableRotate 
              minDistance={3} 
              maxDistance={15} 
              maxPolarAngle={Math.PI / 2.2}
              minPolarAngle={Math.PI / 6}
            />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="rounded-lg border border-neutral-800 bg-diagnostic-surface p-3 text-xs text-diagnostic-muted">
        2021 Honda Accord 3D Model: Realistic visualization with accurate proportions and Honda signature design elements.
      </div>
      
      <button
        type="button"
        onClick={() => setHoodOpen(!hoodOpen)}
        className="w-full rounded-lg border border-diagnostic-border bg-diagnostic-surface px-4 py-3 text-sm font-semibold text-diagnostic-text transition hover:bg-red-950/30"
      >
        {hoodOpen ? 'Close Hood' : 'Open Hood'}
      </button>
      
      <div className="grid gap-2 sm:grid-cols-2">
        {[
          { id: 'engine', label: 'Engine / Front Hood', helper: 'Misfires, stalling, power loss' },
          { id: 'exhaust', label: 'Exhaust/O2 Sensor', helper: 'Smells, noise, emissions codes' },
          { id: 'battery', label: 'Battery', helper: 'No start, dim lights, charging' },
          { id: 'wheels', label: 'Wheels/Suspension', helper: 'Vibration, tire wear, clunks' },
          { id: 'cooling_system', label: 'Cooling System', helper: 'Overheating or coolant loss' }
        ].map(system => (
          <button 
            key={system.id} 
            type="button" 
            onClick={() => onSystemSelect?.(system.id)} 
            className={`rounded-lg border p-3 text-left transition ${
              highlightedPart === system.id 
                ? 'border-diagnostic-red bg-red-950/30' 
                : 'border-neutral-800 bg-diagnostic-surface hover:border-diagnostic-red'
            }`}
          >
            <p className="font-semibold text-diagnostic-text">{system.label}</p>
            <p className="text-xs text-diagnostic-muted">{system.helper}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CarViewerRealistic;
