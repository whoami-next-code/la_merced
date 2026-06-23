'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Nombre requerido'),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: '', phone: '' },
  });

  useEffect(() => {
    createClient()
      .from('profiles')
      .select('*')
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          form.reset({ full_name: data.full_name ?? '', phone: data.phone ?? '' });
        }
      });
  }, [form]);

  async function onSubmit(values: ProfileForm) {
    if (!profile) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: values.full_name, phone: values.phone || null })
      .eq('id', profile.id);

    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Perfil actualizado');
    setProfile((p) => (p ? { ...p, ...values } : p));
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Mi perfil</h1>

      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" value={profile?.email ?? ''} disabled aria-readonly="true" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre completo</Label>
              <Input id="full_name" {...form.register('full_name')} aria-invalid={!!form.formState.errors.full_name} />
              {form.formState.errors.full_name ? (
                <p className="text-sm text-destructive" role="alert">{form.formState.errors.full_name.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" type="tel" {...form.register('phone')} />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={PUBLIC_ROUTES.ORDERS}><Button variant="outline">Mis pedidos</Button></Link>
        <Link href={PUBLIC_ROUTES.FAVORITES}><Button variant="outline">Favoritos</Button></Link>
        <Link href={PUBLIC_ROUTES.RECOVER_PASSWORD} className={cn(buttonVariants({ variant: 'ghost' }))}>
          Cambiar contraseña
        </Link>
      </div>
    </div>
  );
}
