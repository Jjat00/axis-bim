interface Service {
  icon: string;
  title: string;
  description: string;
  accent: "cyan" | "orange" | "cyan2";
}

const services: Service[] = [
  {
    icon: "architecture",
    title: "Construcción Virtual",
    description:
      "Modelado BIM multidisciplinar en Archicad y Revit. Coordinación de especialidades para detectar interferencias antes de la construcción, reduciendo costos y tiempos de ejecución.",
    accent: "cyan",
  },
  {
    icon: "database",
    title: "Levantamiento Digital",
    description:
      "Captura de realidad mediante fotogrametría y drones. Generación de nubes de puntos y modelos 3D precisos como base para proyectos de renovación y ampliación.",
    accent: "orange",
  },
  {
    icon: "view_in_ar",
    title: "Visualización Avanzada",
    description:
      "Renders fotorrealistas, fotomontajes arquitectónicos y recorridos virtuales que comunican el diseño con claridad a clientes e inversionistas.",
    accent: "cyan2",
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const accentColors = {
    cyan: {
      icon: "text-primary-container/40 group-hover:text-primary-container",
      line: "bg-primary-container/20 group-hover:bg-primary-container",
    },
    orange: {
      icon: "text-secondary/40 group-hover:text-secondary",
      line: "bg-secondary/20 group-hover:bg-secondary",
    },
    cyan2: {
      icon: "text-primary-container/40 group-hover:text-primary-container",
      line: "bg-primary-container/20 group-hover:bg-primary-container",
    },
  };

  const colors = accentColors[service.accent];

  return (
    <article className="group bg-surface p-10 md:p-12 hover:bg-surface-high transition-all duration-500 relative overflow-hidden border border-transparent hover:border-primary-container/10 flex flex-col">
      {/* Index label */}
      <div className="absolute top-6 right-6 font-headline text-[0.6rem] tracking-widest text-outline/40 font-bold">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Icon */}
      <div className="mb-10">
        <span
          className={`material-symbols-outlined text-5xl transition-colors duration-500 ${colors.icon}`}
          style={{ fontVariationSettings: "'FILL' 0, 'wght' 200, 'opsz' 48" }}
        >
          {service.icon}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-headline font-bold text-on-surface mb-5 uppercase tracking-tight">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-8 flex-1">
        {service.description}
      </p>

      {/* Expanding line accent */}
      <div
        className={`h-0.5 card-line transition-all duration-500 ${colors.line}`}
      />
    </article>
  );
}

export default function Services() {
  return (
    <section
      id="servicios"
      className="py-24 md:py-32 bg-surface-low relative"
    >
      {/* Subtle blueprint grid */}
      <div className="absolute inset-0 blueprint-grid-subtle pointer-events-none" />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-20 gap-8">
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

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline-variant/10">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
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
