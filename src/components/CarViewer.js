import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Plane } from '@react-three/drei';
import * as THREE from 'three';

// Car body component
function CarBody({ highlightedPart }) {
  const meshRef = useRef();
  
  // Simple car geometry using basic shapes
  const isHighlighted = highlightedPart === 'body' || highlightedPart === 'engine' || highlightedPart === 'transmission';
  
  return (
    <group>
      {/* Main car body */}
      <Box
        ref={meshRef}
        args={[4, 1.5, 2]}
        position={[0, 0.5, 0]}
        material-color={isHighlighted ? '#dc2626' : '#ffffff'}
        material-emissive={isHighlighted ? '#dc2626' : '#000000'}
        material-emissiveIntensity={isHighlighted ? 0.3 : 0}
      >
        <meshStandardMaterial 
          color={isHighlighted ? '#dc2626' : '#ffffff'} 
          emissive={isHighlighted ? '#dc2626' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.3 : 0}
        />
      </Box>
      
      {/* Car roof */}
      <Box
        args={[2.5, 0.8, 1.8]}
        position={[0, 1.5, 0]}
        material-color={isHighlighted ? '#dc2626' : '#ffffff'}
        material-emissive={isHighlighted ? '#dc2626' : '#000000'}
        material-emissiveIntensity={isHighlighted ? 0.3 : 0}
      >
        <meshStandardMaterial 
          color={isHighlighted ? '#dc2626' : '#ffffff'} 
          emissive={isHighlighted ? '#dc2626' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.3 : 0}
        />
      </Box>
      
      {/* Windows */}
      <Box
        args={[2.3, 0.6, 1.6]}
        position={[0, 1.5, 0]}
        material-color="#0a0a0a"
        material-opacity={0.7}
        material-transparent
      >
        <meshStandardMaterial color="#0a0a0a" opacity={0.7} transparent />
      </Box>
    </group>
  );
}

// Wheels component
function Wheels({ highlightedPart }) {
  const isHighlighted = highlightedPart === 'wheels' || highlightedPart === 'brakes' || highlightedPart === 'suspension';
  
  return (
    <group>
      {/* Front wheels */}
      <Cylinder
        args={[0.4, 0.4, 0.3, 16]}
        position={[1.3, -0.3, 1.2]}
        rotation={[Math.PI / 2, 0, 0]}
        material-color={isHighlighted ? '#dc2626' : '#525252'}
        material-emissive={isHighlighted ? '#dc2626' : '#000000'}
        material-emissiveIntensity={isHighlighted ? 0.3 : 0}
      >
        <meshStandardMaterial 
          color={isHighlighted ? '#dc2626' : '#525252'} 
          emissive={isHighlighted ? '#dc2626' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.3 : 0}
        />
      </Cylinder>
      <Cylinder
        args={[0.4, 0.4, 0.3, 16]}
        position={[1.3, -0.3, -1.2]}
        rotation={[Math.PI / 2, 0, 0]}
        material-color={isHighlighted ? '#dc2626' : '#525252'}
        material-emissive={isHighlighted ? '#dc2626' : '#000000'}
        material-emissiveIntensity={isHighlighted ? 0.3 : 0}
      >
        <meshStandardMaterial 
          color={isHighlighted ? '#dc2626' : '#525252'} 
          emissive={isHighlighted ? '#dc2626' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.3 : 0}
        />
      </Cylinder>
      
      {/* Rear wheels */}
      <Cylinder
        args={[0.4, 0.4, 0.3, 16]}
        position={[-1.3, -0.3, 1.2]}
        rotation={[Math.PI / 2, 0, 0]}
        material-color={isHighlighted ? '#dc2626' : '#525252'}
        material-emissive={isHighlighted ? '#dc2626' : '#000000'}
        material-emissiveIntensity={isHighlighted ? 0.3 : 0}
      >
        <meshStandardMaterial 
          color={isHighlighted ? '#dc2626' : '#525252'} 
          emissive={isHighlighted ? '#dc2626' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.3 : 0}
        />
      </Cylinder>
      <Cylinder
        args={[0.4, 0.4, 0.3, 16]}
        position={[-1.3, -0.3, -1.2]}
        rotation={[Math.PI / 2, 0, 0]}
        material-color={isHighlighted ? '#dc2626' : '#525252'}
        material-emissive={isHighlighted ? '#dc2626' : '#000000'}
        material-emissiveIntensity={isHighlighted ? 0.3 : 0}
      >
        <meshStandardMaterial 
          color={isHighlighted ? '#dc2626' : '#525252'} 
          emissive={isHighlighted ? '#dc2626' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.3 : 0}
        />
      </Cylinder>
    </group>
  );
}

// Engine component (simplified representation)
function Engine({ highlightedPart }) {
  const isHighlighted = highlightedPart === 'engine' || highlightedPart === 'battery' || highlightedPart === 'alternator';
  
  return (
    <Box
      args={[1.2, 0.8, 1]}
      position={[1.2, 0.3, 0]}
      material-color={isHighlighted ? '#dc2626' : '#d97706'}
      material-emissive={isHighlighted ? '#dc2626' : '#000000'}
      material-emissiveIntensity={isHighlighted ? 0.3 : 0}
    >
      <meshStandardMaterial 
        color={isHighlighted ? '#dc2626' : '#d97706'} 
        emissive={isHighlighted ? '#dc2626' : '#000000'}
        emissiveIntensity={isHighlighted ? 0.3 : 0}
      />
    </Box>
  );
}

// Exhaust system
function Exhaust({ highlightedPart }) {
  const isHighlighted = highlightedPart === 'exhaust' || highlightedPart === 'muffler';
  
  return (
    <group>
      <Cylinder
        args={[0.1, 0.1, 3, 8]}
        position={[-1.5, -0.2, 0.8]}
        rotation={[0, 0, Math.PI / 2]}
        material-color={isHighlighted ? '#dc2626' : '#525252'}
        material-emissive={isHighlighted ? '#dc2626' : '#000000'}
        material-emissiveIntensity={isHighlighted ? 0.3 : 0}
      >
        <meshStandardMaterial 
          color={isHighlighted ? '#dc2626' : '#525252'} 
          emissive={isHighlighted ? '#dc2626' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.3 : 0}
        />
      </Cylinder>
      <Box
        args={[0.4, 0.3, 0.3]}
        position={[-2.8, -0.2, 0.8]}
        material-color={isHighlighted ? '#dc2626' : '#525252'}
        material-emissive={isHighlighted ? '#dc2626' : '#000000'}
        material-emissiveIntensity={isHighlighted ? 0.3 : 0}
      >
        <meshStandardMaterial 
          color={isHighlighted ? '#dc2626' : '#525252'} 
          emissive={isHighlighted ? '#dc2626' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.3 : 0}
        />
      </Box>
    </group>
  );
}

// Ground plane
function Ground() {
  return (
    <Plane
      args={[20, 20]}
      position={[0, -1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      material-color="#0a0a0a"
    >
      <meshStandardMaterial color="#0a0a0a" />
    </Plane>
  );
}

// Main car viewer component
function CarViewer({ highlightedPart }) {
  return (
    <div className="w-full h-96 bg-diagnostic-bg rounded-lg overflow-hidden border border-diagnostic-border">
      <Canvas
        camera={{ position: [5, 3, 5], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #000000, #0a0a0a)' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        
        <CarBody highlightedPart={highlightedPart} />
        <Wheels highlightedPart={highlightedPart} />
        <Engine highlightedPart={highlightedPart} />
        <Exhaust highlightedPart={highlightedPart} />
        <Ground />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
}

export default CarViewer;
