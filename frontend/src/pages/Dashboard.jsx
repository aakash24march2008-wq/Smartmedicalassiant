import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scan, FileSearch, MessageCircle, Activity, ArrowRight, ActivitySquare, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const aiModules = [
  { icon: Scan, title: 'Image Diagnosis', desc: 'Upload skin images for CNN classification', href: '/image-diagnosis', color: 'bg-vc-blue' },
  { icon: FileSearch, title: 'Report Analyzer', desc: 'Extract insights from medical PDFs', href: '/report-analyzer', color: 'bg-purple-600' },
  { icon: MessageCircle, title: 'AI Chatbot', desc: 'Chat with Groq Llama-3 + RAG', href: '/knowledge-chatbot', color: 'bg-vc-sky' },
  { icon: Activity, title: 'Symptom Checker', desc: 'Get possible conditions instantly', href: '/symptom-checker', color: 'bg-vc-red' },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-vc-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-card flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              {user?.photo ? (
                <img src={user.photo} alt={user.name} className="h-20 w-20 rounded-2xl object-cover shadow-lg border-4 border-white" />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-vc-blue-light text-vc-blue flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-white">
                  {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-vc-navy mb-1">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-gray-500 font-medium">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/image-diagnosis" className="btn-primary py-2.5 px-5 text-sm">
              <Scan className="h-4 w-4" /> New Diagnosis
            </Link>
          </div>
        </motion.div>

        {/* AI Modules Grid */}
        <div>
          <h2 className="text-xl font-bold text-vc-navy mb-4 flex items-center gap-2">
            <ActivitySquare className="h-5 w-5 text-vc-blue" /> Quick Access
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiModules.map((m, i) => (
              <motion.div key={m.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={m.href} className="block card-hover p-5 group h-full">
                  <div className={`w-12 h-12 rounded-xl ${m.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                    <m.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-vc-navy mb-1">{m.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{m.desc}</p>
                  <div className="flex items-center text-xs font-bold text-vc-blue mt-auto group-hover:gap-1.5 transition-all">
                    Launch <ArrowRight className="h-3 w-3 ml-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats & History */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 card p-6"
          >
            <h2 className="text-lg font-bold text-vc-navy mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-vc-sky" /> Recent Activity
            </h2>
            <div className="flex flex-col items-center justify-center py-12 bg-vc-gray rounded-2xl border border-dashed border-gray-300">
              <Activity className="h-10 w-10 text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">No recent activity found.</p>
              <p className="text-gray-400 text-sm mt-1 mb-4">Start using VitaCure AI modules to build your history.</p>
              <Link to="/knowledge-chatbot" className="btn-secondary text-sm py-2">Start Chatting</Link>
            </div>
          </motion.div>

          {/* Account Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <h2 className="text-lg font-bold text-vc-navy mb-4">Security & Usage</h2>
            <ul className="space-y-4">
              <li className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-vc-navy">Authentication</p>
                  <p className="text-xs text-green-600 font-medium">Secured with JWT</p>
                </div>
                <ShieldCheck className="h-5 w-5 text-green-500" />
              </li>
              <li className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-vc-navy">Data Privacy</p>
                  <p className="text-xs text-gray-500 font-medium">In-session processing</p>
                </div>
                <Lock className="h-5 w-5 text-vc-sky" />
              </li>
            </ul>

            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <p className="text-sm font-bold text-amber-900">Disclaimer</p>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                All AI analyses are for educational purposes. Always consult a physician for professional medical advice.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

function ShieldCheck({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
