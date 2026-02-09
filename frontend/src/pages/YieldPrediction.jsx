import React, { useState, useEffect, useRef } from 'react';
import { predictYield } from '../services/api';
import Navbar from '../components/Navbar';
import { Send, Bot, User, Loader2, Award, AlertTriangle, Lightbulb, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useVoiceInput from '../hooks/useVoiceInput';
import { useLanguage } from '../context/LanguageContext';

const YieldPrediction = () => {
    const { t } = useLanguage();

    const getQuestions = () => [
        { key: 'cropName', text: t('yield.greeting'), options: t('yield.options.cropName') },
        { key: 'landSize', text: t('yield.steps.landSize'), options: t('yield.options.landSize') },
        { key: 'soil', text: t('yield.steps.soil'), options: t('yield.options.soil') },
        { key: 'irrigation', text: t('yield.steps.irrigation'), options: t('yield.options.irrigation') },
        { key: 'fertilizer', text: t('yield.steps.fertilizer'), options: t('yield.options.fertilizer') },
        { key: 'season', text: t('yield.steps.season'), options: t('yield.options.season') },
        { key: 'location', text: t('yield.steps.location'), options: [t('yield.options.location')[0], 'Punjab', 'Haryana', 'UP', 'MP'] },
    ];

    // We call this "questions" for consistency with the rest of the file
    const questions = getQuestions();
    const [messages, setMessages] = useState([]);
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        cropName: '', landSize: '', soil: '', irrigation: '', fertilizer: '', season: '', location: ''
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const { isListening, speechSupported, transcript, toggleListening } = useVoiceInput();

    // Sync voice transcript to input
    useEffect(() => {
        if (transcript) setInput(transcript);
    }, [transcript]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initial greeting - runs only once
    useEffect(() => {
        setMessages(prevMessages => {
            if (prevMessages.length === 0) {
                return [{ type: 'bot', text: questions[0].text }];
            }
            return prevMessages;
        });
    }, []);

    const simulateBotResponse = (text, delay = 600) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { type: 'bot', text }]);
            setIsTyping(false);
        }, delay);
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setMessages(prev => [...prev, { type: 'bot', text: "Geolocation is not supported. Please type State manually." }]);
            return;
        }

        setIsTyping(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                const detectState = data.address.state || data.address.region || '';

                if (detectState) {
                    setFormData(prev => ({ ...prev, location: detectState }));
                    setMessages(prev => [...prev, { type: 'bot', text: `📍 Detected State: **${detectState}**` }]);
                    setIsTyping(false);
                    // Location is the last step, so we trigger submit
                    triggerSubmit({ ...formData, location: detectState });
                } else {
                    throw new Error("State not found");
                }
            } catch (error) {
                setIsTyping(false);
                setMessages(prev => [...prev, { type: 'bot', text: "Could not fetch state. Please enter manually." }]);
            }
        }, () => {
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'bot', text: "Permission denied. Please enter State manually." }]);
        });
    };

    const triggerSubmit = async (finalData) => {
        setLoading(true);
        setIsTyping(true);
        try {
            const { data } = await predictYield(finalData);
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'bot', text: "Crunching the numbers...", isSystem: true }]);
            setTimeout(() => {
                setMessages(prev => [...prev, { type: 'result', data: data }]);
            }, 1000);
        } catch (err) {
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'bot', text: "Server error. Please try again. ⚠️" }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const currentAnswer = input;

        if (currentAnswer === '📍 Detect Location') {
            setMessages(prev => [...prev, { type: 'user', text: currentAnswer }]);
            setInput('');
            detectLocation();
            return;
        }

        const currentKey = questions[step].key;
        setMessages(prev => [...prev, { type: 'user', text: currentAnswer }]);
        const updatedData = { ...formData, [currentKey]: currentAnswer };
        setFormData(updatedData);
        setInput('');

        if (step < questions.length - 1) {
            setStep(prev => prev + 1);
            simulateBotResponse(questions[step + 1].text);
        } else {
            triggerSubmit(updatedData);
        }
    };

    return (
        <div className="min-h-screen bg-light-bg flex flex-col">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 pt-24 pb-48 md:pb-24 max-w-2xl">
                <div className="space-y-6">
                    {/* ... (render messages) ... */}
                    <AnimatePresence>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-end gap-3 max-w-[90%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'user' ? 'bg-gray-200' : 'bg-blue-100 text-blue-600'}`}>
                                        {msg.type === 'user' ? <User size={16} className="text-gray-600" /> : <Bot size={18} />}
                                    </div>

                                    {msg.type === 'result' ? (
                                        <div className="w-full bg-white rounded-2xl shadow-soft p-6 border-t-4 border-blue-500 mb-4">
                                            <div className="text-center mb-6">
                                                <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Estimated Yield</p>
                                                <h3 className="text-5xl font-extrabold text-blue-700 mt-2">
                                                    {msg.data.estimated_yield} <span className="text-xl text-gray-500 font-medium">{msg.data.yield_unit}</span>
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <div className="bg-green-50 p-3 rounded-lg">
                                                    <p className="text-xs text-gray-500 mb-1">Max Potential</p>
                                                    <p className="font-bold text-green-700 flex items-center gap-1"><Award size={14} /> {msg.data.best_case}</p>
                                                </div>
                                                <div className="bg-red-50 p-3 rounded-lg">
                                                    <p className="text-xs text-gray-500 mb-1">If Ignored</p>
                                                    <p className="font-bold text-red-700 flex items-center gap-1"><AlertTriangle size={14} /> {msg.data.worst_case}</p>
                                                </div>
                                            </div>
                                            <div className="bg-yellow-50 p-4 rounded-xl">
                                                <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-2 text-sm">
                                                    <Lightbulb size={16} /> Smart Tips
                                                </h4>
                                                <ul className="list-disc pl-4 space-y-1 text-sm text-yellow-900/80">
                                                    {msg.data.tips_to_increase_yield?.slice(0, 3).map((tip, i) => (
                                                        <li key={i}>{tip}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <button onClick={() => window.location.reload()} className="w-full py-3 mt-4 bg-gray-100 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors">
                                                Calculate Another
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`p-4 rounded-2xl shadow-sm text-base leading-relaxed ${msg.type === 'user'
                                            ? 'bg-blue-100 text-blue-900 rounded-br-none shadow-sm border border-blue-200'
                                            : 'bg-white text-text-dark rounded-bl-none border border-gray-100'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}
                                        ></div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isTyping && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm ml-12">
                            <Loader2 size={16} className="animate-spin" /> AgriSense is typing...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="fixed bottom-[4.5rem] md:bottom-0 w-full bg-white border-t border-gray-100 p-4 pb-6 z-40 transition-all duration-300">
                {!loading && !isTyping && step < questions.length && questions[step].options?.length > 0 && (
                    <div className="container mx-auto max-w-2xl px-2 mb-3 flex gap-2 overflow-x-auto no-scrollbar py-1">
                        {questions[step].options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setInput(opt);
                                    setTimeout(() => document.getElementById('chat-submit-btn').click(), 0);
                                }}
                                className="whitespace-nowrap px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors shadow-sm"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSend} className="container mx-auto max-w-2xl flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isListening ? "Listening..." : "Type answer..."}
                        className={`flex-1 h-14 pl-6 pr-4 bg-gray-50 rounded-full text-lg text-black transition-all outline-none placeholder:text-gray-400 ${isListening ? 'border-2 border-red-400 ring-2 ring-red-200' : 'border-transparent focus:border-blue-500/30 focus:bg-white focus:ring-4 focus:ring-blue-500/10'}`}
                        disabled={loading || isTyping}
                        autoFocus
                    />
                    {speechSupported && (
                        <button
                            type="button"
                            onClick={toggleListening}
                            className={`h-12 w-12 rounded-full flex items-center justify-center transition-all shrink-0 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                    )}
                    <button
                        id="chat-submit-btn"
                        type="submit"
                        disabled={!input.trim() || loading || isTyping}
                        className="h-12 w-12 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors disabled:opacity-50 shrink-0"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default YieldPrediction;
