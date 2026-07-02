import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { signInWithGoogle, signInWithGitHub } from '../firebase';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const [remember, setRemember] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isAnyLoading = !!loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setError(''); setLoading('email');
    try {
      const res = await api.login(form);
      login(res.data.user, res.data.access_token, remember);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally { setLoading(''); }
  };

  const handleOAuth = async (provider) => {
    setError(''); setLoading(provider);
    console.log(`[Auth] Initiating ${provider} OAuth login...`);
    try {
      const result = provider === 'google' ? await signInWithGoogle() : await signInWithGitHub();
      const idToken = await result.user.getIdToken();
      console.log(`[Auth] ${provider} Firebase token obtained, exchanging with backend...`);
      const res = provider === 'google'
        ? await api.loginWithGoogle({ id_token: idToken })
        : await api.loginWithGitHub({ id_token: idToken });
      login(res.data.user, res.data.access_token, true);
      console.log(`[Auth] ${provider} login success — redirecting to dashboard.`);
      navigate('/dashboard');
    } catch (err) {
      console.error(`[Auth] ${provider} login error:`, err.code, err.message);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site and try again.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError(`${provider === 'google' ? 'Google' : 'GitHub'} sign-in is not enabled in Firebase. Please contact the administrator.`);
      } else if (err.code === 'auth/redirect-uri-mismatch' || err.message?.includes('redirect_uri')) {
        setError('GitHub OAuth redirect URI mismatch. Please ensure the GitHub OAuth App callback URL is set to: https://medicalproject-9c885.firebaseapp.com/__/auth/handler');
      } else {
        setError(err.response?.data?.detail || err.message || 'Authentication failed. Please try again.');
      }
    } finally { setLoading(''); }
  };

  return (
    <div className="min-h-screen bg-vc-gray flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 text-center">
          <img src="/logo.jpg" alt="VitaCure Hospital" className="h-28 w-28 object-contain rounded-3xl shadow-2xl mx-auto mb-6 border-4 border-white/20" />
          <h2 className="text-3xl font-bold text-white mb-2">VitaCure Hospital</h2>
          <p className="text-blue-200 text-lg mb-8">AI-Powered Healthcare Platform</p>
          <div className="space-y-4 text-left max-w-xs">
            {['CNN-based skin disease diagnosis', 'AI medical report analysis', 'Groq-powered chatbot (Llama 3)', 'Intelligent symptom checker'].map(f => (
              <div key={f} className="flex items-center gap-3 text-blue-100">
                <CheckCircle2 className="h-5 w-5 text-vc-sky flex-shrink-0" />
                <span className="text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
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
            <h1 className="text-2xl font-bold text-vc-navy mb-1">Welcome Back</h1>
            <p className="text-gray-500 text-sm mb-7">Sign in to access your health dashboard</p>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              {/* Google */}
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => handleOAuth('google')}
                disabled={isAnyLoading}
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
              <span className="text-xs text-gray-400 font-medium">or sign in with email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="email" className="input pl-10" placeholder="your@email.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="label mb-0">Password</label>
                  <Link to="/forgot-password" className="text-xs text-vc-blue hover:underline font-medium">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type={show ? 'text' : 'password'} className="input pl-10 pr-10" placeholder="••••••••" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} autoComplete="current-password" />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-vc-blue">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} className="rounded text-vc-blue" />
                <label htmlFor="remember" className="text-sm text-gray-600 font-medium cursor-pointer">Remember me for 7 days</label>
              </div>

              <motion.button type="submit" disabled={isAnyLoading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="btn-primary w-full justify-center py-3.5 text-base ripple"
              >
                {loading === 'email' ? <><Loader2 className="h-5 w-5 animate-spin" /> Signing in...</> : 'Sign In'}
              </motion.button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-vc-blue font-bold hover:underline">Create one free</Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6 px-4">
            By signing in, you agree to our Terms of Service. VitaCure AI is for educational purposes only.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
