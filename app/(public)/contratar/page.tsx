'use client';

import { useState } from 'react';
import { Calendar, MapPin, User, Mail, Phone, Music, Send, Clock } from 'lucide-react';

export default function ContratarPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipoEvento: '',
    fecha: '',
    lugar: '',
    duracion: '',
    notas: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp message
    const message = `¡Hola Comisarios del Norte! 👋 Quisiera solicitar una cotización para un evento:
    
👤 *Nombre:* ${formData.nombre}
📧 *Email:* ${formData.email}
📞 *Teléfono:* ${formData.telefono}
🎈 *Tipo de Evento:* ${formData.tipoEvento}
📅 *Fecha:* ${formData.fecha}
📍 *Lugar:* ${formData.lugar}
⏳ *Duración:* ${formData.duracion}
📝 *Notas:* ${formData.notas || 'Sin notas adicionales'}

Espero su respuesta, ¡Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/528661004040?text=${encodedMessage}`;
    
    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-6 py-12">
      <div className="text-center mb-12 pt-[15vh]">
        <h1 className="font-['Rye'] text-5xl md:text-7xl font-bold text-white tracking-widest mb-4 drop-shadow-[0_10px_25px_rgba(0,0,0,1)] text-center">Contrataciones</h1>
        <p className="font-label text-sm md:text-base uppercase tracking-[0.4em] text-[#D4AF37] font-extrabold drop-shadow-[0_5px_15px_rgba(0,0,0,1)]">Solicita tu cotización ahora</p>
      </div>

      <div className="bg-surface-container-low/30 backdrop-blur-xl rounded-3xl border border-outline-variant/30 shadow-2xl p-6 md:p-10 relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-[#D4AF37] font-bold ml-1 flex items-center gap-2">
                <User size={14} /> Nombre Completo
              </label>
              <input
                required
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-[#D4AF37] font-bold ml-1 flex items-center gap-2">
                <Mail size={14} /> Correo Electrónico
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="juan@ejemplo.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-[#D4AF37] font-bold ml-1 flex items-center gap-2">
                <Phone size={14} /> Teléfono de Contacto
              </label>
              <input
                required
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="866 000 0000"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Tipo de Evento */}
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-[#D4AF37] font-bold ml-1 flex items-center gap-2">
                <Music size={14} /> Tipo de Evento
              </label>
              <select
                required
                name="tipoEvento"
                value={formData.tipoEvento}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="" disabled className="bg-surface">Selecciona uno...</option>
                <option value="Boda" className="bg-surface">Boda</option>
                <option value="Quinceañera" className="bg-surface">Quinceañera</option>
                <option value="Baile Masivo" className="bg-surface">Baile Masivo</option>
                <option value="Evento Privado" className="bg-surface">Evento Privado / Fiesta</option>
                <option value="Graduación" className="bg-surface">Graduación</option>
                <option value="Otro" className="bg-surface">Otro</option>
              </select>
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-[#D4AF37] font-bold ml-1 flex items-center gap-2">
                <Calendar size={14} /> Fecha Tentativa
              </label>
              <input
                required
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Lugar */}
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-[#D4AF37] font-bold ml-1 flex items-center gap-2">
                <MapPin size={14} /> Lugar / Ciudad
              </label>
              <input
                required
                type="text"
                name="lugar"
                value={formData.lugar}
                onChange={handleChange}
                placeholder="Ej. Saltillo, Coahuila"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Duración */}
            <div className="space-y-2 col-span-full">
              <label className="text-xs font-label uppercase tracking-widest text-[#D4AF37] font-bold ml-1 flex items-center gap-2">
                <Clock size={14} /> Duración Solicitada
              </label>
              <input
                required
                type="text"
                name="duracion"
                value={formData.duracion}
                onChange={handleChange}
                placeholder="Ej. 3 horas de música continua"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <label className="text-xs font-label uppercase tracking-widest text-[#D4AF37] font-bold ml-1">
              Notas Adicionales / Requisitos Especiales
            </label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              rows={4}
              placeholder="Cuéntanos más sobre tu evento..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors resize-none"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-[#131313] py-5 rounded-2xl font-bold text-lg uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] flex items-center justify-center gap-3 active:shadow-none"
          >
            <Send size={24} />
            Enviar a WhatsApp Norteño
          </button>

          <p className="text-[10px] text-center text-on-surface-variant/60 uppercase tracking-widest mt-6">
            Al dar clic, serás redirigido a WhatsApp para finalizar tu cotización.
          </p>
        </form>
      </div>

      <div className="mt-12 text-center text-on-surface-variant/40 text-xs">
        © 2026 Comisarios Del Norte — Sistema de Contratación Oficial
      </div>
    </div>
  );
}
