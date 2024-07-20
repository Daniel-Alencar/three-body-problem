import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { calculatePositions } from '../../test/test';

const Sphere = ({ position, color, speed, isRunning }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const [velocity, setVelocity] = useState([0,0,5000]);
  const [positions, setPositions] = useState([7000 * 1000 * 3,0,0]);

  useFrame((state) => {
    if (isRunning && meshRef.current) {
      const newValues = calculatePositions(positions, velocity);
      
      setVelocity([newValues.vx, newValues.vy, newValues.vz]);
      setPositions([newValues.x, newValues.y, newValues.z]);

      // Atualiza a posição do corpo
      if(!(isNaN(newValues.x) || isNaN(newValues.y) || isNaN(newValues.z))) {
        meshRef.current.position.x = newValues.x / 10000000;
        meshRef.current.position.y = newValues.y / 10000000;
        meshRef.current.position.z = newValues.z / 10000000;
      }

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