import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface FormState {
  nombre: string;
  empresa: string;
  email: string;
  mensaje: string;
}

const initialForm: FormState = {
  nombre: "",
  empresa: "",
  email: "",
  mensaje: "",
};

interface FloatFieldProps {
  id: keyof FormState;
  label: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  multiline?: boolean;
  rows?: number;
}

function FloatField({
  id,
  label,
  type = "text",
  value,
  onChange,
  multiline = false,
  rows = 4,
}: FloatFieldProps) {
  const autocompleteMap: Record<keyof FormState, string> = {
    nombre: "name",
    empresa: "organization",
    email: "email",
    mensaje: "off",
  };

  const sharedProps = {
    id,
    name: id,
    placeholder: label,
    value,
    onChange,
    autoComplete: autocompleteMap[id],
    className: "float-input",
  };

  return (
    <div className="float-input-group">
      {multiline ? (
        <textarea {...sharedProps} rows={rows} />
      ) : (
        <input {...sharedProps} type={type} />
      )}
      <label htmlFor={id} className="float-label">
        {label}
      </label>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".contact-title", {
          y: 30,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".contact-title",
            start: "top 85%",
          },
        });
        gsap.from(".contact-form-side", {
          x: -40,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".contact-grid",
            start: "top 80%",
          },
        });
        gsap.from(".contact-info-side", {
          x: 40,
          autoAlpha: 0,
          duration: 0.7,
          delay: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".contact-grid",
            start: "top 80%",
          },
        });
      });
    },
    { scope: containerRef }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder submit — hook to real backend later
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm(initialForm);
  };

  return (
    <section
      id="contacto"
      ref={containerRef}
      className="py-24 md:py-32 bg-surface relative"
    >
      {/* Blueprint grid accent */}
      <div className="absolute inset-0 blueprint-grid-subtle pointer-events-none opacity-60" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8">
        {/* Section header */}
        <div className="contact-title text-center mb-14 md:mb-20">
          <p className="text-primary-container font-label text-[0.65rem] tracking-[0.4em] uppercase font-bold mb-4">
            Contacto Directo
          </p>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface uppercase tracking-tighter mb-5">
            AGENDA TU CONSULTORÍA
          </h2>
          <div className="h-0.5 w-16 bg-primary-container mx-auto" />
        </div>

        {/* Two-column layout */}
        <div className="contact-grid grid grid-cols-1 md:grid-cols-2 gap-px bg-outline-variant/10 border border-outline-variant/10">
          {/* Left: Form */}
          <div className="contact-form-side bg-surface-low p-8 md:p-12">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 py-12">
                <span aria-hidden="true" className="material-symbols-outlined text-4xl text-primary-container">
                  check_circle
                </span>
                <p className="font-headline font-bold text-on-surface text-lg uppercase tracking-tight text-center">
                  Solicitud Enviada
                </p>
                <p className="font-body text-on-surface-variant text-sm text-center">
                  Nos pondremos en contacto dentro de las próximas 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <FloatField
                  id="nombre"
                  label="Nombre"
                  value={form.nombre}
                  onChange={handleChange}
                />
                <FloatField
                  id="empresa"
                  label="Empresa"
                  value={form.empresa}
                  onChange={handleChange}
                />
                <FloatField
                  id="email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
                <FloatField
                  id="mensaje"
                  label="Mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />

                <button
                  type="submit"
                  className="w-full bg-surface-highest text-on-surface py-4 font-headline font-bold uppercase tracking-widest text-sm hover:bg-primary-container hover:text-on-primary-container active:scale-95 transition-colors duration-300"
                >
                  Enviar Solicitud
                </button>
              </form>
            )}
          </div>

          {/* Right: Calendar / info */}
          <div className="contact-info-side bg-surface-container p-8 md:p-12 flex flex-col justify-between gap-10">
            <div>
              <h3 className="text-lg font-headline font-bold text-on-surface mb-2 uppercase tracking-tight">
                Acceso Directo
              </h3>
              <p className="text-on-surface-variant text-sm font-body leading-relaxed mb-8">
                Elige un slot para un análisis técnico con nuestro coordinador
                líder. Sin compromisos, sin intermediarios.
              </p>

              {/* Booking options */}
              <div className="space-y-3">
                <button type="button" className="w-full flex justify-between items-center p-4 bg-surface-high border border-primary-container/10 hover:border-primary-container cursor-pointer group transition-colors duration-300">
                  <div>
                    <p className="text-on-surface font-label text-sm uppercase font-bold tracking-wide group-hover:text-primary-container transition-colors">
                      15 Min Descubrimiento
                    </p>
                    <p className="text-outline text-[0.6rem] font-label tracking-widest uppercase mt-0.5">
                      Llamada inicial gratuita
                    </p>
                  </div>
                  <span aria-hidden="true" className="material-symbols-outlined text-primary-container text-xl">
                    calendar_today
                  </span>
                </button>

                <button type="button" className="w-full flex justify-between items-center p-4 bg-surface-high border border-primary-container/10 hover:border-primary-container cursor-pointer group transition-colors duration-300">
                  <div>
                    <p className="text-on-surface font-label text-sm uppercase font-bold tracking-wide group-hover:text-primary-container transition-colors">
                      45 Min Estrategia
                    </p>
                    <p className="text-outline text-[0.6rem] font-label tracking-widest uppercase mt-0.5">
                      Revisión técnica en profundidad
                    </p>
                  </div>
                  <span aria-hidden="true" className="material-symbols-outlined text-primary-container text-xl">
                    event
                  </span>
                </button>
              </div>
            </div>

            {/* Office locations */}
            <div className="pt-6 border-t border-outline-variant/20">
              <p className="text-[0.6rem] text-outline/60 font-label uppercase tracking-widest mb-2">
                Presencia Global
              </p>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="material-symbols-outlined text-outline/40 text-base">
                  location_on
                </span>
                <p className="text-sm text-on-surface-variant font-label tracking-widest uppercase">
                  COLOMBIA · ESPAÑA · USA
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
