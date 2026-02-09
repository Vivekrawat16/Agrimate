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
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'user' ? 'bg-gray-200' : 'bg-red-100 text-red-600'}`}>
                                        {msg.type === 'user' ? <User size={16} className="text-gray-600" /> : <Activity size={18} />}
                                    </div>

                                    {msg.type === 'result' ? (
                                        <div className="w-full">
                                            {msg.data.possible_diseases?.map((disease, i) => (
                                                <div key={i} className="bg-white rounded-2xl shadow-soft p-5 border-l-4 border-red-500 mb-4 overflow-hidden relative">
                                                    <div className="absolute top-0 right-0 bg-red-100 text-red-800 px-3 py-1 text-xs font-bold rounded-bl-lg uppercase">
                                                        {disease.urgency_level}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-red-700 flex items-center gap-2 mb-2">
                                                        <Skull size={20} /> {disease.name}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm mb-4">Confidence: {disease.confidence}</p>

                                                    <div className="space-y-3">
                                                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                                            <p className="font-bold text-green-800 flex items-center gap-2 text-sm mb-1"><ShieldCheck size={14} /> Organic Solution</p>
                                                            <p className="text-sm text-gray-700">{disease.organic_solution}</p>
                                                        </div>
                                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                                            <p className="font-bold text-blue-800 flex items-center gap-2 text-sm mb-1"><CloudRain size={14} /> Chemical Solution</p>
                                                            <p className="text-sm text-gray-700">{disease.chemical_solution}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={() => window.location.reload()} className="w-full py-3 mt-2 bg-gray-100 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors">
                                                New Diagnosis
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`p-4 rounded-2xl shadow-sm text-base leading-relaxed ${msg.type === 'user'
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
                        <div className="flex items-center gap-2 text-gray-400 text-sm ml-12">
                            <Loader2 size={16} className="animate-spin" /> Diagnosis in progress...
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
                                className="whitespace-nowrap px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200 hover:bg-red-100 transition-colors shadow-sm"
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
                        placeholder={isListening ? "Listening..." : "Describe symptoms..."}
                        className={`flex-1 h-14 pl-6 pr-4 bg-gray-50 rounded-full text-lg text-black transition-all outline-none placeholder:text-gray-400 ${isListening ? 'border-2 border-red-400 ring-2 ring-red-200' : 'border-transparent focus:border-red-500/30 focus:bg-white focus:ring-4 focus:ring-red-500/10'}`}
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

export default DiseasePrediction;
