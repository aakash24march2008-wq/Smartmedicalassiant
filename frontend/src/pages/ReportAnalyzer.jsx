import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Loader2, AlertCircle, FileSearch,
  ArrowRight, Activity, Beaker, ClipboardList, CheckCircle2,
  AlertTriangle, Heart, Salad, Stethoscope, Download, XCircle
} from 'lucide-react';
import { api } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ---------- Section config: maps markdown headings → card styles ----------
const SECTION_CONFIG = {
  '📋 Overall Health Summary': {
    icon: Activity,
    color: 'from-blue-600 to-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
  },
  '✅ Normal Findings': {
    icon: CheckCircle2,
    color: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700',
  },
  '⚠️ Abnormal Findings': {
    icon: AlertTriangle,
    color: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
  },
  '🧬 Possible Clinical Interpretation': {
    icon: Stethoscope,
    color: 'from-purple-600 to-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
  },
  '💡 Lifestyle Recommendations': {
    icon: Heart,
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700',
  },
  '🍎 Dietary Suggestions': {
    icon: Salad,
    color: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-700',
  },
  '👨‍⚕️ Suggested Follow-Up': {
    icon: ClipboardList,
    color: 'from-indigo-600 to-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  '⚠️ Disclaimer': {
    icon: AlertCircle,
    color: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-600',
  },
};

// ---------- Parse markdown into sections ----------
function parseSections(markdown) {
  const lines = markdown.split('\n');
  const sections = [];
  let currentSection = null;
  let bodyLines = [];

  for (const line of lines) {
    // Skip the H1 title line
    if (line.startsWith('# ')) continue;
    // Detect H2 section headings
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push({ title: currentSection, body: bodyLines.join('\n').trim() });
      }
      currentSection = line.replace('## ', '').trim();
      bodyLines = [];
    } else {
      bodyLines.push(line);
    }
  }
  if (currentSection) {
    sections.push({ title: currentSection, body: bodyLines.join('\n').trim() });
  }
  return sections;
}

// ---------- Individual result card ----------
function ResultCard({ title, body, index }) {
  const config = SECTION_CONFIG[title] || {
    icon: FileSearch,
    color: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-600',
  };
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-2xl border ${config.border} overflow-hidden shadow-sm`}
    >
      {/* Card header */}
      <div className={`bg-gradient-to-r ${config.color} px-5 py-4 flex items-center gap-3`}>
        <div className="bg-white/20 p-1.5 rounded-lg">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-bold text-white text-base">{title}</h3>
      </div>

      {/* Card body */}
      <div className={`${config.bg} px-5 py-4`}>
        <div className="prose prose-sm max-w-none
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-li:text-gray-700
          prose-strong:text-gray-900
          prose-headings:text-gray-800
          prose-table:text-sm
          prose-th:bg-gray-100 prose-th:text-gray-700 prose-th:font-bold prose-th:px-4 prose-th:py-2
          prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-gray-200
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:text-gray-600 prose-blockquote:pl-4
          prose-em:text-gray-500
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}

// ---------- Download report helper ----------
function downloadReport(markdown) {
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'VitaCure_Medical_Report_Analysis.md';
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- Main page ----------
export default function ReportAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const resultsRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('File size must be under 20 MB.');
      return;
    }
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  const handleFileChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const analyzeReport = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.analyzeReport(formData);
      setResult(response.data);
      // Scroll to results after render
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the AI server. Please ensure the backend is running on port 8000.');
      } else {
        setError(err.response?.data?.detail || 'The AI report analysis service is currently unavailable. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const sections = result?.summary ? parseSections(result.summary) : [];

  return (
    <div className="min-h-screen bg-vc-gray py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4 shadow-sm">
              <FileSearch className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-vc-navy mb-3">Medical Report Analyzer</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Upload your blood test or lab report PDF. VitaCure AI will generate a structured,
              professional medical analysis — including findings, interpretation, and recommendations.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* ── Left Column: Upload ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="card p-7 shadow-card">
              <h2 className="text-xl font-bold text-vc-navy mb-4">Upload PDF Report</h2>

              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer relative group
                  ${isDragging ? 'border-purple-500 bg-purple-50 scale-[1.02]' : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50/50'}`}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className={`w-16 h-16 rounded-full shadow-sm flex items-center justify-center transition-transform
                    ${isDragging ? 'bg-purple-100 scale-110' : 'bg-white group-hover:scale-110'}`}>
                    <FileText className="h-8 w-8 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-vc-navy">
                      {isDragging ? 'Drop your PDF here' : 'Drag & drop a PDF'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                  </div>
                  <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100">
                    PDF only · Max 20 MB
                  </span>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-4 flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-sm"
                  >
                    <XCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selected file */}
              {selectedFile && (
                <div className="mt-5">
                  <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-100 rounded-xl mb-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-purple-900 truncate max-w-[180px]">{selectedFile.name}</p>
                        <p className="text-xs text-purple-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelectedFile(null); setResult(null); setError(null); }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>

                  <button
                    onClick={analyzeReport}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 active:scale-95 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing with VitaCure AI...</>
                    ) : (
                      <><FileSearch className="h-5 w-5" /> Generate AI Report</>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Feature chips */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Beaker, color: 'text-vc-blue', bg: 'bg-blue-50 border-blue-100', title: 'Lab Values', desc: 'Highlights values outside normal ranges.' },
                { icon: ClipboardList, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', title: 'AI Summary', desc: 'Translates complex jargon into plain English.' },
                { icon: Heart, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100', title: 'Lifestyle Tips', desc: 'Personalized diet & wellness suggestions.' },
                { icon: Stethoscope, color: 'text-teal-600', bg: 'bg-teal-50 border-teal-100', title: 'Follow-Up', desc: 'Recommends next steps with your doctor.' },
              ].map(({ icon: Icon, color, bg, title, desc }) => (
                <div key={title} className={`card border ${bg} p-4`}>
                  <Icon className={`h-5 w-5 ${color} mb-2`} />
                  <h4 className="font-bold text-vc-navy text-sm">{title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right Column: Results ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="card p-0 overflow-hidden flex flex-col h-full">
              {/* Results header */}
              <div className="bg-vc-navy px-6 py-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-400" /> AI Analysis Report
                </h2>
                {result && (
                  <div className="flex items-center gap-3">
                    <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                      ✓ Complete
                    </span>
                    <button
                      onClick={() => downloadReport(result.summary)}
                      className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  </div>
                )}
              </div>

              {/* Results body */}
              <div className="p-5 flex-grow flex flex-col bg-gray-50 overflow-y-auto">

                {/* Empty state */}
                {!result && !loading && !error && (
                  <div className="flex-grow flex flex-col items-center justify-center text-center py-16">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-gray-100">
                      <FileSearch className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-400 mb-2">Awaiting Document</h3>
                    <p className="text-sm text-gray-400 max-w-xs">Upload a medical PDF to generate your professional AI-powered health report.</p>

                    <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-sm text-left">
                      {[
                        { emoji: '🟢', label: 'Green = Normal values' },
                        { emoji: '🔴', label: 'Red = Abnormal values' },
                        { emoji: '🟡', label: 'Yellow = Borderline' },
                        { emoji: '🔵', label: 'Blue = Recommendations' },
                      ].map(({ emoji, label }) => (
                        <div key={label} className="bg-white rounded-xl px-4 py-3 border border-gray-100 text-xs text-gray-600 font-medium flex items-center gap-2 shadow-sm">
                          <span className="text-base">{emoji}</span> {label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading state */}
                {loading && (
                  <div className="flex-grow flex flex-col items-center justify-center py-16">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
                      <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-7 w-7 text-purple-600 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold text-vc-navy mb-2">VitaCure AI is analyzing your report...</h3>
                    <p className="text-sm text-gray-500 mb-6">Extracting text, analyzing values, and generating your professional medical summary.</p>
                    <div className="flex flex-col gap-2 w-full max-w-xs">
                      {['Extracting PDF text...', 'Identifying lab values...', 'Running AI analysis...', 'Generating recommendations...'].map((step, i) => (
                        <div key={step} className="flex items-center gap-3">
                          <Loader2 className="h-4 w-4 text-purple-500 animate-spin flex-shrink-0" style={{ animationDelay: `${i * 0.2}s` }} />
                          <span className="text-xs text-gray-500">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results: sectioned cards */}
                {result && sections.length > 0 && (
                  <div ref={resultsRef} className="space-y-4">
                    {/* Report title banner */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white text-center shadow-md">
                      <h2 className="text-xl font-bold">🩺 Medical Report Analysis</h2>
                      <p className="text-purple-200 text-sm mt-1">Generated by VitaCure AI · Powered by Llama-3.3</p>
                    </div>

                    {sections.map((section, i) => (
                      <ResultCard key={section.title} title={section.title} body={section.body} index={i} />
                    ))}
                  </div>
                )}

                {/* Fallback: if sections couldn't be parsed, render raw markdown */}
                {result && sections.length === 0 && (
                  <div className="prose prose-sm max-w-none p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.summary}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
