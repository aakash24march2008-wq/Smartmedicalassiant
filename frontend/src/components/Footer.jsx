import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Heart, ArrowRight } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms & Conditions', href: '#' },
];

const aiServices = [
  { label: 'AI Image Diagnosis', href: '/image-diagnosis' },
  { label: 'Medical Report Analyzer', href: '/report-analyzer' },
  { label: 'Knowledge Chatbot', href: '/knowledge-chatbot' },
  { label: 'Symptom Checker', href: '/symptom-checker' },
  { label: 'Dashboard', href: '/dashboard' },
];

export default function Footer() {
  return (
    <footer className="bg-vc-navy text-white">
      {/* CTA Strip */}
      <div className="bg-vc-blue py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Ready to experience AI-powered healthcare?</h3>
            <p className="text-blue-200 text-sm mt-1">Join thousands of patients already using VitaCure AI services.</p>
          </div>
          <Link to="/register" className="flex items-center gap-2 bg-white text-vc-blue font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg flex-shrink-0">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <img src="/logo.jpg" alt="VitaCure Hospital" className="h-12 w-12 object-contain rounded-xl" />
              <div>
                <span className="block text-lg font-bold text-white">VitaCure</span>
                <span className="block text-xs font-semibold text-vc-sky tracking-widest uppercase">Hospital</span>
              </div>
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed mb-5">
              An AI-powered healthcare platform providing CNN image diagnosis, medical report analysis, symptom checking, and an intelligent medical chatbot.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 hover:bg-vc-sky rounded-xl flex items-center justify-center transition-colors">
                  <Icon className="h-4 w-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-blue-200 hover:text-vc-sky text-sm font-medium transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-vc-sky rounded-full"></span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-5">AI Services</h4>
            <ul className="space-y-3">
              {aiServices.map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-blue-200 hover:text-vc-sky text-sm font-medium transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-vc-sky rounded-full"></span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-blue-200 text-sm">
                <MapPin className="h-4 w-4 text-vc-sky flex-shrink-0 mt-0.5" />
                <span>123 Healthcare Avenue, Medical District, City — 400001</span>
              </li>
              <li className="flex items-center gap-3 text-blue-200 text-sm">
                <Phone className="h-4 w-4 text-vc-sky flex-shrink-0" />
                <span>+91-9876543210</span>
              </li>
              <li className="flex items-center gap-3 text-blue-200 text-sm">
                <Mail className="h-4 w-4 text-vc-sky flex-shrink-0" />
                <span>care@vitacure.hospital</span>
              </li>
            </ul>
            <div className="mt-5 bg-vc-red/20 border border-vc-red/40 rounded-xl px-4 py-3">
              <p className="text-vc-red font-bold text-xs uppercase tracking-widest mb-0.5">Emergency</p>
              <p className="text-white font-bold text-lg">+91-9876543210</p>
              <p className="text-blue-200 text-xs">Available 24 × 7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-blue-300">
          <span className="flex items-center gap-1.5">
            © {new Date().getFullYear()} VitaCure Hospital. Made with <Heart className="h-3.5 w-3.5 text-vc-red fill-vc-red" /> for better healthcare.
          </span>
          <span className="text-xs text-blue-400">
            ⚠️ For educational purposes only. Not a substitute for professional medical advice.
          </span>
        </div>
      </div>
    </footer>
  );
}
