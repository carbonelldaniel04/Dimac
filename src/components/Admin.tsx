import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { 
  fetchProjects, 
  saveProject, 
  deleteProject, 
  fetchServices, 
  saveService, 
  deleteService, 
  fetchSettings, 
  saveSettings, 
  fetchMessages, 
  deleteMessage, 
  fetchBookings, 
  deleteBooking, 
  seedDefaultData,
  ProjectItem,
  ServiceItem,
  SiteSettings,
  ContactMessage,
  BookingItem,
  DEFAULT_SETTINGS
} from '../lib/dataStore';
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Calendar, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  ExternalLink,
  ShieldCheck,
  RefreshCcw,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { PROJECTS, SERVICES } from '../constants';

type Tab = 'projects' | 'services' | 'messages' | 'bookings' | 'settings';

export default function Admin() {
  const [user, setUser] = useState<User | { email: string; displayName?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const navigate = useNavigate();

  // Data states
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [homepageSettings, setHomepageSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  
  // UI states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isAdding, setIsAdding] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Check local auth first for immediate access
    const localAuth = localStorage.getItem('factoriarq_admin_auth');
    if (localAuth) {
      try {
        const parsed = JSON.parse(localAuth);
        setUser(parsed);
        setIsAdmin(true);
      } catch (e) {}
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAdmin(true);
      } else if (!localAuth) {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleClaimAdmin = async () => {
    setIsAdmin(true);
    localStorage.setItem('factoriarq_admin_auth', JSON.stringify({
      email: user?.email || 'carbonelldaniel04@gmail.com',
      role: 'admin'
    }));
    setStatusMsg({ type: 'success', text: 'Permisos de administrador activados correctamente.' });
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'projects') {
        const data = await fetchProjects();
        setProjects(data);
      } else if (activeTab === 'services') {
        const data = await fetchServices();
        setServices(data);
      } else if (activeTab === 'messages') {
        const data = await fetchMessages();
        setMessages(data);
      } else if (activeTab === 'bookings') {
        const data = await fetchBookings();
        setBookings(data);
      } else if (activeTab === 'settings') {
        const data = await fetchSettings();
        setHomepageSettings(data);
        setFormData(data);
      }
    } catch (error) {
      console.warn('Error loading data in Admin:', error);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('factoriarq_admin_auth');
    try {
      await signOut(auth);
    } catch (e) {}
    navigate('/login');
  };

  const seedData = async () => {
    try {
      setLoading(true);
      await seedDefaultData();
      setStatusMsg({ type: 'success', text: 'Datos iniciales restaurados y sincronizados correctamente.' });
      await fetchData();
    } catch (error) {
      setStatusMsg({ type: 'error', text: 'Error al cargar datos iniciales.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await saveSettings(formData);
      setHomepageSettings(formData);
      setStatusMsg({ type: 'success', text: 'Contenidos de la web actualizados correctamente.' });
    } catch (error) {
      console.error(error);
      setStatusMsg({ type: 'error', text: 'Error al guardar los contenidos.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string | null) => {
    try {
      setLoading(true);
      if (activeTab === 'projects') {
        await saveProject(formData, id || undefined);
      } else if (activeTab === 'services') {
        await saveService(formData, id || undefined);
      }
      setStatusMsg({ type: 'success', text: id ? 'Actualizado correctamente.' : 'Creado correctamente.' });
      setEditingId(null);
      setIsAdding(false);
      setFormData({});
      await fetchData();
    } catch (error) {
      console.error('Error saving:', error);
      setStatusMsg({ type: 'error', text: 'Error al guardar.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmingDeleteId(id);
  };

  const executeDelete = async (id: string) => {
    try {
      setLoading(true);
      if (activeTab === 'projects') {
        await deleteProject(id);
      } else if (activeTab === 'services') {
        await deleteService(id);
      } else if (activeTab === 'messages') {
        await deleteMessage(id);
      } else if (activeTab === 'bookings') {
        await deleteBooking(id);
      }
      setStatusMsg({ type: 'success', text: 'Eliminado correctamente.' });
      setConfirmingDeleteId(null);
      await fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      setStatusMsg({ type: 'error', text: 'Error al eliminar registro.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-primary">
        <RefreshCcw className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-bg-primary text-center p-8 md:p-12">
        <ShieldCheck className="text-accent mb-6" size={64} />
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4 uppercase">Permisos Requeridos</h2>
        <p className="text-gray-400 text-xs font-light max-w-sm mb-8 uppercase tracking-widest leading-loose">
          Sesión iniciada con <span className="text-white font-bold">{user?.email || 'Usuario'}</span>. Haz clic abajo para activar tus privilegios de administrador.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleClaimAdmin}
            className="px-8 py-4 bg-accent text-black font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all"
          >
            Activar Acceso Administrador
          </button>
          <button 
            onClick={handleLogout}
            className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white/10 transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col md:flex-row">
      {/* Admin Sidebar / Top Bar on Mobile */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border-main flex flex-row md:flex-col p-4 md:p-8 bg-[#0F0F0F] sticky top-0 z-50 md:h-screen overflow-x-auto md:overflow-x-visible">
        <div className="mb-0 md:mb-12 mr-8 md:mr-0 flex-shrink-0">
          <div className="text-lg md:text-xl font-bold tracking-tighter uppercase mb-0 md:mb-2 whitespace-nowrap">ADMIN PANEL</div>
          <div className="hidden md:block text-[9px] uppercase tracking-widest text-accent font-bold">Dimac Arq Atelier</div>
        </div>

        <nav className="flex flex-row md:flex-col flex-1 space-x-2 md:space-x-0 md:space-y-4">
          {[
            { id: 'projects', label: 'Proyectos', icon: Briefcase },
            { id: 'services', label: 'Servicios', icon: LayoutDashboard },
            { id: 'messages', label: 'Mensajes', icon: MessageSquare },
            { id: 'bookings', label: 'Reservas', icon: Calendar },
            { id: 'settings', label: 'Contenidos', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as Tab);
                setIsAdding(false);
                setEditingId(null);
              }}
              className={`flex items-center gap-2 md:gap-4 py-2 md:py-4 px-4 md:px-6 text-[9px] md:text-[10px] uppercase tracking-widest font-bold transition-all border-b-2 md:border-b-0 md:border-l-2 whitespace-nowrap ${activeTab === item.id ? 'bg-accent/10 border-accent text-accent' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
              <item.icon size={14} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="ml-auto md:ml-0 md:mt-auto flex items-center gap-2 md:gap-4 py-2 md:py-4 px-4 md:px-6 text-[9px] md:text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all font-bold"
        >
          <LogOut size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Salir</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-2 md:mb-4">{activeTab}</h1>
              <p className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-widest font-light italic">Gestión de base de datos en tiempo real.</p>
            </div>
            
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              {(activeTab === 'projects' || activeTab === 'services') && !isAdding && !editingId && (
                <button 
                  onClick={() => {
                    setIsAdding(true);
                    setFormData({});
                    setEditingId(null);
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 py-3 md:py-4 px-6 md:px-8 bg-white text-black font-bold uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-accent transition-all"
                >
                  <Plus size={14} /> Añadir Nuevo
                </button>
              )}
              
              {(activeTab === 'projects' || activeTab === 'services') && (
                <button 
                  onClick={seedData}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 py-3 md:py-4 px-6 md:px-8 border border-white/20 text-gray-400 hover:text-white hover:border-white font-bold uppercase tracking-widest text-[9px] md:text-[10px] transition-all"
                  title="Restaura o sincroniza los datos predeterminados en Firestore"
                >
                  <RefreshCcw size={14} /> Sincronizar Predeterminados
                </button>
              )}
            </div>
          </div>

          {statusMsg && (
            <div className={`mb-12 p-5 border flex justify-between items-center ${statusMsg.type === 'success' ? 'bg-accent/5 border-accent/30 text-accent' : 'bg-red-900/10 border-red-500/30 text-red-500'}`}>
              <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest">{statusMsg.text}</span>
              <button onClick={() => setStatusMsg(null)}><X size={14} /></button>
            </div>
          )}

          {/* Dedicated Edit / Create Form for Projects & Services */}
          {(isAdding || editingId) && (activeTab === 'projects' || activeTab === 'services') && (
            <div className="mb-12 architect-border p-6 md:p-10 bg-[#121212] animate-in fade-in slide-in-from-top-4 duration-400 border border-accent/40">
              <div className="flex justify-between items-center mb-8 border-b border-border-main pb-4">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-accent font-bold block mb-1">
                    {editingId ? 'Modificar Registro' : 'Nuevo Registro'}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight uppercase">
                    {editingId ? (formData.title || 'Editar Elemento') : `Crear ${activeTab === 'projects' ? 'Proyecto' : 'Servicio'}`}
                  </h3>
                </div>
                <button 
                  onClick={() => { setIsAdding(false); setEditingId(null); setFormData({}); }}
                  className="text-gray-500 hover:text-white p-2"
                >
                  <X size={20} />
                </button>
              </div>

              {activeTab === 'projects' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Título del Proyecto</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/[0.03] border border-border-main p-3 text-sm text-white focus:border-accent outline-none" 
                        value={formData.title || ''}
                        placeholder="Ej: Residencia Monolito V"
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Ubicación</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/[0.03] border border-border-main p-3 text-sm text-white focus:border-accent outline-none" 
                        value={formData.location || ''}
                        placeholder="Ej: Madrid, España"
                        onChange={e => setFormData({...formData, location: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Categoría</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {['Residencial', 'Interiorismo', 'Conceptual', 'Comercial', 'Paisajismo'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData({...formData, category: cat})}
                          className={`px-3 py-1 text-[9px] uppercase tracking-widest border transition-all ${formData.category === cat ? 'border-accent bg-accent/20 text-accent font-bold' : 'border-border-main text-gray-400 hover:text-white'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      className="w-full bg-white/[0.03] border border-border-main p-3 text-sm text-white focus:border-accent outline-none" 
                      value={formData.category || ''}
                      placeholder="O escribe una categoría personalizada..."
                      onChange={e => setFormData({...formData, category: e.target.value})} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">URL de la Imagen</label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-1 w-full space-y-3">
                        <input 
                          type="text" 
                          className="w-full bg-white/[0.03] border border-border-main p-3 text-xs text-white focus:border-accent outline-none font-mono" 
                          value={formData.image || ''}
                          placeholder="https://images.unsplash.com/..."
                          onChange={e => setFormData({...formData, image: e.target.value})} 
                        />
                        <div className="text-[9px] text-gray-500 flex flex-wrap items-center gap-2">
                          <span className="uppercase font-bold">Imágenes Sugeridas:</span>
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'})}
                            className="text-accent underline hover:text-white"
                          >
                            Hormigón & Nogal
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'})}
                            className="text-accent underline hover:text-white"
                          >
                            Residencia Brutalista
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'})}
                            className="text-accent underline hover:text-white"
                          >
                            Pabellón Luz
                          </button>
                        </div>
                      </div>
                      {formData.image && (
                        <div className="w-28 h-20 border border-border-main overflow-hidden bg-black flex-shrink-0 relative group">
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Descripción del Proyecto</label>
                    <textarea 
                      className="w-full bg-white/[0.03] border border-border-main p-3 text-xs text-white focus:border-accent outline-none leading-relaxed" 
                      rows={3} 
                      value={formData.description || ''}
                      placeholder="Detalles sobre el diseño, materiales y concepto..."
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border-main">
                    <button 
                      onClick={() => handleSave(editingId)} 
                      className="py-4 px-10 bg-accent text-black font-bold uppercase text-[10px] tracking-widest hover:bg-white transition-all text-center flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      {editingId ? 'Guardar Cambios del Proyecto' : 'Crear Proyecto en Firebase'}
                    </button>
                    <button 
                      onClick={() => { setIsAdding(false); setEditingId(null); setFormData({}); }} 
                      className="py-4 px-8 border border-white/20 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all text-center"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Título del Servicio</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/[0.03] border border-border-main p-3 text-sm text-white focus:border-accent outline-none" 
                        value={formData.title || ''}
                        placeholder="Ej: Arquitectura Residencial"
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Nombre del Icono (Lucide)</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/[0.03] border border-border-main p-3 text-sm text-white focus:border-accent outline-none font-mono" 
                        value={formData.icon || 'Compass'}
                        placeholder="Compass, Box, Layers, Maximize2..."
                        onChange={e => setFormData({...formData, icon: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Descripción del Servicio</label>
                    <textarea 
                      className="w-full bg-white/[0.03] border border-border-main p-3 text-xs text-white focus:border-accent outline-none leading-relaxed" 
                      rows={3} 
                      value={formData.description || ''}
                      placeholder="Descripción detallada de la disciplina..."
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border-main">
                    <button 
                      onClick={() => handleSave(editingId)} 
                      className="py-4 px-10 bg-accent text-black font-bold uppercase text-[10px] tracking-widest hover:bg-white transition-all text-center flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      {editingId ? 'Guardar Cambios del Servicio' : 'Crear Servicio en Firebase'}
                    </button>
                    <button 
                      onClick={() => { setIsAdding(false); setEditingId(null); setFormData({}); }} 
                      className="py-4 px-8 border border-white/20 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all text-center"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab View */}
          {activeTab === 'settings' ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* HERO FORM */}
                <div className="architect-border p-8 bg-white/5 space-y-6">
                  <h3 className="text-[10px] uppercase font-bold tracking-[0.4em] text-accent mb-4">Sección Hero (Portada)</h3>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Título de Portada</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-transparent border border-border-main p-3 focus:border-accent outline-none text-sm font-light leading-relaxed"
                      value={formData.heroTitle || ''}
                      onChange={e => setFormData({...formData, heroTitle: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Descripción de Portada</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-transparent border border-border-main p-3 focus:border-accent outline-none text-xs text-gray-400 font-light leading-relaxed"
                      value={formData.heroDescription || ''}
                      onChange={e => setFormData({...formData, heroDescription: e.target.value})}
                    />
                  </div>
                </div>

                {/* ABOUT FORM */}
                <div className="architect-border p-8 bg-white/5 space-y-6">
                  <h3 className="text-[10px] uppercase font-bold tracking-[0.4em] text-accent mb-4">Sección Filosofía</h3>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Título de la Sección</label>
                    <textarea 
                      rows={2}
                      className="w-full bg-transparent border border-border-main p-3 focus:border-accent outline-none text-sm font-light leading-relaxed"
                      value={formData.aboutTitle || ''}
                      onChange={e => setFormData({...formData, aboutTitle: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Párrafo 1 de Filosofía</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-transparent border border-border-main p-3 focus:border-accent outline-none text-xs text-gray-400 font-light leading-relaxed"
                      value={formData.aboutText1 || ''}
                      onChange={e => setFormData({...formData, aboutText1: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Párrafo 2 de Filosofía</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-transparent border border-border-main p-3 focus:border-accent outline-none text-xs text-gray-400 font-light leading-relaxed"
                      value={formData.aboutText2 || ''}
                      onChange={e => setFormData({...formData, aboutText2: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Años de Trayectoria</label>
                      <input 
                        type="text" 
                        className="w-full bg-transparent border-b border-border-main py-2 focus:border-accent outline-none text-sm font-bold"
                        value={formData.statsYears || ''}
                        onChange={e => setFormData({...formData, statsYears: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Proyectos Realizados</label>
                      <input 
                        type="text" 
                        className="w-full bg-transparent border-b border-border-main py-2 focus:border-accent outline-none text-sm font-bold"
                        value={formData.statsProjects || ''}
                        onChange={e => setFormData({...formData, statsProjects: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button 
                  onClick={handleSaveSettings}
                  className="w-full md:w-auto px-12 py-5 bg-accent text-black font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white hover:text-black transition-all"
                >
                  Guardar Contenidos en Firebase
                </button>
              </div>
            </div>
          ) : (
            /* Data Tables for Projects, Services, Messages, Bookings */
            <div className="architect-border bg-[#0F0F0F] overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-border-main text-[9px] uppercase tracking-widest text-gray-600">
                    {activeTab === 'projects' && (
                      <>
                        <th className="p-6 font-bold">Proyecto</th>
                        <th className="p-6 font-bold">Localización</th>
                        <th className="p-6 font-bold">Categoría</th>
                        <th className="p-6 font-bold text-right">Acciones</th>
                      </>
                    )}
                    {activeTab === 'services' && (
                      <>
                        <th className="p-6 font-bold">Servicio</th>
                        <th className="p-6 font-bold">Descripción</th>
                        <th className="p-6 font-bold text-right">Acciones</th>
                      </>
                    )}
                    {activeTab === 'messages' && (
                      <>
                        <th className="p-6 font-bold">Remitente</th>
                        <th className="p-6 font-bold">Mensaje</th>
                        <th className="p-6 font-bold text-right">Fecha</th>
                      </>
                    )}
                    {activeTab === 'bookings' && (
                      <>
                        <th className="p-6 font-bold">Cliente</th>
                        <th className="p-6 font-bold">Fecha / Hora</th>
                        <th className="p-6 font-bold">Propósito</th>
                        <th className="p-6 font-bold text-right">Acciones</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/50">
                  {activeTab === 'projects' && projects.map(p => (
                    <tr key={p.id} className={`text-[11px] group transition-colors ${editingId === p.id ? 'bg-accent/10 border-l-2 border-accent' : 'hover:bg-white/[0.02]'}`}>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="w-12 h-10 object-cover grayscale group-hover:grayscale-0 transition-all border border-white/10" alt="" referrerPolicy="no-referrer" />
                          <div>
                            <span className="font-bold block text-white text-xs">{p.title}</span>
                            <span className="text-[9px] text-gray-500 line-clamp-1 max-w-xs">{p.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-gray-400">{p.location}</span>
                      </td>
                      <td className="p-6 font-mono">
                        <span className="px-2 py-1 bg-white/5 border border-white/10 text-[9px] uppercase tracking-wider text-accent">{p.category}</span>
                      </td>
                      <td className="p-6 text-right space-x-3 whitespace-nowrap">
                        {confirmingDeleteId === p.id ? (
                          <div className="flex items-center justify-end gap-2 animate-in fade-in slide-in-from-right-2">
                            <span className="text-[8px] uppercase font-bold text-red-500 mr-2">¿Eliminar?</span>
                            <button onClick={() => executeDelete(p.id)} className="bg-red-500 text-white p-2 hover:bg-red-600 rounded transition-colors" title="Confirmar eliminación"><CheckCircle2 size={14} /></button>
                            <button onClick={() => setConfirmingDeleteId(null)} className="text-gray-500 p-2 hover:text-white transition-colors" title="Cancelar"><X size={14} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => { 
                                setEditingId(p.id); 
                                setFormData(p); 
                                setIsAdding(false); 
                                setConfirmingDeleteId(null); 
                              }} 
                              className="px-3 py-1.5 border border-white/20 text-gray-300 hover:text-black hover:bg-white transition-all text-[9px] uppercase tracking-widest font-bold flex items-center gap-1.5"
                            >
                              <Edit2 size={12} /> Editar
                            </button>
                            <button 
                              onClick={() => { handleDelete(p.id); setEditingId(null); }} 
                              className="p-1.5 text-gray-600 hover:text-red-500 transition-colors" 
                              title="Eliminar proyecto"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'services' && services.map(s => (
                    <tr key={s.id} className={`text-[11px] group transition-colors ${editingId === s.id ? 'bg-accent/10 border-l-2 border-accent' : 'hover:bg-white/[0.02]'}`}>
                      <td className="p-6">
                        <span className="font-bold text-white text-xs">{s.title}</span>
                        <span className="text-[9px] text-accent block font-mono">Icon: {s.icon}</span>
                      </td>
                      <td className="p-6">
                        <span className="text-gray-400 italic max-w-md block line-clamp-2">{s.description}</span>
                      </td>
                      <td className="p-6 text-right space-x-3 whitespace-nowrap">
                        {confirmingDeleteId === s.id ? (
                          <div className="flex items-center justify-end gap-2 animate-in fade-in slide-in-from-right-2">
                            <span className="text-[8px] uppercase font-bold text-red-500 mr-2">¿Eliminar?</span>
                            <button onClick={() => executeDelete(s.id)} className="bg-red-500 text-white p-2 hover:bg-red-600 rounded transition-colors group"><CheckCircle2 size={14} /></button>
                            <button onClick={() => setConfirmingDeleteId(null)} className="text-gray-500 p-2 hover:text-white transition-colors"><X size={14} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => { 
                                setEditingId(s.id); 
                                setFormData(s); 
                                setIsAdding(false); 
                                setConfirmingDeleteId(null); 
                              }} 
                              className="px-3 py-1.5 border border-white/20 text-gray-300 hover:text-black hover:bg-white transition-all text-[9px] uppercase tracking-widest font-bold flex items-center gap-1.5"
                            >
                              <Edit2 size={12} /> Editar
                            </button>
                            <button 
                              onClick={() => { handleDelete(s.id); setEditingId(null); }} 
                              className="p-1.5 text-gray-600 hover:text-red-500 transition-colors" 
                              title="Eliminar servicio"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'messages' && messages.map(m => (
                    <tr key={m.id} className="text-[11px] group hover:bg-white/[0.02] transition-colors">
                      <td className="p-6">
                        <div className="font-bold uppercase tracking-widest text-[9px] mb-1">{m.firstName} {m.lastName}</div>
                        <div className="text-accent underline opacity-60">{m.email}</div>
                      </td>
                      <td className="p-6 text-gray-400 font-light leading-relaxed max-w-sm">{m.message}</td>
                      <td className="p-6 text-right text-gray-600 font-mono text-[9px]">
                        <div className="flex items-center justify-end gap-4">
                          <span>{m.createdAt?.toDate?.() ? m.createdAt.toDate().toLocaleDateString() : 'Reciente'}</span>
                          {confirmingDeleteId === m.id ? (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                              <button onClick={() => executeDelete(m.id)} className="bg-red-500 text-white p-1 hover:bg-red-600 rounded transition-colors"><CheckCircle2 size={12} /></button>
                              <button onClick={() => setConfirmingDeleteId(null)} className="text-gray-500 p-1 hover:text-white transition-colors"><X size={12} /></button>
                            </div>
                          ) : (
                            <button onClick={() => handleDelete(m.id)} className="text-gray-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100" title="Eliminar mensaje"><Trash2 size={14} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'bookings' && bookings.map(b => (
                    <tr key={b.id} className="text-[11px] group hover:bg-white/[0.02] transition-colors text-left uppercase tracking-tighter">
                      <td className="p-6">
                        <div className="font-bold text-[10px] mb-1 uppercase">{b.name}</div>
                        <div className="text-gray-600">{b.email}</div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-accent font-bold">
                          <Calendar size={12} /> {b.date} / {b.time}
                        </div>
                      </td>
                      <td className="p-6 text-gray-500 italic truncate max-w-xs">{b.purpose}</td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <span className="px-3 py-1 bg-green-900/20 text-green-500 text-[8px] uppercase font-bold tracking-widest border border-green-500/30">Pendiente</span>
                          {confirmingDeleteId === b.id ? (
                            <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                              <button onClick={() => executeDelete(b.id)} className="bg-red-500 text-white p-1 hover:bg-red-600 rounded transition-colors" title="Confirmar eliminación"><CheckCircle2 size={12} /></button>
                              <button onClick={() => setConfirmingDeleteId(null)} className="text-gray-500 p-1 hover:text-white transition-colors" title="Cancelar"><X size={12} /></button>
                            </div>
                          ) : (
                            <button onClick={() => handleDelete(b.id)} className="text-gray-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100" title="Eliminar reserva"><Trash2 size={14} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {((activeTab === 'projects' && projects.length === 0) || 
                (activeTab === 'services' && services.length === 0) ||
                (activeTab === 'messages' && messages.length === 0) ||
                (activeTab === 'bookings' && bookings.length === 0)) && !isAdding && (
                <div className="p-20 text-center">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-gray-700 italic">No se encontraron registros en esta sección.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
