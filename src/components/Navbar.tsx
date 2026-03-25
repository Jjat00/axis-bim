import { useState, useEffect, useRef, useCallback } from "react";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Portafolio", href: "#portafolio" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const mobileMenuRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Focus trap for mobile menu
  const handleMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!mobileOpen || e.key !== "Tab") return;
    const menu = mobileMenuRef.current;
    if (!menu) return;
    const focusable = menu.querySelectorAll<HTMLElement>("a, button");
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      // Focus first menu link when opened
      requestAnimationFrame(() => {
        const firstLink = mobileMenuRef.current?.querySelector<HTMLElement>("a");
        firstLink?.focus();
      });
    } else if (hamburgerRef.current && document.activeElement !== hamburgerRef.current) {
      // Return focus to hamburger when closed (only if focus was in menu)
      hamburgerRef.current.focus();
    }
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Determine active section
      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "glass-nav shadow-[0_20px_50px_rgba(0,240,255,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <a
          href="#inicio"
          onClick={(e) => handleNavClick(e, "#inicio")}
          className="text-xl md:text-2xl font-black tracking-tighter uppercase font-headline select-none"
        >
          <span className="text-on-surface">AXIS&nbsp;</span>
          <span className="text-primary-container">BIM</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`font-label text-[0.7rem] tracking-[0.25em] uppercase font-bold transition-colors duration-300 pb-1 focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                  isActive
                    ? "text-primary-container border-b border-primary-container"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#contacto"
            onClick={(e) => handleNavClick(e, "#contacto")}
            className="hidden md:inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2.5 font-headline font-bold text-xs uppercase tracking-widest hover:bg-surface-tint active:scale-95 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Agendar Consultoría
          </a>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-on-surface transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-on-surface transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-on-surface transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav ref={mobileMenuRef} onKeyDown={handleMenuKeyDown} className="glass-nav px-6 pt-2 pb-6 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`font-label text-xs tracking-[0.25em] uppercase font-bold py-3 px-2 border-b border-outline-variant/20 transition-colors ${
                  isActive
                    ? "text-primary-container"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href="#contacto"
            onClick={(e) => handleNavClick(e, "#contacto")}
            className="mt-4 inline-flex justify-center items-center gap-2 bg-primary-container text-on-primary-container px-5 py-3 font-headline font-bold text-xs uppercase tracking-widest"
          >
            Agendar Consultoría
          </a>
        </nav>
      </div>
    </header>
  );
}
