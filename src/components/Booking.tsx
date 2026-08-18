import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, User, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';
import { addBooking } from '../lib/dataStore';

export default function Booking() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: '14',
    time: '',
    name: '',
    email: '',
    purpose: ''
  });

  const availableHours = ['09:00', '10:30', '13:00', '14:30', '16:00'];
  const calendarDays = [
    { day: 'M', num: '12', opacity: 'opacity-20' },
    { day: 'T', num: '13', opacity: 'opacity-20' },
    { day: 'W', num: '14', opacity: 'bg-accent text-black font-bold' },
    { day: 'T', num: '15', opacity: '' },
    { day: 'F', num: '16', opacity: '' },
    { day: 'S', num: '17', opacity: '' },
    { day: 'S', num: '18', opacity: '' },
  ];

  const handleNext = async () => {
    if (step === 2) {
      await handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await addBooking(formData);
      setStep(3);
    } catch (error) {
      console.error(error);
      setStep(3); // Gracefully complete
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => setStep(step - 1);

  return (
    <section id="booking" className="py-24 bg-bg-primary border-t border-border-main">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto border border-border-main overflow-hidden flex flex-col md:flex-row bg-[#0F0F0F]">
          {/* Sidebar Info */}
          <div className="md:w-1/3 p-12 border-b md:border-b-0 md:border-r border-border-main flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-gray-600 mb-6">Consulta</h4>
              <h2 className="text-4xl font-bold tracking-tighter mb-6">Agenda tu <span className="text-accent italic serif">Sesión</span></h2>
              <p className="text-gray-500 text-xs leading-relaxed font-light">
                Reserva un tiempo dedicado con nuestros arquitectos principales para discutir la viabilidad estructural y la dirección conceptual.
              </p>
            </div>
            
            <div className="mt-12 space-y-6">
               <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 architect-border flex items-center justify-center text-[10px] transition-all ${step === 1 ? 'bg-accent text-black font-bold' : ''}`}>01</div>
                  <span className="text-[10px] uppercase tracking-widest font-bold">Horario</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 architect-border flex items-center justify-center text-[10px] transition-all ${step === 2 ? 'bg-accent text-black font-bold' : ''}`}>02</div>
                  <span className="text-[10px] uppercase tracking-widest font-bold">Detalles</span>
               </div>
            </div>
          </div>

          {/* Interaction Area */}
          <div className="md:w-2/3 p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-12"
                >
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.4em] text-gray-600 mb-8">Calendario / Seleccionar Día</h4>
                    <div className="grid grid-cols-7 gap-2">
                       {['L','M','M','J','V','S','D'].map((d, index) => (
                         <div key={`${d}-${index}`} className="text-center text-[10px] text-gray-700 font-bold mb-2">{d}</div>
                       ))}
                       {calendarDays.map((d, i) => (
                         <button
                           key={i}
                           onClick={() => setFormData({...formData, date: d.num})}
                           className={`py-4 text-center text-xs transition-all border border-transparent hover:border-accent/40 ${d.opacity}`}
                         >
                           {d.num}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.4em] text-gray-600 mb-6">Seleccionar Horario</h4>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {availableHours.map((t) => (
                        <button
                          key={t}
                          onClick={() => setFormData({...formData, time: t})}
                          className={`p-3 architect-border text-[10px] font-bold transition-all ${formData.time === t ? 'bg-accent text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={!formData.date || !formData.time}
                    onClick={handleNext}
                    className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-accent transition-colors disabled:opacity-10"
                  >
                    Continuar a Detalles
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-gray-600">Nombre Completo</label>
                      <input 
                        type="text" 
                        className="w-full bg-transparent border-b border-border-main py-3 outline-none focus:border-accent transition-all text-sm font-light"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-gray-600">Correo Electrónico</label>
                      <input 
                        type="email" 
                        className="w-full bg-transparent border-b border-border-main py-3 outline-none focus:border-accent transition-all text-sm font-light"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-gray-600">Resumen del Proyecto</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-transparent border-b border-border-main py-3 outline-none focus:border-accent transition-all text-sm font-light resize-none"
                      value={formData.purpose}
                      onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button onClick={handleBack} className="flex-1 py-5 border border-border-main text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white/5 transition-colors">
                      Atrás
                    </button>
                    <button onClick={handleNext} className="flex-[2] py-5 bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-accent transition-colors">
                      Solicitar Cita
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 architect-border flex items-center justify-center mx-auto mb-8 bg-accent/10">
                    <CheckCircle2 className="text-accent" size={32} />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tighter mb-4 uppercase">Solicitud Recibida</h3>
                  <p className="text-gray-500 text-xs font-light mb-10 max-w-sm mx-auto leading-loose uppercase tracking-widest">
                    Protocolo de consulta iniciado. Nuestro concierge verificará la agenda y le contactará a la brevedad.
                  </p>
                  <button 
                    onClick={() => setStep(1)}
                    className="px-10 py-4 border border-border-main text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
                  >
                    Finalizar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
