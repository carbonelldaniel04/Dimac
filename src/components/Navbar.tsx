import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'Portada', href: isHome ? '#' : '/', id: '01' },
    { name: 'Proyectos', href: isHome ? '#projects' : '/#projects', id: '02' },
    { name: 'Filosofía', href: isHome ? '#about' : '/#about', id: '03' },
    { name: 'Servicios', href: isHome ? '#services' : '/#services', id: '04' },
    { name: 'Reserva', href: isHome ? '#booking' : '/#booking', id: '05' },
    { name: 'Contacto', href: isHome ? '#contact' : '/#contact', id: '06' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[280px] h-screen sticky top-0 border-r border-border-main flex-col p-12 bg-bg-secondary z-50 relative overflow-hidden">
        {/* Background Brushstroke Decoration */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10">
          <svg viewBox="0 0 200 400" className="w-full h-full" preserveAspectRatio="none">
            <path 
              d="M180,400 C150,350 160,300 120,250 C80,200 90,150 50,100 C10,50 20,20 0,0 L0,400 Z" 
              fill="#5D4037" 
            />
          </svg>
        </div>
        <div className="mb-20">
          <Link to="/" className="text-3xl font-bold tracking-tighter uppercase mb-1 block">DIMAC ARQ</Link>
          <div className="text-[10px] tracking-[0.4em] uppercase text-gray-600 opacity-80">Estudio de Arquitectura</div>
        </div>

        <nav className="flex-1 space-y-8">
          {navLinks.map((link) => (
            link.href.startsWith('/') ? (
              <Link
                key={link.name}
                to={link.href}
                className="block text-[11px] uppercase tracking-[0.3em] text-white/40 hover:text-accent transition-all font-semibold flex items-center gap-4 group"
              >
                <span className="text-[9px] opacity-20 group-hover:opacity-100">{link.id}.</span>
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="block text-[11px] uppercase tracking-[0.3em] text-white/40 hover:text-accent transition-all font-semibold flex items-center gap-4 group"
              >
                <span className="text-[9px] opacity-20 group-hover:opacity-100">{link.id}.</span>
                {link.name}
              </a>
            )
          ))}
        </nav>

        <div className="mt-auto pt-10 border-t border-white/5">
          <Link 
            to="/admin" 
            className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-600 hover:text-accent mb-6 flex items-center gap-2 transition-colors"
          >
            <Settings size={14} /> Panel Administrador
          </Link>
          <div className="text-[9px] text-gray-600 uppercase tracking-[0.3em] mb-6 leading-loose">
            Basados en CDMX / <br /> Madrid / Nueva York
          </div>
          <div className="flex space-x-4 opacity-20">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-3 h-3 border border-white"></div>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <nav className="md:hidden fixed top-0 left-0 w-full z-[60] bg-bg-secondary border-b border-border-main p-6 flex justify-between items-center px-8">
        <Link to="/" className="text-xl font-bold tracking-tighter uppercase">DIMAC ARQ</Link>
        <button 
          className="text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="md:hidden fixed inset-0 bg-bg-primary z-[70] p-12 flex flex-col justify-center gap-8 overflow-hidden"
          >
            {/* Background Brushstroke Decoration */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none -z-10">
              <svg viewBox="0 0 200 400" className="w-full h-full" preserveAspectRatio="none">
                <path 
                  d="M180,400 C150,350 160,300 120,250 C80,200 90,150 50,100 C10,50 20,20 0,0 L0,400 Z" 
                  fill="#5D4037" 
                />
              </svg>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 text-white">
              <X size={32} />
            </button>
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-bold tracking-tighter uppercase text-white/40 hover:text-accent"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-bold tracking-tighter uppercase text-white/40 hover:text-accent"
                >
                  {link.name}
                </a>
              )
            ))}
            <Link 
              to="/admin" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-8 text-lg font-bold uppercase tracking-widest text-accent flex items-center gap-2"
            >
              <Settings size={20} /> Admin
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
