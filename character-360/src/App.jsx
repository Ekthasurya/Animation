import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function Character() {
  const characterRef = useRef();

  const { scene } = useGLTF(
    "/models/one_piece_monkey_d_luffy.glb"
  );

  // Store keyboard state
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  // -------------------------------
  // Keyboard Events
  // -------------------------------

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (key === "w") {
        keys.current.w = true;
      }

      if (key === "a") {
        keys.current.a = true;
      }

      if (key === "s") {
        keys.current.s = true;
      }

      if (key === "d") {
        keys.current.d = true;
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();

      if (key === "w") {
        keys.current.w = false;
      }

      if (key === "a") {
        keys.current.a = false;
      }

      if (key === "s") {
        keys.current.s = false;
      }

      if (key === "d") {
        keys.current.d = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp
      );
    };
  }, []);

  // -------------------------------
  // Movement
  // -------------------------------

  useFrame((state, delta) => {
    const character = characterRef.current;

    if (!character) return;

    const direction = new THREE.Vector3();

    // W
    if (keys.current.w) {
      direction.z -= 1;
    }

    // S
    if (keys.current.s) {
      direction.z += 1;
    }

    // A
    if (keys.current.a) {
      direction.x -= 1;
    }

    // D
    if (keys.current.d) {
      direction.x += 1;
    }

    // -------------------------------
    // Move Character
    // -------------------------------

    if (direction.lengthSq() > 0) {
      direction.normalize();

      const speed = 4;

      character.position.x +=
        direction.x * speed * delta;

      character.position.z +=
        direction.z * speed * delta;

      // -------------------------------
      // Rotate Character
      // -------------------------------

      const targetRotation =
        Math.atan2(
          direction.x,
          direction.z
        );

      // Smooth rotation
      character.rotation.y = THREE.MathUtils.lerp(
        character.rotation.y,
        targetRotation,
        8 * delta
      );
    }

    // -------------------------------
    // Camera Follow
    // -------------------------------

    const targetCameraPosition = new THREE.Vector3(
      character.position.x,
      character.position.y + 3,
      character.position.z + 7
    );

    state.camera.position.lerp(
      targetCameraPosition,
      5 * delta
    );

    // Camera looks at character
    state.camera.lookAt(
      character.position.x,
      character.position.y + 1,
      character.position.z
    );
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
        position: [0, 3, 7],
        fov: 50,
      }}
    >
      {/* Lights */}

      <ambientLight intensity={1.5} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={3}
      />

      {/* Ground */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[100, 100]} />

        <meshStandardMaterial
          color="lightgray"
        />
      </mesh>

      {/* Character */}

      <Character />
    </Canvas>
  );
}

export default App;