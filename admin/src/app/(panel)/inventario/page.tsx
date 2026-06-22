function AdminPlaceholder({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{desc}</p>
      </div>
      <div className="rounded-lg border bg-white p-8 text-sm text-muted-foreground">
        Módulo en desarrollo — Sprint 2 del roadmap SCRUM.
      </div>
    </div>
  );
}

export default function AdminInventarioPage() {
  return <AdminPlaceholder title="Inventario" desc="Movimientos de almacén y alertas de stock" />;
}
