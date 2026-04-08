'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { name: 'Events', path: '/admin/events', icon: 'calendar_today' },
    { name: 'Merchandise', path: '/admin/merch', icon: 'shopping_bag' },
    { name: 'Bookings', path: '/admin/bookings', icon: 'confirmation_number' },
    { name: 'Band Info', path: '/admin/band-info', icon: 'smart_toy' },
  ];

  return (
    <div className="noise-texture bg-[#131313] text-[#e5e2e1] font-body min-h-screen selection:bg-primary selection:text-on-primary">
      {/* SideNavBar (Desktop) */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#1c1b1b] border-r border-[#4d4635]/15 shadow-[40px_0_60px_rgba(0,0,0,0.5)] flex-col h-full py-8 z-50 hidden md:flex">
        <div className="px-6 mb-12">
          <h2 className="text-[#D4AF37] font-headline italic text-lg tracking-widest">LOS REYES</h2>
          <p className="font-label uppercase tracking-widest text-[10px] text-[#e5e2e1]/60 mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-grow flex flex-col space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={isActive
                  ? "bg-[#D4AF37]/10 text-[#D4AF37] border-r-4 border-[#D4AF37] px-6 py-4 flex items-center gap-4 duration-300 ease-in-out cursor-pointer"
                  : "text-[#e5e2e1]/60 px-6 py-4 flex items-center gap-4 hover:bg-[#131313] hover:text-[#D4AF37] transition-all duration-300 ease-in-out cursor-pointer"}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="font-label uppercase tracking-widest text-[10px]">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 mb-8">
          <Link href="/admin/events" className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-bold py-3 rounded-xl shadow-[0_10px_20px_rgba(212,175,55,0.2)] hover:opacity-90 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">add</span>
            Create New Event
          </Link>
        </div>

        <div className="mt-auto border-t border-[#4d4635]/10 pt-4">
          <button className="w-full text-left text-[#e5e2e1]/60 px-6 py-3 flex items-center gap-4 hover:text-[#D4AF37] transition-all cursor-pointer">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label uppercase tracking-widest text-[10px]">Settings</span>
          </button>
          <button onClick={handleLogout} className="w-full text-left text-[#e5e2e1]/60 px-6 py-3 flex items-center gap-4 hover:text-error transition-all cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label uppercase tracking-widest text-[10px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:ml-64 relative z-10 min-h-screen pb-24 md:pb-0">
        {/* Top Navbar (Mobile Only) */}
        <header className="md:hidden flex justify-between items-center px-6 py-6 bg-[#131313]/70 backdrop-blur-xl sticky top-0 z-50">
          <span className="text-2xl font-headline font-bold text-[#D4AF37] tracking-widest uppercase">LOS REYES</span>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[#D4AF37]">account_circle</span>
          </div>
        </header>

        {children}
      </div>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-20 bg-[#131313]/80 backdrop-blur-2xl rounded-t-3xl border-t border-[#D4AF37]/20 z-50">
        <Link href="/" className="flex flex-col items-center justify-center text-[#e5e2e1]/40 hover:text-[#D4AF37] transition-all">
          <span className="material-symbols-outlined">forum</span>
          <span className="font-label font-bold text-[10px]">Chat</span>
        </Link>
        <Link href="/admin/events" className={pathname === '/admin/events' ? "flex flex-col items-center justify-center text-[#D4AF37] scale-110" : "flex flex-col items-center justify-center text-[#e5e2e1]/40 hover:text-[#D4AF37] transition-all"}>
          <span className="material-symbols-outlined">event</span>
          <span className="font-label font-bold text-[10px]">Events</span>
        </Link>
        <Link href="/admin/bookings" className={pathname === '/admin/bookings' ? "flex flex-col items-center justify-center text-[#D4AF37] scale-110" : "flex flex-col items-center justify-center text-[#e5e2e1]/40 hover:text-[#D4AF37] transition-all"}>
          <span className="material-symbols-outlined">confirmation_number</span>
          <span className="font-label font-bold text-[10px]">Bookings</span>
        </Link>
        <Link href="/admin" className={pathname === '/admin' ? "flex flex-col items-center justify-center text-[#D4AF37] scale-110" : "flex flex-col items-center justify-center text-[#e5e2e1]/40 hover:text-[#D4AF37] transition-all"}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label font-bold text-[10px]">Admin</span>
        </Link>
      </nav>
    </div>
  );
}
