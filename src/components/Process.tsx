import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  {
    num: "01",
    title: "Auditoría Inicial",
    description:
      "Evaluamos el estado actual del proyecto, identificamos brechas en la documentación y definimos el alcance de la coordinación BIM.",
    icon: "search",
    accent: "text-primary-container",
    duration: "1-2 días",
  },
  {
    num: "02",
    title: "Modelado & Coordinación",
    description:
      "Creamos o integramos los modelos 3D de cada disciplina. Ejecutamos detección de interferencias y generamos reportes de colisiones.",
    icon: "view_in_ar",
    accent: "text-secondary",
    duration: "2-8 semanas",
  },
  {
    num: "03",
    title: "Revisión & Resolución",
    description:
      "Sesiones de revisión técnica con tu equipo. Cada interferencia se rastrea hasta su resolución completa con registro en el modelo.",
    icon: "sync_alt",
    accent: "text-primary-container",
    duration: "Iterativo",
  },
  {
    num: "04",
    title: "Entregables Finales",
    description:
      "Planos de construcción coordinados, modelos LOD 400, tablas de cantidades de obra y documentación As-Built lista para ejecución.",
    icon: "task_alt",
    accent: "text-secondary",
    duration: "Entrega final",
  },
];

export default function Process() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".process-header", {
          y: 40,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".process-header",
            start: "top 85%",
          },
        });
        gsap.set(".process-step", { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(".process-step", {
          onEnter: (elements) =>
            gsap.to(elements, {
              y: 0,
              autoAlpha: 1,
              stagger: 0.15,
              duration: 0.6,
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
      ref={containerRef}
      className="py-24 md:py-32 bg-surface-container relative overflow-hidden"
    >
      <div className="absolute inset-0 blueprint-grid-subtle pointer-events-none" />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8">
        {/* Section header */}
        <div className="process-header flex flex-col md:flex-row justify-between items-end mb-16 md:mb-20 gap-8">
          <div className="max-w-xl">
            <p className="text-secondary font-label text-[0.65rem] tracking-[0.4em] uppercase font-bold mb-4 block">
              Metodología
            </p>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tighter">
              CÓMO TRABAJAMOS
            </h2>
          </div>
          <div className="font-label text-outline text-xs tracking-tighter hidden md:block">
            AXIS_WORKFLOW_v2.4
          </div>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-outline-variant/10">
          {steps.map((step) => (
            <article
              key={step.num}
              className="process-step bg-surface p-8 md:p-10 relative group hover:bg-surface-high transition-colors duration-500 flex flex-col"
            >
              {/* Step number */}
              <div className="absolute top-6 right-6 font-headline text-[0.6rem] tracking-widest text-outline/30 font-bold">
                {step.num}
              </div>

              {/* Icon */}
              <div className="mb-8">
                <span
                  aria-hidden="true"
                  className={`material-symbols-outlined text-4xl ${step.accent} opacity-40 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{
                    fontVariationSettings:
                      "'FILL' 0, 'wght' 200, 'opsz' 48",
                  }}
                >
                  {step.icon}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-headline font-bold text-on-surface mb-4 uppercase tracking-tight">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-6 flex-1">
                {step.description}
              </p>

              {/* Duration tag */}
              <div className="mt-auto">
                <span className="text-[0.55rem] font-label font-bold uppercase tracking-widest text-outline/50 px-2 py-1 bg-surface-highest">
                  {step.duration}
                </span>
              </div>

              {/* Connecting line on larger screens */}
              <div className="hidden lg:block absolute top-1/2 -right-px w-6 h-px bg-primary-container/20 last:hidden" />
            </article>
          ))}
        </div>

        {/* Bottom technical label */}
        <div className="mt-12 flex items-center gap-6">
          <div className="h-px flex-1 bg-outline-variant/20" />
          <span className="font-label text-[0.6rem] text-outline/50 tracking-[0.3em] uppercase">
            ISO 19650 · BIM Execution Plan · LOD Specification
          </span>
          <div className="h-px flex-1 bg-outline-variant/20" />
        </div>
      </div>
    </section>
  );
}
