'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  city: string;
  price: string | null;
  description: string | null;
  is_active: boolean;
}

const EMPTY: Omit<Event, 'id'> = {
  title: '', date: '', location: '', city: '', price: '', description: '', is_active: true,
};

export default function EventsPage() {
  const supabase = createClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState(EMPTY);

  const load = async () => {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
    setEvents(data || []);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (e: Event) => {
    setEditing(e);
    setForm({ ...e, date: e.date ? e.date.slice(0, 16) : '' });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await supabase.from('events').update(form).eq('id', editing.id);
    } else {
      await supabase.from('events').insert(form);
    }
    setShowModal(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este evento definitivamente?')) {
      await supabase.from('events').delete().eq('id', id);
      load();
    }
  };

  const fmt = (d: string) => {
    return new Date(d).toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase();
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface mb-2">Gira y Eventos</h1>
          <p className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant font-bold">Calendario Oficial de Comisarios</p>
        </div>
        <button onClick={openNew} className="bg-gradient-to-tr from-primary to-primary-container text-on-primary-container px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(212,175,55,0.2)] transition-all">
          <span className="material-symbols-outlined text-sm">add</span>
          Crear Nuevo Evento
        </button>
      </header>

      {/* Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Total Shows Registrados</p>
            <p className="text-3xl font-headline font-bold text-primary">{events.length}</p>
          </div>
          <span className="material-symbols-outlined text-4xl text-primary/20">confirmation_number</span>
        </div>
        <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Próximos Activos</p>
            <p className="text-3xl font-headline font-bold text-tertiary">{events.filter(e => e.is_active).length}</p>
          </div>
          <span className="material-symbols-outlined text-4xl text-tertiary/20">event_available</span>
        </div>
      </section>

      {/* Events Table Container */}
      <div className="bg-surface-container-highest/30 backdrop-blur-md rounded-2xl border border-outline-variant/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container/50">
                <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Fecha / Show</th>
                <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Ubicación</th>
                <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Ticket / Precio</th>
                <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Status</th>
                <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant text-sm">No hay eventos configurados en el sistema.</td>
                </tr>
              ) : (
                events.map(event => (
                  <tr key={event.id} className="border-b border-outline-variant/5 hover:bg-surface-container/50 transition-colors group">
                    <td className="p-4">
                      <p className="font-headline italic text-lg font-bold text-primary mb-1">{event.title}</p>
                      <p className="text-[10px] text-on-surface-variant tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                        {event.date ? fmt(event.date) : 'Por definir'}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-on-surface truncate max-w-[200px]">{event.location}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">{event.city}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-on-surface bg-surface-container-low inline-block px-3 py-1 rounded-md border border-outline-variant/10">{event.price || 'General'}</p>
                    </td>
                    <td className="p-4">
                      {event.is_active ? (
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle"></span>
                          Confirmado
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-error/10 text-error border border-error/20 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                          Cancelado
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(event)} className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-primary/20 text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors border border-outline-variant/10">
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(event.id)} className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-error/20 text-on-surface-variant hover:text-error flex items-center justify-center transition-colors border border-outline-variant/10">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#131313]/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          
          <div className="bg-surface-container border border-outline-variant/20 rounded-2xl shadow-2xl w-full max-w-xl relative z-10 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-gradient-to-r from-surface-container-highest to-surface-container">
              <div>
                <h2 className="font-headline text-2xl font-bold text-primary ita">{editing ? 'Editar Evento' : 'Nuevo Evento Oficial'}</h2>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Publicación directa al chatbot</p>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex-grow overflow-y-auto max-h-[70vh]">
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Nombre del Evento</label>
                  <input required type="text" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors" placeholder="Ej: Gran Baile de Feria" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Fecha y Hora</label>
                    <input required type="datetime-local" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary/50" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Precio / Info Ticket</label>
                    <input type="text" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary/50" placeholder="Ej: $300 Preventa" value={form.price || ''} onChange={e => setForm({...form, price: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Recinto / Lugar</label>
                    <input required type="text" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary/50" placeholder="Ej: Plaza Principal" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Ciudad, Estado</label>
                    <input required type="text" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary/50" placeholder="Ej: Monterrey, NL" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Indicaciones Adicionales</label>
                  <textarea rows={3} className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary/50 resize-none" placeholder="Venta de boletos en..." value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})}></textarea>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input type="checkbox" id="isActive" className="accent-primary w-4 h-4 cursor-pointer" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
                  <label htmlFor="isActive" className="text-sm font-bold text-on-surface cursor-pointer">Evento Confirmado (Visible para IA)</label>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-outline-variant/10 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 hover:bg-surface-container-highest rounded-xl font-bold text-[10px] uppercase tracking-widest text-on-surface-variant transition-colors border border-transparent hover:border-outline-variant/20">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-container text-on-primary-container rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:opacity-90 transition-opacity">
                  {editing ? 'Guardar Cambios' : 'Confirmar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
