import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="bg-bg-secondary py-20 border-t border-border-main">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="text-3xl font-bold tracking-tighter uppercase mb-6">DIMAC ARQ</div>
            <p className="text-gray-600 text-xs font-light max-w-sm leading-relaxed uppercase tracking-widest">
              Replanteando el diálogo entre la estructura y el alma. Sede en CDMX y Madrid.
            </p>
          </div>

          <div>
             <h5 className="text-[10px] uppercase font-bold tracking-[0.3em] text-white mb-6">Navegación</h5>
             <ul className="space-y-3">
                {['Proyectos', 'Servicios', 'Atelier', 'Consultas'].map(item => (
                  <li key={item}><a href="#" className="text-[10px] text-gray-600 hover:text-accent transition-colors uppercase tracking-widest font-bold">{item}</a></li>
                ))}
             </ul>
          </div>

          <div>
             <h5 className="text-[10px] uppercase font-bold tracking-[0.3em] text-white mb-6">Conexión</h5>
             <ul className="space-y-3">
                {['Instagram', 'Behance', 'LinkedIn'].map(item => (
                  <li key={item}><a href="#" className="text-[10px] text-gray-600 hover:text-accent transition-colors uppercase tracking-widest font-bold">{item}</a></li>
                ))}
             </ul>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-white/5 flex justify-between items-center">
           <div className="text-[8px] tracking-[0.5em] text-gray-700 uppercase font-black">2026 // DIMAC ARQ STUDIO</div>
           <div className="text-[8px] tracking-[0.5em] text-gray-700 uppercase">Arquitectura / Diseño / Ética</div>
        </div>
      </div>
    </footer>
  );
}
