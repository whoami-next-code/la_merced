'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { chatbotService } from '@/services/catalog.service';

export default function AdminChatbotPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => crypto.randomUUID());

  async function testChat(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: msg }]);
    const res = await chatbotService.send(msg, sessionId);
    setMessages((m) => [...m, { role: 'assistant', content: res.reply }]);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Chat Bot</h1>
        <p className="text-muted-foreground">Gestión del asistente virtual y FAQ</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Probar respuestas</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`text-sm rounded p-2 ${m.role === 'user' ? 'bg-blue-50' : 'bg-muted'}`}>
                {m.content}
              </div>
            ))}
          </div>
          <form onSubmit={testChat} className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Mensaje de prueba..." />
            <Button type="submit">Probar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
