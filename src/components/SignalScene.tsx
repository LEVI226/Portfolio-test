import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group, MathUtils, Mesh } from "three";
import SignalFallback from "./SignalFallback";
function Sculpture({ active }: { active: boolean }) {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const { invalidate } = useThree();
  useEffect(() => {
    invalidate();
  }, [active, invalidate]);
  useFrame((state, delta) => {
    if (!active || !group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y += Math.min(delta, 0.04) * 0.12;
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      state.pointer.y * 0.1 + 0.2,
      2,
      delta,
    );
    group.current.rotation.z = MathUtils.damp(
      group.current.rotation.z,
      -0.25 + state.pointer.x * 0.09,
      2,
      delta,
    );
    if (core.current) core.current.position.y = Math.sin(t * 0.6) * 0.06;
  });
  return (
    <group ref={group} rotation={[0.2, 0.35, -0.25]}>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.48, i * 0.62, i * 0.21]}>
          <torusGeometry args={[1.6, 0.055, 12, 160]} />
          <meshStandardMaterial
            color="#b9673f"
            metalness={0.83}
            roughness={0.28}
          />
        </mesh>
      ))}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.24, 3]} />
        <meshStandardMaterial
          color="#d77c49"
          metalness={0.8}
          roughness={0.22}
        />
      </mesh>
    </group>
  );
}
function RendererLifecycle({ onFailure }: { onFailure: () => void }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = () => onFailure();
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  return null;
}
function Unavailable({ onFailure }: { onFailure: () => void }) {
  useEffect(() => {
    onFailure();
  }, [onFailure]);
  return <SignalFallback />;
}
export default function SignalScene({
  active,
  onFailure,
}: {
  active: boolean;
  onFailure: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.4], fov: 43 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "demand"}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      fallback={<Unavailable onFailure={onFailure} />}
    >
      <RendererLifecycle onFailure={onFailure} />
      <ambientLight intensity={1.7} />
      <directionalLight position={[-3, 5, 4]} intensity={5} color="#fff3df" />
      <directionalLight position={[4, -1, 2]} intensity={2.5} color="#cd784b" />
      <Sculpture active={active} />
    </Canvas>
  );
}
