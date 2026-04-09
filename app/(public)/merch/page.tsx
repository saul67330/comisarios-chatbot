'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Store } from 'lucide-react';

export default function MerchPage() {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('merchandise')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });
      setItems(data || []);
    };
    load();
  }, [supabase]);

  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-12">
      <div className="text-center mb-16 pt-[15vh]">
        <h1 className="font-['Rye'] text-5xl md:text-7xl font-bold text-white tracking-widest mb-4 drop-shadow-[0_10px_25px_rgba(0,0,0,1)]">Tienda Oficial</h1>
        <p className="font-label text-sm md:text-base uppercase tracking-[0.4em] text-[#D4AF37] font-extrabold drop-shadow-[0_5px_15px_rgba(0,0,0,1)]">Lleva el estilo de la frontera contigo</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low/40 backdrop-blur-md rounded-3xl border border-outline-variant/10 flex flex-col items-center">
          <Store size={64} className="text-primary/20 mb-4" />
          <p className="text-on-surface-variant font-medium">Próximamente nueva mercancía...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="group flex flex-col bg-[#131313]/60 backdrop-blur-xl border border-outline-variant/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl">
              {/* Product Image */}
              <div className="relative aspect-square bg-surface-container overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-container-high overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" alt="Merch" className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-on-surface-variant font-label text-xs uppercase tracking-widest bg-[#131313]/60 px-3 py-1 rounded backdrop-blur-sm">Sin Foto</span>
                    </div>
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#131313] to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 font-headline text-2xl font-black italic text-[#D4AF37] drop-shadow-lg">
                  ${item.price} MXN
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-headline font-bold text-on-surface mb-2 tracking-tight group-hover:text-primary transition-colors">{item.name}</h3>
                <p className="text-sm text-on-surface-variant flex-grow mb-6 line-clamp-3">{item.description}</p>
                <a
                  href={item.purchase_url || '#'}
                  target="_blank"
                  className="block w-full text-center bg-gradient-to-tr from-[#D4AF37] to-[#f2ca50] text-[#131313] px-6 py-3 rounded-xl font-label font-bold text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 shadow-lg transition-transform"
                >
                  Comprar Ahora
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
