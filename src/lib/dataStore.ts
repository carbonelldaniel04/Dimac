import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { PROJECTS as STATIC_PROJECTS, SERVICES as STATIC_SERVICES } from '../constants';

export interface ProjectItem {
  id: string;
  title: string;
  location: string;
  category: string;
  image: string;
  description: string;
  createdAt?: any;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SiteSettings {
  heroTitle?: string;
  heroDescription?: string;
  aboutTitle?: string;
  aboutText1?: string;
  aboutText2?: string;
  statsYears?: string;
  statsProjects?: string;
}

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt?: any;
}

export interface BookingItem {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  purpose: string;
  status?: string;
  createdAt?: any;
}

// LocalStorage Keys
const KEYS = {
  PROJECTS: 'factoriarq_db_projects',
  SERVICES: 'factoriarq_db_services',
  SETTINGS: 'factoriarq_db_settings',
  MESSAGES: 'factoriarq_db_messages',
  BOOKINGS: 'factoriarq_db_bookings',
  AUTH: 'factoriarq_admin_auth'
};

// Safe LocalStorage helpers
export function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

// ==================== PROJECTS ====================
export async function fetchProjects(): Promise<ProjectItem[]> {
  try {
    const snap = await getDocs(collection(db, 'projects'));
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() })) as ProjectItem[];
      setLocal(KEYS.PROJECTS, items);
      return items;
    }
  } catch (err) {
    // Firestore offline or unprovisioned, continue with local
  }
  
  const local = getLocal<ProjectItem[]>(KEYS.PROJECTS, []);
  if (local.length > 0) return local;

  // Initialize with static default projects
  setLocal(KEYS.PROJECTS, STATIC_PROJECTS as ProjectItem[]);
  return STATIC_PROJECTS as ProjectItem[];
}

export async function saveProject(project: Partial<ProjectItem>, id?: string): Promise<string> {
  const currentProjects = await fetchProjects();
  const targetId = id || (project.id && project.id.length > 3 ? project.id : `proj_${Date.now()}`);
  const payload = {
    ...project,
    id: targetId,
    updatedAt: new Date().toISOString()
  } as ProjectItem;

  // Try Firestore
  try {
    await setDoc(doc(db, 'projects', targetId), {
      ...payload,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    // Firestore offline, continue locally
  }

  // Update Local
  const existingIdx = currentProjects.findIndex(p => p.id === targetId);
  let updatedList: ProjectItem[];
  if (existingIdx >= 0) {
    updatedList = [...currentProjects];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...payload };
  } else {
    updatedList = [payload, ...currentProjects];
  }
  setLocal(KEYS.PROJECTS, updatedList);
  return targetId;
}

export async function deleteProject(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (err) {
    // Firestore offline
  }
  const current = getLocal<ProjectItem[]>(KEYS.PROJECTS, STATIC_PROJECTS as ProjectItem[]);
  setLocal(KEYS.PROJECTS, current.filter(p => p.id !== id));
}

// ==================== SERVICES ====================
export async function fetchServices(): Promise<ServiceItem[]> {
  try {
    const snap = await getDocs(collection(db, 'services'));
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() })) as ServiceItem[];
      setLocal(KEYS.SERVICES, items);
      return items;
    }
  } catch (err) {
    // Firestore offline
  }

  const local = getLocal<ServiceItem[]>(KEYS.SERVICES, []);
  if (local.length > 0) return local;

  const defaultServices = STATIC_SERVICES.map((s, i) => ({ id: `serv_${i + 1}`, ...s }));
  setLocal(KEYS.SERVICES, defaultServices);
  return defaultServices;
}

export async function saveService(service: Partial<ServiceItem>, id?: string): Promise<string> {
  const current = await fetchServices();
  const targetId = id || (service.id && service.id.length > 3 ? service.id : `serv_${Date.now()}`);
  const payload = {
    ...service,
    id: targetId
  } as ServiceItem;

  try {
    await setDoc(doc(db, 'services', targetId), payload, { merge: true });
  } catch (err) {}

  const existingIdx = current.findIndex(s => s.id === targetId);
  let updatedList: ServiceItem[];
  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...payload };
  } else {
    updatedList = [payload, ...current];
  }
  setLocal(KEYS.SERVICES, updatedList);
  return targetId;
}

export async function deleteService(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'services', id));
  } catch (err) {}
  const current = getLocal<ServiceItem[]>(KEYS.SERVICES, []);
  setLocal(KEYS.SERVICES, current.filter(s => s.id !== id));
}

// ==================== SETTINGS ====================
export const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "Estructura\nTrascendente.",
  heroDescription: "Residencias minimalistas diseñadas con nogal, concreto bruto y la captura precisa de la luz matutina.",
  aboutTitle: "La Geometría\nDe La Calma.",
  aboutText1: "Fundados en la creencia de que la arquitectura es la coreografía silenciosa de la luz y el espacio. Exploramos la tensión entre el material bruto y la forma refinada.",
  aboutText2: "Nuestro enfoque distintivo utiliza nogal, concreto bruto y siluetas matutinas para crear espacios que respiran y evolucionan con el paso del tiempo.",
  statsYears: "15",
  statsProjects: "120"
};

export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'homepage'));
    if (docSnap.exists()) {
      const data = docSnap.data() as SiteSettings;
      setLocal(KEYS.SETTINGS, { ...DEFAULT_SETTINGS, ...data });
      return { ...DEFAULT_SETTINGS, ...data };
    }
  } catch (err) {}

  return getLocal<SiteSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  try {
    await setDoc(doc(db, 'settings', 'homepage'), {
      ...settings,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {}

  const current = getLocal<SiteSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
  setLocal(KEYS.SETTINGS, { ...current, ...settings });
}

// ==================== CONTACT MESSAGES ====================
export async function fetchMessages(): Promise<ContactMessage[]> {
  try {
    const snap = await getDocs(collection(db, 'contact_messages'));
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() })) as ContactMessage[];
      setLocal(KEYS.MESSAGES, items);
      return items;
    }
  } catch (err) {}

  return getLocal<ContactMessage[]>(KEYS.MESSAGES, []);
}

export async function addContactMessage(data: Omit<ContactMessage, 'id'>): Promise<string> {
  const id = `msg_${Date.now()}`;
  const record: ContactMessage = {
    ...data,
    id,
    createdAt: new Date().toISOString()
  };

  try {
    await addDoc(collection(db, 'contact_messages'), {
      ...data,
      createdAt: serverTimestamp()
    });
  } catch (err) {}

  const current = getLocal<ContactMessage[]>(KEYS.MESSAGES, []);
  setLocal(KEYS.MESSAGES, [record, ...current]);
  return id;
}

export async function deleteMessage(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'contact_messages', id));
  } catch (err) {}
  const current = getLocal<ContactMessage[]>(KEYS.MESSAGES, []);
  setLocal(KEYS.MESSAGES, current.filter(m => m.id !== id));
}

// ==================== BOOKINGS ====================
export async function fetchBookings(): Promise<BookingItem[]> {
  try {
    const snap = await getDocs(collection(db, 'bookings'));
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() })) as BookingItem[];
      setLocal(KEYS.BOOKINGS, items);
      return items;
    }
  } catch (err) {}

  return getLocal<BookingItem[]>(KEYS.BOOKINGS, []);
}

export async function addBooking(data: Omit<BookingItem, 'id'>): Promise<string> {
  const id = `book_${Date.now()}`;
  const record: BookingItem = {
    ...data,
    id,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  try {
    await addDoc(collection(db, 'bookings'), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  } catch (err) {}

  const current = getLocal<BookingItem[]>(KEYS.BOOKINGS, []);
  setLocal(KEYS.BOOKINGS, [record, ...current]);
  return id;
}

export async function deleteBooking(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'bookings', id));
  } catch (err) {}
  const current = getLocal<BookingItem[]>(KEYS.BOOKINGS, []);
  setLocal(KEYS.BOOKINGS, current.filter(b => b.id !== id));
}

// ==================== SEED DATA UTILITY ====================
export async function seedDefaultData(): Promise<void> {
  // Sync projects
  const projects = STATIC_PROJECTS.map((p, i) => ({
    ...p,
    id: p.id || `proj_${i + 1}`
  }));
  setLocal(KEYS.PROJECTS, projects);

  for (const p of projects) {
    try {
      await setDoc(doc(db, 'projects', p.id), p, { merge: true });
    } catch (err) {}
  }

  // Sync services
  const services = STATIC_SERVICES.map((s, i) => ({
    id: `serv_${i + 1}`,
    ...s
  }));
  setLocal(KEYS.SERVICES, services);

  for (const s of services) {
    try {
      await setDoc(doc(db, 'services', s.id), s, { merge: true });
    } catch (err) {}
  }

  // Sync settings
  setLocal(KEYS.SETTINGS, DEFAULT_SETTINGS);
  try {
    await setDoc(doc(db, 'settings', 'homepage'), DEFAULT_SETTINGS, { merge: true });
  } catch (err) {}
}
