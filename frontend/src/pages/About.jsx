import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Shield, Target, Zap, Code2, Heart, Mail, Github, ArrowRight, CheckCircle2 } from 'lucide-react';

const techStack = [
  { name: 'React + Vite', desc: 'Fast, modern frontend with component-based architecture', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { name: 'FastAPI (Python)', desc: 'High-performance async API backend with auto-generated docs', color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Groq API', desc: 'Ultra-fast LLM inference for the Knowledge Chatbot', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'CNN (TensorFlow)', desc: 'Convolutional neural network for skin image classification', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { name: 'RAG (PyPDF2)', desc: 'Retrieval-Augmented Generation to answer from documents', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'JWT Auth', desc: 'Secure JSON Web Token authentication for protected routes', color: 'bg-vc-blue-light text-vc-blue border-blue-200' },
  { name: 'Firebase OAuth', desc: 'Google & GitHub sign-in for seamless authentication', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'Poppins + Tailwind', desc: 'Premium typography and utility-first styling system', color: 'bg-teal-50 text-teal-700 border-teal-200' },
];

const steps = [
  { step: '01', title: 'Upload Your Data', desc: 'Upload a skin image, medical PDF, or type your symptoms.' },
  { step: '02', title: 'AI Processes It', desc: 'Our AI models — CNN, RAG, or Groq — analyze your input in real time.' },
  { step: '03', title: 'Receive Insights', desc: 'Get predictions, confidence scores, plain-English summaries.' },
  { step: '04', title: 'Consult a Professional', desc: 'Use AI insights to have a more informed conversation with your doctor.' },
];

const whyChoose = [
  'State-of-the-art CNN trained on 10,000+ medical images',
  'Groq LLM inference — the fastest AI available',
  'Privacy-first design — no permanent data storage',
  'Secure JWT + Firebase OAuth authentication',
  'Fully responsive — mobile, tablet, and desktop',
  'Educational AI output with professional disclaimers',
];

export default function About() {
  return (
    <div className="bg-vc-gray">
      {/* Hero */}
      <section className="page-hero">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-center mb-6">
              <img src="/logo.jpg" alt="VitaCure Hospital" className="h-28 w-28 object-contain rounded-3xl shadow-2xl border-4 border-white/20 bg-white/10 backdrop-blur" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About VitaCure Hospital</h1>
            <p className="text-blue-200 text-lg">An AI-powered healthcare companion helping you understand your health better — one analysis at a time.</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16">

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-br from-vc-blue-light to-blue-50 rounded-3xl p-8 border border-blue-100"
          >
            <div className="w-12 h-12 bg-vc-blue rounded-2xl flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-vc-navy mb-3">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To democratize access to medical knowledge by providing AI-driven tools that help everyday people understand their health data — whether it's a lab report, a skin condition, or unexplained symptoms — empowering more informed conversations with healthcare professionals.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-8 border border-green-100"
          >
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-vc-navy mb-3">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              A world where AI acts as a knowledgeable health companion — not replacing doctors, but bridging the gap between patients and their understanding of complex medical information. Everyone should be able to walk into a doctor's appointment prepared and informed.
            </p>
          </motion.div>
        </div>

        {/* How it works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="section-badge"><Brain className="h-3.5 w-3.5" /> Process</div>
            <h2 className="section-title">How VitaCure AI Works</h2>
            <p className="section-sub">A transparent look at our AI pipeline from input to insight</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card hover:shadow-vc transition-shadow"
              >
                <div className="text-5xl font-black text-vc-blue/10 mb-3">{s.step}</div>
                <h3 className="text-lg font-bold text-vc-navy mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why choose VitaCure */}
        <div className="mb-20 bg-white rounded-3xl p-10 border border-gray-100 shadow-card">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="section-badge">Why Us</div>
              <h2 className="section-title mb-6">Why Choose VitaCure Hospital?</h2>
              <ul className="space-y-3">
                {whyChoose.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-vc-blue flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <img src="/logo.jpg" alt="VitaCure Hospital" className="h-52 w-52 object-contain rounded-3xl shadow-vc-lg" />
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="section-badge"><Code2 className="h-3.5 w-3.5" /> Technology</div>
            <h2 className="section-title">Built with Modern Technology</h2>
            <p className="section-sub">A carefully selected stack for performance, accuracy, and security</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStack.map((tech, i) => (
              <motion.div key={tech.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className={`border rounded-2xl p-5 ${tech.color}`}
              >
                <div className="font-bold text-base mb-1">{tech.name}</div>
                <div className="text-sm opacity-80 leading-relaxed">{tech.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="bg-amber-50 border border-amber-200 rounded-3xl p-8 mb-20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-900 mb-2">Educational Disclaimer</h2>
              <p className="text-amber-800 leading-relaxed">
                <strong>VitaCure Hospital AI is strictly for educational and informational purposes only.</strong> All AI-generated outputs, including image diagnoses, report analyses, chatbot answers, and symptom assessments, are <em>not</em> a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before making any medical decisions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-vc-navy mb-2">Get in Touch</h2>
          <p className="text-gray-500 mb-6">Questions, feedback, or collaboration? We'd love to hear from you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:care@vitacure.hospital" className="btn-primary">
              <Mail className="h-5 w-5" /> care@vitacure.hospital
            </a>
            <a href="https://github.com" className="btn-secondary">
              <Github className="h-5 w-5" /> View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-hero-gradient py-14 px-4 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Explore VitaCure AI Today</h2>
        <p className="text-blue-200 mb-6">Experience AI-powered healthcare insights, completely free.</p>
        <Link to="/register" className="inline-flex items-center gap-2 bg-white text-vc-blue font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition shadow-xl">
          Create Free Account <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
