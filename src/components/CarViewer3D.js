import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stage } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced material for realistic car rendering
const CarMaterial = ({ color = '#ffffff', metalness = 0.4, roughness = 0.3, clearcoat = 0.1, clearcoatRoughness = 0.2 }) => {
  return (
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      clearcoat={clearcoat}
      clearcoatRoughness={clearcoatRoughness}
      envMapIntensity={1.5}
    />
  );
};

// Glass material for windows and lights
const GlassMaterial = ({ color = '#111827', opacity = 0.8, metalness = 0.1, roughness = 0.15 }) => {
  return (
    <meshPhysicalMaterial
      color={color}
      opacity={opacity}
      transparent
      metalness={metalness}
      roughness={roughness}
      envMapIntensity={0.5}
    />
  );
};

// Wheel material with realistic tire appearance
const WheelMaterial = () => {
  return (
    <meshStandardMaterial
      color="#1a1a1a"
      roughness={0.8}
      metalness={0.1}
    />
  );
};

// Rim material
const RimMaterial = ({ color = '#c0c0c0', metalness = 0.8, roughness = 0.2 }) => {
  return (
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      envMapIntensity={1.0}
    />
  );
};

// Brake light material
const BrakeLightMaterial = () => {
  return (
    <meshStandardMaterial
      color="#ff0000"
      emissive="#ff0000"
      emissiveIntensity={0.5}
      toneMapped={false}
    />
  );
};

// Headlight material
const HeadlightMaterial = () => {
  return (
    <meshStandardMaterial
      color="#ffffcc"
      emissive="#ffffcc"
      emissiveIntensity={0.3}
      toneMapped={false}
    />
  );
};

// Enhanced Honda Accord 3D Model Component
function HondaAccord3D({ highlightedPart, hoodOpen, scale = 1.5 }) {
  const groupRef = useRef();
  
  // Hood animation
  useEffect(() => {
    if (groupRef.current) {
      const hood = groupRef.current.children.find(child => child.userData.isHood);
      if (hood) {
        const targetRotation = hoodOpen ? -Math.PI / 3 : 0;
        hood.rotation.x = THREE.MathUtils.lerp(hood.rotation.x, targetRotation, 0.1);
      }
    }
  }, [hoodOpen]);

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={[0, -0.5, 0]}>
      {/* Main Body */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.9, 0.6, 1.8]} />
        <CarMaterial 
          color="#f5f5f5" 
          metalness={0.6} 
          roughness={0.25} 
          clearcoat={0.3} 
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Hood */}
      <mesh 
        position={[1.8, 0.8, 0]} 
        rotation={[0, hoodOpen ? -Math.PI / 3 : 0, 0]}
        userData={{ isHood: true }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.3, 0.15, 1.7]} />
        <CarMaterial 
          color="#f5f5f5" 
          metalness={0.6} 
          roughness={0.25} 
          clearcoat={0.3} 
          clearcoatRoughness={0.15}
          highlighted={highlightedPart === 'engine' || highlightedPart === 'cooling_system'}
        />
      </mesh>

      {/* Trunk */}
      <mesh position={[-2.1, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.15, 1.7]} />
        <CarMaterial 
          color="#f5f5f5" 
          metalness={0.6} 
          roughness={0.25} 
          clearcoat={0.3} 
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.7, 1.5]} />
        <CarMaterial 
          color="#f5f5f5" 
          metalness={0.6} 
          roughness={0.25} 
          clearcoat={0.3} 
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Front Windshield */}
      <mesh position={[0.7, 1.2, 0]} rotation={[0, 0, -0.15]} receiveShadow>
        <boxGeometry args={[0.9, 0.4, 1.3]} />
        <GlassMaterial opacity={0.85} />
      </mesh>

      {/* Rear Windshield */}
      <mesh position={[-1.3, 1.2, 0]} rotation={[0, 0, 0.15]} receiveShadow>
        <boxGeometry args={[0.95, 0.4, 1.3]} />
        <GlassMaterial opacity={0.85} />
      </mesh>

      {/* Side Windows */}
      <mesh position={[0.7, 1.0, 0.65]} receiveShadow>
        <boxGeometry args={[0.3, 0.3, 0.8]} />
        <GlassMaterial opacity={0.7} />
      </mesh>

      <mesh position={[-1.3, 1.0, 0.65]} receiveShadow>
        <boxGeometry args={[0.3, 0.3, 0.8]} />
        <GlassMaterial opacity={0.7} />
      </mesh>

      {/* Front Grille */}
      <mesh position={[2.5, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.3, 1.7]} />
        <CarMaterial 
          color="#2a2a2a" 
          metalness={0.8} 
          roughness={0.15}
        />
      </mesh>

      {/* Headlights */}
      <mesh position={[2.55, 0.6, 0.55]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.15, 0.4]} />
        <HeadlightMaterial />
      </mesh>

      <mesh position={[2.55, 0.6, -0.55]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.15, 0.4]} />
        <HeadlightMaterial />
      </mesh>

      {/* Tail Lights */}
      <mesh position={[-2.55, 0.6, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.1, 0.3]} />
        <BrakeLightMaterial />
      </mesh>

      <mesh position={[-2.55, 0.6, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.1, 0.3]} />
        <BrakeLightMaterial />
      </mesh>

      {/* Wheels */}
      <Wheel position={[1.5, -0.3, 0.8]} highlighted={highlightedPart === 'wheels' || highlightedPart === 'suspension'} />
      <Wheel position={[1.5, -0.3, -0.8]} highlighted={highlightedPart === 'wheels' || highlightedPart === 'suspension'} />
      <Wheel position={[-1.5, -0.3, 0.8]} highlighted={highlightedPart === 'wheels' || highlightedPart === 'suspension'} />
      <Wheel position={[-1.5, -0.3, -0.8]} highlighted={highlightedPart === 'wheels' || highlightedPart === 'suspension'} />

      {/* Side Mirrors */}
      <mesh position={[0.8, 1.0, 0.95]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.1, 0.3]} />
        <CarMaterial 
          color="#f5f5f5" 
          metalness={0.6} 
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0.8, 1.0, -0.95]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.1, 0.3]} />
        <CarMaterial 
          color="#f5f5f5" 
          metalness={0.6} 
          roughness={0.25}
        />
      </mesh>

      {/* Door Handles */}
      <mesh position={[0.2, 0.6, 0.9]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.08, 0.2]} />
        <CarMaterial 
          color="#2a2a2a" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0.2, 0.6, -0.9]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.08, 0.2]} />
        <CarMaterial 
          color="#2a2a2a" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>

      {/* Engine Components (visible when hood is open) */}
      {hoodOpen && (
        <group>
          {/* Engine Block */}
          <mesh position={[1.2, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.3, 0.6]} />
            <CarMaterial 
              color="#4a4a4a" 
              metalness={0.8} 
              roughness={0.3}
              highlighted={highlightedPart === 'engine'}
            />
          </mesh>

          {/* Battery */}
          <mesh position={[0.8, 0.6, -0.4]} castShadow receiveShadow>
            <boxGeometry args={[0.3, 0.2, 0.4]} />
            <CarMaterial 
              color="#1a1a1a" 
              highlighted={highlightedPart === 'battery'}
            />
          </mesh>

          {/* Air Intake */}
          <mesh position={[1.8, 0.7, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 0.2, 0.3]} />
            <CarMaterial 
              color="#3a3a3a" 
              metalness={0.7} 
              roughness={0.3}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Enhanced Wheel Component
function Wheel({ position, highlighted = false }) {
  const wheelRef = useRef();
  const [rotation, setRotation] = useState(0);

  // Rotate wheels for animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.01);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <group position={position} rotation={[0, 0, rotation]}>
      {/* Tire */}
      <mesh ref={wheelRef} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
        <WheelMaterial />
      </mesh>

      {/* Rim */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.25, 16]} />
        <RimMaterial color={highlighted ? "#dc2626" : "#c0c0c0"} />
      </mesh>

      {/* Wheel Spokes */}
      {[0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].map((angle, index) => (
        <mesh 
          key={index} 
          rotation={[0, 0, angle]} 
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[0.02, 0.25, 0.02]} />
          <RimMaterial color="#808080" />
        </mesh>
      ))}
    </group>
  );
}

// Ground Plane
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
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

// Main CarViewer3D Component
function CarViewer3D({ highlightedPart, onSystemSelect }) {
  const [hoodOpen, setHoodOpen] = useState(false);

  useEffect(() => {
    if (highlightedPart === 'battery') {
      setHoodOpen(true);
    }
  }, [highlightedPart]);

  return (
    <div className="space-y-4">
      <div className="h-80 w-full overflow-hidden rounded-lg border border-diagnostic-border bg-diagnostic-bg md:h-96">
        <Canvas 
          camera={{ position: [6, 3, 4], fov: 45 }} 
          style={{ background: 'linear-gradient(to bottom, #020617, #050505)' }}
          shadows
        >
          <Suspense fallback={<LoadingFallback />}>
            <Stage environment="city" intensity={0.5}>
              <HondaAccord3D highlightedPart={highlightedPart} hoodOpen={hoodOpen} />
              <Ground />
            </Stage>
            <OrbitControls 
              enablePan 
              enableZoom 
              enableRotate 
              minDistance={3} 
              maxDistance={15} 
              maxPolarAngle={Math.PI / 2.5}
              minPolarAngle={Math.PI / 6}
            />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="rounded-lg border border-neutral-800 bg-diagnostic-surface p-3 text-xs text-diagnostic-muted">
        2021 Honda Accord 3D Model: Interactive 3D visualization with realistic materials and lighting.
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

export default CarViewer3D;
