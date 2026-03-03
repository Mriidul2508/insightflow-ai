import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

const ProjectNode = () => {
  const mesh = useRef();
  
  useFrame((state) => {
    mesh.current.rotation.x = state.clock.getElapsedTime() * 0.5;
  });

  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={2}>
      <Sphere args={[1, 100, 200]} scale={2} ref={mesh}>
        <MeshDistortMaterial color="#6366f1" attach="material" distort={0.4} speed={2} />
      </Sphere>
    </Float>
  );
};

// THIS IS THE LINE REACT WAS MISSING
export default ProjectNode;