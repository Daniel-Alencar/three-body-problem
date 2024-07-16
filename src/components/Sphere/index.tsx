import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Sphere = ({ position, color, speed, isRunning, mass }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (isRunning && meshRef.current) {
      const acceleration = speed.map(v => v / mass);
      meshRef.current.position.x += speed[0];
      meshRef.current.position.y += speed[1];
      meshRef.current.position.z += speed[2];
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Sphere;