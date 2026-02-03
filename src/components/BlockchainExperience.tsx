import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { resumeData } from '../data/resume'

// More vivid colors (600 shades)
const COLORS = ['#4f46e5', '#0284c7', '#d97706', '#059669', '#db2777'];

interface BlockProps {
  position: [number, number, number]
  index: number
  isActive: boolean
  onClick: () => void
}

function Block({ position, index, isActive, onClick }: BlockProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!)
  const initialized = useRef(false)
  
  // Pre-compute target vectors to avoid garbage collection issues
  // CRITICAL: All blocks use IDENTICAL scale values - no variation
  const ACTIVE_SCALE = 1.15
  const INACTIVE_SCALE = 1.0
  const activeScale = useMemo(() => new THREE.Vector3(ACTIVE_SCALE, ACTIVE_SCALE, ACTIVE_SCALE), [])
  const inactiveScale = useMemo(() => new THREE.Vector3(INACTIVE_SCALE, INACTIVE_SCALE, INACTIVE_SCALE), [])
  const activeColor = useMemo(() => new THREE.Color(COLORS[index % COLORS.length]), [index])
  const inactiveColor = useMemo(() => new THREE.Color('#cbd5e1'), [])
  const emissiveActive = useMemo(() => new THREE.Color(COLORS[index % COLORS.length]), [index])
  const emissiveInactive = useMemo(() => new THREE.Color('#000000'), [])
  
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return
    
    // Initialize scale immediately on first frame to prevent size jump
    if (!initialized.current) {
      const initialScale = isActive ? ACTIVE_SCALE : INACTIVE_SCALE
      meshRef.current.scale.set(initialScale, initialScale, initialScale)
      if (isActive) {
        materialRef.current.color.copy(activeColor)
        materialRef.current.emissive.copy(emissiveActive)
        materialRef.current.emissiveIntensity = 0.35
      }
      initialized.current = true
    }
    
    const t = state.clock.getElapsedTime()
    
    // Gentle idle rotation - consistent speed for all blocks
    meshRef.current.rotation.y += 0.005
    meshRef.current.rotation.x = Math.sin(t * 0.3 + index * 0.5) * 0.03
    
    // Smooth scale transition - same lerp factor for consistency
    const targetScale = isActive ? activeScale : inactiveScale
    meshRef.current.scale.lerp(targetScale, 0.06)
    
    // Smooth color transition
    const targetColor = isActive ? activeColor : inactiveColor
    materialRef.current.color.lerp(targetColor, 0.08)
    
    // Smooth emissive transition
    const targetEmissive = isActive ? emissiveActive : emissiveInactive
    materialRef.current.emissive.lerp(targetEmissive, 0.08)
    materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      materialRef.current.emissiveIntensity,
      isActive ? 0.35 : 0,
      0.08
    )
  })

  return (
    <group position={position}>
      {/* The Block - Using RoundedBox for softer appearance */}
      <RoundedBox 
        ref={meshRef} 
        args={[1.3, 1.3, 1.3]}
        radius={0.15}
        smoothness={4}
        onClick={onClick}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'auto' }}
      >
        <meshPhysicalMaterial 
          ref={materialRef}
          color="#cbd5e1"
          emissive="#000000"
          emissiveIntensity={0}
          roughness={0.15} 
          metalness={0.2} 
          clearcoat={0.3}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>

      {/* Connection Line to next block - softer gradient effect */}
      {index < resumeData.experience.length - 1 && (
        <Line
          points={[[0, -0.7, 0], [0, -3.3, 0]]}
          color={isActive ? COLORS[index % COLORS.length] : '#e2e8f0'}
          lineWidth={isActive ? 2 : 1}
          transparent
          opacity={isActive ? 0.6 : 0.3}
        />
      )}
    </group>
  )
}

function Chain({ activeIndex, onBlockClick }: { activeIndex: number, onBlockClick: (index: number) => void }) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(() => {
    if (!groupRef.current) return
    // Smooth vertical scroll to center active block
    const targetY = activeIndex * 4
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.06)
  })

  return (
    <group ref={groupRef} position={[1, 0, 0]}>
      {resumeData.experience.map((job, i) => (
        <Block 
          key={job.id} 
          position={[0, -i * 4, 0]} 
          index={i}
          isActive={i === activeIndex}
          onClick={() => onBlockClick(i)}
        />
      ))}
    </group>
  )
}

interface BlockchainExperienceProps {
  activeIndex: number
  onIndexChange?: (index: number) => void
}

export default function BlockchainExperience({ activeIndex, onIndexChange }: BlockchainExperienceProps) {
  const handleBlockClick = (index: number) => {
    if (onIndexChange) {
      onIndexChange(index)
    }
  }

  return (
    // CRITICAL: Use absolute inset-0 to fill parent exactly - no min-height that causes reflow
    <div className="absolute inset-0">
      {/* 3D Canvas - clean without Float for stability */}
      <Canvas camera={{ position: [0, 0, 12], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.2} castShadow />
        <pointLight position={[-10, -5, -10]} intensity={0.4} color="#4f46e5" />
        <pointLight position={[5, 5, 5]} intensity={0.3} color="#0284c7" />
        <Chain activeIndex={activeIndex} onBlockClick={handleBlockClick} />
      </Canvas>
      
      {/* 2D Overlay Labels - Using flexbox for stable centering */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center">
        <div className="relative h-[300px] w-full">
          {resumeData.experience.map((job, i) => {
            const isActive = i === activeIndex
            const distance = Math.abs(i - activeIndex)
            // Calculate offset from center - each label is 60px apart
            const offsetFromCenter = (i - activeIndex) * 60
            
            return (
              <div
                key={job.id}
                className="absolute left-6 w-48 transition-all duration-500 ease-out"
                style={{
                  top: '50%',
                  transform: `translateY(${offsetFromCenter - 20}px)`,
                  opacity: distance === 0 ? 1 : distance === 1 ? 0.2 : 0,
                  pointerEvents: 'none',
                }}
              >
                <div 
                  className={`transition-transform duration-500 ${
                    isActive ? 'translate-x-0' : 'translate-x-2'
                  }`}
                >
                  <div 
                    className={`font-display font-bold text-base leading-tight transition-colors duration-300 ${
                      isActive ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {job.company}
                  </div>
                  <div 
                    className={`text-xs font-mono mt-1 transition-colors duration-300 ${
                      isActive ? 'text-primary' : 'text-slate-300'
                    }`}
                  >
                    {job.date}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
