'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface BandInfo {
  id: string;
  category: string;
  title: string;
  content: string;
}

const CATEGORIES = ['biography', 'members', 'discography', 'contact', 'social_media'];
const CATEGORY_LABELS: Record<string, string> = {
  biography: '📖 Biografía',
  members: '👥 Integrantes',
  discography: '💿 Discografía',
  contact: '📞 Contacto',
  social_media: '📱 Redes Sociales',
};

export default function BandInfoPage() {
  const supabase = createClient();
  const [items, setItems] = useState<BandInfo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BandInfo | null>(null);
  const [form, setForm] = useState({ category: 'biography', title: '', content: '' });

  const load = async () => {
    const { data } = await supabase.from('band_info').select('*').order('category');
    setItems(data || []);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ category: 'biography', title: '', content: '' }); setShowModal(true); };
  const openEdit = (b: BandInfo) => { setEditing(b); setForm(b); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await supabase.from('band_info').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id);
    } else {
      await supabase.from('band_info').insert(form);
    }
    setShowModal(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta información?')) {
      await supabase.from('band_info').delete().eq('id', id);
      load();
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface mb-2">Información del Grupo</h1>
          <p className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant font-bold">Biografía, integrantes, discografía y contacto</p>
        </div>
        <button className="bg-gradient-to-tr from-primary to-primary-container text-on-primary-container px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg transition-all" onClick={openNew}>
          <span className="material-symbols-outlined text-sm">add</span>
          Nueva Info
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-surface-container-low p-12 rounded-2xl border border-outline-variant/10 text-center flex flex-col items-center">
          <span className="text-6xl text-primary/20 mb-4 block">📖</span>
          <p className="text-on-surface-variant">No hay información registrada</p>
        </div>
      ) : (
        <div className="bg-surface-container-highest/30 backdrop-blur-md rounded-2xl border border-outline-variant/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/10 bg-surface-container/50">
                  <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Categoría</th>
                  <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Título</th>
                  <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Contenido</th>
                  <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-outline-variant/5 hover:bg-surface-container/50 transition-colors">
                    <td className="p-4 text-on-surface font-medium">{CATEGORY_LABELS[item.category] || item.category}</td>
                    <td className="p-4"><strong className="text-primary italic">{item.title}</strong></td>
                    <td className="p-4 text-on-surface-variant text-sm truncate max-w-[300px]">{item.content}</td>
                    <td className="p-4 text-right">
                      <button className="mr-2 px-3 py-1 bg-surface-container hover:bg-primary/20 text-on-surface hover:text-primary rounded-lg text-xs font-bold transition-colors" onClick={() => openEdit(item)}>Editar</button>
                      <button className="px-3 py-1 bg-surface-container hover:bg-error/20 text-on-surface hover:text-error rounded-lg text-xs font-bold transition-colors" onClick={() => handleDelete(item.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#131313]/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="bg-surface-container border border-outline-variant/20 rounded-2xl shadow-2xl w-full max-w-xl relative z-10 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-gradient-to-r from-surface-container-highest to-surface-container">
              <h2 className="font-headline text-2xl font-bold text-primary italic">{editing ? 'Editar Info' : 'Nueva Info'}</h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex-grow overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Categoría</label>
                  <select className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm text-on-surface focus:border-primary/50" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Título</label>
                  <input required className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm text-on-surface focus:border-primary/50" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ej: Nuestra Historia" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Contenido</label>
                  <textarea required className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm text-on-surface focus:border-primary/50" rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Escribe aquí la información..." />
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-outline-variant/10 flex justify-end gap-3">
                <button type="button" className="px-5 py-2.5 hover:bg-surface-container-highest rounded-xl font-bold text-[10px] uppercase tracking-widest text-on-surface-variant transition-colors" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-container text-on-primary-container rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:opacity-90 transition-opacity">{editing ? 'Guardar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
