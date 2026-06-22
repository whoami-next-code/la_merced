'use client';

import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/features/auth/schemas/auth.schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { ADMIN_ROUTES, STAFF_ROLES } from '@/constants/routes';
import { toast } from 'sonner';
import { Package } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/env';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? ADMIN_ROUTES.DASHBOARD;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    try {
      const supabase = createClient();
      const { data: authData, error } = await supabase.auth.signInWithPassword(data);
      if (error) {
        toast.error(error.message);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      const role =
        profile?.role ??
        (authData.user.app_metadata?.role as string | undefined);

      if (
        profileError?.message?.includes('profiles') ||
        (!profile && !role)
      ) {
        // Tabla profiles aún no migrada — usar rol de app_metadata del seed
      }

      if (!role || !STAFF_ROLES.includes(role as typeof STAFF_ROLES[number])) {
        await supabase.auth.signOut();
        toast.error('No tienes acceso al panel administrativo');
        return;
      }

      toast.success('Bienvenido al panel admin');
      router.push(redirect);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error && err.message.includes('fetch')
          ? 'No se pudo conectar con Supabase. Verifica admin/.env.local y reinicia el servidor (npm run dev).'
          : err instanceof Error
            ? err.message
            : 'Error de conexión';
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Correo</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Ingresando...' : 'Acceder al panel'}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Panel Administrativo</CardTitle>
          <CardDescription>Acceso exclusivo para personal autorizado</CardDescription>
        </CardHeader>
        <CardContent>
          {!isSupabaseConfigured() && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              Supabase no está configurado. Copia tus claves en <code className="text-xs">admin/.env.local</code> y reinicia el servidor.
            </div>
          )}
          <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando...</p>}>
            <AdminLoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
