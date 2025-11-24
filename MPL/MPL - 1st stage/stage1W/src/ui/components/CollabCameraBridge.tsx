// src/ui/components/CollabCameraBridge.tsx
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useCollab } from '../state/collab';

/**
 * Host: broadcasts camera position + target on changes.
 * Viewer: follows latest remote camera.
 */
export default function CollabCameraBridge() {
  const { camera } = useThree();
  const { role, me, hostId, sendCamera, lastCamera } = useCollab();
  const lastSent = useRef<{pos:[number,number,number]; target:[number,number,number]}|null>(null);

  // Broadcast (host only)
  useEffect(() => {
    if (role !== 'host' || me.id !== hostId) return;
    let raf = 0;
    const tick = () => {
      const pos: [number,number,number] = [camera.position.x, camera.position.y, camera.position.z];
      // Approximate target from camera direction
      const dir = camera.getWorldDirection(new (camera as any).constructor().Vector3?.() || ({} as any));
      const target: [number,number,number] = [pos[0] + dir.x*10, pos[1] + dir.y*10, pos[2] + dir.z*10];
      const payload = { pos, target };
      if (!lastSent.current || dist(lastSent.current.pos, pos) > 0.05) {
        sendCamera(pos, target);
        lastSent.current = payload;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [role, hostId, camera]);

  // Follow (viewers)
  useEffect(() => {
    if (!lastCamera) return;
    if (role === 'host' && me.id === hostId) return;
    const { pos, target } = lastCamera;
    camera.position.set(pos[0], pos[1], pos[2]);
    camera.lookAt(target[0], target[1], target[2]);
  }, [lastCamera?.pos[0], lastCamera?.pos[1], lastCamera?.pos[2]]);

  return null;
}

function dist(a:[number,number,number], b:[number,number,number]) {
  const dx=a[0]-b[0], dy=a[1]-b[1], dz=a[2]-b[2];
  return Math.sqrt(dx*dx+dy*dy+dz*dz);
}