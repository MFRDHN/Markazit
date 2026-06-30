import { useRef, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

const KEY_SPACING = 1.05;
const KEY_WIDTH = 1;
const KEY_HEIGHT = 0.35;
const KEY_DEPTH = 1;
const BASE_GAP = 0.15;

const LAYOUT = [
  [{ w: 0 }, '1','2','3','4','5','6','7','8','9','0','-','=', { w: 2 }],
  [{ w: 1.5 }, 'Q','W','E','R','T','Y','U','I','O','P','[',']',{ w: 1.5 }],
  [{ w: 1.75 }, 'A','S','D','F','G','H','J','K','L',';',"'", { w: 2.25 }],
  [{ w: 2.25 }, 'Z','X','C','V','B','N','M',',','.',{ w: 2.85 }],
  [{ w: 1.25 }, { w: 1.25 }, { w: 1.25 }, { w: 6.25 }, { w: 1.25 }, { w: 1.25 }, { w: 1.25 }, { w: 1.25 }],
];

function KeyLabel({ label, ...props }) {
  if (label.length > 2) return null;
  return (
    <Text
      {...props}
      fontSize={0.2}
      fontWeight={700}
      color="#004665"
      anchorX="center"
      anchorY="middle"
    >
      {label}
    </Text>
  );
}

function Keycap({ label, position, size, onClick: onKeyClick, isPressed: forcePressed }) {
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const animRef = useRef({ phase: 'idle', startY: position[1], progress: 0 });

  const isDown = pressed || forcePressed;

  useFrame(() => {
    const anim = animRef.current;
    if (anim.phase === 'idle' && meshRef.current) {
      const targetY = isDown ? anim.startY - 0.15 : anim.startY;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.25;
    }
  });

  const startY = position[1];
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (onKeyClick) onKeyClick(label);
    if (!meshRef.current) return;
    const anim = animRef.current;
    anim.startY = startY;
    anim.phase = 'pressed';
    setPressed(true);
    playClickSound();
    setTimeout(() => {
      setPressed(false);
      anim.phase = 'idle';
    }, 100);
  }, [label, onKeyClick, startY]);

  const keySize = [
    (size || 1) * KEY_WIDTH + ((size || 1) - 1) * BASE_GAP - 0.04,
    KEY_HEIGHT,
    KEY_DEPTH - 0.04,
  ];

  const emissiveColor = hovered ? '#017EB7' : '#000000';
  const emissiveIntensity = hovered ? 0.15 : 0;

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={keySize}
        radius={0.04}
        smoothness={4}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={hovered ? '#e8e0d0' : '#f5f0e8'}
          metalness={0.1}
          roughness={0.6}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </RoundedBox>
      <KeyLabel
        label={label}
        position={[0, KEY_HEIGHT / 2 + 0.02, 0]}
      />
    </group>
  );
}

function clickSoundCtx() {
  let ctx = null;
  return () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  };
}

const playClickSound = clickSoundCtx();

function KeyboardModel({ onKeyClick, pressedKey }) {
  const keys = useMemo(() => {
    const result = [];
    let row = 0;
    const rows = LAYOUT;

    for (const rowData of rows) {
      let xOffset = -(rowData.reduce((acc, k) => acc + (typeof k === 'object' && k.w ? k.w : 1), 0) * KEY_SPACING) / 2;
      for (const item of rowData) {
        if (typeof item === 'object' && item.w !== undefined) {
          xOffset += (item.w * KEY_SPACING) / 2;
        } else if (typeof item === 'object' && item.w === 0) {
          continue;
        } else if (typeof item === 'string') {
          const x = xOffset + KEY_SPACING / 2;
          const z = row * KEY_SPACING - (rows.length - 1) * KEY_SPACING / 2;
          result.push({
            label: item,
            position: [x, 0, z],
            size: 1,
          });
          xOffset += KEY_SPACING;
        }
      }
      row++;
    }
    return result;
  }, []);

  return (
    <group rotation={[-0.35, 0.4, 0]} position={[0, -0.5, 0]}>
      {keys.map((key) => (
        <Keycap
          key={key.label}
          label={key.label}
          position={key.position}
          size={key.size}
          onClick={onKeyClick}
          isPressed={pressedKey === key.label}
        />
      ))}
    </group>
  );
}

export default function Keyboard3D({ onKeyClick, pressedKey, className = '' }) {
  return (
    <div className={`w-full h-full ${className}`} style={{ minHeight: '300px' }}>
      <Canvas
        camera={{ position: [0, 6, 8], fov: 30 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <directionalLight position={[-3, 4, -2]} intensity={0.4} />
        <KeyboardModel onKeyClick={onKeyClick} pressedKey={pressedKey} />
      </Canvas>
    </div>
  );
}
