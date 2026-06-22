import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactoPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Contacto</h1>
      <p className="text-muted-foreground mb-8">Estamos para atenderte</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: MapPin, title: 'Dirección', desc: 'Consultar en tienda física' },
          { icon: Phone, title: 'Teléfono', desc: 'Próximamente' },
          { icon: Mail, title: 'Correo', desc: 'info@lamerced.com' },
          { icon: Clock, title: 'Horario', desc: 'Lun–Sáb 9:00 a.m. – 8:00 p.m.' },
        ].map(({ icon: Icon, title, desc }) => (
          <Card key={title}>
            <CardContent className="flex gap-4 p-6">
              <Icon className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
