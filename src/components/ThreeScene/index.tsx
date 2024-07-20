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
  const [spheres, setSpheres] = useState([
    {
      id: 1,
      position: [2.1, 0, 0],
      speed: [0, 0, 5000],
      mass: 1,
      color: '#ffcccb'
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const guiRef = useRef<dat.GUI | null>(null);

  useEffect(() => {
    if (!guiRef.current) {
      guiRef.current = new dat.GUI();
  
      spheres.forEach((sphere, index) => {
        const folder = guiRef.current.addFolder(`Sphere ${index + 1}`);
  
        folder.add(sphere.speed, '0', -5000, 5000).name('Speed X')
          .setValue(sphere.speed[0])
          .onChange(value => updateSphere(index, { ...sphere, speed: [value, sphere.speed[1], sphere.speed[2]] }));
  
        folder.add(sphere.speed, '1', -5000, 5000).name('Speed Y')
          .setValue(sphere.speed[1])
          .onChange(value => updateSphere(index, { ...sphere, speed: [sphere.speed[0], value, sphere.speed[2]] }));
  
        folder.add(sphere.speed, '2', -5000, 5000).name('Speed Z')
          .setValue(sphere.speed[2])
          .onChange(value => updateSphere(index, { ...sphere, speed: [sphere.speed[0], sphere.speed[1], value] }));
  
        folder.add(sphere.position, '0', -10, 10).name('Position X')
          .setValue(sphere.position[0])
          .onChange(value => updateSphere(index, { ...sphere, position: [value, sphere.position[1], sphere.position[2]] }));
  
        folder.add(sphere.position, '1', -10, 10).name('Position Y')
          .setValue(sphere.position[1])
          .onChange(value => updateSphere(index, { ...sphere, position: [sphere.position[0], value, sphere.position[2]] }));
  
        folder.add(sphere.position, '2', -10, 10).name('Position Z')
          .setValue(sphere.position[2])
          .onChange(value => updateSphere(index, { ...sphere, position: [sphere.position[0], sphere.position[1], value] }));
  
        folder.add(sphere, 'mass', 1, 100000).name('Mass')
          .setValue(sphere.mass)
          .onChange(value => updateSphere(index, { ...sphere, mass: value }));
      });
    }
  
    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [spheres]);

  const updateSphere = (index, updatedSphere) => {
    const newSpheres = [...spheres];
    newSpheres[index] = updatedSphere;
    setSpheres(newSpheres);
  };

  const addSphere = () => {
    const newSphere = {
      id: spheres.length + 1,
      position: [Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10],
      speed: [Math.random() * 5000 - 2500, Math.random() * 5000 - 2500, Math.random() * 5000 - 2500],
      mass: Math.random() * 100 + 1,
      color: '#'+Math.floor(Math.random()*16777215).toString(16)
    };
    setSpheres([...spheres, newSphere]);
  };

  const removeSphere = () => {
    if (spheres.length > 0) {
      setSpheres(spheres.slice(0, -1));
    }
  };

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

        {
        spheres.map((sphere, index) => (
          <Sphere 
            key={sphere.id}
            position={sphere.position} speed={sphere.speed} mass={sphere.mass}
            isRunning={isRunning} color={sphere.color}
          />
        ))
        }

        <OrbitControls />
        
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.5} />
        </mesh>

      </Canvas>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {!isRunning && <button onClick={startSimulation}>Iniciar Simulação</button>}
        {isRunning && <button onClick={stopSimulation}>Parar Simulação</button>}
        <button onClick={addSphere}>Adicionar Esfera</button>
        <button onClick={removeSphere}>Remover Esfera</button>
      </div>
    </div>
  );
};

export default ThreeScene;
