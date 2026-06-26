'use client';

import { AdminNavContent } from '@/components/admin/admin-nav-content';
import { AdminHeader } from '@/components/admin/admin-header';
import { SessionMonitor } from '@/components/admin/session-monitor';
import { ErrorReporter } from '@/components/admin/error-reporter';
import { CatalogPrefetch } from '@/components/admin/catalog-prefetch';

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <SessionMonitor />
      <ErrorReporter />
      <CatalogPrefetch />
      <aside
        className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col"
        aria-label="Barra lateral"
      >
        <AdminNavContent />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main
          id="main-content"
          className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
