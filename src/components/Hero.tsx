import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fetchSettings, SiteSettings } from '../lib/dataStore';

export default function Hero() {
  const [settings, setSettings] = useState<SiteSettings>({
    heroTitle: "Estructura\nTrascendente.",
    heroDescription: "Residencias minimalistas diseñadas con nogal, concreto bruto y la captura precisa de la luz matutina."
  });

  useEffect(() => {
    fetchSettings().then(data => {
      if (data) {
        setSettings(data);
      }
    });
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] w-full flex flex-col md:flex-row overflow-hidden border-b border-border-main">
      {/* Left Content Column */}
      <div className="w-full md:w-3/5 relative z-20 flex flex-col justify-end p-12 md:p-20 pb-20 md:pb-32">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-8"
        >
          <div className="w-12 h-[1px] bg-accent mb-8"></div>
          <h1 className="text-5xl md:text-8xl font-light tracking-tight leading-[0.9] mb-6 whitespace-pre-line">
            {settings.heroTitle}
          </h1>
          <p className="text-xs md:text-base text-white/50 max-w-sm mb-10 leading-relaxed font-light">
            {settings.heroDescription}
          </p>
          <motion.button
            whileHover={{ backgroundColor: 'rgba(154, 132, 113, 0.2)' }}
            className="px-8 py-4 border border-accent bg-accent/10 text-accent text-xs uppercase tracking-[0.3em] font-bold transition-all"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ver Portafolio
          </motion.button>
        </motion.div>
      </div>

      {/* Right Image Column */}
      <div className="w-full md:w-2/5 relative border-l border-border-main bg-bg-secondary">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600')` }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-t from-bg-primary via-transparent to-transparent"></div>
        
        {/* Floating Detail */}
        <div className="absolute top-12 right-12 text-right hidden md:block">
           <div className="text-[10px] uppercase tracking-[0.4em] text-accent mb-2">Excelencia</div>
           <div className="text-[9px] text-white/30 uppercase tracking-widest font-mono">01 // LAT 19.43 / LON -99.13</div>
        </div>
      </div>
    </section>
  );
}
