import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function Geometry({ position, rotation, type, color, scale }: { position: [number, number, number], rotation: [number, number, number], type: 'cube' | 'octahedron' | 'torus', color: string, scale: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = rotation[0] + Math.cos(t / 4) / 8
    meshRef.current.rotation.y = rotation[1] + Math.sin(t / 4) / 8
    meshRef.current.rotation.z = rotation[2] + Math.sin(t / 4) / 8
    meshRef.current.position.y = position[1] + Math.sin(t / 1.5) / 10
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {type === 'cube' && <boxGeometry args={[1, 1, 1]} />}
      {type === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
      {type === 'torus' && <torusGeometry args={[0.8, 0.2, 16, 32]} />}
      <meshStandardMaterial 
        color={color} 
        roughness={0.1} 
        metalness={0.1} 
        transparent 
        opacity={0.8}
      />
    </mesh>
  )
}

export default function Scene() {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 15], fov: 30 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={1} />
          
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Geometry position={[-3, 2, -2]} rotation={[0, 0.5, 0]} type="cube" color="#4f46e5" scale={1.2} />
            <Geometry position={[4, -1, -4]} rotation={[0.5, 0, 0]} type="octahedron" color="#0ea5e9" scale={1.5} />
            <Geometry position={[-4, -3, -5]} rotation={[0, 0, 0.5]} type="torus" color="#f43f5e" scale={1} />
            <Geometry position={[3, 3, -6]} rotation={[0.2, 0.2, 0]} type="cube" color="#cbd5e1" scale={0.8} />
          </Float>

          <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
