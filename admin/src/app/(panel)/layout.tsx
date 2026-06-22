'use client';

import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex h-14 items-center border-b bg-white px-6 md:hidden">
          <span className="font-semibold text-sm">Panel Administrativo</span>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
