'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  event_type: string;
  event_date: string | null;
  location: string | null;
  guests: number | null;
  message: string | null;
  status: 'pending' | 'contacted' | 'confirmed' | 'rejected';
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  contacted: 'Contactado',
  confirmed: 'Confirmación',
  rejected: 'Rechazado',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-tertiary-container/20 text-tertiary border-tertiary/30',
  contacted: 'bg-primary-container/20 text-primary border-primary/30',
  confirmed: 'bg-surface-bright text-on-surface border-outline-variant/30',
  rejected: 'bg-error/20 text-error border-error/30',
};

export default function BookingsPage() {
  const supabase = createClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<Booking | null>(null);

  const load = async () => {
    const { data } = await supabase.from('booking_requests').select('*').order('created_at', { ascending: false });
    setBookings(data || []);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('booking_requests').update({ status }).eq('id', id);
    load();
    if (selected?.id === id) setSelected({ ...selected, status: status as Booking['status'] });
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface mb-2">Solicitudes de Contratación</h1>
        <p className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant font-bold">Gestión de Booking y Cotizaciones</p>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface-container-highest text-primary font-bold text-[10px] uppercase tracking-widest rounded-lg border border-primary/20">
            Todas ({bookings.length})
          </button>
          <button className="px-4 py-2 hover:bg-surface-container text-on-surface-variant font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors">
            Pendientes ({bookings.filter(b => b.status === 'pending').length})
          </button>
        </div>
        <div className="relative w-full md:w-64">
          <input type="text" placeholder="BUSCAR SOLICITUD..." className="w-full bg-surface-container border border-outline-variant/20 rounded-lg py-2 pl-10 pr-4 text-xs font-bold text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50" />
          <span className="material-symbols-outlined absolute left-3 top-2 text-on-surface-variant/50 text-sm">search</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-highest/30 backdrop-blur-md rounded-2xl border border-outline-variant/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container/50">
                <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Cliente / Evento</th>
                <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Fecha Solicitada</th>
                <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Ubicación</th>
                <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Estado</th>
                <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant text-sm">No hay solicitudes de contratación encontradas.</td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="border-b border-outline-variant/5 hover:bg-surface-container/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center font-headline italic font-bold text-primary shrink-0">
                          {b.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-on-surface">{b.name}</p>
                          <p className="text-[10px] text-on-surface-variant tracking-wider uppercase mt-0.5">{b.event_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-on-surface">{b.event_date ? fmt(b.event_date) : 'Por definir'}</p>
                      <p className="text-[10px] text-on-surface-variant tracking-wider uppercase mt-0.5">Recibido: {fmt(b.created_at)}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-on-surface font-medium truncate max-w-[150px]">{b.location || 'No especificada'}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${STATUS_STYLES[b.status]}`}>
                        <span className="w-1.5 h-1.5 rounded-full outline outline-1 outline-offset-1 bg-current"></span>
                        {STATUS_LABELS[b.status]}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setSelected(b)} className="px-4 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary-container rounded-lg font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-[0_5px_15px_rgba(212,175,55,0.2)]">
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View details */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#131313]/80 backdrop-blur-sm" onClick={() => setSelected(null)}></div>
          
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-start bg-surface-container-highest/30">
              <div>
                <h2 className="font-headline text-3xl font-bold text-primary italic mb-1">Solicitud de Cotización</h2>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">ID: {selected.id.split('-')[0]}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 flex-grow overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Contact Data */}
                <div>
                  <h3 className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-4 border-b border-primary/20 pb-2">Información de Contacto</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] uppercase text-on-surface-variant tracking-wider">Nombre Completo</p>
                      <p className="text-sm font-medium text-on-surface">{selected.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-on-surface-variant tracking-wider">Email</p>
                      <a href={`mailto:${selected.email}`} className="text-sm font-medium text-primary hover:underline">{selected.email}</a>
                    </div>
                    {selected.phone && (
                      <div>
                        <p className="text-[10px] uppercase text-on-surface-variant tracking-wider">Teléfono</p>
                        <a href={`tel:${selected.phone}`} className="text-sm font-medium text-primary hover:underline">{selected.phone}</a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Data */}
                <div>
                  <h3 className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-4 border-b border-primary/20 pb-2">Detalles del Evento</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] uppercase text-on-surface-variant tracking-wider">Tipo de Evento</p>
                      <p className="text-sm font-medium text-on-surface">{selected.event_type}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-on-surface-variant tracking-wider">Ubicación / Ciudad</p>
                      <p className="text-sm font-medium text-on-surface">{selected.location || 'No especificada'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] uppercase text-on-surface-variant tracking-wider">Fecha</p>
                        <p className="text-sm font-medium text-on-surface">{selected.event_date ? fmt(selected.event_date) : 'Por definir'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-on-surface-variant tracking-wider">Asistentes</p>
                        <p className="text-sm font-medium text-on-surface">{selected.guests ? `~${selected.guests}` : 'No definido'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selected.message && (
                <div className="mb-8">
                  <h3 className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-4 border-b border-primary/20 pb-2">Mensaje Adicional</h3>
                  <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/10 text-sm text-on-surface leading-relaxed">
                    "{selected.message}"
                  </div>
                </div>
              )}

              {/* Action Area */}
              <div className="bg-surface-bright p-5 rounded-xl border border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-[10px] uppercase text-on-surface-variant tracking-wider mb-1">Estado de la Solicitud</p>
                  <p className="text-xs font-bold text-on-surface">Actualizar progreso de la negociación</p>
                </div>
                <div className="flex gap-2">
                  <select 
                    className="bg-surface-container border border-outline-variant/20 rounded-lg py-2 px-4 text-xs font-bold text-on-surface focus:outline-none focus:border-primary/50 cursor-pointer"
                    value={selected.status}
                    onChange={(e) => updateStatus(selected.id, e.target.value)}
                  >
                    <option value="pending">Pendiente de Revisar</option>
                    <option value="contacted">Contactado (En negociación)</option>
                    <option value="confirmed">Confirmado (Agendado)</option>
                    <option value="rejected">Rechazado / Cancelado</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-surface-container-highest border-t border-outline-variant/10 flex justify-end gap-3">
              <button onClick={() => setSelected(null)} className="px-5 py-2 hover:bg-surface-container rounded-lg font-bold text-[10px] uppercase tracking-widest text-on-surface-variant transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
