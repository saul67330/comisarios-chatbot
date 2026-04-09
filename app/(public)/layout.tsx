import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col overflow-x-hidden pt-20 pb-20 md:pb-0">
      <TopNavBar />
      {/* Background Hero with Dark Overlay shared across public views */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          className="w-full h-full object-cover object-bottom"
          src="https://kkqphhhejfgvdnycabqt.supabase.co/storage/v1/object/public/public_assets/real/cover.jpg"
          alt="Hero Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/30 to-black/10"></div>
      </div>
      
      <main className="flex-grow flex flex-col relative z-10 w-full">
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
}
