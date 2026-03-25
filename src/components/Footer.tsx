import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Footer() {
  const year = new Date().getFullYear();
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".footer-content", {
          y: 20,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".footer-content",
            start: "top 90%",
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <footer ref={containerRef} className="bg-surface-lowest border-t border-secondary/15">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-8 md:py-10">
        <div className="footer-content flex flex-col md:flex-row justify-between items-center gap-6">
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
