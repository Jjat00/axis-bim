import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Service {
  num: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  tools: string[];
  image: string;
  accent: "cyan" | "orange";
}

const services: Service[] = [
  {
    num: "01",
    icon: "architecture",
    title: "Construcción Virtual",
    subtitle: "Modelado & Coordinación BIM",
    description:
      "Modelamos cada disciplina del proyecto en 3D — estructura, arquitectura, redes hidráulicas, eléctricas y mecánicas — dentro de un modelo federado. Detectamos interferencias entre especialidades antes de que lleguen a obra, evitando demoliciones, retrabajo y sobrecostos.",
    bullets: [
      "Detección de colisiones entre disciplinas",
      "Cuantificación de obra directo del modelo",
      "Planos de construcción coordinados",
    ],
    tools: ["Revit", "Archicad", "Navisworks", "BIM 360"],
    image: "/images/service-bim.jpg",
    accent: "cyan",
  },
  {
    num: "02",
    icon: "database",
    title: "Levantamiento Digital",
    subtitle: "Fotogrametría & Escaneo LiDAR",
    description:
      "Capturamos la realidad existente con drones y escáneres LiDAR para generar nubes de puntos y modelos 3D de alta precisión. Ideal como base para remodelaciones, ampliaciones o verificación de avance de obra contra el modelo BIM.",
    bullets: [
      "Nubes de puntos georeferenciadas",
      "Ortomosaicos y modelos de terreno",
      "Comparación modelo vs. realidad construida",
    ],
    tools: ["DJI Mapper", "RealityCapture", "CloudCompare", "Civil 3D"],
    image: "/images/service-scan.jpg",
    accent: "orange",
  },
  {
    num: "03",
    icon: "view_in_ar",
    title: "Visualización Avanzada",
    subtitle: "Renders & Recorridos Virtuales",
    description:
      "Comunicamos el diseño con imágenes fotorrealistas, fotomontajes sobre contexto real y recorridos interactivos. Para que clientes, inversionistas y comités de aprobación vean el proyecto terminado antes de iniciar obra.",
    bullets: [
      "Renders fotorrealistas de interiores y exteriores",
      "Fotomontajes sobre fotografía del sitio real",
      "Recorridos virtuales navegables",
    ],
    tools: ["Twinmotion", "Lumion", "Enscape", "Photoshop"],
    image: "/images/service-render.jpg",
    accent: "cyan",
  },
];

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const isReversed = index % 2 !== 0;
  const accentColor =
    service.accent === "cyan" ? "primary-container" : "secondary";

  return (
    <article
      className={`service-row grid grid-cols-1 lg:grid-cols-2 gap-0 bg-surface-low border border-outline-variant/10 overflow-hidden`}
    >
      {/* Image */}
      <div
        className={`relative h-72 md:h-96 lg:h-auto lg:min-h-[480px] overflow-hidden ${isReversed ? "lg:order-2" : ""}`}
      >
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover grayscale-[30%] opacity-80 hover:grayscale-0 hover:opacity-100 transition-[filter,opacity] duration-700"
          loading="lazy"
          width={960}
          height={640}
        />

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-${isReversed ? "l" : "r"} from-transparent via-transparent to-surface-low/60 hidden lg:block`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-low via-transparent to-transparent lg:hidden" />

        {/* Corner accents */}
        <div
          className={`absolute top-4 ${isReversed ? "left-4" : "right-4"} w-8 h-8 border-t-2 ${isReversed ? "border-l-2" : "border-r-2"} border-${accentColor}/30 pointer-events-none`}
        />

        {/* Number overlay */}
        <div className="absolute bottom-4 left-4 font-headline text-6xl font-black text-on-surface/[0.04] select-none pointer-events-none leading-none">
          {service.num}
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex flex-col justify-center p-8 md:p-12 lg:p-16 ${isReversed ? "lg:order-1" : ""}`}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <span
            aria-hidden="true"
            className={`material-symbols-outlined text-2xl text-${accentColor}/60`}
            style={{
              fontVariationSettings: "'FILL' 0, 'wght' 300, 'opsz' 24",
            }}
          >
            {service.icon}
          </span>
          <span
            className={`text-[0.6rem] font-label font-bold uppercase tracking-[0.3em] text-${accentColor}/60`}
          >
            {service.subtitle}
          </span>
        </div>

        <h3 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-on-surface mb-6 uppercase tracking-tight">
          {service.title}
        </h3>

        <p className="text-[1.0625rem] font-body text-on-surface-variant leading-relaxed mb-8">
          {service.description}
        </p>

        {/* Bullet points */}
        <ul className="space-y-3 mb-8">
          {service.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={`material-symbols-outlined text-base text-${accentColor} mt-0.5 flex-shrink-0`}
                style={{
                  fontVariationSettings: "'FILL' 1, 'wght' 400, 'opsz' 20",
                }}
              >
                check
              </span>
              <span className="text-sm font-body text-on-surface-variant">
                {bullet}
              </span>
            </li>
          ))}
        </ul>

        {/* Tools row */}
        <div className="flex flex-wrap items-center gap-2">
          {service.tools.map((tool) => (
            <span
              key={tool}
              className="px-3 py-1.5 bg-surface-highest font-label text-[0.6rem] text-outline uppercase tracking-widest"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".service-header", {
          y: 40,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".service-header",
            start: "top 85%",
          },
        });
        gsap.set(".service-row", { autoAlpha: 0, y: 60 });
        ScrollTrigger.batch(".service-row", {
          onEnter: (elements) =>
            gsap.to(elements, {
              y: 0,
              autoAlpha: 1,
              stagger: 0.2,
              duration: 0.8,
              ease: "power2.out",
              overwrite: true,
            }),
          start: "top 85%",
          once: true,
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="servicios"
      ref={containerRef}
      className="py-24 md:py-32 bg-surface-low relative"
    >
      {/* Subtle blueprint grid */}
      <div className="absolute inset-0 blueprint-grid-subtle pointer-events-none" />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8">
        {/* Section header */}
        <div className="service-header flex flex-col md:flex-row justify-between items-end mb-16 md:mb-20 gap-8">
          <div className="max-w-xl">
            <p className="text-primary-container font-label text-[0.65rem] tracking-[0.4em] uppercase font-bold mb-4 block">
              Servicios Especializados
            </p>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tighter">
              LÍNEAS DE NEGOCIO
            </h2>
          </div>
          <div className="font-label text-outline text-xs tracking-tighter hidden md:block">
            CORE_ENGINE_SYSTEMS [03]
          </div>
        </div>

        {/* Service rows */}
        <div className="space-y-6 md:space-y-8">
          {services.map((service, i) => (
            <ServiceRow key={service.num} service={service} index={i} />
          ))}
        </div>

        {/* Bottom technical label */}
        <div className="mt-12 flex items-center gap-6">
          <div className="h-px flex-1 bg-outline-variant/20" />
          <span className="font-label text-[0.6rem] text-outline/50 tracking-[0.3em] uppercase">
            Archicad · Revit · BIM 360 · Navisworks
          </span>
          <div className="h-px flex-1 bg-outline-variant/20" />
        </div>
      </div>
    </section>
  );
}
