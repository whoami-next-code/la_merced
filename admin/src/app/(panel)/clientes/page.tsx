'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useApi } from '@/hooks/use-api';
import type { Customer } from '@/types';
import { PageHeader } from '@/components/admin/page-header';
import { DataTableShell } from '@/components/admin/data-table-shell';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminClientesPage() {
  const { api } = useApi();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', search],
    queryFn: async () => {
      const q = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
      const res = await api<{ data: Customer[] | null }>(`/customers${q}`);
      return res.data ?? [];
    },
  });

  const customers = data ?? [];

  return (
    <div className="admin-page-enter space-y-6">
      <PageHeader title="Clientes" description="Base de clientes registrados" />

      <div className="max-w-md space-y-2">
        <Label htmlFor="customer-search">Buscar cliente</Label>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id="customer-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre, email o teléfono…"
            className="pl-9"
            aria-label="Buscar por nombre, email o teléfono"
          />
        </div>
      </div>

      <DataTableShell
        title="Listado de clientes"
        isLoading={isLoading}
        actions={<Badge variant="outline">{customers.length} clientes</Badge>}
      >
        {customers.length ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead scope="col">Nombre</TableHead>
                <TableHead scope="col">Email</TableHead>
                <TableHead scope="col">Teléfono</TableHead>
                <TableHead scope="col">Documento</TableHead>
                <TableHead scope="col">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.full_name}</TableCell>
                  <TableCell>{c.email ?? '—'}</TableCell>
                  <TableCell>{c.phone ?? '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {c.document_type && c.document_number
                      ? `${c.document_type}: ${c.document_number}`
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.is_active ? 'default' : 'secondary'}>
                      {c.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">Sin clientes encontrados.</p>
        )}
      </DataTableShell>
    </div>
  );
}
