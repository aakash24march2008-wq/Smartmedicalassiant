import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Send, Loader2, AlertCircle, ShieldAlert, ChevronRight, Stethoscope, HeartPulse } from 'lucide-react';
import { api } from '../services/api';
import ReactMarkdown from 'react-markdown';

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await api.checkSymptoms({ symptoms });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-red-700 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-vc-blue bg-vc-blue-light border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-vc-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4 shadow-sm">
              <HeartPulse className="h-8 w-8 text-vc-red" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-vc-navy mb-3">AI Symptom Checker</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">Describe what you're feeling in detail. Our AI will analyze your symptoms to suggest possible conditions and recommend the appropriate level of care.</p>
          </motion.div>
        </div>

        {/* Input Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card p-6 shadow-card mb-8"
        >
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-bold text-vc-navy mb-2">Describe your symptoms</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="E.g., I have had a severe headache for 2 days, accompanied by nausea and sensitivity to light..."
              className="input min-h-[140px] resize-y mb-4"
              required
            />
            
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mb-4 flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-sm"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-400 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                In an emergency, dial 911 immediately.
              </div>
              <button
                type="submit"
                disabled={!symptoms.trim() || loading}
                className="w-full sm:w-auto btn-danger py-3.5 px-8 text-base ripple"
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing...</>
                ) : (
                  <><Activity className="h-5 w-5" /> Analyze Symptoms</>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-red-100 border-t-vc-red rounded-full animate-spin mx-auto" />
              <Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-vc-red animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-vc-navy mt-4">Cross-referencing medical databases...</h3>
            <p className="text-sm text-gray-500">Please wait while AI assesses your symptoms.</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Risk Banner */}
            <div className={`rounded-2xl p-6 border ${getRiskColor(result.risk_level)} flex items-start sm:items-center gap-4 flex-col sm:flex-row`}>
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <AlertCircle className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Assessed Risk Level</p>
                <h2 className="text-2xl font-black capitalize">{result.risk_level} Risk</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Possible Conditions */}
              <div className="card p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-vc-navy mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Stethoscope className="h-5 w-5 text-vc-blue" /> Possible Conditions
                </h3>
                <ul className="space-y-3">
                  {result.possible_conditions?.map((condition, i) => (
                    <li key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <ChevronRight className="h-5 w-5 text-vc-sky flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-700">{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="card p-6 shadow-sm border border-gray-100 bg-vc-blue-light/30">
                <h3 className="text-lg font-bold text-vc-navy mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Activity className="h-5 w-5 text-vc-blue" /> Recommended Action
                </h3>
                <div className="prose prose-sm prose-p:leading-relaxed text-gray-700">
                  <ReactMarkdown>{result.recommendations}</ReactMarkdown>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-sm font-semibold text-vc-navy">Need further assistance?</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">You can discuss these results further with our AI Chatbot.</p>
              <a href="/knowledge-chatbot" className="btn-secondary text-sm py-2">Consult AI Chatbot</a>
            </div>
            
          </motion.div>
        )}
      </div>
    </div>
  );
}
