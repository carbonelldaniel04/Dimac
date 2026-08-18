import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, MapPin } from 'lucide-react';
import { fetchProjects, ProjectItem } from '../lib/dataStore';

export default function Projects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    fetchProjects().then(data => {
      setProjects(data);
    });
  }, []);

  return (
    <section id="projects" className="py-24 bg-bg-primary border-t border-border-main scroll-mt-20">
      <div className="container mx-auto px-6">
        {/* ... header ... */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-600 mb-4 block">02 // PORTAFOLIO</span>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.8] mb-8">
              Galería <br />
              <span className="text-accent italic font-light lowercase">Monolítica.</span>
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-md text-gray-500 font-light text-sm leading-relaxed"
          >
            Una intersección curada entre estructura y alma. Residencias minimalistas diseñadas con nogal, hormigón bruto y luz matutina.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-main border border-border-main">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id || idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-bg-primary p-8 md:p-12 hover:bg-bg-secondary transition-colors"
            >
              <div className="relative aspect-video overflow-hidden architect-border mb-8">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-accent font-bold mb-2 block">{project.category}</span>
                  <h3 className="text-2xl font-bold tracking-tighter">{project.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 font-mono text-[9px] uppercase tracking-widest mt-2">
                    <MapPin size={10} />
                    <span>{project.location}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="text-[10px] font-mono text-gray-700 mb-4">M00{idx + 1}</div>
                   <motion.div 
                      whileHover={{ x: 5 }}
                      className="w-10 h-10 architect-border flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all cursor-pointer"
                    >
                      <ExternalLink size={16} />
                    </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
