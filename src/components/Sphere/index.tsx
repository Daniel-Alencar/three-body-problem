import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { calculatePositions } from '../../test/test';

const Sphere = ({ position, speed, mass, color, isRunning }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const [velocity, setVelocity] = useState(speed);
  const [positions, setPositions] = useState(position);
  const [sphereMass, setSphereMass] = useState(mass);

  useEffect(() => {
    setPositions(position);
    setVelocity(speed);
    setSphereMass(mass);
  }, [position, speed, mass])

  useFrame(() => {
    if (isRunning && meshRef.current) {

      const realPositions = [
        positions[0] * 10000000,
        positions[1] * 10000000,
        positions[2] * 10000000,
      ]
      const newValues = calculatePositions(sphereMass, realPositions, velocity);
      
      setVelocity([newValues.vx, newValues.vy, newValues.vz]);
      setPositions([newValues.x / 10000000, newValues.y / 10000000, newValues.z / 10000000]);

      // Atualiza a posição do corpo
      if(!(isNaN(newValues.x) || isNaN(newValues.y) || isNaN(newValues.z))) {
        meshRef.current.position.x = newValues.x / 10000000;
        meshRef.current.position.y = newValues.y / 10000000;
        meshRef.current.position.z = newValues.z / 10000000;
      }

    }
  });

  return (
    <mesh ref={meshRef} position={positions} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Sphere;