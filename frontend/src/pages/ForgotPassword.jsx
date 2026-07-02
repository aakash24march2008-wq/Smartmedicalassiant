import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // Simulate API call
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-vc-gray flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-hero-gradient blur-3xl opacity-10 pointer-events-none transform -skew-y-12 -translate-y-1/2" />
      
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src="/logo.jpg" alt="VitaCure Hospital" className="h-20 w-auto object-contain shadow-xl rounded-2xl bg-white p-2" />
          </div>
          <h1 className="text-2xl font-bold text-vc-navy">Reset Password</h1>
          <p className="text-gray-500 mt-2 text-sm">Enter your email and we'll send a reset link</p>
        </div>

        <div className="card p-8 shadow-vc-lg">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-vc-navy mb-2">Check your email</h3>
              <p className="text-gray-500 text-sm mb-6">We've sent password reset instructions to <span className="font-medium text-vc-navy">{email}</span></p>
              <button onClick={() => setSubmitted(false)} className="text-sm font-semibold text-vc-blue hover:underline">
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="email" className="input pl-10" placeholder="your@email.com" value={email}
                    onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="bg-blue-50 text-blue-800 text-xs rounded-xl px-4 py-3 flex gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>If an account exists with this email, you will receive a secure reset link.</p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base ripple">
                {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-vc-blue transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
