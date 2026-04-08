'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Merch {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  purchase_url: string | null;
  is_available: boolean;
}

const EMPTY: Omit<Merch, 'id'> = {
  name: '', description: '', price: 0, image_url: '', purchase_url: '', is_available: true,
};

export default function MerchPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Merch[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Merch | null>(null);
  const [form, setForm] = useState(EMPTY);

  const load = async () => {
    const { data } = await supabase.from('merchandise').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (m: Merch) => { setEditing(m); setForm(m); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await supabase.from('merchandise').update(form).eq('id', editing.id);
    } else {
      await supabase.from('merchandise').insert(form);
    }
    setShowModal(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      await supabase.from('merchandise').delete().eq('id', id);
      load();
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface mb-2">Mercancía</h1>
          <p className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant font-bold">Gestiona los productos disponibles para fans</p>
        </div>
        <button className="bg-gradient-to-tr from-primary to-primary-container text-on-primary-container px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg transition-all" onClick={openNew}>
          <span className="material-symbols-outlined text-sm">add</span>
          Nuevo Producto
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-surface-container-low p-12 rounded-2xl border border-outline-variant/10 text-center flex flex-col items-center">
          <span className="text-6xl text-primary/20 mb-4 block">👕</span>
          <p className="text-on-surface-variant">No hay productos registrados</p>
        </div>
      ) : (
        <div className="bg-surface-container-highest/30 backdrop-blur-md rounded-2xl border border-outline-variant/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/10 bg-surface-container/50">
                  <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Producto</th>
                  <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Precio</th>
                  <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Disponible</th>
                  <th className="p-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-outline-variant/5 hover:bg-surface-container/50 transition-colors">
                    <td className="p-4">
                      <strong className="text-on-surface">{item.name}</strong>
                      {item.description && <div className="text-[10px] text-on-surface-variant mt-1 max-w-[200px] truncate">{item.description}</div>}
                    </td>
                    <td className="p-4 text-on-surface font-headline italic font-bold text-lg">${item.price} MXN</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${item.is_available ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-error/10 text-error border border-error/20'}`}>
                        {item.is_available ? 'Sí' : 'No'}
                      </span>
                    </td>
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
              <h2 className="font-headline text-2xl font-bold text-primary italic">{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex-grow overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Nombre</label>
                  <input required className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm text-on-surface focus:border-primary/50" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Playera Oficial" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Descripción</label>
                  <textarea className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm text-on-surface focus:border-primary/50" rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Playera negra con logo..." />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Precio (MXN)</label>
                  <input required className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm text-on-surface focus:border-primary/50" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary font-bold mb-2">URL de compra</label>
                  <input className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 px-4 text-sm text-on-surface focus:border-primary/50" value={form.purchase_url || ''} onChange={(e) => setForm({ ...form, purchase_url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <input id="avail" type="checkbox" className="accent-primary w-4 h-4" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} />
                  <label htmlFor="avail" className="text-sm font-bold text-on-surface cursor-pointer">Disponible</label>
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
