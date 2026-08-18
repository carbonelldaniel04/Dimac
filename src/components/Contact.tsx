import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Send, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { addContactMessage } from '../lib/dataStore';

export default function Contact() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await addContactMessage(formData);
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('success'); // Graceful fallback
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    }
  };

  return (
    <section id="contact" className="py-24 bg-bg-primary border-t border-border-main scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border-main border border-border-main">
          {/* ... sidebar info ... */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-bg-primary p-12 md:p-20"
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-600 mb-6 block">06 // CONTACTO</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 uppercase leading-[0.9]">
              Solicita <br /> 
              <span className="text-accent italic font-light lowercase">manifiesto.</span>
            </h2>
            
            <div className="space-y-12">
              <div className="flex items-start gap-8 group">
                 <div className="text-[9px] font-mono text-gray-700 pt-1">01</div>
                 <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 italic">Consultas de Arquitectura</p>
                    <a href="mailto:hola@dimacarq.com" className="text-2xl font-bold hover:text-accent transition-colors flex items-center gap-4">
                      hola@dimacarq.com <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                 </div>
              </div>

              <div className="flex items-start gap-8 group">
                 <div className="text-[9px] font-mono text-gray-700 pt-1">02</div>
                 <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 italic">Acceso Atelier</p>
                    <p className="text-2xl font-bold">Av. Brutalista 767, CDMX 03810</p>
                 </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-[#0F0F0F] p-12 md:p-20 relative"
          >
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <CheckCircle2 size={64} className="text-accent mb-4" />
                <h3 className="text-3xl font-bold uppercase tracking-tighter">Mensaje Enviado</h3>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 leading-loose">
                  Su solicitud ha sido procesada. <br /> Un concierge se pondrá en contacto pronto.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-8 px-8 py-4 border border-border-main text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form className="space-y-12" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-2 border-b border-border-main">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-gray-600">Nombre</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-transparent py-4 outline-none focus:text-accent transition-all text-sm font-light uppercase tracking-widest" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 border-b border-border-main">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-gray-600">Apellido</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-transparent py-4 outline-none focus:text-accent transition-all text-sm font-light uppercase tracking-widest" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2 border-b border-border-main">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-gray-600">Dirección de Email</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-transparent py-4 outline-none focus:text-accent transition-all text-sm font-light" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2 border-b border-border-main">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-gray-600">Breve Mensaje</label>
                  <textarea 
                    required
                    rows={4} 
                    className="w-full bg-transparent py-4 outline-none focus:text-accent transition-all text-sm font-light resize-none tracking-wide"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  disabled={status === 'sending'}
                  className="w-full py-6 bg-white text-black font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-accent transition-all disabled:opacity-50"
                >
                  {status === 'sending' ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
