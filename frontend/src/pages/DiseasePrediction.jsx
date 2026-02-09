import React, { useState, useEffect, useRef } from 'react';
import { predictDisease } from '../services/api';
import Navbar from '../components/Navbar';
import { Send, Bot, User, Loader2, ShieldCheck, CloudRain, Skull, Activity, AlertOctagon, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useVoiceInput from '../hooks/useVoiceInput';
import { useLanguage } from '../context/LanguageContext';

const DiseasePrediction = () => {
    const { t } = useLanguage();

    const getQuestions = () => [
        { key: 'cropName', text: t('disease.greeting'), options: t('disease.options.cropName') },
        { key: 'symptoms', text: t('disease.steps.symptoms'), options: t('disease.options.symptoms') },
        { key: 'daysSinceParams', text: t('disease.steps.days'), options: t('disease.options.days') },
        { key: 'weather', text: t('disease.steps.weather'), options: t('disease.options.weather') },
        { key: 'fertilizer', text: t('disease.steps.fertilizer'), options: t('disease.options.fertilizer') },
    ];

    const questions = getQuestions();
    const [messages, setMessages] = useState([]);
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        cropName: '', symptoms: '', daysSinceParams: '', weather: '', fertilizer: ''
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

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const currentAnswer = input;
        const currentKey = questions[step].key;

        setMessages(prev => [...prev, { type: 'user', text: currentAnswer }]);
        const updatedData = { ...formData, [currentKey]: currentAnswer };
        setFormData(updatedData);
        setInput('');

        if (step < questions.length - 1) {
            setStep(prev => prev + 1);
            simulateBotResponse(questions[step + 1].text);
        } else {
            setLoading(true);
            setIsTyping(true);
            try {
                const { data } = await predictDisease(updatedData);

                setIsTyping(false);
                setMessages(prev => [...prev, { type: 'bot', text: "Analyzing symptoms with Plant Pathology AI...", isSystem: true }]);

                setTimeout(() => {
                    setMessages(prev => [...prev, { type: 'result', data: data }]);
                }, 1000);

            } catch (err) {
                setIsTyping(false);
                setMessages(prev => [...prev, { type: 'bot', text: "I'm detecting a network issue. Please try again. ⚠️" }]);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-light-bg flex flex-col">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 pt-24 pb-48 md:pb-24 max-w-2xl">
                <div className="space-y-6">
                    <AnimatePresence>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-end gap-3 max-w-[90%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'user' ? 'bg-gray-200' : 'bg-red-100 text-red-600'}`}>
                                        {msg.type === 'user' ? <User size={14} className="text-gray-600 md:w-4 md:h-4" /> : <Activity size={14} className="md:w-4.5 md:h-4.5" />}
                                    </div>

                                    {msg.type === 'result' ? (
                                        <div className="w-full">
                                            {msg.data.possible_diseases?.map((disease, i) => (
                                                <div key={i} className="bg-white rounded-2xl shadow-soft p-4 md:p-5 border-l-4 border-red-500 mb-4 overflow-hidden relative">
                                                    <div className="absolute top-0 right-0 bg-red-100 text-red-800 px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-bold rounded-bl-lg uppercase">
                                                        {disease.urgency_level}
                                                    </div>
                                                    <h3 className="text-lg md:text-xl font-bold text-red-700 flex items-center gap-2 mb-2">
                                                        <Skull size={18} className="md:w-5 md:h-5" /> {disease.name}
                                                    </h3>
                                                    <p className="text-gray-500 text-xs md:text-sm mb-3 md:mb-4">Confidence: {disease.confidence}</p>

                                                    <div className="space-y-2 md:space-y-3">
                                                        <div className="bg-green-50 p-2 md:p-3 rounded-lg border border-green-100">
                                                            <p className="font-bold text-green-800 flex items-center gap-2 text-xs md:text-sm mb-1"><ShieldCheck size={12} className="md:w-3.5 md:h-3.5" /> Organic Solution</p>
                                                            <p className="text-xs md:text-sm text-gray-700">{disease.organic_solution}</p>
                                                        </div>
                                                        <div className="bg-blue-50 p-2 md:p-3 rounded-lg border border-blue-100">
                                                            <p className="font-bold text-blue-800 flex items-center gap-2 text-xs md:text-sm mb-1"><CloudRain size={12} className="md:w-3.5 md:h-3.5" /> Chemical Solution</p>
                                                            <p className="text-xs md:text-sm text-gray-700">{disease.chemical_solution}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={() => window.location.reload()} className="w-full py-2 md:py-3 mt-2 bg-gray-100 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors text-sm md:text-base">
                                                New Diagnosis
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`p-3 md:p-4 rounded-2xl shadow-sm text-xs md:text-base leading-relaxed ${msg.type === 'user'
                                            ? 'bg-red-50 text-red-900 rounded-br-none shadow-sm border border-red-100'
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
                        <div className="flex items-center gap-2 text-gray-400 text-xs md:text-sm ml-8 md:ml-12">
                            <Loader2 size={14} className="animate-spin md:w-4 md:h-4" /> Diagnosis in progress...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="fixed bottom-20 md:bottom-0 w-full bg-white border-t border-gray-100 px-2 py-2 md:p-4 md:pb-6 z-[60] transition-all duration-300">
                {!loading && !isTyping && step < questions.length && questions[step].options?.length > 0 && (
                    <div className="container mx-auto max-w-2xl px-2 mb-2 md:mb-3 flex gap-2 overflow-x-auto no-scrollbar py-1">
                        {questions[step].options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setInput(opt);
                                    setTimeout(() => document.getElementById('chat-submit-btn').click(), 0);
                                }}
                                className="whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 bg-red-50 text-red-700 rounded-full text-xs md:text-sm font-medium border border-red-200 hover:bg-red-100 transition-colors shadow-sm"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSend} className="w-full max-w-2xl mx-auto flex items-center gap-2">
                    <div className="relative flex-1 min-w-0">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isListening ? "Listening..." : "Describe symptoms..."}
                            className={`w-full h-9 md:h-14 pl-3 md:pl-6 pr-8 md:pr-4 bg-gray-50 rounded-full text-sm md:text-lg text-black transition-all outline-none placeholder:text-gray-400 ${isListening ? 'border-2 border-red-400 ring-2 ring-red-200' : 'border-transparent focus:border-red-500/30 focus:bg-white focus:ring-4 focus:ring-red-500/10'}`}
                            disabled={loading || isTyping}
                            autoFocus
                        />
                        {speechSupported && (
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full md:hidden transition-all ${isListening ? 'text-red-500 animate-pulse bg-red-50' : 'text-gray-400 hover:text-red-600'}`}
                            >
                                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                            </button>
                        )}
                    </div>

                    {speechSupported && (
                        <button
                            type="button"
                            onClick={toggleListening}
                            className={`hidden md:flex h-12 w-12 rounded-full items-center justify-center transition-all shrink-0 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'}`}
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                    )}
                    <button
                        id="chat-submit-btn"
                        type="submit"
                        disabled={!input.trim() || loading || isTyping}
                        className="h-9 w-9 md:h-12 md:w-12 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-900 transition-colors disabled:opacity-50 shrink-0"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin md:w-5 md:h-5" /> : <Send size={16} className="md:w-5 md:h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DiseasePrediction;
