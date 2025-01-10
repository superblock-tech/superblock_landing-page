import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function SpinningModel() {
  const { scene, nodes } = useGLTF("/superblock-logo-2.glb");
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.dispose();
      child.material = new THREE.MeshPhysicalMaterial({
        color: "#7938B7",
        metalness: 0.8,
        roughness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      });
    }
  });

  return (
    <group
      ref={ref}
      position={[0, 0, 0]}
      rotation={[Math.PI / 0.5, 0, 0]}
      dispose={null}
      scale={[0.1, 0.1, 0.1]}
    >
      {nodes.model.children.map((mesh, index) => (
        <mesh
          key={index}
          geometry={mesh.geometry}
          material={mesh.material}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}
