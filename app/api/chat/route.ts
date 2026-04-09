import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 30;

async function getContext(supabase: Awaited<ReturnType<typeof createClient>>) {
  const now = new Date().toISOString();

  const [eventsRes, merchRes, bandInfoRes] = await Promise.all([
    supabase
      .from('events')
      .select('title, date, location, city, price, description')
      .gte('date', now)
      .eq('is_active', true)
      .order('date', { ascending: true })
      .limit(10),
    supabase
      .from('merchandise')
      .select('name, description, price')
      .eq('is_available', true),
    supabase
      .from('band_info')
      .select('category, title, content'),
  ]);

  let context = '';

  if (bandInfoRes.data?.length) {
    context += '=== INFORMACIÓN DEL GRUPO ===\n';
    bandInfoRes.data.forEach((info) => {
      context += `${info.title}: ${info.content}\n`;
    });
  }

  if (eventsRes.data?.length) {
    context += '\n=== PRÓXIMOS EVENTOS ===\n';
    eventsRes.data.forEach((event) => {
      const date = new Date(event.date).toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      context += `• ${event.title} — ${date} — ${event.location}, ${event.city} — ${event.price || 'Precio por confirmar'}\n`;
      if (event.description) context += `  ${event.description}\n`;
    });
  } else {
    context += '\n=== PRÓXIMOS EVENTOS ===\nNo hay eventos próximos programados por el momento.\n';
  }

  if (merchRes.data?.length) {
    context += '\n=== MERCANCÍA DISPONIBLE ===\n';
    merchRes.data.forEach((item) => {
      context += `• ${item.name} — $${item.price} MXN — ${item.description || ''}\n`;
    });
  }

  return context;
}

const SYSTEM_PROMPT = `Eres el asistente virtual oficial de "Comisarios Del Norte", un grupo de música norteña y regional mexicano.

Tu personalidad:
- Eres una persona de administración/management contestando a los fans o clientes.
- Tu tono es profesional, humano, cálido y conciso.
- Tienes orgullo norteño pero sin exagerar modismos.

Tu trabajo es ayudar a los fans y clientes con:
- Eventos: Informar sobre próximos shows, fechas, lugares y precios.
- Contrataciones: Si alguien pregunta por precios, disponibilidad para eventos privados (bodas, XV, etc) o cómo contratarlos, SIEMPRE diles que para darles una cotización formal deben llenar el formulario en la página de Contrataciones (puedes mencionar la dirección: /contratar). Explícales que ahí pondrán los datos de su evento y les llegará directo al WhatsApp de la oficina.
- Mercancía: Informar sobre productos disponibles.
- Info del grupo: Biografía, integrantes y música.

Reglas ESTRICTAS de Formato:
- NUNCA uses formato Markdown. NO uses asteriscos (*) ni letras en negrita ni listas con viñetas complejas.
- Responde como si enviaras un mensaje de texto normal (WhatsApp o SMS). Escribe en párrafos naturales.
- Responde siempre en español.
- Sé conciso pero sumamente atento en tus respuestas.
- No inventes información. Si no sabes algo, invita amablemente a contactar por mensaje directo en Facebook.

A continuación se te proporcionará la información actualizada del grupo para responder:`;

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = await createClient();
  const context = await getContext(supabase);

  // Support both v5 (messages array) and v6 (UIMessages with parts) formats
  const messages = body.messages?.map((msg: { role: string; content?: string; parts?: Array<{ type: string; text: string }> }) => ({
    role: msg.role,
    content: msg.content || msg.parts?.filter((p: { type: string }) => p.type === 'text').map((p: { text: string }) => p.text).join('') || '',
  })) || [];

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: `${SYSTEM_PROMPT}\n\n${context}`,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
