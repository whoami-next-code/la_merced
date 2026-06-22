'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('¡Gracias! Te avisaremos sobre ofertas exclusivas.');
    setEmail('');
  }

  return (
    <section className="relative overflow-hidden bg-accent py-16 md:py-20">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white blur-3xl" />
      </div>
      <div className="container relative mx-auto px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-foreground/70">
          Ofertas exclusivas
        </p>
        <h2 className="section-heading mt-3 text-accent-foreground">
          Obtén hasta 10% de descuento
        </h2>
        <p className="mx-auto mt-4 max-w-md text-accent-foreground/80">
          Suscríbete y recibe novedades, promociones y lanzamientos de calzado y ropa.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            required
            className="flex-1 border-2 border-accent-foreground/20 bg-white/10 px-4 py-3 text-sm text-accent-foreground placeholder:text-accent-foreground/50 backdrop-blur focus:border-accent-foreground focus:outline-none"
          />
          <button
            type="submit"
            className="border-2 border-accent-foreground bg-accent-foreground px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent transition hover:bg-transparent hover:text-accent-foreground"
          >
            Suscribirme
          </button>
        </form>
      </div>
    </section>
  );
}
