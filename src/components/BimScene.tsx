import { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Layer config                                                        */
/* ------------------------------------------------------------------ */
interface BimLayer {
  id: string;
  label: string;
  description: string;
  color: string;
  threeColor: string;
  icon: string;
}

const layers: BimLayer[] = [
  {
    id: "structure",
    label: "Estructura",
    description: "Columnas, vigas y losas que soportan el edificio",
    color: "text-cyan-400",
    threeColor: "#00f0ff",
    icon: "foundation",
  },
  {
    id: "mep",
    label: "MEP",
    description: "Sistemas mecánicos, eléctricos e hidro-sanitarios",
    color: "text-green-400",
    threeColor: "#4ade80",
    icon: "plumbing",
  },
  {
    id: "architecture",
    label: "Arquitectura",
    description: "Muros, fachadas, pisos y acabados del diseño",
    color: "text-violet-400",
    threeColor: "#a78bfa",
    icon: "apartment",
  },
  {
    id: "coordination",
    label: "Coordinación",
    description: "Detección de interferencias entre disciplinas",
    color: "text-amber-400",
    threeColor: "#fbbf24",
    icon: "sync_alt",
  },
];

/* ------------------------------------------------------------------ */
/* 3D Building components                                              */
/* ------------------------------------------------------------------ */

function FloorSlab({
  y,
  opacity,
  color,
}: {
  y: number;
  opacity: number;
  color: string;
}) {
  return (
    <mesh position={[0, y, 0]}>
      <boxGeometry args={[4, 0.12, 3]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        wireframe={opacity < 0.5}
      />
    </mesh>
  );
}

function Column({
  x,
  z,
  height,
  baseY,
  opacity,
  color,
}: {
  x: number;
  z: number;
  height: number;
  baseY: number;
  opacity: number;
  color: string;
}) {
  return (
    <mesh position={[x, baseY + height / 2, z]}>
      <boxGeometry args={[0.2, height, 0.2]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        wireframe={opacity < 0.5}
      />
    </mesh>
  );
}

function Beam({
  start,
  end,
  y,
  opacity,
  color,
}: {
  start: [number, number];
  end: [number, number];
  y: number;
  opacity: number;
  color: string;
}) {
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[1] + end[1]) / 2;
  const length = Math.sqrt(
    (end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2
  );
  const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);

  return (
    <mesh position={[midX, y - 0.06, midZ]} rotation={[0, -angle, 0]}>
      <boxGeometry args={[length, 0.15, 0.12]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        wireframe={opacity < 0.5}
      />
    </mesh>
  );
}

/* Structural layer: columns, beams, slabs */
function StructureLayer({ opacity }: { opacity: number }) {
  const color = "#00f0ff";
  const floors = [0, 1.8, 3.6, 5.4];
  const colPositions: [number, number][] = [
    [-1.6, -1.1],
    [-1.6, 1.1],
    [0, -1.1],
    [0, 1.1],
    [1.6, -1.1],
    [1.6, 1.1],
  ];

  return (
    <group>
      {/* Slabs */}
      {floors.map((y) => (
        <FloorSlab key={`slab-${y}`} y={y} opacity={opacity * 0.6} color={color} />
      ))}
      {/* Columns */}
      {floors.slice(0, -1).map((baseY, fi) =>
        colPositions.map(([x, z]) => (
          <Column
            key={`col-${fi}-${x}-${z}`}
            x={x}
            z={z}
            height={1.8}
            baseY={baseY}
            opacity={opacity}
            color={color}
          />
        ))
      )}
      {/* Beams along X */}
      {floors.slice(1).map((y) =>
        [-1.1, 1.1].map((z) => (
          <Beam
            key={`bx-${y}-${z}`}
            start={[-1.6, z]}
            end={[1.6, z]}
            y={y}
            opacity={opacity * 0.8}
            color={color}
          />
        ))
      )}
      {/* Beams along Z */}
      {floors.slice(1).map((y) =>
        [-1.6, 0, 1.6].map((x) => (
          <Beam
            key={`bz-${y}-${x}`}
            start={[x, -1.1]}
            end={[x, 1.1]}
            y={y}
            opacity={opacity * 0.8}
            color={color}
          />
        ))
      )}
    </group>
  );
}

/* MEP layer: pipes and ducts */
function Pipe({
  points,
  color,
  opacity,
  radius = 0.04,
}: {
  points: THREE.Vector3[];
  color: string;
  opacity: number;
  radius?: number;
}) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 20, radius, 8, false);
  }, [points, radius]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function MepLayer({ opacity }: { opacity: number }) {
  const green = "#4ade80";
  const red = "#f87171";
  const blue = "#60a5fa";

  return (
    <group>
      {/* Horizontal HVAC ducts per floor */}
      {[1.5, 3.3, 5.1].map((y, i) => (
        <group key={`duct-${i}`}>
          {/* Main duct */}
          <mesh position={[0, y, 0]}>
            <boxGeometry args={[3.2, 0.2, 0.35]} />
            <meshStandardMaterial
              color={blue}
              transparent
              opacity={opacity * 0.7}
              emissive={blue}
              emissiveIntensity={0.15}
            />
          </mesh>
          {/* Branch */}
          <mesh position={[0.8, y, 0.6]}>
            <boxGeometry args={[0.25, 0.15, 0.9]} />
            <meshStandardMaterial
              color={blue}
              transparent
              opacity={opacity * 0.5}
              emissive={blue}
              emissiveIntensity={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Vertical water pipes */}
      <Pipe
        points={[
          new THREE.Vector3(-1.0, 0, -0.6),
          new THREE.Vector3(-1.0, 5.4, -0.6),
        ]}
        color={green}
        opacity={opacity}
        radius={0.05}
      />
      <Pipe
        points={[
          new THREE.Vector3(-0.7, 0, -0.6),
          new THREE.Vector3(-0.7, 5.4, -0.6),
        ]}
        color={red}
        opacity={opacity}
        radius={0.04}
      />

      {/* Horizontal pipe branches */}
      {[1.2, 3.0, 4.8].map((y) => (
        <Pipe
          key={`hpipe-${y}`}
          points={[
            new THREE.Vector3(-1.0, y, -0.6),
            new THREE.Vector3(-1.0, y, 0.8),
            new THREE.Vector3(0.5, y, 0.8),
          ]}
          color={green}
          opacity={opacity * 0.7}
          radius={0.03}
        />
      ))}

      {/* Electrical conduits */}
      <Pipe
        points={[
          new THREE.Vector3(1.2, 0, 0.8),
          new THREE.Vector3(1.2, 5.4, 0.8),
        ]}
        color="#fbbf24"
        opacity={opacity * 0.6}
        radius={0.025}
      />
    </group>
  );
}

/* Architecture layer: walls and facades */
function ArchitectureLayer({ opacity }: { opacity: number }) {
  const color = "#a78bfa";

  return (
    <group>
      {/* Exterior walls per floor */}
      {[0, 1.8, 3.6].map((baseY) => (
        <group key={`walls-${baseY}`}>
          {/* Front wall */}
          <mesh position={[0, baseY + 0.9, -1.45]}>
            <boxGeometry args={[3.8, 1.7, 0.08]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={opacity * 0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Back wall */}
          <mesh position={[0, baseY + 0.9, 1.45]}>
            <boxGeometry args={[3.8, 1.7, 0.08]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={opacity * 0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Left wall */}
          <mesh position={[-1.95, baseY + 0.9, 0]}>
            <boxGeometry args={[0.08, 1.7, 2.82]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={opacity * 0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Right wall */}
          <mesh position={[1.95, baseY + 0.9, 0]}>
            <boxGeometry args={[0.08, 1.7, 2.82]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={opacity * 0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Interior partition */}
          <mesh position={[0, baseY + 0.9, 0]}>
            <boxGeometry args={[0.06, 1.5, 2.0]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={opacity * 0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
      {/* Roof */}
      <mesh position={[0, 5.5, 0]}>
        <boxGeometry args={[4.2, 0.08, 3.2]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity * 0.4}
        />
      </mesh>
    </group>
  );
}

/* Coordination: clash spheres */
function CoordinationLayer({ opacity }: { opacity: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.children.forEach((child, i) => {
        const scale = 0.8 + Math.sin(t * 3 + i * 1.5) * 0.3;
        child.scale.setScalar(scale);
      });
    }
  });

  const clashPoints: [number, number, number][] = [
    [-1.0, 1.5, -0.6],
    [0.8, 3.3, 0.6],
    [-0.7, 4.8, 0.8],
    [1.2, 1.2, 0.8],
  ];

  return (
    <group ref={ref}>
      {clashPoints.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            transparent
            opacity={opacity * 0.8}
            emissive="#fbbf24"
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

/* Auto-rotate the whole building */
function RotatingGroup({
  children,
  activeLayers,
}: {
  children: React.ReactNode;
  activeLayers: Set<string>;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15;
    }
  });

  // Explode offset based on active layers count
  const explode = activeLayers.size === 1 ? 0 : 0;
  void explode;

  return (
    <group ref={ref} position={[0, -2.7, 0]}>
      {children}
    </group>
  );
}

/* Ground grid */
function GroundGrid() {
  return (
    <group position={[0, -2.7, 0]}>
      <gridHelper
        args={[12, 24, "#00f0ff", "#1a2a3a"]}
        position={[0, -0.01, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color="#0c141e"
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Main scene                                                          */
/* ------------------------------------------------------------------ */
function Scene({ activeLayers }: { activeLayers: Set<string> }) {
  const getOpacity = (id: string) => (activeLayers.has(id) ? 1 : 0.06);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight
        position={[-3, 4, -3]}
        intensity={0.3}
        color="#00f0ff"
      />
      <pointLight position={[0, 6, 0]} intensity={0.5} color="#00f0ff" distance={12} />

      <GroundGrid />

      <Float speed={0.5} rotationIntensity={0} floatIntensity={0.3}>
        <RotatingGroup activeLayers={activeLayers}>
          <StructureLayer opacity={getOpacity("structure")} />
          <MepLayer opacity={getOpacity("mep")} />
          <ArchitectureLayer opacity={getOpacity("architecture")} />
          {activeLayers.has("coordination") && (
            <CoordinationLayer opacity={getOpacity("coordination")} />
          )}
        </RotatingGroup>
      </Float>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate={false}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Exported component                                                  */
/* ------------------------------------------------------------------ */
export default function BimScene() {
  const [activeLayers, setActiveLayers] = useState<Set<string>>(
    new Set(["structure", "mep", "architecture"])
  );

  const toggleLayer = (id: string) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section id="metodologia" className="relative py-16 md:py-24 bg-surface-lowest overflow-hidden">
      {/* Blueprint grid */}
      <div className="absolute inset-0 blueprint-grid-subtle pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 md:px-8">
        {/* Section header */}
        <div className="text-center mb-4">
          <p className="text-primary-container font-label text-[0.65rem] tracking-[0.4em] uppercase font-bold mb-4">
            Metodología BIM
          </p>
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-surface tracking-tighter mb-4">
            CONSTRUIR ANTES DE CONSTRUIR
          </h2>
          <p className="text-on-surface-variant font-body max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Building Information Modeling permite coordinar todas las
            disciplinas de un proyecto en un modelo 3D único, detectando
            interferencias y optimizando costos antes de iniciar la obra.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* 3D Canvas */}
          <div className="lg:col-span-8 relative h-[400px] md:h-[500px]">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary-container/30 z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary-container/30 z-10 pointer-events-none" />

            <Canvas
              camera={{ position: [6, 4, 6], fov: 35 }}
              gl={{ antialias: true, alpha: true }}
              style={{ background: "transparent" }}
            >
              <Scene activeLayers={activeLayers} />
            </Canvas>

            {/* Technical label */}
            <div className="absolute bottom-3 left-3 font-label text-[0.5rem] tracking-[0.3em] uppercase text-outline/40">
              AXIS_BIM_3D_VIEWER
            </div>
          </div>

          {/* Layer controls */}
          <div className="lg:col-span-4">
            <div className="glass-panel p-6 border-l-2 border-primary-container/30">
              <h3 className="font-label text-[0.6rem] uppercase tracking-[0.3em] text-outline mb-5 font-bold">
                Capas del Modelo
              </h3>

              <div className="space-y-3">
                {layers.map((layer) => {
                  const isActive = activeLayers.has(layer.id);
                  return (
                    <button
                      key={layer.id}
                      onClick={() => toggleLayer(layer.id)}
                      className={`w-full text-left p-4 transition-all duration-300 group ${
                        isActive
                          ? "bg-surface-high border border-primary-container/20"
                          : "bg-surface/50 border border-transparent hover:border-outline-variant/20"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-1.5">
                        <span
                          aria-hidden="true"
                          className={`material-symbols-outlined text-lg transition-colors ${
                            isActive ? layer.color : "text-outline/40"
                          }`}
                        >
                          {layer.icon}
                        </span>
                        <span
                          className={`font-headline font-bold text-sm uppercase tracking-wider transition-colors ${
                            isActive ? "text-on-surface" : "text-outline/60"
                          }`}
                        >
                          {layer.label}
                        </span>
                        {/* Toggle indicator */}
                        <span
                          className={`ml-auto w-2 h-2 rounded-full transition-colors ${
                            isActive ? "bg-primary-container" : "bg-outline/30"
                          }`}
                        />
                      </div>
                      <p
                        className={`text-[0.7rem] font-body leading-relaxed transition-colors pl-8 ${
                          isActive
                            ? "text-on-surface-variant"
                            : "text-outline/40"
                        }`}
                      >
                        {layer.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Benefits summary */}
              <div className="mt-5 pt-5 border-t border-outline-variant/15">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "-30%", label: "Costos" },
                    { value: "-80%", label: "Errores" },
                    { value: "+40%", label: "Velocidad" },
                    { value: "100%", label: "Trazabilidad" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center py-2">
                      <div className="text-lg font-headline font-black text-primary-container">
                        {stat.value}
                      </div>
                      <div className="text-[0.55rem] uppercase tracking-widest text-outline font-label">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
