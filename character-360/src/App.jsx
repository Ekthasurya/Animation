import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

function Luffy() {
  const { scene } = useGLTF(
    "/models/one_piece_monkey_d_luffy.glb"
  );

  const luffyRef = useRef();

  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  // Keyboard controls
  useEffect(() => {
    const keyDown = (event) => {
      const key = event.key.toLowerCase();

      if (keys.current[key] !== undefined) {
        keys.current[key] = true;
      }
    };

    const keyUp = (event) => {
      const key = event.key.toLowerCase();

      if (keys.current[key] !== undefined) {
        keys.current[key] = false;
      }
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!luffyRef.current) return;

    const moveSpeed = 3;
    const rotateSpeed = 3;

    // -------------------------
    // ROTATION
    // -------------------------

    if (keys.current.a) {
      luffyRef.current.rotation.y += rotateSpeed * delta;
    }

    if (keys.current.d) {
      luffyRef.current.rotation.y -= rotateSpeed * delta;
    }

    // -------------------------
    // MOVEMENT
    // -------------------------

    if (keys.current.w) {
      // Move forward based on current rotation
      luffyRef.current.translateZ(-moveSpeed * delta);
    }

    if (keys.current.s) {
      // Move backward
      luffyRef.current.translateZ(moveSpeed * delta);
    }
  });

  return (
    <primitive
      ref={luffyRef}
      object={scene}
      scale={0.08}
      position={[0, -2.3, 0]}
    />
  );
}

function App() {
  return (
    <Canvas
      camera={{
        position: [0, 2, 8],
        fov: 45,
      }}
    >
      {/* White background */}
      <color attach="background" args={["white"]} />

      {/* Light */}
      <ambientLight intensity={3} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={5}
      />

      {/* Luffy */}
      <Luffy />
    </Canvas>
  );
}

useGLTF.preload(
  "/models/one_piece_monkey_d_luffy.glb"
);

export default App;