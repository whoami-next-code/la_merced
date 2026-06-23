'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useApi } from '@/hooks/use-api';
import type { Profile, UserRole } from '@/types';
import { PageHeader } from '@/components/admin/page-header';
import { DataTableShell } from '@/components/admin/data-table-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ROLES: UserRole[] = ['super_admin', 'admin', 'manager', 'seller', 'warehouse', 'customer'];

const roleLabels: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrador',
  manager: 'Gerente',
  seller: 'Vendedor',
  warehouse: 'Almacenero',
  customer: 'Cliente',
};

export default function AdminUsuariosPage() {
  const { api } = useApi();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api<{ data: Profile[] | null }>('/users');
      return res.data ?? [];
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
    onSuccess: () => {
      toast.success('Rol actualizado');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      api(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ is_active }) }),
    onSuccess: () => {
      toast.success('Estado actualizado');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="admin-page-enter space-y-6">
      <PageHeader title="Usuarios y roles" description="Gestión RBAC del personal" />

      <DataTableShell
        title="Listado de usuarios"
        isLoading={isLoading}
        actions={<Badge variant="outline">{users.length} usuarios</Badge>}
      >
        {users.length ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead scope="col">Nombre</TableHead>
                <TableHead scope="col">Email</TableHead>
                <TableHead scope="col">Rol</TableHead>
                <TableHead scope="col">Estado</TableHead>
                <TableHead scope="col" className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name ?? '—'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(role) => role && roleMutation.mutate({ id: user.id, role })}
                      disabled={roleMutation.isPending}
                    >
                      <SelectTrigger className="w-[160px]" aria-label={`Rol de ${user.email}`}>
                        <SelectValue>{roleLabels[user.role] ?? user.role}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.filter((r) => r !== 'customer').map((r) => (
                          <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? 'default' : 'secondary'}>
                      {user.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        statusMutation.mutate({ id: user.id, is_active: !user.is_active })
                      }
                      disabled={statusMutation.isPending}
                      aria-label={user.is_active ? `Desactivar ${user.email}` : `Activar ${user.email}`}
                    >
                      {user.is_active ? 'Desactivar' : 'Activar'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">Sin usuarios registrados.</p>
        )}
      </DataTableShell>
    </div>
  );
}
