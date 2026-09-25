import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

function Character() {
  const characterRef = useRef();

  const { scene } = useGLTF(
    "/models/one_piece_monkey_d_luffy.glb"
  );

  // Keyboard state
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  // Detect keyboard
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (key === "w") keys.current.w = true;
      if (key === "a") keys.current.a = true;
      if (key === "s") keys.current.s = true;
      if (key === "d") keys.current.d = true;
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();

      if (key === "w") keys.current.w = false;
      if (key === "a") keys.current.a = false;
      if (key === "s") keys.current.s = false;
      if (key === "d") keys.current.d = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Movement
  useFrame((state, delta) => {
    const character = characterRef.current;

    if (!character) return;

    let x = 0;
    let z = 0;

    // W = forward
    if (keys.current.w) {
      z -= 1;
    }

    // S = backward
    if (keys.current.s) {
      z += 1;
    }

    // A = left
    if (keys.current.a) {
      x -= 1;
    }

    // D = right
    if (keys.current.d) {
      x += 1;
    }

    // Character is moving
    if (x !== 0 || z !== 0) {
      // Normalize diagonal movement
      const length = Math.sqrt(x * x + z * z);

      x /= length;
      z /= length;

      const speed = 3;

      character.position.x += x * speed * delta;
      character.position.z += z * speed * delta;
    }
  });

  return (
    <primitive
      ref={characterRef}
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

function App() {
  return (
    <Canvas
      camera={{
        position: [0, 2, 5],
        fov: 50,
      }}
    >
      {/* Background */}
      <color attach="background" args={["#202020"]} />

      {/* Lighting */}
      <ambientLight intensity={2} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={4}
      />

      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
      >
        <planeGeometry args={[50, 50]} />

        <meshStandardMaterial color="lightgray" />
      </mesh>

      {/* Luffy */}
      <Character />

      {/* Camera control */}
      <OrbitControls />
    </Canvas>
  );
}

export default App;