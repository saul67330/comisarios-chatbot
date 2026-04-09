'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Book, Users, Disc, Share2, Phone, PhoneCall, MessageCircle, Send } from 'lucide-react';

export default function AboutPage() {
  const supabase = createClient();
  const [info, setInfo] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('band_info')
        .select('*')
        .order('category');
      setInfo(data || []);
    };
    load();
  }, [supabase]);

  // Helper to group items by category
  const groupedInfo = info.reduce((acc: any, curr: any) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  const renderSection = (title: string, category: string, IconComponent: React.ComponentType<any>) => {
    const items = groupedInfo[category];
    if (!items || items.length === 0) return null;

    return (
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-6 border-b border-outline-variant/10 pb-4">
          <IconComponent size={36} className="text-primary" />
          <h2 className="font-headline text-3xl font-extrabold text-on-surface italic">{title}</h2>
        </div>
        <div className="grid gap-6 grid-cols-1">
          {items.map((item: any) => (
            <div key={item.id} className={`bg-surface-container-low/40 backdrop-blur-xl border border-outline-variant/10 p-6 rounded-2xl ${category === 'contact' ? 'bg-gradient-to-br from-primary-container/20 to-surface-container-low/40 border-primary/30 flex flex-col items-center text-center py-10' : 'h-full'}`}>
              <h3 className={`font-bold uppercase tracking-widest mb-4 ${category === 'contact' ? 'text-primary text-xl' : 'text-primary text-xs'}`}>{item.title}</h3>
              {category === 'contact' ? (
                <div className="w-full">
                  <p className="text-on-surface text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap font-medium">{item.content}</p>
                  
                  <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
                    <a href="tel:8661488946" className="flex items-center justify-center gap-3 bg-surface-container-highest px-8 py-4 rounded-xl border border-outline-variant/20 hover:border-primary/50 transition-all font-bold text-lg hover:scale-105 text-on-surface">
                      <PhoneCall className="text-primary" size={24} />
                      866 148 8946
                    </a>
                    <Link href="/contratar" className="flex items-center justify-center gap-3 bg-[#D4AF37] text-[#131313] px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)]">
                      <Send size={24} />
                      Cotizar ahora
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-on-surface-variant text-sm whitespace-pre-wrap leading-relaxed">{item.content}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12">
      <div className="text-center mb-16 pt-[15vh]">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-4 italic drop-shadow-[0_10px_25px_rgba(0,0,0,1)]">Los Comisarios</h1>
        <p className="font-label text-sm md:text-base uppercase tracking-[0.4em] text-[#D4AF37] font-extrabold drop-shadow-[0_5px_15px_rgba(0,0,0,1)]">Nuestra Historia y Contacto</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderSection('Biografía', 'biography', Book)}
        {renderSection('Integrantes', 'members', Users)}
        {renderSection('Discografía', 'discography', Disc)}
        {renderSection('Redes Sociales', 'social_media', Share2)}
      </div>

      <div className="my-16 flex flex-col items-center justify-center text-center col-span-full">
        <h3 className="font-['Rye'] text-3xl text-primary mb-6 drop-shadow-md">Nuestra Esencia</h3>
        <div className="rounded-2xl overflow-hidden border-2 border-primary/30 shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-surface-container-low/40 backdrop-blur-xl w-full max-w-5xl hover:scale-[1.02] transition-transform duration-500">
          <img 
            src="https://kkqphhhejfgvdnycabqt.supabase.co/storage/v1/object/public/public_assets/real/cover.jpg" 
            alt="Comisarios Del Norte - Seguimos Adelante" 
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      <div className="mt-8 col-span-full w-full">
        {renderSection('Contacto y Contrataciones', 'contact', Phone)}
      </div>
    </div>
  );
}
