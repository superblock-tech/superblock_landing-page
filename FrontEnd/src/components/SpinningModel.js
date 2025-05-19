import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef, useEffect, useState, useMemo } from "react"
import * as THREE from "three"

export default function SpinningModel() {
  const { scene, nodes } = useGLTF("/superblock-logo-2.glb")
  const ref = useRef()
  const isVisible = useRef(true)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const [materialsApplied, setMaterialsApplied] = useState(false)
  const [deviceCores, setDeviceCores] = useState(4) // default safe value

  const clockRef = useRef(null)

  useEffect(() => {
    // Initialize animation
    clockRef.current = new THREE.Clock(false)
    clockRef.current.start()

    // Get CPU core count
    setDeviceCores(navigator.hardwareConcurrency || 4)

    return () => {
      // Cleanup on unmount
      if (clockRef.current) {
        clockRef.current.stop()
      }
    }
  }, [])

  // Safe memoization and automatic material cleanup
  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: "#7938B7",
      metalness: 0.8,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    })
    return mat
  }, [])

  useEffect(() => {
    return () => {
      material.dispose()
      // console.log("Disposed material")
    }
  }, [material])

  // Material optimization (single material)
  useEffect(() => {
    if (!scene) return

    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material?.dispose) child.material.dispose()
        child.material = material
      }
    })

    setMaterialsApplied(true)

    return () => {
      scene.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry?.dispose) child.geometry.dispose()
          // material.dispose is NOT called here — cleanup is done in the useEffect above.
          // When assigning a shared memoized material, avoid disposing it per mesh.
          // Keep track of this if any modifications happen.
        }
      })
    }
  }, [scene, material])

  // Manage animation during tab switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisible.current = !document.hidden

      if (document.hidden) {
        // console.log("Ушли со вкладки Spinning")
        clockRef.current.stop() // Completely stop the animation
      } else {
        // console.log("Вернулись на вкладку Spinning")
        clockRef.current.start() // Smoothly resume animation
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Use delta-time for smooth animation
  useFrame(() => {
    if (!isVisible.current || !ref.current) return

    const delta = clockRef.current.getDelta()
    const baseSpeed = deviceCores >= 4 ? 0.5 : 0.25
    const speed = isIOS ? baseSpeed * 1 : baseSpeed // Slow down for iOS; change 1 to 0.5 if needed

    ref.current.rotation.y += delta * speed
  })

  if (!scene || !materialsApplied || !nodes.model) return null

  // Disable shadows on iOS devices with fewer than 4 CPU cores (older iPhones)
  const enableShadows = !(isIOS && deviceCores < 4)

  // Size of the shadow map
  let shadowMapSize = 1024
  if (isIOS) {
    shadowMapSize = deviceCores < 4 ? 256 : 512
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow={enableShadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
      />

      <group
        ref={ref}
        position={[0, 0, 0]}
        rotation={[Math.PI / 0.5, 0, 0]}
        dispose={null}
        scale={[0.1, 0.1, 0.1]}
      >
        {nodes.model?.children?.map?.((mesh, index) => (
          <mesh
            key={index}
            geometry={mesh.geometry}
            material={mesh.material}
            castShadow
            receiveShadow
          />
        ))}
      </group>
    </>
  )
}
