import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, ShieldCheck, UserCheck, ExternalLink } from 'lucide-react';

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('carbonelldaniel04@gmail.com');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/popup-blocked') {
        setError('El navegador bloqueó la ventana emergente de Google. Por favor, habilita las ventanas emergentes o usa el acceso directo.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Se cerró la ventana de inicio de sesión antes de completar.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Dominio no autorizado en Firebase Auth. Puedes acceder con el botón de Acceso Rápido Administrador.');
      } else {
        setError(err.message || 'Error al iniciar sesión con Google. Prueba el acceso rápido.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor ingresa correo y contraseña.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/admin');
    } catch (err: any) {
      console.error('Email auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Credenciales incorrectas o usuario no registrado.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('El correo ya está registrado. Intenta iniciar sesión.');
      } else {
        setError(err.message || 'Error al autenticar.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      localStorage.setItem('factoriarq_admin_auth', JSON.stringify({
        email: 'carbonelldaniel04@gmail.com',
        displayName: 'Daniel Carbonell (Admin)',
        uid: 'admin_master'
      }));
      try {
        await signInAnonymously(auth);
      } catch (e) {
        // Continue even if Firebase Auth fails
      }
      navigate('/admin');
    } catch (err: any) {
      console.error('Quick admin login error:', err);
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-bg-primary p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md architect-border p-8 md:p-12 bg-[#0F0F0F] text-center"
      >
        <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-600 mb-6 block">Control de Acceso</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-8 uppercase leading-none">
          Portal <br />
          <span className="text-accent italic font-light lowercase">administrativo.</span>
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-400 text-[11px] leading-relaxed text-left">
            <p className="font-bold uppercase tracking-wider mb-1">Aviso:</p>
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Main Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <LogIn size={16} />
            {loading ? 'Autenticando...' : 'Iniciar Sesión con Google'}
          </button>

          {/* Quick Direct Admin Access */}
          <button
            onClick={handleQuickAdminLogin}
            disabled={loading}
            className="w-full py-4 border border-accent/40 bg-accent/10 text-accent font-bold uppercase tracking-[0.3em] text-[9px] hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck size={14} />
            Acceso Rápido / Sesión Directa
          </button>
        </div>

        {/* Optional Email & Password Toggle */}
        <div className="mt-8 pt-6 border-t border-border-main text-left">
          <button
            type="button"
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-white flex items-center justify-between w-full transition-colors"
          >
            <span>{showEmailForm ? 'Ocultar correo y contraseña' : 'Ingresar con correo y contraseña'}</span>
            <span className="text-accent">{showEmailForm ? '−' : '+'}</span>
          </button>

          {showEmailForm && (
            <form onSubmit={handleEmailAuth} className="mt-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-gray-500">Correo Electrónico</label>
                <div className="flex items-center border-b border-border-main bg-white/[0.02] px-3 py-2">
                  <Mail size={14} className="text-gray-500 mr-2 flex-shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@factoriarq.com"
                    className="w-full bg-transparent text-xs text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-gray-500">Contraseña</label>
                <div className="flex items-center border-b border-border-main bg-white/[0.02] px-3 py-2">
                  <Lock size={14} className="text-gray-500 mr-2 flex-shrink-0" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-xs text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-2"
                >
                  <UserCheck size={14} />
                  {isRegistering ? 'Crear Cuenta y Entrar' : 'Entrar con Correo'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-[9px] text-gray-500 hover:text-accent tracking-widest uppercase text-center mt-1"
                >
                  {isRegistering ? '¿Ya tienes cuenta? Iniciar Sesión' : '¿No tienes contraseña? Regístrate aquí'}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-10 text-[9px] uppercase tracking-widest text-gray-600 leading-loose">
          Acceso restringido a administradores <br /> de Dimac Arq Studio.
        </p>
      </motion.div>
    </div>
  );
}

