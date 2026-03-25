import { useState, useRef, useMemo, useEffect, Suspense, useCallback } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { PLYLoader } from "three/addons/loaders/PLYLoader.js";

/* ================================================================== */
/* VIEWER MODE                                                         */
/* ================================================================== */
type ViewerMode = "bim" | "pointcloud";

/* ================================================================== */
/* BIM LAYER CONFIG                                                    */
/* ================================================================== */
interface BimLayer {
  id: string;
  label: string;
  description: string;
  color: string;
  icon: string;
}

const layers: BimLayer[] = [
  {
    id: "structure",
    label: "Estructura",
    description: "Columnas, vigas y losas que soportan el edificio",
    color: "text-cyan-400",
    icon: "foundation",
  },
  {
    id: "mep",
    label: "MEP",
    description: "Sistemas mecánicos, eléctricos e hidro-sanitarios",
    color: "text-green-400",
    icon: "plumbing",
  },
  {
    id: "architecture",
    label: "Arquitectura",
    description: "Muros, fachadas, pisos y acabados del diseño",
    color: "text-violet-400",
    icon: "apartment",
  },
  {
    id: "coordination",
    label: "Coordinación",
    description: "Detección de interferencias entre disciplinas",
    color: "text-amber-400",
    icon: "sync_alt",
  },
];

/* ================================================================== */
/* BIM 3D COMPONENTS                                                   */
/* ================================================================== */

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
  const length = Math.sqrt((end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2);
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

function StructureLayer({ opacity }: { opacity: number }) {
  const color = "#00f0ff";
  const floors = [0, 1.8, 3.6, 5.4];
  const cols: [number, number][] = [
    [-1.6, -1.1],
    [-1.6, 1.1],
    [0, -1.1],
    [0, 1.1],
    [1.6, -1.1],
    [1.6, 1.1],
  ];
  return (
    <group>
      {floors.map((y) => (
        <FloorSlab key={`s-${y}`} y={y} opacity={opacity * 0.6} color={color} />
      ))}
      {floors
        .slice(0, -1)
        .map((baseY, fi) =>
          cols.map(([x, z]) => (
            <Column
              key={`c-${fi}-${x}-${z}`}
              x={x}
              z={z}
              height={1.8}
              baseY={baseY}
              opacity={opacity}
              color={color}
            />
          )),
        )}
      {floors
        .slice(1)
        .map((y) =>
          [-1.1, 1.1].map((z) => (
            <Beam
              key={`bx-${y}-${z}`}
              start={[-1.6, z]}
              end={[1.6, z]}
              y={y}
              opacity={opacity * 0.8}
              color={color}
            />
          )),
        )}
      {floors
        .slice(1)
        .map((y) =>
          [-1.6, 0, 1.6].map((x) => (
            <Beam
              key={`bz-${y}-${x}`}
              start={[x, -1.1]}
              end={[x, 1.1]}
              y={y}
              opacity={opacity * 0.8}
              color={color}
            />
          )),
        )}
    </group>
  );
}

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
      {[1.5, 3.3, 5.1].map((y, i) => (
        <group key={`duct-${i}`}>
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
      {[1.2, 3.0, 4.8].map((y) => (
        <Pipe
          key={`hp-${y}`}
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

function ArchitectureLayer({ opacity }: { opacity: number }) {
  const color = "#a78bfa";
  return (
    <group>
      {[0, 1.8, 3.6].map((baseY) => (
        <group key={`w-${baseY}`}>
          <mesh position={[0, baseY + 0.9, -1.45]}>
            <boxGeometry args={[3.8, 1.7, 0.08]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={opacity * 0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, baseY + 0.9, 1.45]}>
            <boxGeometry args={[3.8, 1.7, 0.08]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={opacity * 0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[-1.95, baseY + 0.9, 0]}>
            <boxGeometry args={[0.08, 1.7, 2.82]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={opacity * 0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[1.95, baseY + 0.9, 0]}>
            <boxGeometry args={[0.08, 1.7, 2.82]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={opacity * 0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
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

function CoordinationLayer({ opacity }: { opacity: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.children.forEach((child, i) => {
        child.scale.setScalar(0.8 + Math.sin(t * 3 + i * 1.5) * 0.3);
      });
    }
  });
  const pts: [number, number, number][] = [
    [-1.0, 1.5, -0.6],
    [0.8, 3.3, 0.6],
    [-0.7, 4.8, 0.8],
    [1.2, 1.2, 0.8],
  ];
  return (
    <group ref={ref}>
      {pts.map(([x, y, z], i) => (
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

function BimBuilding({ activeLayers }: { activeLayers: Set<string> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });
  const op = (id: string) => (activeLayers.has(id) ? 1 : 0.06);
  return (
    <Float speed={0.5} rotationIntensity={0} floatIntensity={0.3}>
      <group ref={ref} position={[0, -2.7, 0]}>
        <StructureLayer opacity={op("structure")} />
        <MepLayer opacity={op("mep")} />
        <ArchitectureLayer opacity={op("architecture")} />
        {activeLayers.has("coordination") && (
          <CoordinationLayer opacity={op("coordination")} />
        )}
      </group>
    </Float>
  );
}

/* ================================================================== */
/* POINT CLOUD COMPONENT                                               */
/* ================================================================== */

type ColorMode = "original" | "cyan" | "height";

function PointCloudMesh({
  pointSize,
  colorMode,
}: {
  pointSize: number;
  colorMode: ColorMode;
}) {
  const geometry = useLoader(PLYLoader, "/models/fragment.ply");
  const pointsRef = useRef<THREE.Points>(null);

  const processedGeometry = useMemo(() => {
    const geo = geometry.clone();
    // Rotate from Z-up (scanner convention) to Y-up (Three.js convention)
    // geo.rotateY(Math.PI / 2);
    geo.computeBoundingBox();
    geo.center();
    const size = new THREE.Vector3();
    geo.boundingBox!.getSize(size);
    const scale = 4 / Math.max(size.x, size.y, size.z);
    geo.scale(scale, scale, scale);
    geo.computeBoundingBox();
    return geo;
  }, [geometry]);

  // Store original colors separately so they're always available
  const originalColorsRef = useRef<THREE.BufferAttribute | null>(null);

  useEffect(() => {
    const origAttr = processedGeometry.getAttribute("color");
    if (origAttr) {
      // Deep copy the original colors before any modifications
      const arr = new Float32Array(origAttr.count * 3);
      for (let i = 0; i < origAttr.count; i++) {
        arr[i * 3] = origAttr.getX(i);
        arr[i * 3 + 1] = origAttr.getY(i);
        arr[i * 3 + 2] = origAttr.getZ(i);
      }
      originalColorsRef.current = new THREE.BufferAttribute(arr, 3);
    }
  }, [processedGeometry]);

  useEffect(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const positions = geo.getAttribute("position");
    const count = positions.count;
    const colors = new Float32Array(count * 3);
    const bbox = geo.boundingBox ?? processedGeometry.boundingBox!;
    const minY = bbox.min.y;
    const rangeY = bbox.max.y - minY || 1;

    for (let i = 0; i < count; i++) {
      if (colorMode === "original" && originalColorsRef.current) {
        colors[i * 3] = originalColorsRef.current.getX(i);
        colors[i * 3 + 1] = originalColorsRef.current.getY(i);
        colors[i * 3 + 2] = originalColorsRef.current.getZ(i);
      } else if (colorMode === "cyan") {
        const z = positions.getZ(i);
        const zN = (z - (bbox.min.z ?? 0)) / (bbox.max.z - bbox.min.z || 1);
        colors[i * 3] = 0.0 + zN * 0.1;
        colors[i * 3 + 1] = 0.85 + zN * 0.15;
        colors[i * 3 + 2] = 0.9 + zN * 0.1;
      } else {
        const t = (positions.getY(i) - minY) / rangeY;
        if (t < 0.5) {
          const s = t * 2;
          colors[i * 3] = 0.05 * (1 - s);
          colors[i * 3 + 1] = 0.2 * (1 - s) + 0.94 * s;
          colors[i * 3 + 2] = 0.6 * (1 - s) + 1.0 * s;
        } else {
          const s = (t - 0.5) * 2;
          colors[i * 3] = 0.9 * s;
          colors[i * 3 + 1] = 0.94 * (1 - s) + 0.95 * s;
          colors[i * 3 + 2] = 1.0;
        }
      }
    }

    const attr = new THREE.BufferAttribute(colors, 3);
    geo.setAttribute("color", attr);
    geo.attributes.color.needsUpdate = true;
  }, [colorMode, processedGeometry]);

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.08;
  });

  return (
    <points ref={pointsRef} geometry={processedGeometry}>
      <pointsMaterial
        size={pointSize}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}

/* ================================================================== */
/* UNIFIED SCENE                                                       */
/* ================================================================== */

function UnifiedScene({
  mode,
  activeLayers,
  pointSize,
  colorMode,
}: {
  mode: ViewerMode;
  activeLayers: Set<string>;
  pointSize: number;
  colorMode: ColorMode;
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <directionalLight
        position={[-3, 4, -3]}
        intensity={0.3}
        color="#00f0ff"
      />
      <pointLight
        position={[0, 6, 0]}
        intensity={0.5}
        color="#00f0ff"
        distance={12}
      />

      {/* Ground grid */}
      <gridHelper
        args={[12, 24, "#00f0ff", "#1a2a3a"]}
        position={[0, mode === "bim" ? -2.71 : -2.5, 0]}
      />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, mode === "bim" ? -2.72 : -2.51, 0]}
      >
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#0c141e" transparent opacity={0.8} />
      </mesh>

      {mode === "bim" ? (
        <BimBuilding activeLayers={activeLayers} />
      ) : (
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1.2, 1.2, 1.2]} />
              <meshStandardMaterial color="#00f0ff" wireframe transparent opacity={0.3} />
            </mesh>
          }
        >
          <PointCloudMesh pointSize={pointSize} colorMode={colorMode} />
        </Suspense>
      )}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        enableDamping
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
        minDistance={3}
        maxDistance={14}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
      />
    </>
  );
}

/* ================================================================== */
/* POINT CLOUD CONTROLS                                                */
/* ================================================================== */

const colorOptions: { id: ColorMode; label: string; description: string }[] = [
  {
    id: "original",
    label: "RGB Original",
    description: "Colores capturados por el escáner",
  },
  { id: "cyan", label: "Técnico", description: "Visualización monocromática" },
  { id: "height", label: "Elevación", description: "Gradiente por altura" },
];

function PointCloudControls({
  pointSize,
  setPointSize,
  colorMode,
  setColorMode,
}: {
  pointSize: number;
  setPointSize: (v: number) => void;
  colorMode: ColorMode;
  setColorMode: (v: ColorMode) => void;
}) {
  return (
    <>
      <h3 className="font-label text-[0.6rem] uppercase tracking-[0.3em] text-outline mb-4 font-bold">
        Modo de Color
      </h3>
      <div className="space-y-2 mb-5">
        {colorOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setColorMode(opt.id)}
            className={`w-full text-left p-3 transition-colors duration-300 ${
              colorMode === opt.id
                ? "bg-surface-high border border-primary-container/20"
                : "bg-surface/50 border border-transparent hover:border-outline-variant/20"
            }`}
          >
            <span
              className={`font-headline font-bold text-xs uppercase tracking-wider block mb-0.5 ${colorMode === opt.id ? "text-primary-container" : "text-outline/60"}`}
            >
              {opt.label}
            </span>
            <span
              className={`text-[0.65rem] font-body ${colorMode === opt.id ? "text-on-surface-variant" : "text-outline/40"}`}
            >
              {opt.description}
            </span>
          </button>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="font-label text-[0.6rem] uppercase tracking-[0.3em] text-outline mb-3 font-bold">
          Tamaño de Punto
        </h3>
        <input
          type="range"
          min="0.005"
          max="0.05"
          step="0.001"
          value={pointSize}
          onChange={(e) => setPointSize(parseFloat(e.target.value))}
          className="w-full h-1 bg-surface-highest appearance-none cursor-pointer accent-primary-container"
          aria-label="Tamaño de punto"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[0.55rem] text-outline/40 font-label uppercase">
            Fino
          </span>
          <span className="text-[0.55rem] text-outline/40 font-label uppercase">
            Grueso
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {[
          { action: "Rotar", key: "Clic + Arrastrar" },
          { action: "Zoom", key: "Scroll" },
          { action: "Mover", key: "Clic Derecho" },
        ].map((ctrl) => (
          <div key={ctrl.action} className="flex justify-between items-center">
            <span className="text-[0.65rem] text-on-surface-variant font-body">
              {ctrl.action}
            </span>
            <span className="text-[0.6rem] text-outline font-label uppercase tracking-wider px-2 py-0.5 bg-surface-highest">
              {ctrl.key}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ================================================================== */
/* BIM LAYER CONTROLS                                                  */
/* ================================================================== */

function BimControls({
  activeLayers,
  toggleLayer,
}: {
  activeLayers: Set<string>;
  toggleLayer: (id: string) => void;
}) {
  return (
    <>
      <h3 className="font-label text-[0.6rem] uppercase tracking-[0.3em] text-outline mb-4 font-bold">
        Capas del Modelo
      </h3>
      <div className="space-y-2 mb-5">
        {layers.map((layer) => {
          const isActive = activeLayers.has(layer.id);
          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={`w-full text-left p-3 transition-colors duration-300 ${
                isActive
                  ? "bg-surface-high border border-primary-container/20"
                  : "bg-surface/50 border border-transparent hover:border-outline-variant/20"
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span
                  className={`material-symbols-outlined text-lg transition-colors ${isActive ? layer.color : "text-outline/40"}`}
                  aria-hidden="true"
                >
                  {layer.icon}
                </span>
                <span
                  className={`font-headline font-bold text-xs uppercase tracking-wider transition-colors ${isActive ? "text-on-surface" : "text-outline/60"}`}
                >
                  {layer.label}
                </span>
                <span
                  className={`ml-auto w-2 h-2 rounded-full transition-colors ${isActive ? "bg-primary-container" : "bg-outline/30"}`}
                />
              </div>
              <p
                className={`text-[0.65rem] font-body leading-relaxed transition-colors pl-8 ${isActive ? "text-on-surface-variant" : "text-outline/40"}`}
              >
                {layer.description}
              </p>
            </button>
          );
        })}
      </div>
      {/* Benefits */}
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
    </>
  );
}

/* ================================================================== */
/* EXPORTED COMPONENT                                                  */
/* ================================================================== */

export default function BimScene() {
  const [mode, setMode] = useState<ViewerMode>("bim");
  const [activeLayers, setActiveLayers] = useState(
    new Set(["structure", "mep", "architecture"]),
  );
  const [pointSize, setPointSize] = useState(0.015);
  const [colorMode, setColorMode] = useState<ColorMode>("original");
  const [canvasInteractive, setCanvasInteractive] = useState(false);
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;

  const handleCanvasTap = useCallback(() => {
    if (isMobile && !canvasInteractive) setCanvasInteractive(true);
  }, [isMobile, canvasInteractive]);

  const toggleLayer = (id: string) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const modeConfig = {
    bim: {
      label: "Metodología BIM",
      title: "CONSTRUIR ANTES DE CONSTRUIR",
      description:
        "Building Information Modeling permite coordinar todas las disciplinas de un proyecto en un modelo 3D único, detectando interferencias y optimizando costos antes de iniciar la obra.",
      techLabel: "AXIS_BIM_3D_VIEWER",
    },
    pointcloud: {
      label: "Levantamiento Digital",
      title: "NUBE DE PUNTOS 3D",
      description:
        "Captura de realidad mediante fotogrametría y escáner LiDAR. Explora la nube de puntos interactiva — arrastra para rotar, scroll para zoom.",
      techLabel: "AXIS_POINTCLOUD_VIEWER",
    },
  };

  const cfg = modeConfig[mode];

  return (
    <section
      id="metodologia"
      className="relative py-16 md:py-24 bg-surface-lowest overflow-hidden"
    >
      <div className="absolute inset-0 blueprint-grid-subtle pointer-events-none" />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="mb-4 max-w-2xl">
          <p className="text-primary-container font-label text-[0.65rem] tracking-[0.4em] uppercase font-bold mb-4">
            {cfg.label}
          </p>
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-surface tracking-tighter mb-4">
            {cfg.title}
          </h2>
          <p className="text-on-surface-variant font-body leading-relaxed text-[1.0625rem]">
            {cfg.description}
          </p>
        </div>

        {/* Mode tabs */}
        <div className="flex justify-center gap-6 mb-6">
          {(["bim", "pointcloud"] as ViewerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setCanvasInteractive(false); }}
              className={`font-label font-bold text-xs uppercase tracking-widest min-h-[44px] px-4 pb-2 flex items-center transition-colors duration-300 ${
                mode === m
                  ? "text-primary-container border-b border-primary-container"
                  : "text-outline hover:text-on-surface"
              }`}
            >
              {m === "bim" ? "Modelo BIM" : "Nube de Puntos"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Canvas */}
          <div className="lg:col-span-8 relative h-[320px] md:h-[500px]">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary-container/30 z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary-container/30 z-10 pointer-events-none" />

            <div
              className="w-full h-full"
              style={{ touchAction: isMobile && !canvasInteractive ? "pan-y" : "none" }}
              onClick={handleCanvasTap}
            >
              <Canvas
                camera={{ position: [6, 4, 6], fov: 35 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent", pointerEvents: isMobile && !canvasInteractive ? "none" : "auto" }}
              >
                <color attach="background" args={["#070f19"]} />
                <UnifiedScene
                  mode={mode}
                  activeLayers={activeLayers}
                  pointSize={pointSize}
                  colorMode={colorMode}
                />
              </Canvas>
            </div>

            {/* Mobile touch-to-interact overlay */}
            {isMobile && !canvasInteractive && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="glass-panel px-4 py-2.5 flex items-center gap-2 border border-primary-container/20">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary-container text-base">touch_app</span>
                  <span className="text-[0.65rem] font-label font-bold uppercase tracking-widest text-on-surface-variant">
                    Toca para interactuar
                  </span>
                </div>
              </div>
            )}

            <div className="absolute bottom-3 left-3 font-label text-[0.5rem] tracking-[0.3em] uppercase text-outline/40 pointer-events-none">
              {cfg.techLabel}
            </div>
            <div className="absolute top-3 right-3 font-label text-[0.5rem] tracking-[0.3em] uppercase text-primary-container/40 pointer-events-none">
              LIVE 3D
            </div>
          </div>

          {/* Controls panel */}
          <div className="lg:col-span-4">
            <div className="glass-panel p-6 border-l-2 border-primary-container/30 h-full">
              {mode === "bim" ? (
                <BimControls
                  activeLayers={activeLayers}
                  toggleLayer={toggleLayer}
                />
              ) : (
                <PointCloudControls
                  pointSize={pointSize}
                  setPointSize={setPointSize}
                  colorMode={colorMode}
                  setColorMode={setColorMode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
