import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';

@Injectable()
export class ChatbotService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async chat(message: string, sessionId: string) {
    const lowerMessage = message.toLowerCase();

    let response = 'Gracias por contactar a Multiservicios La Merced PyK. ¿En qué puedo ayudarte?';

    if (lowerMessage.includes('pedido') || lowerMessage.includes('orden')) {
      response =
        'Para consultar tu pedido, proporciona tu número de orden (ej: P-20250621-00001). También puedes visitar la sección "Mis Pedidos" en nuestra web.';
    } else if (lowerMessage.includes('producto') || lowerMessage.includes('zapato') || lowerMessage.includes('ropa')) {
      const { data: products } = await this.supabase
        .from('products')
        .select('name, sale_price, stock_quantity')
        .eq('is_active', true)
        .limit(5);

      if (products?.length) {
        response = 'Estos son algunos productos disponibles:\n' +
          products.map((p) => `• ${p.name} — S/ ${p.sale_price} (Stock: ${p.stock_quantity})`).join('\n');
      } else {
        response = 'Tenemos calzado, ropa y accesorios. Visita nuestro catálogo en la web para ver todos los productos.';
      }
    } else if (lowerMessage.includes('horario') || lowerMessage.includes('atención')) {
      response = 'Atendemos de lunes a sábado de 9:00 a.m. a 8:00 p.m.';
    } else if (lowerMessage.includes('pago') || lowerMessage.includes('yape') || lowerMessage.includes('plin')) {
      response = 'Aceptamos efectivo, tarjetas, Yape, Plin y transferencias bancarias.';
    } else {
      const { data: faq } = await this.supabase
        .from('faq_entries')
        .select('answer')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (faq) response = faq.answer;
    }

    const { data: conversation } = await this.supabase
      .from('chat_conversations')
      .upsert({ session_id: sessionId, channel: 'web' }, { onConflict: 'session_id' })
      .select()
      .single();

    if (conversation) {
      await this.supabase.from('chat_messages').insert([
        { conversation_id: conversation.id, role: 'user', content: message },
        { conversation_id: conversation.id, role: 'assistant', content: response },
      ]);
    }

    return { reply: response, sessionId };
  }

  getFaq() {
    return this.supabase.from('faq_entries').select('*').eq('is_active', true).order('sort_order');
  }

  findAllFaqAdmin() {
    return this.supabase.from('faq_entries').select('*').order('sort_order');
  }

  createFaq(body: { question: string; answer: string; category?: string; keywords?: string[] }) {
    return this.supabase.from('faq_entries').insert(body).select().single();
  }

  updateFaq(id: string, body: Record<string, unknown>) {
    return this.supabase.from('faq_entries').update(body).eq('id', id).select().single();
  }

  deleteFaq(id: string) {
    return this.supabase.from('faq_entries').delete().eq('id', id);
  }
}
