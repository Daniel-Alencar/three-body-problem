import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as dat from 'dat.gui';

import Sphere from '../Sphere';

interface ThickAxesHelperProps {
  size: number;
  thickness: number;
  position: [number, number, number];
}

function ThickAxesHelper({ size, thickness, position }: ThickAxesHelperProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[thickness / 2, thickness / 2, size, 32]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[thickness / 2, thickness / 2, size, 32]} />
        <meshBasicMaterial color="green" />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[thickness / 2, thickness / 2, size, 32]} />
        <meshBasicMaterial color="blue" />
      </mesh>
    </group>
  );
}

const ThreeScene: React.FC = () => {
  const [sphere1Speed, setSphere1Speed] = useState([0, 0, 5000]);
  const [sphere1Position, setSphere1Position] = useState([2.1, 0, 0]);
  const [sphere1Mass, setSphere1Mass] = useState(1);

  const [isRunning, setIsRunning] = useState(false);

  const guiRef = useRef<dat.GUI | null>(null);

  useEffect(() => {
    if (!guiRef.current) {
      guiRef.current = new dat.GUI();
  
      const sphere1Folder = guiRef.current.addFolder('Sphere 1');
  
      sphere1Folder.add(sphere1Speed, '0', -5000, 5000).name('Speed X')
        .setValue(sphere1Speed[0])
        .onChange(value => setSphere1Speed([value, sphere1Speed[1], sphere1Speed[2]]));
  
      sphere1Folder.add(sphere1Speed, '1', -5000, 5000).name('Speed Y')
        .setValue(sphere1Speed[1])
        .onChange(value => setSphere1Speed([sphere1Speed[0], value, sphere1Speed[2]]));
  
      sphere1Folder.add(sphere1Speed, '2', -5000, 5000).name('Speed Z')
        .setValue(sphere1Speed[2])
        .onChange(value => setSphere1Speed([sphere1Speed[0], sphere1Speed[1], value]));
  
      sphere1Folder.add(sphere1Position, '0', -10, 10).name('Position X')
        .setValue(sphere1Position[0])
        .onChange(value => setSphere1Position([value, sphere1Position[1], sphere1Position[2]]));
  
      sphere1Folder.add(sphere1Position, '1', -10, 10).name('Position Y')
        .setValue(sphere1Position[1])
        .onChange(value => setSphere1Position([sphere1Position[0], value, sphere1Position[2]]));
  
      sphere1Folder.add(sphere1Position, '2', -10, 10).name('Position Z')
        .setValue(sphere1Position[2])
        .onChange(value => setSphere1Position([sphere1Position[0], sphere1Position[1], value]));
  
      sphere1Folder.add({ mass: sphere1Mass }, 'mass', 1, 100000).name('Mass')
        .setValue(sphere1Mass)
        .onChange(value => setSphere1Mass(value));
    }
  
    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, []);

  const startSimulation = () => {
    setIsRunning(true);
  };

  const stopSimulation = () => {
    setIsRunning(false);
  };

  return (
    <div>
      <Canvas
        style={{ width: '100%', height: '92vh' }}
        gl={{ alpha: false }}
        camera={{ position: [10, 10, 45] }}
        shadows
      >
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 7.5]} 
          castShadow 
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[10, 10, 10]} />
        
        <ThickAxesHelper 
          size={100000} 
          thickness={0.05}
          position={[0,0,0]}
        />

        <Sphere 
          position={sphere1Position} speed={sphere1Speed} mass={sphere1Mass}
          isRunning={isRunning} color="#ffcccb"
        />

        <OrbitControls />
        
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.5} />
        </mesh>

      </Canvas>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {!isRunning && <button onClick={startSimulation}>Iniciar Simulação</button>}
        {isRunning && <button onClick={stopSimulation}>Parar Simulação</button>}
      </div>
    </div>
  );
};

export default ThreeScene;
