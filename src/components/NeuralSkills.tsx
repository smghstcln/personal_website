import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Line, Sphere, Float, OrbitControls, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { resumeData } from '../data/resume'

function Node({ position, label, color, connections, size }: { position: [number, number, number], label: string, color: string, connections: [number, number, number][], size: number }) {
  const ref = useRef<THREE.Group>(null!)
  const [hovered, setHover] = useState(false)

  useFrame((state) => {
    // Subtle breathing animation
    if (hovered) {
      ref.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1)
    } else {
      ref.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
  })

  return (
    <group ref={ref} position={position}>
      <Sphere args={[size, 16, 16]} onPointerOver={() => { document.body.style.cursor = 'grab'; setHover(true) }} onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false) }}>
        <meshStandardMaterial color={hovered ? '#f43f5e' : color} emissive={hovered ? '#f43f5e' : color} emissiveIntensity={0.5} />
      </Sphere>
      <Billboard
        position={[0, size + 0.2, 0]}
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <Text
          fontSize={Math.max(0.12, size * 0.6)}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#ffffff"
        >
          {label}
        </Text>
      </Billboard>
      {connections.map((target, i) => (
        <Line
          key={i}
          points={[[0, 0, 0], new THREE.Vector3(...target).sub(new THREE.Vector3(...position))]}
          color={color}
          transparent
          opacity={0.15}
          lineWidth={1}
        />
      ))}
    </group>
  )
}

export default function NeuralSkills() {
  const skills = useMemo(() => {
    const allSkills = resumeData.skills.flatMap(c => c.items)
    
    return allSkills.map((skill, i) => {
      const phi = Math.acos(-1 + (2 * i) / allSkills.length)
      const theta = Math.sqrt(allSkills.length * Math.PI) * phi
      const r = 3 // Reduced radius to fit better in container
      
      const category = resumeData.skills.find(c => c.items.includes(skill))?.category
      
      // Sizing logic
      let size = 0.15 + Math.random() * 0.15
      
      if (category === 'Tools & Hardware' || category === 'Languages') {
        size = 0.1
      } else if (['Python', 'Solidity', 'JavaScript', 'TypeScript', 'Kubernetes'].some(s => skill.includes(s))) {
        size = 0.4
      }

      return {
        name: skill,
        position: [
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi)
        ] as [number, number, number],
        category,
        size
      }
    })
  }, [])

  const getColor = (category: string | undefined) => {
    switch(category) {
      case 'Programming': return '#4f46e5' // Indigo
      case 'Data & Analytics': return '#0ea5e9' // Sky
      case 'DevOps': return '#f59e0b' // Amber
      case 'Tools & Hardware': return '#64748b' // Slate
      case 'Languages': return '#ec4899' // Pink
      default: return '#cbd5e1'
    }
  }

  return (
    <div className="h-full w-full bg-slate-50/80 rounded-3xl border border-slate-200 overflow-hidden backdrop-blur-sm min-h-[600px] cursor-move">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.2}>
          <group rotation={[0, 0, 0]}>
            {skills.map((skill, i) => (
              <Node 
                key={i} 
                position={skill.position} 
                label={skill.name} 
                size={skill.size}
                color={getColor(skill.category)}
                connections={skills
                  .filter((_, idx) => Math.abs(idx - i) < 2)
                  .map(s => s.position)
                } 
              />
            ))}
          </group>
        </Float>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
