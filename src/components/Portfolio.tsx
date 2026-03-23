import { useState, useEffect } from "react";

type FilterTab = "Infraestructura" | "Comercial" | "Institucional";

const tabs: FilterTab[] = ["Infraestructura", "Comercial", "Institucional"];

interface Project {
  title: string;
  subtitle: string;
  tag: FilterTab;
  image: string;
  size: "large" | "small";
  description: string;
  specs: { label: string; value: string }[];
  tools: string[];
}

const projects: Project[] = [
  {
    title: "INFRAESTRUCTURA VIAL",
    subtitle: "LOD 400 | Coordinación Multidisciplinar",
    tag: "Infraestructura",
    image: "/images/portfolio-infra.png",
    size: "large",
    description:
      "Coordinación BIM completa para proyecto de infraestructura vial tipo placa huella. Modelado de vía, obras de drenaje, muros de contención y señalización. Detección de interferencias entre especialidades y generación de cantidades de obra directamente del modelo.",
    specs: [
      { label: "Nivel de Detalle", value: "LOD 400" },
      { label: "Área", value: "3.2 km lineales" },
      { label: "Disciplinas", value: "Vial, Hidráulica, Estructural" },
      { label: "Duración", value: "4 meses" },
    ],
    tools: ["Revit", "Navisworks", "Civil 3D"],
  },
  {
    title: "RETAIL COMERCIAL",
    subtitle: "Diseño Interior",
    tag: "Comercial",
    image: "/images/portfolio-commercial.png",
    size: "small",
    description:
      "Diseño y modelado BIM para adecuación de locales comerciales. Coordinación de instalaciones eléctricas, hidráulicas y sistema HVAC en espacio reducido. Fotomontajes para aprobación de marca y renders de presentación al cliente final.",
    specs: [
      { label: "Nivel de Detalle", value: "LOD 350" },
      { label: "Área", value: "450 m²" },
      { label: "Disciplinas", value: "Arquitectura, MEP, Interiorismo" },
      { label: "Duración", value: "6 semanas" },
    ],
    tools: ["Archicad", "Twinmotion", "Photoshop"],
  },
  {
    title: "EQUIPAMIENTO URBANO",
    subtitle: "Integración MEP",
    tag: "Institucional",
    image: "/images/portfolio-institutional.png",
    size: "small",
    description:
      "Modelado BIM integral para salón comunal con enfoque en coordinación MEP. Integración de redes eléctricas, hidro-sanitarias y sistema de ventilación mecánica. Generación de planos de construcción y tablas de planificación desde el modelo.",
    specs: [
      { label: "Nivel de Detalle", value: "LOD 350" },
      { label: "Área", value: "820 m²" },
      { label: "Disciplinas", value: "Arquitectura, Estructural, MEP" },
      { label: "Duración", value: "3 meses" },
    ],
    tools: ["Revit", "Navisworks", "AutoCAD"],
  },
];

function ProjectImage({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-700"
        loading="lazy"
      />
      {children}
    </div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-surface/90 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-surface-container border border-outline-variant/20 shadow-[0_20px_50px_rgba(0,240,255,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-surface-highest/80 text-on-surface hover:text-primary-container hover:bg-surface-highest transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Image */}
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />

          {/* Tag */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 bg-surface/80 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
            <span className="text-[0.6rem] uppercase tracking-[0.3em] font-label text-primary-container font-semibold">
              {project.tag}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Info */}
            <div className="lg:col-span-7">
              <h3 className="text-2xl md:text-3xl font-headline font-black text-on-surface uppercase tracking-tight mb-2">
                {project.title}
              </h3>
              <p className="text-primary-container font-label text-[0.65rem] tracking-widest uppercase mb-6">
                {project.subtitle}
              </p>

              <p className="text-on-surface-variant font-body leading-relaxed mb-8">
                {project.description}
              </p>

              {/* Tools */}
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1.5 bg-surface-highest font-label text-[0.65rem] text-on-surface uppercase tracking-widest"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Specs */}
            <div className="lg:col-span-5">
              <div className="bg-surface-low p-6">
                <h4 className="font-label text-[0.6rem] uppercase tracking-[0.3em] text-outline mb-5 font-bold">
                  Especificaciones Técnicas
                </h4>
                <div className="space-y-4">
                  {project.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex justify-between items-baseline gap-4"
                    >
                      <span className="font-label text-[0.65rem] uppercase tracking-widest text-outline">
                        {spec.label}
                      </span>
                      <span className="font-headline font-bold text-sm text-on-surface">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-outline-variant/20 my-6" />

                <a
                  href="#contacto"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    setTimeout(() => {
                      document
                        .getElementById("contacto")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 300);
                  }}
                  className="w-full flex justify-between items-center bg-primary-container text-on-primary-container py-3.5 px-5 font-headline font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all duration-200"
                >
                  Consultar Proyecto
                  <span className="material-symbols-outlined text-[1rem]">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom corner accent */}
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary-container/20 pointer-events-none" />
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<FilterTab>("Infraestructura");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="portafolio" className="py-24 md:py-32 bg-surface">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-8">
        {/* Section label */}
        <div className="flex items-center gap-5 mb-12">
          <span className="h-px flex-1 bg-outline-variant/20" />
          <h2 className="text-[0.65rem] font-label font-bold tracking-[0.5em] text-outline uppercase">
            Proyectos Seleccionados
          </h2>
          <span className="h-px flex-1 bg-outline-variant/20" />
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-8 md:gap-12 mb-14 md:mb-16">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-label font-bold text-xs uppercase tracking-widest pb-2 transition-all duration-300 ${
                activeTab === tab
                  ? "text-primary-container border-b border-primary-container"
                  : "text-outline hover:text-on-surface"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Large card — 8 columns */}
          <div
            className="md:col-span-8 group relative overflow-hidden bg-surface-container h-72 md:h-[500px] cursor-pointer"
            onClick={() => setSelectedProject(projects[0])}
          >
            <ProjectImage src={projects[0].image} alt={projects[0].title}>
              <div className="absolute inset-0 bg-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </ProjectImage>

            {/* Gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-90" />

            {/* Content */}
            <div className="absolute bottom-8 left-8">
              <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 bg-surface-highest/80">
                <span className="text-[0.55rem] uppercase tracking-[0.3em] font-label text-outline">
                  {activeTab}
                </span>
              </div>
              <h4 className="text-2xl md:text-3xl font-headline font-black text-on-surface uppercase mb-2 tracking-tight">
                {projects[0].title}
              </h4>
              <p className="text-primary-container font-label text-[0.65rem] tracking-widest uppercase">
                {projects[0].subtitle}
              </p>
            </div>

            {/* View detail hint */}
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="material-symbols-outlined text-primary-container text-2xl">
                open_in_full
              </span>
            </div>

            {/* Top-right corner decoration */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary-container/20 group-hover:border-primary-container/50 transition-colors duration-500" />
          </div>

          {/* Right column — small cards */}
          <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
            {projects.slice(1).map((project) => (
              <div
                key={project.title}
                className="group relative overflow-hidden bg-surface-container flex-1 h-52 md:h-auto md:min-h-[232px] cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <ProjectImage src={project.image} alt={project.title}>
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${
                      project.tag === "Comercial"
                        ? "bg-primary-container/8"
                        : "bg-secondary/5"
                    }`}
                  />
                </ProjectImage>

                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-90" />

                <div className="absolute bottom-5 left-5">
                  <h4 className="text-lg font-headline font-bold text-on-surface uppercase tracking-tight mb-1">
                    {project.title}
                  </h4>
                  <span className="text-[0.6rem] text-outline font-label uppercase tracking-widest">
                    {project.subtitle}
                  </span>
                </div>

                {/* View detail hint */}
                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="material-symbols-outlined text-primary-container text-lg">
                    open_in_full
                  </span>
                </div>

                {/* Corner detail */}
                <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-outline-variant/30 group-hover:border-primary-container/30 transition-colors duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex justify-center">
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("contacto")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-3 border border-outline-variant/30 text-on-surface-variant px-8 py-3.5 font-label font-bold text-xs uppercase tracking-widest hover:border-primary-container/40 hover:text-primary hover:bg-primary-container/5 transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[1rem]">
              folder_open
            </span>
            Ver Portafolio Completo
          </a>
        </div>
      </div>

      {/* Project detail modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
