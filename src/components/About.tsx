const capabilities = [
  { num: "01", label: "Gerencia Estratégica de Proyectos" },
  { num: "02", label: "Coordinación y Detección de Interferencias" },
  { num: "03", label: "Estándares de Entrega Global" },
];

export default function About() {
  return (
    <section
      id="nosotros"
      className="py-24 md:py-32 relative bg-surface-lowest overflow-hidden"
    >
      {/* Watermark text */}
      <div className="absolute -right-8 md:-right-20 top-1/2 -translate-y-1/2 text-[8rem] md:text-[14rem] font-headline font-black text-on-surface/[0.015] select-none pointer-events-none leading-none rotate-90 md:rotate-0">
        EXPERTISE
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 blueprint-grid-subtle pointer-events-none" />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Visual column */}
          <div className="relative order-2 lg:order-1">
            {/* Main image / placeholder */}
            <div className="w-full aspect-[4/5] bg-surface-high relative overflow-hidden">
              <img
                src="/images/director.png"
                alt="Director de Proyectos BIM"
                className="w-full h-full object-cover grayscale opacity-80"
                loading="lazy"
              />

              {/* Technical label in corner */}
              <div className="absolute top-4 left-4 font-label text-[0.55rem] tracking-[0.3em] uppercase text-primary-container/30">
                AXIS_DIR_001
              </div>
            </div>

            {/* Floating glass badge */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 glass-panel p-6 md:p-8 border border-on-surface/10 shadow-[0_20px_50px_rgba(0,240,255,0.06)] z-10">
              <div className="text-4xl md:text-5xl font-headline font-black text-primary-container mb-1 leading-none">
                07
              </div>
              <div className="text-[0.6rem] md:text-[0.65rem] font-label font-bold tracking-[0.2em] text-on-surface uppercase leading-tight">
                Años de<br />Experiencia
              </div>
            </div>

            {/* Corner top-left decoration */}
            <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-outline-variant/30" />
          </div>

          {/* Right: Text column */}
          <div className="order-1 lg:order-2">
            {/* Section label */}
            <p className="text-secondary font-label text-[0.65rem] tracking-[0.4em] uppercase font-bold mb-6 block">
              Nuestro Equipo
            </p>

            <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface mb-8 leading-tight tracking-tighter">
              DIRECCIÓN DE PROYECTOS
            </h2>

            <p className="text-base md:text-lg text-on-surface-variant font-body leading-relaxed mb-10 max-w-lg">
              Nuestro Director de Proyectos cuenta con más de 7 años de
              experiencia en gerencia y coordinación BIM. Lideramos un equipo
              multidisciplinario que escala la producción técnica de tu proyecto
              desde Colombia, con estándares internacionales.
            </p>

            {/* Capabilities list */}
            <div className="space-y-4">
              {capabilities.map((cap) => (
                <div
                  key={cap.num}
                  className="flex items-center gap-5 group cursor-default"
                >
                  {/* Number badge */}
                  <span className="flex-shrink-0 w-11 h-11 flex items-center justify-center border border-primary-container/30 text-primary-container font-headline font-bold text-sm group-hover:bg-primary-container group-hover:text-on-primary-container transition-all duration-300">
                    {cap.num}
                  </span>
                  {/* Label */}
                  <span className="text-on-surface font-label font-bold text-xs md:text-sm tracking-widest uppercase group-hover:text-primary-container transition-colors duration-300">
                    {cap.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Technical metadata row */}
            <div className="mt-10 flex items-center gap-4">
              <div className="h-px w-8 bg-primary-container/30" />
              <span className="font-label text-[0.6rem] text-outline/60 uppercase tracking-[0.25em]">
                Colombia · España · USA
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
