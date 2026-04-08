'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';

const QUICK_PROMPTS = [
  '¿Cuándo es el próximo baile?',
  '¿Tienen playeras nuevas?',
  '¿Cómo puedo contratar a la banda?',
  'Ver setlist reciente'
];

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLInputElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim() || isLoading) return;
    sendMessage({ text: text.trim() });
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleChipClick = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col overflow-x-hidden">
      {/* TopNavBar Component */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/70 backdrop-blur-xl flex justify-between items-center px-8 py-4 shadow-[0_20px_50px_rgba(19,19,19,0.8)]">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold text-[#D4AF37] tracking-widest font-headline tracking-tighter">LOS REYES</span>
          <div className="hidden md:flex gap-6 font-headline tracking-tighter">
            <a className="text-[#e5e2e1] hover:text-[#D4AF37] transition-colors hover:opacity-80 transition-all scale-95 active:duration-100" href="#">Tour</a>
            <a className="text-[#e5e2e1] hover:text-[#D4AF37] transition-colors hover:opacity-80 transition-all scale-95 active:duration-100" href="#">Merch</a>
            <a className="text-[#e5e2e1] hover:text-[#D4AF37] transition-colors hover:opacity-80 transition-all scale-95 active:duration-100" href="#">About</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[#D4AF37] text-[#131313] px-6 py-2 rounded-full font-label font-bold hover:opacity-80 transition-all scale-95 active:duration-100">
            Book Now
          </button>
          <span className="material-symbols-outlined text-[#D4AF37] text-2xl cursor-pointer hover:opacity-80 transition-all">account_circle</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent h-[1px]"></div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col relative pt-20">
        {/* Background Hero with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover grayscale brightness-50 opacity-40"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC63P1BBuDssTUovp7sezHbIbBw9aCxTz9dMx85lStOSUfp_KsuQQcgdl9JM0AUaBiKzaTB7WhVd5AFe9EIv23c9dV2c3LtCSFoHcu_aNCHCh_34yeqHldhToO0m0vkLRIPP7PIDd-1Qc4hY9W8IX-e2Hpfe5U1Of0fCKOxW-z6PE7hcmj_9HzrQrEXoNUxUIt2I6g37CznxuIeepTPDzjEcmLk48R_W8LrbKK9eqD9IJTbfa9Fw_iM1uPHApRh74Cmh2SVUmrYGJs"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
        </div>

        {/* Chat Container */}
        <div className="relative z-10 flex-grow flex flex-col max-w-5xl mx-auto w-full px-4 py-8 md:py-12 h-[calc(100vh-80px)]">
          {/* Header/Identity */}
          <div className="text-center mb-8">
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-primary tracking-tighter mb-2 italic">Comisarios AI</h1>
            <p className="font-label text-xs uppercase tracking-[0.4em] text-on-surface-variant font-medium">Chat con la esencia de la frontera</p>
          </div>

          {/* Interaction Area */}
          <div className="flex-grow flex flex-col bg-surface-container-low/40 backdrop-blur-2xl rounded-3xl border border-outline-variant/10 shadow-2xl overflow-hidden mb-6 relative">
            {/* Inner Glow for Glassmorphism */}
            <div className="absolute inset-x-0 top-0 h-px bg-surface-bright opacity-20"></div>

            {/* Messages Display */}
            <div className="flex-grow overflow-y-auto p-6 space-y-8 scroll-smooth">
              
              {/* Initial Welcome AI Message */}
              {messages.length === 0 && (
                <div className="flex gap-4 items-end max-w-[85%]">
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/20 shrink-0">
                    <span className="material-symbols-outlined text-primary">smart_toy</span>
                  </div>
                  <div className="bg-surface-container-highest/80 backdrop-blur-md p-5 rounded-2xl rounded-bl-none border border-outline-variant/10 shadow-xl">
                    <p className="text-on-surface leading-relaxed text-lg italic font-headline">¡Qué onda compadre! Aquí andamos al cien. Los Comisarios Del Norte estamos listos para lo que se ofrezca. ¿En qué le puedo ayudar hoy?</p>
                  </div>
                </div>
              )}

              {/* Chat Thread */}
              {messages.map((message) => {
                const text = message.parts
                  ?.filter((p: { type: string }) => p.type === 'text')
                  .map((p: { type: string; text: string }) => p.text)
                  .join('') || '';
                
                const isUser = message.role === 'user';

                return isUser ? (
                  <div key={message.id} className="flex gap-4 items-end justify-end ml-auto max-w-[85%]">
                    <div className="bg-primary/10 backdrop-blur-md p-5 rounded-2xl rounded-br-none border border-primary/30 shadow-[0_10px_30px_rgba(242,202,80,0.05)]">
                      <p className="text-primary font-medium">{text}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant">person</span>
                    </div>
                  </div>
                ) : (
                  <div key={message.id} className="flex gap-4 items-end max-w-[85%]">
                    <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/20 shrink-0">
                      <span className="material-symbols-outlined text-primary">smart_toy</span>
                    </div>
                    <div className="bg-surface-container-highest/80 backdrop-blur-md p-5 rounded-2xl rounded-bl-none border border-outline-variant/10 shadow-xl">
                      <p className="text-on-surface leading-relaxed text-lg italic font-headline whitespace-pre-wrap">{text}</p>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-4 items-end max-w-[85%]">
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/20 shrink-0">
                    <span className="material-symbols-outlined text-primary">smart_toy</span>
                  </div>
                  <div className="bg-surface-container-highest/80 backdrop-blur-md p-5 rounded-2xl rounded-bl-none border border-outline-variant/10 shadow-xl flex gap-1 items-center h-[52px]">
                    <span className="w-2 h-2 bg-on-surface/50 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-on-surface/50 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-on-surface/50 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 0 && (
              <div className="px-6 pb-6">
                <div className="flex flex-wrap gap-3">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleChipClick(prompt)}
                      className="bg-surface-container-highest/50 hover:bg-surface-container-highest text-on-surface-variant hover:text-primary px-4 py-2 rounded-xl text-sm font-medium border border-outline-variant/10 transition-all duration-300"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Field Area */}
            <div className="p-6 bg-surface-container-highest/40 backdrop-blur-md border-t border-outline-variant/10">
              <div className="relative flex items-center">
                <input
                  ref={textareaRef}
                  type="text"
                  className="w-full bg-surface-container-low border-none rounded-2xl py-5 px-6 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-4 focus:ring-primary/20 transition-all duration-500 font-medium"
                  placeholder="Escribe tu mensaje aquí, compadre..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  autoComplete="off"
                />
                <div className="absolute right-3 flex items-center gap-2">
                  <button className="p-3 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50" disabled={isLoading}>
                    <span className="material-symbols-outlined">mic</span>
                  </button>
                  <button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container p-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Stats / Branding */}
          <div className="flex justify-between items-center px-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">
            <div className="flex items-center gap-4">
              <span>LIVE SESSION ID: COM-AI-88</span>
              <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_10px_rgba(255,191,175,0.8)] animate-pulse"></span>
            </div>
            <span>© {new Date().getFullYear()} LOS REYES / COMISARIOS</span>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-20 pb-safe bg-[#131313]/80 backdrop-blur-2xl rounded-t-3xl border-t border-[#D4AF37]/20 z-50 shadow-[0_-10px_40px_rgba(212,175,55,0.1)]">
        <a href="#" className="flex flex-col items-center justify-center text-[#D4AF37] scale-110 font-bold text-[10px]">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
          <span>Chat</span>
        </a>
        <a href="/admin/events" className="flex flex-col items-center justify-center text-[#e5e2e1]/40 font-bold text-[10px] hover:text-[#D4AF37]">
          <span className="material-symbols-outlined">event</span>
          <span>Events</span>
        </a>
        <a href="/admin/merch" className="flex flex-col items-center justify-center text-[#e5e2e1]/40 font-bold text-[10px] hover:text-[#D4AF37]">
          <span className="material-symbols-outlined">payments</span>
          <span>Shop</span>
        </a>
        <a href="/admin" className="flex flex-col items-center justify-center text-[#e5e2e1]/40 font-bold text-[10px] hover:text-[#D4AF37]">
          <span className="material-symbols-outlined">admin_panel_settings</span>
          <span>Admin</span>
        </a>
      </nav>
    </div>
  );
}
