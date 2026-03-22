export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-lowest border-t border-primary-container/10">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-8 md:py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="text-lg font-headline font-black uppercase tracking-tighter">
            <span className="text-on-surface">AXIS&nbsp;</span>
            <span className="text-primary-container">BIM</span>
          </div>

          {/* Copyright */}
          <p className="text-[0.6rem] tracking-[0.2em] font-label font-medium text-outline uppercase text-center">
            © {year} AXIS BIM. Todos los derechos reservados.
          </p>

          {/* Footer links */}
          <div className="flex items-center gap-6 md:gap-8">
            <a
              href="#"
              className="text-outline hover:text-primary-container transition-colors duration-300 text-[0.6rem] tracking-[0.2em] font-label font-medium uppercase"
            >
              Política de Privacidad
            </a>
            <span className="h-3 w-px bg-outline-variant/40 hidden md:block" />
            <a
              href="#"
              className="text-outline hover:text-primary-container transition-colors duration-300 text-[0.6rem] tracking-[0.2em] font-label font-medium uppercase"
            >
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
