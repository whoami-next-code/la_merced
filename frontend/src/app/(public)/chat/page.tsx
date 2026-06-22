'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { chatbotService } from '@/services/catalog.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy el asistente de La Merced PyK. Puedo ayudarte con productos, stock, pedidos y más.' },
  ]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => crypto.randomUUID());
  const [loading, setLoading] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const res = await chatbotService.send(msg, sessionId);
      setMessages((m) => [...m, { role: 'assistant', content: res.reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Servicio no disponible. Escríbenos por contacto.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Atención al cliente</h1>
      <p className="text-muted-foreground mb-6">Chat en línea — consultas sobre productos y pedidos</p>
      <Card className="flex flex-col h-[480px]">
        <CardHeader><CardTitle className="text-base">Asistente virtual</CardTitle></CardHeader>
        <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`rounded-lg px-4 py-2 text-sm max-w-[85%] ${m.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {m.content}
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe tu mensaje..." disabled={loading} />
            <Button type="submit" disabled={loading}>Enviar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
