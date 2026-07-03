import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2, Loader2, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { signInWithGoogle } from '../firebase';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const isAnyLoading = !!loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters long.'); return; }
    setError(''); setLoading('email');
    try {
      await api.register(form);
      const res = await api.login({ email: form.email, password: form.password });
      login(res.data.user, res.data.access_token, true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Email might already exist.');
    } finally { setLoading(''); }
  };

  const handleOAuth = async () => {
    setError(''); setLoading('google');
    try {
      const result = await signInWithGoogle();
      const idToken = await result.user.getIdToken();
      const res = await api.loginWithGoogle({ id_token: idToken });
      login(res.data.user, res.data.access_token, true);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') { setError(''); }
      else if (err.code === 'auth/popup-blocked') { setError('Popup was blocked. Please allow popups for this site.'); }
      else setError(err.response?.data?.detail || err.message || 'Authentication failed.');
    } finally { setLoading(''); }
  };

  return (
    <div className="min-h-screen bg-vc-gray flex flex-row-reverse">
      {/* Right panel (branding) */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 text-center">
          <img src="/logo.jpg" alt="VitaCure Hospital" className="h-28 w-28 object-contain rounded-3xl shadow-2xl mx-auto mb-6 border-4 border-white/20" />
          <h2 className="text-3xl font-bold text-white mb-2">Join VitaCure AI</h2>
          <p className="text-blue-200 text-lg mb-8">Your intelligent health companion</p>
          <div className="space-y-4 text-left max-w-xs mx-auto">
            {['Get instant AI diagnoses', 'Analyze medical reports', 'Chat with Llama-3 AI', 'Track symptoms securely'].map(f => (
              <div key={f} className="flex items-center gap-3 text-blue-100">
                <CheckCircle2 className="h-5 w-5 text-vc-sky flex-shrink-0" />
                <span className="text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Left panel (form) */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/logo.jpg" alt="VitaCure Hospital" className="h-16 w-16 object-contain rounded-2xl shadow-md mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">VitaCure Hospital AI</p>
          </div>

          <div className="card p-8 shadow-vc-lg">
            <h1 className="text-2xl font-bold text-vc-navy mb-1">Create Account</h1>
            <p className="text-gray-500 text-sm mb-7">Join VitaCure for smarter healthcare insights</p>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* OAuth */}
            <div className="space-y-3 mb-6">
              <motion.button type="button" onClick={handleOAuth} disabled={isAnyLoading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'google' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                ) : (
                  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                <span>Continue with Google</span>
              </motion.button>
            </div>


            <div className="relative flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">or sign up with email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="text" className="input pl-10" placeholder="John Doe" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="label">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="email" className="input pl-10" placeholder="your@email.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="label">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="tel" className="input pl-10" placeholder="+91-XXXXXXXXXX" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type={show ? 'text' : 'password'} className="input pl-10 pr-10" placeholder="Min 6 characters" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-vc-blue">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <motion.button type="submit" disabled={isAnyLoading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="btn-primary w-full justify-center py-3.5 text-base ripple mt-2"
              >
                {loading === 'email' ? <><Loader2 className="h-5 w-5 animate-spin" /> Creating Account...</> : 'Create Free Account'}
              </motion.button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-vc-blue font-bold hover:underline">Sign in</Link>
            </p>
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-6 px-4">
            VitaCure AI is for educational purposes only. Not a substitute for professional medical advice.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
