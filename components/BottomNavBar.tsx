'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, CalendarDays, ShoppingBag, Info, Image, Send } from 'lucide-react';

export default function BottomNavBar() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return `flex flex-col items-center justify-center font-bold text-[10px] transition-all gap-1 ${
      isActive ? 'text-[#D4AF37] scale-110' : 'text-[#e5e2e1]/40 hover:text-[#D4AF37]'
    }`;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] bg-[#131313]/90 backdrop-blur-3xl border-t border-white/10 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.9)]">
      <Link href="/" className={getLinkClasses('/')}>
        <MessageSquare size={20} className={pathname === '/' ? 'fill-[#D4AF37]' : ''} />
        <span>Chat</span>
      </Link>
      <Link href="/muro" className={getLinkClasses('/muro')}>
        <Image size={20} className={pathname === '/muro' ? 'fill-[#D4AF37]' : ''} />
        <span>Muro</span>
      </Link>
      <Link href="/tour" className={getLinkClasses('/tour')}>
        <CalendarDays size={20} className={pathname === '/tour' ? 'fill-[#D4AF37]' : ''} />
        <span>Gira</span>
      </Link>
      <Link href="/merch" className={getLinkClasses('/merch')}>
        <ShoppingBag size={20} className={pathname === '/merch' ? 'fill-[#D4AF37]' : ''} />
        <span>Tienda</span>
      </Link>
      <Link href="/contratar" className={getLinkClasses('/contratar')}>
        <Send size={20} className={pathname === '/contratar' ? 'fill-[#D4AF37]' : ''} />
        <span>Cotizar</span>
      </Link>
    </nav>
  );
}
