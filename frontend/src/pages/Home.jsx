import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scan, FileSearch, MessageCircle, Activity, ArrowRight,
  ShieldCheck, Brain, Zap, Star, CheckCircle2, Users, Award, Clock
} from 'lucide-react';

const features = [
  {
    icon: Scan, color: 'bg-vc-blue', light: 'bg-vc-blue-light',
    title: 'AI Image Diagnosis',
    desc: 'CNN-powered skin disease detection with confidence scores, heatmaps, and full treatment recommendations.',
    href: '/image-diagnosis'
  },
  {
    icon: FileSearch, color: 'bg-purple-600', light: 'bg-purple-50',
    title: 'Report Analyzer',
    desc: 'Upload medical PDFs and get instant AI-generated summaries with highlighted abnormal values.',
    href: '/report-analyzer'
  },
  {
    icon: MessageCircle, color: 'bg-vc-sky', light: 'bg-vc-sky-light',
    title: 'AI Medical Chatbot',
    desc: 'Chat with Llama-3 via Groq. Upload documents for RAG-powered precise answers from your own records.',
    href: '/knowledge-chatbot'
  },
  {
    icon: Activity, color: 'bg-vc-red', light: 'bg-vc-red-light',
    title: 'Symptom Checker',
    desc: 'Describe symptoms to get possible diagnoses, risk levels, and specialist recommendations instantly.',
    href: '/symptom-checker'
  },
];

const stats = [
  { value: '98%', label: 'Diagnostic Accuracy', icon: Star },
  { value: '10K+', label: 'Patients Served', icon: Users },
  { value: '4', label: 'AI Modules', icon: Brain },
  { value: '24/7', label: 'Available', icon: Clock },
];

const whyUs = [
  'State-of-the-art CNN model trained on 10,000+ images',
  'Groq-powered AI chatbot — fastest inference available',
  'RAG system for document-grounded answers',
  'Secure JWT authentication & encrypted data',
  'Fully responsive — works on any device',
  'No permanent data storage — privacy first',
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

export default function Home() {
  const [count, setCount] = useState({ acc: 0, patients: 0, modules: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setCount({ acc: 98, patients: 10000, modules: 4 }), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-vc-gray">
      {/* ========= HERO ========= */}
      <section className="relative bg-hero-gradient overflow-hidden min-h-[90vh] flex items-center">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-vc-sky/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-vc-blue/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-vc-red/10 rounded-full blur-3xl" style={{ transform: 'translate(-50%, -50%)' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6 border border-white/20">
                <span className="w-2 h-2 bg-vc-sky rounded-full animate-pulse" />
                AI-Powered Healthcare Platform
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                AI-Powered Healthcare<br />
                <span className="text-vc-sky">for Smarter</span><br />
                Diagnosis
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-blue-200 text-lg leading-relaxed mb-8 max-w-lg">
                VitaCure Hospital's AI platform offers CNN-based image diagnosis, intelligent report analysis, 
                Groq AI chatbot, and an advanced symptom checker — all in one place.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary text-base py-3.5 px-7 ripple shadow-xl">
                  Get Started Free <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/image-diagnosis" className="btn-secondary text-base py-3.5 px-7 bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Try AI Diagnosis <Scan className="h-5 w-5" />
                </Link>
                <Link to="/knowledge-chatbot" className="btn-ghost text-white hover:bg-white/10 py-3.5 px-5">
                  <MessageCircle className="h-5 w-5" /> Chat with AI
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-4 mt-8">
                {['CNN Diagnosis', 'Groq AI', 'RAG + PDF', 'Secure & Private'].map((badge) => (
                  <span key={badge} className="flex items-center gap-1.5 text-xs text-blue-200 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-vc-sky" /> {badge}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — Logo + floating cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center relative"
            >
              <div className="relative">
                <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 animate-float bg-white/10 backdrop-blur flex items-center justify-center">
                  <img src="/logo.jpg" alt="VitaCure Hospital" className="w-full h-full object-cover" />
                </div>
                {/* Floating stat cards */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                  className="absolute -left-10 top-12 glass rounded-2xl p-3 shadow-vc-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-vc-blue rounded-xl flex items-center justify-center"><Brain className="h-4 w-4 text-white" /></div>
                    <div><p className="text-xs text-gray-500 font-medium">Accuracy</p><p className="text-sm font-bold text-vc-navy">98%</p></div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
                  className="absolute -right-10 bottom-16 glass rounded-2xl p-3 shadow-vc-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-vc-red rounded-xl flex items-center justify-center"><Zap className="h-4 w-4 text-white" /></div>
                    <div><p className="text-xs text-gray-500 font-medium">Response</p><p className="text-sm font-bold text-vc-navy">&lt; 2 sec</p></div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass rounded-2xl px-4 py-2 shadow-vc-lg"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    <span className="text-xs font-bold text-vc-navy">100% Secure & Private</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========= STATS ========= */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-12 h-12 bg-vc-blue-light rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-vc-blue transition-colors">
                  <s.icon className="h-6 w-6 text-vc-blue group-hover:text-white transition-colors" />
                </div>
                <div className="text-3xl font-bold text-vc-navy mb-1">{s.value}</div>
                <div className="text-sm text-gray-500 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= FEATURE CARDS ========= */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-14"
          >
            <div className="section-badge"><Brain className="h-3.5 w-3.5" /> AI Capabilities</div>
            <h2 className="section-title">Intelligent Healthcare<br />at Your Fingertips</h2>
            <p className="section-sub max-w-2xl mx-auto">Four AI modules working together to give you unprecedented insights into your health.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              >
                <Link to={f.href} className="group block bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-vc-lg hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                  <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <f.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-vc-navy mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-grow">{f.desc}</p>
                  <div className="mt-5 flex items-center text-sm font-semibold text-vc-blue group-hover:gap-2 transition-all">
                    Launch Module <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= WHY VITACURE ========= */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="section-badge"><Award className="h-3.5 w-3.5" /> Why VitaCure</div>
              <h2 className="section-title mb-4">Why Choose VitaCure<br />Hospital AI?</h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                We combine cutting-edge artificial intelligence with healthcare expertise to deliver insights that are fast, accurate, and trustworthy.
              </p>
              <ul className="space-y-3">
                {whyUs.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-vc-blue flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 flex gap-3">
                <Link to="/register" className="btn-primary">Get Started Free</Link>
                <Link to="/about" className="btn-secondary">Learn More</Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-soft-gradient rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-vc-blue/10 rounded-full blur-2xl" />
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Brain, label: 'CNN Model', desc: 'Skin Disease Detection', color: 'text-vc-blue' },
                    { icon: Zap, label: 'Groq AI', desc: 'Ultra-fast LLM', color: 'text-vc-sky' },
                    { icon: ShieldCheck, label: 'RAG System', desc: 'Document-grounded', color: 'text-purple-600' },
                    { icon: Activity, label: 'Symptom AI', desc: 'Risk Assessment', color: 'text-vc-red' },
                  ].map((item, i) => (
                    <div key={i} className="card p-4 hover:shadow-vc transition-shadow">
                      <item.icon className={`h-8 w-8 ${item.color} mb-2`} />
                      <p className="font-bold text-vc-navy text-sm">{item.label}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========= CTA ========= */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="bg-hero-gradient rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-mesh opacity-40" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Start Your AI Health Journey Today</h2>
              <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
                Create a free account and access all 4 AI modules instantly. No credit card required.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register" className="bg-white text-vc-blue font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition shadow-xl ripple">
                  Create Free Account <ArrowRight className="inline h-5 w-5 ml-1" />
                </Link>
                <Link to="/knowledge-chatbot" className="border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition">
                  <MessageCircle className="inline h-5 w-5 mr-1" /> Try AI Chatbot
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-t border-amber-200 py-3 px-4 text-center text-xs text-amber-700">
        ⚠️ VitaCure Hospital AI is for educational and informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment.
      </div>
    </div>
  );
}
