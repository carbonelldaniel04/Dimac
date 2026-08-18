import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { fetchServices, ServiceItem } from '../lib/dataStore';

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    fetchServices().then(data => {
      setServices(data);
    });
  }, []);

  return (
    <section id="services" className="py-24 bg-bg-primary border-t border-border-main scroll-mt-20">
      <div className="container mx-auto px-6">
        {/* ... header ... */}
        <div className="mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-600 mb-4 block"
          >
            04 // SERVICIOS
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-bold tracking-tighter uppercase leading-none"
          >
            Saber-Hacer <br />
            <span className="font-light italic text-accent lowercase">Articulado.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border-main border border-border-main">
          {services.map((service, idx) => {
            const IconComponent = (Icons as any)[service.icon];
            return (
              <motion.div
                key={service.id || idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-12 bg-bg-primary hover:bg-bg-secondary transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-gray-800">S.00{idx + 1}</div>
                <div className="w-1 h-8 bg-accent mb-10 group-hover:h-12 transition-all"></div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6">{service.title}</h3>
                <p className="text-gray-600 text-xs font-light leading-loose">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
