'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import { Mic, Send } from 'lucide-react';

const QUICK_PROMPTS = [
  '¿Tienen eventos cerca de Monterrey?',
  '¿Puedo comprar el Álbum de Vinilo?',
  'Me interesa contratarlos para una boda',
  '¿Quién fundó Comisarios Del Norte?'
];

function isTextPart(part: { type: string }): part is { type: 'text'; text: string } {
  return part.type === 'text';
}

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
    <div className="flex-1 flex flex-col justify-end max-w-2xl mx-auto w-full px-4 pt-[20vh] md:pt-[25vh] pb-4 h-[calc(100vh-100px)] md:h-[calc(100vh-80px)]">
      {/* Header/Identity */}
      <div className="text-center mb-4 mt-auto">
        <h1 className="font-['Rye'] text-4xl md:text-5xl font-bold text-white tracking-widest mb-1 drop-shadow-[0_10px_25px_rgba(0,0,0,1)]">Comisarios AI</h1>
        <p className="font-label text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#D4AF37] font-extrabold drop-shadow-[0_5px_15px_rgba(0,0,0,1)]">Chat con la esencia de la frontera</p>
      </div>

      {/* Interaction Area */}
      <div className="flex-1 flex flex-col bg-surface-container-low/30 backdrop-blur-md rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden mb-2 relative min-h-[300px] max-h-[500px]">
        {/* Inner Glow for Glassmorphism */}
        <div className="absolute inset-x-0 top-0 h-px bg-surface-bright opacity-30"></div>

        {/* Messages Display */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
          
          {/* Initial Welcome AI Message */}
          {messages.length === 0 && (
            <div className="flex gap-4 items-end max-w-[85%]">
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/20 shrink-0 overflow-hidden">
                <img src="https://kkqphhhejfgvdnycabqt.supabase.co/storage/v1/object/public/public_assets/real/evento_quinceanera.jpg" alt="Comisarios" className="w-full h-full object-cover" />
              </div>
              <div className="bg-surface-container-highest/80 backdrop-blur-md p-5 rounded-2xl rounded-bl-none border border-outline-variant/10 shadow-xl">
                <p className="text-on-surface leading-relaxed text-lg italic font-headline">¡Qué onda compadre! Aquí andamos al cien. Los Comisarios Del Norte estamos listos para lo que se ofrezca. ¿En qué le puedo ayudar hoy?</p>
              </div>
            </div>
          )}

          {/* Chat Thread */}
          {messages.map((message) => {
            const text = message.parts
              ?.filter(isTextPart)
              .map((p) => p.text)
              .join('') || '';
            
            const isUser = message.role === 'user';

            return isUser ? (
              <div key={message.id} className="flex gap-4 items-end justify-end ml-auto max-w-[85%]">
                <div className="bg-primary/10 backdrop-blur-md p-5 rounded-2xl rounded-br-none border border-primary/30 shadow-[0_10px_30px_rgba(242,202,80,0.05)]">
                  <p className="text-primary font-medium">{text}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 shrink-0 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80" alt="User" className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <div key={message.id} className="flex gap-4 items-end max-w-[85%]">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/20 shrink-0 overflow-hidden">
                  <img src="https://kkqphhhejfgvdnycabqt.supabase.co/storage/v1/object/public/public_assets/real/evento_quinceanera.jpg" alt="Comisarios" className="w-full h-full object-cover" />
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
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/20 shrink-0 overflow-hidden">
                <img src="https://kkqphhhejfgvdnycabqt.supabase.co/storage/v1/object/public/public_assets/real/evento_quinceanera.jpg" alt="Comisarios" className="w-full h-full object-cover" />
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
                <Mic size={20} />
              </button>
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container p-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100 flex items-center justify-center"
              >
                <Send size={20} className="ml-1" />
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
        <span>© {new Date().getFullYear()} COMISARIOS DEL NORTE</span>
      </div>
    </div>
  );
}
