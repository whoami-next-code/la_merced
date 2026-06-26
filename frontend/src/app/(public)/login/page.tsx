'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/features/auth/schemas/auth.schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { toast } from 'sonner';
import { useApi } from '@/hooks/use-api';

function LoginForm({ redirect }: { redirect: string }) {
  const router = useRouter();
  const { api } = useApi();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    const email = data.email.trim().toLowerCase();
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: data.password,
    });
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Bienvenido de nuevo');
    router.push(redirect);
    router.refresh();

    void api('/auth/complete-profile', { method: 'POST', body: JSON.stringify({}) }).catch(() => {
      // Perfil ya existente o backend no disponible — no bloquea el login
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          type="text"
          inputMode="email"
          autoComplete="email"
          placeholder="usuario@ejemplo.com"
          {...register('email')}
        />
        {errors.email ? (
          <p className="text-sm text-destructive" role="alert">{errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
        {errors.password ? (
          <p className="text-sm text-destructive" role="alert">{errors.password.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  const [redirect, setRedirect] = useState(PUBLIC_ROUTES.PROFILE);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('redirect');
    if (value) setRedirect(value);
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Accede a tu cuenta para comprar y ver tus pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm redirect={redirect} />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link href={PUBLIC_ROUTES.RECOVER_PASSWORD} className="text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link href={PUBLIC_ROUTES.REGISTER} className="text-primary hover:underline">
              Regístrate y obtén 10% OFF
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
