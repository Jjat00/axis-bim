export default function Hero() {
  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPortfolio = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("portafolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        {/* Hero image with graceful fallback */}
        <img
          src="/images/hero-bg.png"
          alt="BIM coordination model"
          className="w-full h-full object-cover opacity-25 grayscale"
          loading="eager"
        />

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-transparent to-surface" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/60 via-transparent to-transparent" />

        {/* Blueprint grid */}
        <div className="absolute inset-0 blueprint-grid opacity-25" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-5rem)]">
          {/* Left: Main headline block */}
          <div className="lg:col-span-7 flex flex-col justify-center py-20 lg:py-0">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-3 self-start px-4 py-1.5 bg-surface-container border border-primary-container/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
              <span className="text-[0.6rem] uppercase tracking-[0.35em] font-headline text-primary-container font-semibold">
                Virtual Design &amp; BIM Coordination
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-headline font-black leading-none tracking-tighter text-on-surface mb-8">
              <span className="block text-5xl sm:text-6xl md:text-7xl xl:text-8xl">
                DISEÑO VIRTUAL
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-primary-container mt-1">
                &amp; COORDINACIÓN
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl xl:text-8xl mt-1">
                BIM
              </span>
            </h1>

            {/* Divider + subtitle */}
            <div className="flex items-start gap-5 mb-10 max-w-xl">
              <div className="flex-shrink-0 mt-2 h-px w-16 bg-primary-container/50" />
              <p className="text-base md:text-lg font-body text-on-surface-variant leading-relaxed">
                Reducimos costos y eliminamos errores en obra mediante
                coordinación BIM multidisciplinar. Tu equipo técnico
                especializado en Archicad y Revit.
              </p>
            </div>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contacto"
                onClick={scrollToContact}
                className="inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary-container px-7 py-3.5 font-headline font-bold text-sm uppercase tracking-widest hover:bg-surface-tint active:scale-95 transition-all duration-200"
              >
                Agendar Consultoría
                <span className="material-symbols-outlined text-[1.1rem]">
                  arrow_forward
                </span>
              </a>
              <a
                href="#portafolio"
                onClick={scrollToPortfolio}
                className="inline-flex items-center justify-center gap-2 border border-outline-variant/40 text-on-surface px-7 py-3.5 font-headline font-bold text-sm uppercase tracking-widest hover:bg-primary-container/5 hover:border-primary-container/30 active:scale-95 transition-all duration-200"
              >
                Ver Portafolio
              </a>
            </div>
          </div>

          {/* Right: Glass info panel */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end py-8 lg:py-0">
            <div className="relative w-full max-w-md">
              {/* Corner accent decoration */}
              <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-primary-container/40 pointer-events-none z-10" />
              <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b border-l border-outline-variant/30 pointer-events-none z-10" />

              <div className="glass-panel p-8 md:p-10 border-l-2 border-primary-container/30 shadow-[0_20px_50px_rgba(0,240,255,0.05)]">
                {/* Tag */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[0.6rem] uppercase tracking-[0.3em] font-headline text-outline font-semibold">
                    Ref: AXIS_BIM_01
                  </span>
                  <span className="text-[0.6rem] uppercase tracking-[0.3em] font-headline text-primary-container/60">
                    Auth: COL
                  </span>
                </div>

                <h2 className="text-xl font-headline font-bold text-on-surface mb-3 uppercase tracking-tight">
                  Identidad del Sistema
                </h2>
                <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-8">
                  Desplegamos flujos de coordinación avanzados para
                  infraestructura y sector comercial a gran escala. Nuestro
                  enfoque elimina colisiones antes de que se coloque la primera
                  piedra.
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-px bg-outline-variant/10 mb-8">
                  {[
                    { value: "07+", label: "Años" },
                    { value: "LOD 400", label: "Estándar" },
                    { value: "3D", label: "Coord." },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-surface-container px-4 py-3 text-center"
                    >
                      <div className="text-base font-headline font-black text-primary-container">
                        {stat.value}
                      </div>
                      <div className="text-[0.55rem] uppercase tracking-widest text-outline font-label">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="#contacto"
                  onClick={scrollToContact}
                  className="w-full flex justify-between items-center bg-primary-container text-on-primary-container py-4 px-6 font-headline font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all duration-200"
                >
                  Iniciar Auditoría Técnica
                  <span className="material-symbols-outlined text-[1.1rem]">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[0.55rem] uppercase tracking-[0.3em] font-label text-outline">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-primary-container/60 to-transparent" />
      </div>
    </section>
  );
}
