import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Loader2, AlertCircle, Scan, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function Diagnosis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPEG, PNG).');
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.analyzeImage(formData);
      setResult(response.data);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the diagnosis server. Please ensure the backend is running.');
      } else {
        setError(err.response?.data?.detail || 'The CNN model could not be loaded or failed to process the image.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-vc-blue bg-vc-blue-light border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-vc-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-vc-blue-light rounded-2xl mb-4 shadow-sm">
              <Scan className="h-8 w-8 text-vc-blue" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-vc-navy mb-3">AI Image Diagnosis</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">Upload a clear image of a skin condition. Our CNN model will analyze it instantly to detect possible diseases and recommend next steps.</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            <div className="card p-8">
              <h2 className="text-xl font-bold text-vc-navy mb-4">Upload Image</h2>
              
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:border-vc-blue hover:bg-vc-blue-light/50 transition-colors cursor-pointer relative group bg-gray-50"
              >
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="h-8 w-8 text-vc-blue" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-vc-navy">Drag and drop an image</p>
                    <p className="text-sm text-gray-500 mt-1">or click to browse from your device</p>
                  </div>
                  <div className="text-xs text-gray-400">Supported formats: JPEG, PNG (Max 5MB)</div>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-4 flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-sm"
                  >
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {preview && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-vc-navy mb-3">Image Preview</h3>
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-black/5 aspect-video flex items-center justify-center shadow-inner">
                    <img src={preview} alt="Preview" className="max-w-full max-h-[300px] object-contain" />
                  </div>
                  
                  <button
                    onClick={analyzeImage}
                    disabled={loading}
                    className="mt-6 w-full btn-primary py-4 text-lg justify-center ripple"
                  >
                    {loading ? (
                      <><Loader2 className="h-6 w-6 animate-spin" /> Analyzing Image...</>
                    ) : (
                      <><Scan className="h-6 w-6" /> Run AI Diagnosis</>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Privacy note */}
            <div className="bg-vc-sky-light border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-vc-blue flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-vc-navy mb-1">Privacy Assured</h4>
                <p className="text-xs text-gray-600">Your images are processed securely and are never stored permanently on our servers. The analysis is performed instantly and the data is discarded.</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="h-full">
            <div className="card p-0 h-full overflow-hidden flex flex-col">
              <div className="bg-vc-navy px-6 py-5 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-vc-sky" /> Diagnosis Results
                </h2>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                {!result && !loading && (
                  <div className="flex-grow flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Scan className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-400 mb-2">No Results Yet</h3>
                    <p className="text-sm text-gray-400 max-w-xs">Upload an image and click analyze to see the CNN diagnosis results here.</p>
                  </div>
                )}

                {loading && (
                  <div className="flex-grow flex flex-col items-center justify-center py-12">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-vc-blue-light border-t-vc-blue rounded-full animate-spin" />
                      <Scan className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-vc-blue animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold text-vc-navy mt-6 mb-2">Running CNN Models...</h3>
                    <p className="text-sm text-gray-500">Scanning image patterns and extracting features.</p>
                  </div>
                )}

                {result && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Primary Prediction */}
                    <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Primary Prediction</p>
                      <h3 className="text-3xl font-black text-vc-blue mb-3">{result.prediction}</h3>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-bold text-vc-navy text-sm">Confidence: {(result.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Description */}
                      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-vc-navy mb-2 border-b border-gray-100 pb-2">Description</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{result.description}</p>
                      </div>

                      {/* Symptoms */}
                      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-vc-navy mb-2 border-b border-gray-100 pb-2">Common Symptoms</h4>
                        <ul className="space-y-2">
                          {result.symptoms?.map((sym, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle2 className="h-4 w-4 text-vc-sky flex-shrink-0 mt-0.5" />
                              <span>{sym}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className={`border rounded-2xl p-5 flex items-start gap-4 ${getRiskColor(result.severity)}`}>
                      <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold mb-1">Recommendation (Severity: {result.severity})</h4>
                        <p className="text-sm opacity-90 leading-relaxed">{result.recommendation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
