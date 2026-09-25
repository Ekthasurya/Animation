import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function Character() {
  const characterRef = useRef();

  const { scene } = useGLTF(
    "/models/one_piece_monkey_d_luffy.glb"
  );

  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  const velocity = useRef(
    new THREE.Vector3(0, 0, 0)
  );

  const animationTime = useRef(0);

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

  useFrame((state, delta) => {
    const character = characterRef.current;

    if (!character) return;

    let x = 0;
    let z = 0;

    if (keys.current.w) z -= 1;
    if (keys.current.s) z += 1;
    if (keys.current.a) x -= 1;
    if (keys.current.d) x += 1;

    // Normalize diagonal movement
    if (x !== 0 || z !== 0) {
      const length = Math.sqrt(
        x * x + z * z
      );

      x /= length;
      z /= length;
    }

    // Target velocity
    const maxSpeed = 3;

    const targetVelocity =
      new THREE.Vector3(
        x * maxSpeed,
        0,
        z * maxSpeed
      );

    // Smooth movement
    const acceleration = 10;

    velocity.current.lerp(
      targetVelocity,
      acceleration * delta
    );

    // Move
    character.position.x +=
      velocity.current.x * delta;

    character.position.z +=
      velocity.current.z * delta;

    // Movement check
    const isMoving =
      velocity.current.length() > 0.05;

    // Animation
    animationTime.current += delta;

    if (isMoving) {
      const walkSpeed = 10;

      const bob =
        Math.abs(
          Math.sin(
            animationTime.current *
              walkSpeed
          )
        );

      character.position.y =
        bob * 0.08;

      character.rotation.z =
        Math.sin(
          animationTime.current *
            walkSpeed
        ) * 0.03;
    } else {
      const idleSpeed = 2;

      const breathing =
        Math.sin(
          animationTime.current *
            idleSpeed
        );

      character.position.y =
        breathing * 0.02;

      character.rotation.z =
        breathing * 0.01;
    }

    // Rotate toward movement
    if (isMoving) {
      const targetRotation =
        Math.atan2(
          velocity.current.x,
          velocity.current.z
        );

      character.rotation.y =
        THREE.MathUtils.lerp(
          character.rotation.y,
          targetRotation,
          10 * delta
        );
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


// =====================================================
// BACKGROUND
// =====================================================

function Background() {
  const starsRef = useRef();

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y +=
        delta * 0.01;

      starsRef.current.rotation.x +=
        delta * 0.003;
    }
  });

  return (
    <group ref={starsRef}>
      {/* Stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1000}
            array={
              new Float32Array(
                Array.from(
                  { length: 3000 },
                  () => (Math.random() - 0.5) * 100
                )
              )
            }
            itemSize={3}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.08}
          color="#ffffff"
          transparent
          opacity={0.8}
        />
      </points>
    </group>
  );
}


// =====================================================
// GROUND
// =====================================================

function Ground() {
  return (
    <>
      {/* Main ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />

        <meshStandardMaterial
          color="#171b24"
          roughness={0.9}
        />
      </mesh>

      {/* Grid */}
      <gridHelper
        args={[
          100,
          100,
          "#384454",
          "#202733",
        ]}
        position={[0, -0.98, 0]}
      />
    </>
  );
}


// =====================================================
// APP
// =====================================================

function App() {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 1.8, 5],
        fov: 45,
        near: 0.1,
        far: 200,
      }}
    >
      {/* Background */}
      <color
        attach="background"
        args={["#080d18"]}
      />

      {/* Stars */}
      <Background />

      {/* Lighting */}
      <ambientLight intensity={2.5} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={3}
        castShadow
      />

      <directionalLight
        position={[-5, 5, -5]}
        intensity={1.5}
      />

      {/* Ground */}
      <Ground />

      {/* Luffy */}
      <Character />

      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={2.5}
        maxDistance={10}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}

useGLTF.preload(
  "/models/one_piece_monkey_d_luffy.glb"
);

export default App;