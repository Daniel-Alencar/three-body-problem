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
  const [sphere1Speed, setSphere1Speed] = useState([0, 0, 0]);
  const [sphere2Speed, setSphere2Speed] = useState([0, 0.01, 0]);
  const [sphere3Speed, setSphere3Speed] = useState([0.01, 0, 0]);
  const [sphere1Mass, setSphere1Mass] = useState(1);
  const [sphere2Mass, setSphere2Mass] = useState(1);
  const [sphere3Mass, setSphere3Mass] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  const guiRef = useRef<dat.GUI | null>(null);

  useEffect(() => {
    if(!guiRef.current) {
      guiRef.current = new dat.GUI();

      const sphere1Folder = guiRef.current.addFolder('Sphere 1');
      sphere1Folder.add(sphere1Speed, '0', -0.1, 0.1).name('Speed X')
        .onChange(value => setSphere1Speed([value, sphere1Speed[1], sphere1Speed[2]]));
      sphere1Folder.add(sphere1Speed, '1', -0.1, 0.1).name('Speed Y')
        .onChange(value => setSphere1Speed([sphere1Speed[0], value, sphere1Speed[2]]));
      sphere1Folder.add(sphere1Speed, '2', -0.1, 0.1).name('Speed Z')
        .onChange(value => setSphere1Speed([sphere1Speed[0], sphere1Speed[1], value]));
      sphere1Folder.add({ mass: sphere1Mass }, 'mass', 0.1, 10).name('Mass')
        .onChange(value => setSphere1Mass(value));

      const sphere2Folder = guiRef.current.addFolder('Sphere 2');
      sphere2Folder.add(sphere2Speed, '0', -0.1, 0.1).name('Speed X')
        .onChange(value => setSphere2Speed([value, sphere2Speed[1], sphere2Speed[2]]));
      sphere2Folder.add(sphere2Speed, '1', -0.1, 0.1).name('Speed Y')
        .onChange(value => setSphere2Speed([sphere2Speed[0], value, sphere2Speed[2]]));
      sphere2Folder.add(sphere2Speed, '2', -0.1, 0.1).name('Speed Z')
        .onChange(value => setSphere2Speed([sphere2Speed[0], sphere2Speed[1], value]));
      sphere2Folder.add({ mass: sphere2Mass }, 'mass', 0.1, 10).name('Mass')
        .onChange(value => setSphere2Mass(value));

      const sphere3Folder = guiRef.current.addFolder('Sphere 3');
      sphere3Folder.add(sphere3Speed, '0', -0.1, 0.1).name('Speed X')
        .onChange(value => setSphere3Speed([value, sphere3Speed[1], sphere3Speed[2]]));
      sphere3Folder.add(sphere3Speed, '1', -0.1, 0.1).name('Speed Y')
        .onChange(value => setSphere3Speed([sphere3Speed[0], value, sphere3Speed[2]]));
      sphere3Folder.add(sphere3Speed, '2', -0.1, 0.1).name('Speed Z')
        .onChange(value => setSphere3Speed([sphere3Speed[0], sphere3Speed[1], value]));
      sphere3Folder.add({ mass: sphere3Mass }, 'mass', 0.1, 10).name('Mass')
        .onChange(value => setSphere3Mass(value));
    }

    return () => {
      if(guiRef.current) {
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
          size={10} 
          thickness={0.05}
          position={[0,0,0]}
        />

        <Sphere 
          position={[2, 0, 0]} color="#ffcccb" speed={sphere1Speed} 
          isRunning={isRunning} mass={sphere1Mass} 
        />
        {/* 
        <Sphere 
          position={[-2, 0, 0]} color="#ccffcc" speed={sphere2Speed} 
          isRunning={isRunning} mass={sphere2Mass} 
        />
        <Sphere 
          position={[0, 2, 0]} color="#ccccff" speed={sphere3Speed} 
          isRunning={isRunning} mass={sphere3Mass} 
        />
        */}
       

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
