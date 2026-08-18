import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fetchSettings, SiteSettings, DEFAULT_SETTINGS } from '../lib/dataStore';

export default function About() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetchSettings().then(data => {
      if (data) {
        setSettings(data);
      }
    });
  }, []);

  return (
    <section id="about" className="py-24 bg-bg-secondary relative overflow-hidden border-t border-border-main scroll-mt-20">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="architect-border p-4 bg-bg-primary"
          >
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600" 
              alt="Atelier Dimac Arq" 
              className="grayscale opacity-80"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-600 mb-6 block">03 // FILOSOFÍA</span>
            <h2 className="text-3xl md:text-6xl font-light tracking-tight mb-8 leading-tight uppercase whitespace-pre-line">
              {settings.aboutTitle}
            </h2>
            <div className="space-y-6 text-gray-500 font-light leading-relaxed text-sm max-w-lg">
              <p>
                {settings.aboutText1}
              </p>
              <p>
                {settings.aboutText2}
              </p>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-px bg-border-main border border-border-main max-w-sm">
              <div className="bg-bg-secondary p-6">
                <h4 className="text-2xl font-bold text-white mb-2">{settings.statsYears}</h4>
                <p className="text-[9px] uppercase tracking-widest text-gray-600">Años de Trayectoria</p>
              </div>
              <div className="bg-bg-secondary p-6">
                <h4 className="text-2xl font-bold text-white mb-2">{settings.statsProjects}</h4>
                <p className="text-[9px] uppercase tracking-widest text-gray-600">Proyectos</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
