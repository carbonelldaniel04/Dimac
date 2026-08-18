import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, X, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: '¿En qué puedo asistirle hoy sobre Dimac Arq?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const webhookUrl = (import.meta as any).env?.VITE_CHAT_WEBHOOK_URL || 'https://n8n.smarteco.com.ar/webhook/dani';
      let assistantReply = "";

      if (webhookUrl) {
        try {
          const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              message: userMessage,
              context: 'Dimac Arq Architecture Atelier',
              history: messages,
              timestamp: new Date().toISOString()
            })
          });

          if (webhookResponse.ok) {
            const data = await webhookResponse.json();
            assistantReply = data.reply || data.message || data.content || "";
          } else {
            console.warn(`Webhook returned status: ${webhookResponse.status}`);
          }
        } catch (err) {
          console.warn('Webhook communication failed, falling back to Gemini:', err);
        }
      }

      // Fallback to Gemini if webhook didn't provide a reply
      if (!assistantReply) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: [
            { role: 'user', parts: [{ text: `Eres el concierge de arquitectura de Dimac Arq. Un estudio minimalista de lujo. Responde de forma muy profesional, educada y minimalista. Mensaje del usuario: ${userMessage}` }] }
          ],
          config: {
            systemInstruction: 'Eres breve, formal y servicial. Tu tono es sofisticado y profesional. Respondes siempre en español.'
          }
        });
        assistantReply = response.text || 'Inconveniente técnico. Reintente.';
      }

      setMessages(prev => [...prev, { role: 'assistant', content: assistantReply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Inconveniente técnico. Reintente.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-12 right-12 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="w-80 md:w-96 h-[500px] architect-border bg-[#0F0F0F] flex flex-col mb-4 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-main flex justify-between items-center bg-bg-primary">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em]">Dimac Arq Concierge</h4>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-bg-primary custom-scrollbar">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] text-xs leading-loose tracking-wide ${m.role === 'user' ? 'text-accent font-bold italic' : 'text-gray-400 font-light'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-accent text-[10px] tracking-widest font-bold"
                  >
                    Procesando...
                  </motion.div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-border-main bg-bg-secondary">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Consultar..."
                  className="w-full bg-transparent border-b border-border-main py-4 text-xs focus:border-accent outline-none transition-all tracking-widest font-light"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-accent hover:text-white transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 architect-border flex items-center justify-center transition-all bg-bg-primary ${isOpen ? 'rotate-90 text-accent' : 'text-gray-500 hover:text-white'}`}
      >
        <MessageSquare size={20} />
      </motion.button>
    </div>
  );
}
