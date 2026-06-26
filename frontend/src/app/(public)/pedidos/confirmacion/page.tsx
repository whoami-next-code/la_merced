'use client';

import { Suspense } from 'react';
import { ConfirmacionContent } from './confirmacion-content';

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Cargando comprobante…
      </div>
    }>
      <ConfirmacionContent />
    </Suspense>
  );
}
