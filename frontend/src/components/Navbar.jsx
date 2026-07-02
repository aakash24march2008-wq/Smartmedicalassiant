import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, ChevronDown, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const publicLinks = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const aiLinks = [
  { label: 'Image Diagnosis', href: '/image-diagnosis' },
  { label: 'Report Analyzer', href: '/report-analyzer' },
  { label: 'AI Chatbot', href: '/knowledge-chatbot' },
  { label: 'Symptom Checker', href: '/symptom-checker' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aiDropdown, setAiDropdown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href) => location.pathname === href;

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-blue-50' : 'bg-white border-b border-gray-100'}`}>
      {/* Top Bar */}
      <div className="bg-vc-navy text-white text-xs py-1.5 px-4 hidden md:flex items-center justify-between">
        <span className="flex items-center gap-2 text-blue-200">
          <Phone className="h-3 w-3" /> Emergency: +91-9876543210 | Available 24/7
        </span>
        <span className="text-blue-200">🏥 AI-Powered Healthcare Platform</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Name */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="VitaCure Hospital"
                className="h-11 w-11 object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-200"
              />
              <div className="leading-tight">
                <span className="block text-lg font-bold text-vc-blue leading-none">VitaCure</span>
                <span className="block text-xs font-semibold text-vc-sky tracking-widest uppercase">Hospital</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map(link => (
              <Link key={link.href} to={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-vc-blue-light text-vc-blue font-semibold'
                    : 'text-gray-600 hover:text-vc-blue hover:bg-vc-blue-light'
                }`}>
                {link.label}
              </Link>
            ))}

            {/* AI Services Dropdown */}
            {user && (
              <div className="relative" onMouseEnter={() => setAiDropdown(true)} onMouseLeave={() => setAiDropdown(false)}>
                <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  aiLinks.some(l => isActive(l.href))
                    ? 'bg-vc-blue-light text-vc-blue font-semibold'
                    : 'text-gray-600 hover:text-vc-blue hover:bg-vc-blue-light'
                }`}>
                  AI Services <ChevronDown className={`h-3.5 w-3.5 transition-transform ${aiDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {aiDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-52 bg-white rounded-2xl shadow-vc-lg border border-gray-100 py-2 overflow-hidden"
                    >
                      {aiLinks.map(link => (
                        <Link key={link.href} to={link.href}
                          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                            isActive(link.href) ? 'bg-vc-blue-light text-vc-blue' : 'text-gray-700 hover:bg-vc-blue-light hover:text-vc-blue'
                          }`}>
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {user && (
              <Link to="/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard') ? 'bg-vc-blue-light text-vc-blue font-semibold' : 'text-gray-600 hover:text-vc-blue hover:bg-vc-blue-light'
                }`}>
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-vc-blue-light rounded-xl border border-blue-100">
                  {user.photo
                    ? <img src={user.photo} alt={user.name} className="h-6 w-6 rounded-full object-cover" />
                    : <User className="h-4 w-4 text-vc-blue" />
                  }
                  <span className="text-sm font-semibold text-vc-blue max-w-[120px] truncate">{user.name || user.email}</span>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-vc-blue hover:bg-vc-blue-light rounded-xl transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5 ripple">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 pt-3 pb-4 space-y-1">
              {publicLinks.map(link => (
                <Link key={link.href} to={link.href} onClick={() => setOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href) ? 'bg-vc-blue-light text-vc-blue' : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <div className="pt-1 pb-1 px-3 text-xs font-bold text-gray-400 uppercase tracking-widest">AI Services</div>
                  {aiLinks.map(link => (
                    <Link key={link.href} to={link.href} onClick={() => setOpen(false)}
                      className={`block px-3 py-2.5 rounded-xl text-sm font-medium ml-2 transition-colors ${
                        isActive(link.href) ? 'bg-vc-blue-light text-vc-blue' : 'text-gray-700 hover:bg-gray-50'
                      }`}>
                      {link.label}
                    </Link>
                  ))}
                  <Link to="/dashboard" onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Dashboard
                  </Link>
                </>
              )}
              <div className="pt-3 border-t border-gray-100 mt-2 space-y-2">
                {user ? (
                  <button onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="block text-center py-2.5 text-sm font-semibold text-vc-blue bg-vc-blue-light rounded-xl">Sign In</Link>
                    <Link to="/register" onClick={() => setOpen(false)} className="block text-center py-2.5 text-sm font-semibold text-white bg-vc-blue rounded-xl">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
