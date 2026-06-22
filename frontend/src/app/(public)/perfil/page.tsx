'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PUBLIC_ROUTES } from '@/constants/routes';
import type { Profile } from '@/types';

export default function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    createClient()
      .from('profiles')
      .select('*')
      .single()
      .then(({ data }) => setProfile(data));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Mi perfil</h1>
      <Card>
        <CardHeader><CardTitle>Datos personales</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p><strong>Nombre:</strong> {profile?.full_name ?? '—'}</p>
          <p><strong>Correo:</strong> {profile?.email ?? '—'}</p>
          <p><strong>Teléfono:</strong> {profile?.phone ?? '—'}</p>
        </CardContent>
      </Card>
      <div className="mt-6 flex gap-3">
        <Link href={PUBLIC_ROUTES.ORDERS}><Button variant="outline">Mis pedidos</Button></Link>
        <Link href={PUBLIC_ROUTES.FAVORITES}><Button variant="outline">Favoritos</Button></Link>
      </div>
    </div>
  );
}
