import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scan, FileSearch, MessageCircle, Activity, ArrowRight, Brain, ShieldCheck, Zap, BarChart2, Lock } from 'lucide-react';

const features = [
  {
    icon: Scan, color: 'bg-vc-blue', href: '/image-diagnosis',
    badge: 'CNN Model',
    title: 'AI Disease Detection',
    desc: 'Upload skin images for CNN-powered disease classification. Get confidence scores, visual explanations, symptom lists, causes, prevention tips, and recommended treatments.',
    points: ['10K+ training images', 'Real-time confidence scoring', 'Visual heatmap overlay', 'Full treatment plan'],
  },
  {
    icon: FileSearch, color: 'bg-purple-600', href: '/report-analyzer',
    badge: 'NLP Analysis',
    title: 'Medical Report Analyzer',
    desc: 'Upload any medical PDF or lab report. Our NLP model extracts key findings, highlights abnormal values in red, and generates a plain-English summary.',
    points: ['PDF & scanned reports', 'Abnormal value detection', 'AI-generated summary', 'Doctor question generator'],
  },
  {
    icon: MessageCircle, color: 'bg-vc-sky', href: '/knowledge-chatbot',
    badge: 'Groq + RAG',
    title: 'AI Medical Chatbot',
    desc: 'Powered by Llama-3 via Groq for ultra-fast responses. Upload your documents for RAG-grounded answers that cite your actual medical records.',
    points: ['Llama-3 via Groq', 'Document RAG support', 'Streaming responses', 'Conversation memory'],
  },
  {
    icon: Activity, color: 'bg-vc-red', href: '/symptom-checker',
    badge: 'Triage AI',
    title: 'Symptom Checker',
    desc: 'Describe your symptoms and receive a structured assessment including possible conditions, urgency levels, specialist recommendations, and lifestyle advice.',
    points: ['Multi-symptom analysis', 'Risk level scoring', 'Specialist referral', 'Lifestyle guidance'],
  },
  {
    icon: ShieldCheck, color: 'bg-green-600', href: '/dashboard',
    badge: 'Privacy First',
    title: 'Secure Health Dashboard',
    desc: 'VitaCure AI is designed with privacy at its core. All uploads are processed in-session and never stored permanently. JWT authentication protects every route.',
    points: ['JWT authentication', 'In-session processing', 'No permanent storage', 'Encrypted requests'],
  },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

export default function Features() {
  return (
    <div className="bg-vc-gray">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white text-xs font-bold mb-6 border border-white/20 uppercase tracking-widest">
              <Brain className="h-3.5 w-3.5" /> AI Capabilities
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Everything VitaCure AI Can Do</h1>
            <p className="text-blue-200 text-lg">Four specialized AI modules designed to make healthcare insights accessible, accurate, and actionable for everyone.</p>
          </motion.div>
        </div>
      </section>

      {/* Stats ribbon */}
      <div className="bg-white border-b border-gray-100 py-5">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[['4', 'AI Modules'], ['98%', 'Accuracy'], ['< 2s', 'Response Time'], ['24/7', 'Availability']].map(([v, l]) => (
            <div key={l}>
              <div className="text-2xl font-bold text-vc-blue">{v}</div>
              <div className="text-xs text-gray-500 font-medium">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden"
            >
              <div className={`grid md:grid-cols-5 gap-0 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                {/* Color accent panel */}
                <div className={`${f.color} md:col-span-1 p-8 flex items-center justify-center`}>
                  <f.icon className="h-16 w-16 text-white" />
                </div>

                {/* Content */}
                <div className="md:col-span-4 p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${f.color} text-white`}>{f.badge}</span>
                      <h2 className="text-2xl font-bold text-vc-navy">{f.title}</h2>
                    </div>
                    <Link to={f.href} className="btn-primary text-sm py-2.5 flex-shrink-0">
                      Launch <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <p className="text-gray-500 leading-relaxed mb-6">{f.desc}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {f.points.map((point) => (
                      <div key={point} className="flex items-center gap-2 bg-vc-gray rounded-xl px-3 py-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${f.color} flex-shrink-0`} />
                        <span className="text-xs font-medium text-gray-600">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="bg-hero-gradient rounded-3xl p-10 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Built on Industry-Leading Technology</h2>
              <p className="text-blue-200 mb-8">The most reliable AI stack for medical applications</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['React + Vite', 'FastAPI', 'Groq API', 'Llama 3.3 70B', 'TensorFlow CNN', 'PyPDF2 RAG', 'JWT Auth', 'Firebase OAuth'].map((t) => (
                  <span key={t} className="px-4 py-2 bg-white/15 backdrop-blur rounded-xl text-white text-sm font-semibold border border-white/20">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/register" className="bg-white text-vc-blue font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition shadow-xl inline-flex items-center gap-2">
                  Try All Features Free <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
