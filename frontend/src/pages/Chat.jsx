import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Upload, FileText, Loader2, MessageCircle, Bot, User, BrainCircuit, ShieldCheck, X } from 'lucide-react';
import { api } from '../services/api';
import ReactMarkdown from 'react-markdown';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docLoading, setDocLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hello! I am the VitaCure AI medical assistant, powered by Groq Llama-3. I can answer medical questions or analyze any health documents you upload. How can I help you today?"
      }]);
    }
  }, []);

  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedDoc(file);
      setDocLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      try {
        await api.uploadDocument(formData);
        setMessages(prev => [...prev, { role: 'system', content: `Document "${file.name}" uploaded successfully. You can now ask questions about it.` }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'system', content: 'Failed to process document. Please try again.', error: true }]);
        setSelectedDoc(null);
      } finally {
        setDocLoading(false);
      }
    }
  };

  const removeDocument = () => {
    setSelectedDoc(null);
    setMessages(prev => [...prev, { role: 'system', content: 'Document removed from context.' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = messages.filter(m => m.role !== 'system');
      
      console.log("Sending chat request to backend with history:", chatHistory);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${baseUrl}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatHistory, userMessage],
          use_rag: !!selectedDoc
        }),
      });

      if (!response.ok) {
        let errDetail = "";
        try {
          const errJson = await response.json();
          errDetail = errJson.detail || "";
        } catch (_) {}
        const statusText = errDetail || `Server error ${response.status} (${response.statusText})`;
        throw new Error(statusText);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: 'assistant', content: '' };
      
      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                if (parsed.content.startsWith("Error: ")) {
                  throw new Error(parsed.content);
                }
                assistantMessage.content += parsed.content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = { ...assistantMessage };
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error("Chatbot connection error:", err);
      let friendlyError = err.message;
      if (err.message === "Failed to fetch") {
        friendlyError = "Backend server is not running or network request failed. Please ensure the backend is started.";
      }
      setMessages(prev => [...prev, { role: 'system', content: friendlyError, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-vc-gray">
      {/* Header */}
      <div className="bg-vc-navy text-white px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-vc-blue w-10 h-10 rounded-xl flex items-center justify-center shadow-inner">
            <BrainCircuit className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              VitaCure Chatbot <span className="bg-vc-sky/20 text-vc-sky px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border border-vc-sky/30">Groq Llama-3</span>
            </h1>
            <p className="text-xs text-blue-200">Ultra-fast medical knowledge assistant</p>
          </div>
        </div>
        
        {/* RAG Context Controls */}
        <div className="flex items-center gap-3">
          {selectedDoc ? (
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
              <FileText className="h-4 w-4 text-vc-sky" />
              <span className="text-xs font-medium max-w-[150px] truncate">{selectedDoc.name}</span>
              <button onClick={removeDocument} className="ml-1 text-gray-400 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-medium transition-colors">
                {docLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload Document (RAG)
                <input type="file" accept="application/pdf" className="hidden" onChange={handleDocUpload} disabled={docLoading} />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Mobile RAG Controls */}
      <div className="sm:hidden bg-vc-blue-dark px-4 py-2 flex items-center justify-between text-white border-t border-white/10">
        {selectedDoc ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-vc-sky" />
              <span className="text-xs font-medium truncate max-w-[200px]">{selectedDoc.name}</span>
            </div>
            <button onClick={removeDocument}><X className="h-4 w-4" /></button>
          </div>
        ) : (
          <label className="cursor-pointer w-full flex items-center justify-center gap-2 text-xs font-medium">
            {docLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Tap to upload document for context
            <input type="file" accept="application/pdf" className="hidden" onChange={handleDocUpload} disabled={docLoading} />
          </label>
        )}
      </div>

      {/* Chat Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'system' ? (
                <div className={`mx-auto text-xs font-medium px-4 py-1.5 rounded-full ${msg.error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-100 text-gray-500'}`}>
                  {msg.content}
                </div>
              ) : (
                <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-vc-blue text-white' : 'bg-white border border-gray-200'}`}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-5 w-5 text-vc-sky" />}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`px-5 py-3.5 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-vc-blue text-white rounded-br-sm shadow-md' 
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100 prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-vc-navy'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot className="h-5 w-5 text-vc-sky" />
                </div>
                <div className="px-5 py-4 bg-white rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 flex items-center gap-1.5">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50/80 px-4 py-2 border-t border-amber-100 text-center text-[11px] text-amber-700 flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3 w-3" />
        AI can make mistakes. Always verify medical information with a doctor.
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={selectedDoc ? "Ask a question about your document..." : "Describe your symptoms or ask a medical question..."}
              disabled={loading || docLoading}
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-6 pr-14 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-vc-sky focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading || docLoading}
              className="absolute right-2 w-10 h-10 bg-vc-blue text-white rounded-full flex items-center justify-center hover:bg-vc-blue-dark disabled:opacity-50 disabled:hover:bg-vc-blue transition-colors"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
