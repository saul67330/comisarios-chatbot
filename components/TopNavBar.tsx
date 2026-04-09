'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';

export default function TopNavBar() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return `font-headline tracking-tighter transition-all scale-95 active:duration-100 ${
      isActive ? 'text-[#D4AF37] opacity-100' : 'text-[#e5e2e1] hover:text-[#D4AF37] hover:opacity-80'
    }`;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131313]/70 backdrop-blur-xl flex justify-between items-center px-8 py-4 shadow-[0_20px_50px_rgba(19,19,19,0.8)]">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-primary/50 shadow-[0_0_15px_rgba(212,175,55,0.4)] overflow-hidden shrink-0 bg-black">
            <img 
              src="https://kkqphhhejfgvdnycabqt.supabase.co/storage/v1/object/public/public_assets/real/evento_quinceanera.jpg" 
              alt="Comisarios Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="text-2xl font-bold text-[#D4AF37] font-['Rye'] tracking-widest hover:opacity-80 transition-opacity whitespace-nowrap drop-shadow-md">COMISARIOS DEL NORTE</span>
        </Link>
        <div className="hidden md:flex gap-6 items-center">
          <Link className={getLinkClasses('/muro')} href="/muro">Muro</Link>
          <Link className={getLinkClasses('/tour')} href="/tour">Gira</Link>
          <Link className={getLinkClasses('/merch')} href="/merch">Tienda</Link>
          <Link className={getLinkClasses('/about')} href="/about">Nosotros</Link>
          <Link 
            href="/contratar" 
            className="ml-4 bg-[#D4AF37] text-[#131313] px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_5px_15px_rgba(212,175,55,0.3)]"
          >
            Cotizar Evento
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-[#D4AF37] cursor-pointer hover:opacity-80 transition-all">
          <User size={24} />
        </Link>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent h-[1px]"></div>
    </nav>
  );
}
