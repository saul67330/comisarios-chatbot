'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Calendar, MapPin, Ticket } from 'lucide-react';

export default function TourPage() {
  const supabase = createClient();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true });
      setEvents(data || []);
    };
    load();
  }, [supabase]);

  const fmtDate = (d: string) => {
    const date = new Date(d);
    return {
      day: date.toLocaleDateString('es-MX', { day: '2-digit' }),
      month: date.toLocaleDateString('es-MX', { month: 'short' }).toUpperCase(),
      time: date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-6 py-12">
      <div className="text-center mb-16 pt-[15vh]">
        <h1 className="font-['Rye'] text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight sm:tracking-widest mb-4 drop-shadow-[0_10px_25px_rgba(0,0,0,1)]">Fechas Oficiales</h1>
        <p className="font-label text-sm md:text-base uppercase tracking-[0.4em] text-[#D4AF37] font-extrabold drop-shadow-[0_5px_15px_rgba(0,0,0,1)]">Próximos bailes y presentaciones</p>
      </div>

      <div className="space-y-6">
        {events.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-low/40 backdrop-blur-md rounded-3xl border border-outline-variant/10 flex flex-col items-center">
            <Calendar size={64} className="text-primary/20 mb-4" />
            <p className="text-on-surface-variant font-medium">Próximamente más fechas por confirmar...</p>
          </div>
        ) : (
          events.map((event) => {
            const date = event.date ? fmtDate(event.date) : null;
            return (
              <div key={event.id} className="group relative bg-[#131313]/60 backdrop-blur-xl border border-outline-variant/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/5 to-[#D4AF37]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
                  
                  {/* Date Block */}
                  <div className="flex flex-col items-center justify-center min-w-[100px] shrink-0">
                    {date ? (
                      <>
                        <span className="text-sm font-label text-primary uppercase tracking-widest font-bold">{date.month}</span>
                        <span className="text-5xl font-headline font-black text-on-surface -mt-1 -mb-1">{date.day}</span>
                        <span className="text-xs font-label text-on-surface-variant uppercase tracking-wider">{date.time} hrs</span>
                      </>
                    ) : (
                      <span className="text-sm font-label text-primary uppercase tracking-widest font-bold">TBA</span>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="flex-grow text-center md:text-left border-t md:border-t-0 md:border-l border-outline-variant/10 pt-6 md:pt-0 md:pl-8">
                    <h3 className="text-2xl font-headline font-bold text-on-surface italic mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-on-surface-variant text-sm mb-1 line-clamp-2">{event.description || 'Sin descripción adicional.'}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                      <div className="flex items-center gap-1.5 text-xs font-label uppercase tracking-wider text-on-surface opacity-80">
                        <MapPin size={16} className="text-primary" />
                        {event.location}, {event.city}
                      </div>
                      {event.price && (
                        <div className="flex items-center gap-1.5 text-xs font-label uppercase tracking-wider text-on-surface opacity-80">
                          <Ticket size={16} className="text-primary" />
                          {event.price}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                    <button className="w-full md:w-auto bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface px-8 py-3 rounded-xl font-label font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg">
                      Tickets
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
