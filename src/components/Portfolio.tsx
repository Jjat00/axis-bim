import { useState } from "react";

type FilterTab = "Infraestructura" | "Comercial" | "Institucional";

const tabs: FilterTab[] = ["Infraestructura", "Comercial", "Institucional"];

interface Project {
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  size: "large" | "small";
}

const projects: Project[] = [
  {
    title: "INFRAESTRUCTURA VIAL",
    subtitle: "LOD 400 | Coordinación Multidisciplinar",
    tag: "Infraestructura",
    image: "/images/portfolio-infra.png",
    size: "large",
  },
  {
    title: "RETAIL COMERCIAL",
    subtitle: "Diseño Interior",
    tag: "Comercial",
    image: "/images/portfolio-commercial.png",
    size: "small",
  },
  {
    title: "EQUIPAMIENTO URBANO",
    subtitle: "Integración MEP",
    tag: "Institucional",
    image: "/images/portfolio-institutional.png",
    size: "small",
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

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<FilterTab>("Infraestructura");

  return (
    <section
      id="portafolio"
      className="py-24 md:py-32 bg-surface"
    >
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
          <div className="md:col-span-8 group relative overflow-hidden bg-surface-container h-72 md:h-[500px]">
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

            {/* Top-right corner decoration */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary-container/20 group-hover:border-primary-container/50 transition-colors duration-500" />
          </div>

          {/* Right column — small cards */}
          <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
            {projects.slice(1).map((project) => (
              <div
                key={project.title}
                className="group relative overflow-hidden bg-surface-container flex-1 h-52 md:h-auto md:min-h-[232px]"
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
    </section>
  );
}
