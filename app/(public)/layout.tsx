import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col overflow-x-hidden pt-20 pb-20 md:pb-0">
      <TopNavBar />
      {/* Background Hero with Dark Overlay shared across public views */}
      <div className="fixed top-0 left-0 right-0 z-0 pointer-events-none bg-[#131313] h-[35vh] md:h-full md:inset-0">
        <div className="w-[90%] mx-auto h-full md:w-full">
          <img
            className="w-full h-full object-contain md:object-cover object-top md:object-bottom opacity-80 md:opacity-100"
            src="https://kkqphhhejfgvdnycabqt.supabase.co/storage/v1/object/public/public_assets/real/cover.jpg"
            alt="Hero Background"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/60 to-transparent"></div>
      </div>
      
      <main className="flex-grow flex flex-col relative z-10 w-full">
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
}
