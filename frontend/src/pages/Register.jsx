import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2, Loader2, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { auth, signInWithGitHub } from '../firebase';

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

  const handleOAuth = async (provider) => {
    setError(''); setLoading(provider);
    try {
      const result = await signInWithGitHub();
      const idToken = await result.user.getIdToken();
      const res = await api.loginWithGitHub({ id_token: idToken });
      login(res.data.user, res.data.access_token, true);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') { setError(''); }
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
              <button type="button" onClick={() => handleOAuth('github')} disabled={isAnyLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all font-semibold text-gray-700 disabled:opacity-50 text-sm"
              >
                {loading === 'github' ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <svg className="h-4 w-4 fill-gray-900" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                )}
                Continue with GitHub
              </button>
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
