import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".video-header", {
          y: 40,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".video-header",
            start: "top 85%",
          },
        });
        gsap.from(".video-container", {
          y: 50,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".video-container",
            start: "top 80%",
          },
        });
      });
    },
    { scope: containerRef }
  );

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-32 bg-surface-lowest relative overflow-hidden"
    >
      <div className="absolute inset-0 blueprint-grid-subtle pointer-events-none" />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="video-header flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-8">
          <div className="max-w-xl">
            <p className="text-secondary font-label text-[0.65rem] tracking-[0.4em] uppercase font-bold mb-4 block">
              Showreel
            </p>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tighter">
              NUESTRO TRABAJO
            </h2>
          </div>
          <div className="font-label text-outline text-xs tracking-tighter hidden md:block">
            AXIS_REEL_2026
          </div>
        </div>

        {/* Video */}
        <div className="video-container relative aspect-video bg-surface-container overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-primary-container/30 z-20 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-primary-container/30 z-20 pointer-events-none" />

          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster="/images/video-poster.jpg"
            controls={isPlaying}
            playsInline
            preload="none"
            onEnded={() => setIsPlaying(false)}
          >
            <source src="/videos/showreel.mp4" type="video/mp4" />
          </video>

          {/* Play button overlay */}
          {!isPlaying && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 z-10 flex items-center justify-center group cursor-pointer"
              aria-label="Reproducir video showreel"
            >
              {/* Dimmed background */}
              <div className="absolute inset-0 bg-surface/40" />

              {/* Play button */}
              <div className="relative flex flex-col items-center gap-4">
                <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border-2 border-primary-container/60 group-hover:border-primary-container group-hover:bg-primary-container/10 transition-all duration-300">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-primary-container text-4xl md:text-5xl ml-1"
                    style={{
                      fontVariationSettings: "'FILL' 1, 'wght' 400, 'opsz' 48",
                    }}
                  >
                    play_arrow
                  </span>
                </div>
                <span className="text-[0.65rem] font-label font-bold uppercase tracking-[0.3em] text-on-surface-variant group-hover:text-primary-container transition-colors duration-300">
                  Reproducir Showreel
                </span>
              </div>
            </button>
          )}

          {/* Tech label */}
          <div className="absolute bottom-3 left-3 font-label text-[0.5rem] tracking-[0.3em] uppercase text-outline/40 pointer-events-none z-20">
            AXIS_SHOWREEL
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-outline-variant/10">
          {[
            { value: "50+", label: "Proyectos coordinados" },
            { value: "120K+", label: "m² modelados" },
            { value: "3", label: "Países" },
            { value: "98%", label: "Clientes satisfechos" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-container px-6 py-5 text-center"
            >
              <div className="text-xl md:text-2xl font-headline font-black text-primary-container mb-1">
                {stat.value}
              </div>
              <div className="text-[0.55rem] uppercase tracking-widest text-outline font-label">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
