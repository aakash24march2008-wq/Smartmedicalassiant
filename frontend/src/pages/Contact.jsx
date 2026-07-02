import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

const contactInfo = [
  { icon: Phone, title: 'Phone', detail: '+91-9876543210', sub: 'Mon–Sat 9am–6pm' },
  { icon: Mail, title: 'Email', detail: 'care@vitacure.hospital', sub: 'We reply within 24h' },
  { icon: MapPin, title: 'Address', detail: '123 Healthcare Avenue', sub: 'Medical District, City — 400001' },
  { icon: Clock, title: 'Emergency', detail: '+91-9876543210', sub: 'Available 24 × 7' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-vc-gray">
      {/* Hero */}
      <section className="page-hero">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Contact VitaCure Hospital</h1>
            <p className="text-blue-200 text-lg">Get in touch with our team for questions, feedback, or medical inquiries.</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="card text-center hover:shadow-vc transition-all group"
            >
              <div className="w-14 h-14 bg-vc-blue-light rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-vc-blue transition-colors">
                <item.icon className="h-7 w-7 text-vc-blue group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-vc-navy mb-1">{item.title}</h3>
              <p className="text-vc-blue font-semibold text-sm">{item.detail}</p>
              <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-vc-navy mb-1">Send us a Message</h2>
              <p className="text-gray-500 text-sm mb-6">Fill out the form below and our team will get back to you shortly.</p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-vc-navy mb-2">Message Sent!</h3>
                  <p className="text-gray-500">Thank you for contacting us. Our team will respond within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="mt-6 btn-secondary text-sm">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name *</label>
                      <input className="input" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <label className="label">Email Address *</label>
                      <input type="email" className="input" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Phone Number</label>
                      <input className="input" placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">Subject *</label>
                      <select className="input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
                        <option value="">Select subject</option>
                        <option>General Inquiry</option>
                        <option>AI Diagnosis Support</option>
                        <option>Technical Issue</option>
                        <option>Partnership</option>
                        <option>Feedback</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Message *</label>
                    <textarea className="input min-h-[140px] resize-y" placeholder="Describe your query or message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">For medical emergencies, please call our 24/7 helpline: <strong>+91-9876543210</strong>. Do not use this form for emergencies.</p>
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-primary w-full justify-center py-3.5 text-base ripple">
                    {loading ? (
                      <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="h-5 w-5" /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Map + Hours */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Map placeholder */}
            <div className="card p-0 overflow-hidden">
              <div className="h-56 bg-gradient-to-br from-vc-blue-light to-vc-sky-light flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(30,90,168,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30,90,168,.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="text-center relative z-10">
                  <div className="w-12 h-12 bg-vc-red rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg animate-float">
                    <MapPin className="h-6 w-6 text-white fill-white" />
                  </div>
                  <p className="font-bold text-vc-navy text-sm">VitaCure Hospital</p>
                  <p className="text-gray-500 text-xs">123 Healthcare Avenue</p>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-vc-navy mb-1">Find Us</h3>
                <p className="text-gray-500 text-sm">123 Healthcare Avenue, Medical District, City — 400001</p>
              </div>
            </div>

            {/* Working hours */}
            <div className="card">
              <h3 className="font-bold text-vc-navy mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-vc-blue" /> Working Hours
              </h3>
              <div className="space-y-3">
                {[
                  ['Monday – Friday', '9:00 AM – 7:00 PM'],
                  ['Saturday', '9:00 AM – 5:00 PM'],
                  ['Sunday', 'Closed'],
                  ['Emergency', '24 × 7 Available'],
                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                    <span className="text-gray-600 font-medium">{day}</span>
                    <span className={`font-semibold ${hours === '24 × 7 Available' ? 'text-vc-red' : hours === 'Closed' ? 'text-gray-400' : 'text-vc-blue'}`}>{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency */}
            <div className="bg-vc-red rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-1">🚨 Emergency Contact</h3>
              <p className="text-red-100 text-sm mb-3">For life-threatening emergencies, call immediately:</p>
              <p className="text-3xl font-black">+91-9876543210</p>
              <p className="text-red-200 text-sm mt-1">Available 24 hours, 7 days a week</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
