import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Bot } from "lucide-react";

const MODEL_URL = "/models/robot.glb";

/** Real expressive robot model — plays its built-in Idle animation in a loop. */
function RealRobot() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const names = Object.keys(actions);
    if (!names.length) return;
    const idle = actions["Idle"] ?? actions[names[0]];
    idle?.reset().fadeIn(0.6).play();
    return () => {
      idle?.fadeOut(0.4);
    };
  }, [actions]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = -1.5 + Math.sin(t * 1.1) * 0.04;
      group.current.rotation.y = Math.sin(t * 0.35) * 0.08;
    }
  });

  return (
    <group ref={group} position={[0, -1.5, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

/** Hero figure: real animated 3D robot, right side (like the reference design). */
export default function Robot3D({ height = 500 }: { height?: number }) {
  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 560 }}>
      <div style={{ height }}>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 1.3, 5.2], fov: 38 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 6, 5]} intensity={1.6} />
          <directionalLight position={[-5, 3, -4]} intensity={0.8} color="#a78bfa" />
          <pointLight position={[0, 2.5, 3]} intensity={10} color="#2dd4bf" distance={9} />
          <RealRobot />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.65} scale={6} blur={2.4} color="#000000" />
          <OrbitControls
            target={[0, 1, 0]}
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={1.1}
            minPolarAngle={Math.PI / 3.2}
            maxPolarAngle={Math.PI / 1.85}
          />
        </Canvas>
      </div>
      <div className="mt-1 flex items-center justify-center gap-2 text-[11px] font-semibold">
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-amber-300">
          <Bot size={12} /> 3D LIVE
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
          drag to rotate • auto-animated
        </span>
      </div>
    </div>
  );
}
