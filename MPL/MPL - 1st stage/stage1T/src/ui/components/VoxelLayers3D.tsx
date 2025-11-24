// src/ui/components/VoxelLayers3D.tsx
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { layersBridge } from '../../engine/layersBridge';
import { colorForChannel } from '../state/visConfig';
import { useVoxelSelection } from '../hooks/useVoxelSelection';
import { useLayerConfig } from '../state/layerConfig';

type Props = { className?: string; voxelSize?: number };

function LayerMesh({ layer, voxelSize }:{ layer:any; voxelSize:number }) {
  const { setSelection } = useVoxelSelection();

  const count = layer.size.x * layer.size.y * layer.size.z;
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => new Float32Array(count * 3), [count]);

  const geometry = useMemo(() => new THREE.BoxGeometry(1,1,1), []);
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true });
    m.opacity = typeof layer.opacity === 'number' ? layer.opacity : 1.0;
    return m;
  }, [layer.opacity]);

  // Build instance matrices & colors now — r3f will render this as-is until the bridge version changes
  for (let z=0; z<layer.size.z; z++) {
    for (let y=0; y<layer.size.y; y++) {
      for (let x=0; x<layer.size.x; x++) {
        const i = x + y*layer.size.x + z*layer.size.x*layer.size.y;
        const c = colorForChannel(layer.channel[i] || 0);
        colors[i*3 + 0] = c.r; colors[i*3 + 1] = c.g; colors[i*3 + 2] = c.b;
      }
    }
  }

  const onClick = (e:any) => {
    if (typeof e.instanceId !== 'number') return;
    const instId = e.instanceId;
    const sx = layer.size.x, sy = layer.size.y;
    const z = Math.floor(instId / (sx*sy));
    const y = Math.floor((instId - z*sx*sy) / sx);
    const x = instId - z*sx*sy - y*sx;
    setSelection({ x,y,z });
  };

  const center = new THREE.Vector3((layer.size.x-1)/2, (layer.size.y-1)/2, (layer.size.z-1)/2);

  return (
    <group position={center.clone().multiplyScalar(-1)}>
      <instancedMesh args={[geometry, material, count]} onClick={onClick}>
        {/* Fill instance transforms */}
        <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
        {Array.from({length: count}).map((_, i) => {
          const z = Math.floor(i / (layer.size.x*layer.size.y));
          const y = Math.floor((i - z*layer.size.x*layer.size.y) / layer.size.x);
          const x = i - z*layer.size.x*layer.size.y - y*layer.size.x;
          dummy.position.set(x, y, z);
          dummy.scale.setScalar(voxelSize);
          dummy.updateMatrix();
          return <primitive key={i} object={matrix} attach={`instanceMatrix-${i}`} />;
        })}
      </instancedMesh>
    </group>
  );
}

function SceneContent({ voxelSize=0.9 }:{ voxelSize?: number }) {
  const { overrides } = useLayerConfig();
  const { layers } = layersBridge.getSnapshot();
  const dims = layers.length ? layers[0].size : { x:0,y:0,z:0 };

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      {layers.map((L) => {
        const o = overrides[L.id] || {};
        const visible = o.visible ?? (L.visible ?? true);
        const opacity = o.opacity ?? (typeof L.opacity === 'number' ? L.opacity : 1.0);
        if (!visible) return null;
        const layer = { ...L, opacity };
        return <LayerMesh key={L.id} layer={layer} voxelSize={voxelSize} />;
      })}
      <OrbitControls makeDefault enablePan enableZoom enableRotate />
    </>
  );
}

export default function VoxelLayers3D({ className, voxelSize=0.9 }: Props) {
  const bg = '#0b0b0b';
  return (
    <div className={className} style={{ background: bg }}>
      <Canvas camera={{ position: [12, 14, 16], near: 0.1, far: 2000 }}>
        <SceneContent voxelSize={voxelSize} />
      </Canvas>
    </div>
  );
}