import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch quick stats
  const { count: eventsCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true });

  const { count: productsCount } = await supabase
    .from('merchandise')
    .select('*', { count: 'exact', head: true });

  const { count: bookingsCount } = await supabase
    .from('booking_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return (
    <div className="p-6 md:p-10">
      <header className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6">
        <div>
          <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface">Comisarios Del Norte</h1>
          <p className="text-primary tracking-[0.3em] uppercase text-xs mt-2 font-bold">Control Central Dashboard</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="font-bold text-sm text-on-surface">Band Admin</p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Authenticated Session</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-primary-container overflow-hidden p-0.5">
            <div className="w-full h-full rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-xl">
              CN
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="glass-panel p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-primary/5 text-9xl font-headline italic pointer-events-none group-hover:text-primary/10 transition-all">E</div>
          <h3 className="text-on-surface-variant uppercase tracking-widest text-[10px] mb-4 font-bold">Próximos Eventos</h3>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-headline text-5xl font-bold text-on-surface">{eventsCount || 0}</p>
              <p className="text-xs text-primary mt-1 font-medium">Shows Registrados</p>
            </div>
            <span className="material-symbols-outlined text-primary text-4xl">event</span>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-tertiary/5 text-9xl font-headline italic pointer-events-none group-hover:text-tertiary/10 transition-all">S</div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-on-surface-variant uppercase tracking-widest text-[10px] font-bold">Contrataciones</h3>
            {bookingsCount && bookingsCount > 0 ? (
              <span className="bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
                {bookingsCount} NEW
              </span>
            ) : null}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-headline text-5xl font-bold text-on-surface">{bookingsCount || 0}</p>
              <p className="text-xs text-tertiary-fixed-dim mt-1 font-medium">Pendientes de revisión</p>
            </div>
            <span className="material-symbols-outlined text-tertiary text-4xl">notifications_active</span>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-primary/5 text-9xl font-headline italic pointer-events-none group-hover:text-primary/10 transition-all">M</div>
          <h3 className="text-on-surface-variant uppercase tracking-widest text-[10px] mb-4 font-bold">Mercancía</h3>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-headline text-5xl font-bold text-on-surface">{productsCount || 0}</p>
              <p className="text-xs text-primary mt-1 font-medium">Productos Activos</p>
            </div>
            <span className="material-symbols-outlined text-primary text-4xl">shopping_bag</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Quick Actions */}
          <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/5">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/events" className="flex flex-col items-center justify-center p-6 rounded-xl bg-surface-container-highest hover:bg-primary-container/20 group transition-all border border-outline-variant/10 text-center">
                <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform mb-3">add_box</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Agregar Evento</span>
              </Link>
              <Link href="/admin/band-info" className="flex flex-col items-center justify-center p-6 rounded-xl bg-surface-container-highest hover:bg-primary-container/20 group transition-all border border-outline-variant/10 text-center">
                <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform mb-3">edit_note</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Editar Info</span>
              </Link>
              <Link href="/admin/merch" className="flex flex-col items-center justify-center p-6 rounded-xl bg-surface-container-highest hover:bg-primary-container/20 group transition-all border border-outline-variant/10 text-center">
                <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform mb-3">inventory_2</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Mercancía</span>
              </Link>
              <Link href="/admin/bookings" className="flex flex-col items-center justify-center p-6 rounded-xl bg-surface-container-highest hover:bg-primary-container/20 group transition-all border border-outline-variant/10 text-center">
                <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform mb-3">mark_email_unread</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Solicitudes</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-gradient-to-br from-surface-container-high to-surface-container-lowest p-8 rounded-xl border border-primary/20 relative overflow-hidden flex-grow flex flex-col justify-end min-h-[300px]">
            <div className="absolute inset-0 bg-primary/5"></div>
            <div className="relative z-10">
              <h3 className="font-headline text-xl italic text-primary mb-2">Comisarios AI</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                El asistente virtual está en línea y respondiendo a los fans automáticamente usando la base de datos actualizada.
              </p>
              <Link href="/" target="_blank" className="mt-6 inline-flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest hover:gap-4 transition-all">
                Probar Chatbot
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
