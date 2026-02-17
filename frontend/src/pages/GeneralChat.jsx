import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Bot, User, Loader2, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatAgent } from '../services/api';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';

const GeneralChat = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    // Initial message from Home page input, if any
    const initialQuery = state?.query || '';

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(true);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
    };

    useEffect(scrollToBottom, [messages, loading]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSpeechSupported(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setInput(transcript);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [language]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setInput(''); // Clear input when starting new voice input
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    useEffect(() => {
        // If there was an initial query, send it automatically
        if (initialQuery) {
            setMessages(prev => {
                if (prev.length === 0) {
                    handleSend(null, initialQuery);
                }
                return prev;
            });
        } else {
            // Initial Greeting - functional update to prevent double render
            setMessages(prev => {
                if (prev.length === 0) {
                    return [{
                        type: 'bot',
                        translationKey: 'chat.greeting',
                        text: t('chat.greeting') // Fallback/Initial text
                    }];
                }
                return prev;
            });
        }
    }, []);

    const handleSend = async (e, textOverride = null) => {
        if (e) e.preventDefault();
        const textToUse = textOverride || input;
        if (!textToUse.trim()) return;

        // Stop listening if active
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }

        // User Message
        const userMsg = { type: 'user', text: textToUse };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await chatAgent({ query: textToUse, language });
            const botMsg = {
                type: 'bot',
                text: res.data.answer || "I'm sorry, I couldn't understand that."
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { type: 'bot', text: t('chat.networkError') }]);
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
                    <button onClick={() => navigate('/home')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-text-dark">{t('chat.title')}</h1>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white rounded-3xl shadow-soft p-4 overflow-y-auto mb-4 border border-gray-100 relative">
                    <div className="space-y-4 pb-48 md:pb-20">
                        <AnimatePresence>
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex items-start gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'user' ? 'bg-primary-green text-white' : 'bg-gray-100 text-primary-green'}`}>
                                        {msg.type === 'user' ? <User size={14} className="md:w-4 md:h-4" /> : <Bot size={14} className="md:w-4 md:h-4" />}
                                    </div>

                                    <div className={`p-3 md:p-4 rounded-2xl max-w-[85%] text-xs md:text-base leading-relaxed shadow-sm ${msg.type === 'user'
                                        ? 'bg-green-600 text-white font-medium rounded-tr-none'
                                        : 'bg-white text-gray-800 font-medium rounded-tl-none border border-gray-100 shadow-sm'
                                        }`}>
                                        {msg.translationKey ? t(msg.translationKey) : msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 md:gap-3">
                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Bot size={14} className="text-primary-green md:w-4 md:h-4" />
                                </div>
                                <div className="bg-white px-3 py-2 md:px-4 md:py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin text-primary-green md:w-4 md:h-4" />
                                    <span className="text-[10px] md:text-xs text-gray-400">{t('chat.thinking')}</span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area - Fixed at bottom on mobile to avoid nav overlap */}
                <div className="fixed bottom-20 left-0 right-0 px-2 py-2 md:py-4 bg-gradient-to-t from-white via-white to-transparent md:static md:bg-none md:p-0 z-[60]">
                    <form onSubmit={handleSend} className="relative flex items-center gap-2 max-w-4xl mx-auto w-full">
                        <div className="relative flex-1 min-w-0">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isListening ? t('chat.listening') : t('chat.inputPlaceholder')}
                                className={`w-full h-9 md:h-14 pl-3 md:pl-6 pr-8 md:pr-4 bg-white rounded-full shadow-lg border transition-all font-sans text-sm md:text-base ${isListening
                                    ? 'border-red-400 ring-2 ring-red-200'
                                    : 'border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-green/50'
                                    }`}
                            />
                            {/* Voice Button Mobile (Inside Input) */}
                            {speechSupported && (
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    className={`absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full md:hidden transition-all ${isListening
                                        ? 'text-red-500 animate-pulse bg-red-50'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                                </button>
                            )}
                        </div>

                        {/* Voice Button Desktop */}
                        {speechSupported && (
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`hidden md:flex h-12 w-12 rounded-full items-center justify-center transition-all shrink-0 shadow-lg ${isListening
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                                    }`}
                            >
                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                        )}

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="h-9 w-9 md:h-12 md:w-12 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-lg"
                        >
                            <Send size={16} className="md:w-5 md:h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GeneralChat;
