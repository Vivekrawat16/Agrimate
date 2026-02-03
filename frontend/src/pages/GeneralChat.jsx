import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Bot, User, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatAgent } from '../services/api';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';

const GeneralChat = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();

    // Initial message from Home page input, if any
    const initialQuery = state?.query || '';

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        // If there was an initial query, send it automatically
        if (initialQuery && messages.length === 0) {
            handleSend(null, initialQuery);
        } else if (messages.length === 0) {
            // Initial Greeting
            setMessages([{
                type: 'bot',
                text: "Hello! I am your Agrimate Assistant. 🌾 Ask me anything about farming, weather, or market prices."
            }]);
        }
    }, []);

    const handleSend = async (e, textOverride = null) => {
        if (e) e.preventDefault();
        const textToUse = textOverride || input;
        if (!textToUse.trim()) return;

        // User Message
        const userMsg = { type: 'user', text: textToUse };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await chatAgent({ query: textToUse });
            const botMsg = {
                type: 'bot',
                text: res.data.answer || "I'm sorry, I couldn't understand that."
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { type: 'bot', text: "⚠️ Network Error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-light-bg pb-4">
            <Navbar />

            <div className="container mx-auto px-4 pt-20 max-w-2xl h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-text-dark">Agrimate Assistant</h1>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white rounded-3xl shadow-soft p-4 overflow-y-auto mb-4 border border-gray-100 relative">
                    <div className="space-y-4 pb-20">
                        <AnimatePresence>
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex items-start gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'user' ? 'bg-primary-green text-white' : 'bg-gray-100 text-primary-green'}`}>
                                        {msg.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>

                                    <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${msg.type === 'user'
                                        ? 'bg-green-600 text-white font-medium rounded-tr-none'
                                        : 'bg-white text-gray-800 font-medium rounded-tl-none border border-gray-100 shadow-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Bot size={16} className="text-primary-green" />
                                </div>
                                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-primary-green" />
                                    <span className="text-xs text-gray-400">Thinking...</span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question..."
                        className="w-full h-14 pl-6 pr-14 bg-white rounded-full shadow-hover border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-green/50 transition-all font-sans"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-2 h-10 w-10 bg-primary-green rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GeneralChat;
