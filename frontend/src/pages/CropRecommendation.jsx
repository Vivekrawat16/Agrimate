import React, { useState, useEffect, useRef } from 'react';
import { recommendCrop } from '../services/api';
import Navbar from '../components/Navbar';
import { Send, Bot, User, Loader2, Leaf, Droplets, DollarSign, Clock, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useVoiceInput from '../hooks/useVoiceInput';
import { useLanguage } from '../context/LanguageContext';

const CropRecommendation = () => {
    const { t } = useLanguage();

    // Define questions dynamically based on language
    const getQuestions = () => [
        { key: 'soil', text: t('crop.greeting'), options: t('crop.options.soil') },
        { key: 'landSize', text: t('crop.steps.landSize'), options: ['1 Acre', '2 Acres', '5 Acres', '10+ Acres'] }, // Numeric options usually remain static or can be translated
        { key: 'season', text: t('crop.steps.season'), options: t('crop.options.season') },
        { key: 'irrigation', text: t('crop.steps.irrigation'), options: t('crop.options.irrigation') },
        { key: 'state', text: t('crop.steps.state'), options: [t('crop.options.detect'), 'Punjab', 'Uttar Pradesh', 'Madhya Pradesh', 'Maharashtra'] },
        { key: 'district', text: t('crop.steps.district'), options: [] },
        { key: 'previousCrop', text: t('crop.steps.previousCrop'), options: ['Wheat', 'Rice', 'Maize', 'None'] },
    ];

    const questions = getQuestions();
    const [messages, setMessages] = useState([]);
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        soil: '', landSize: '', season: '', irrigation: '', state: '', district: '', previousCrop: ''
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
            setMessages(prev => [...prev, { type: 'bot', text: "Geolocation is not supported by your browser. Please type your state manually." }]);
            return;
        }

        setIsTyping(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                const detectState = data.address.state || data.address.region || '';
                const detectDistrict = data.address.county || data.address.city || data.address.state_district || '';

                if (detectState && detectDistrict) {
                    setFormData(prev => ({ ...prev, state: detectState, district: detectDistrict }));
                    setMessages(prev => [...prev,
                    { type: 'bot', text: `📍 Detected Location: **${detectDistrict}, ${detectState}**` }
                    ]);
                    setIsTyping(false);

                    // Skip 'district' step (index 5) and jump to 'previousCrop' (index 6)
                    setStep(6);
                    simulateBotResponse(questions[6].text);
                } else {
                    throw new Error("Location details incomplete");
                }
            } catch (error) {
                setIsTyping(false);
                setMessages(prev => [...prev, { type: 'bot', text: "Could not fetch detailed address. Please enter State manually." }]);
            }
        }, () => {
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'bot', text: "Permission denied or unavailable. Please enter State manually." }]);
        });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const currentAnswer = input;

        // Handle Location Detection Trigger
        if (currentAnswer === '📍 Detect Location') {
            setMessages(prev => [...prev, { type: 'user', text: currentAnswer }]);
            setInput('');
            detectLocation();
            return;
        }

        const currentKey = questions[step].key;

        // Add user message
        setMessages(prev => [...prev, { type: 'user', text: currentAnswer }]);
        setFormData(prev => ({ ...prev, [currentKey]: currentAnswer }));
        setInput('');

        // Move to next step or submit
        if (step < questions.length - 1) {
            setStep(prev => prev + 1);
            simulateBotResponse(questions[step + 1].text);
        } else {
            // Submit form
            setLoading(true);
            setIsTyping(true);
            try {
                // Construct final data payload including the last answer
                const finalData = { ...formData, [currentKey]: currentAnswer };
                const { data } = await recommendCrop(finalData);

                setIsTyping(false);
                setMessages(prev => [...prev, { type: 'bot', text: "Analyzing your farm data...", isSystem: true }]);

                setTimeout(() => {
                    setMessages(prev => [...prev, { type: 'result', data: data }]);
                }, 1000);

            } catch (err) {
                setIsTyping(false);
                setMessages(prev => [...prev, { type: 'bot', text: "I'm having trouble connecting to the server. Please try again later. ⚠️" }]);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-light-bg flex flex-col">
            <Navbar />

            {/* Chat Area */}
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
                                <div className={`flex items-end gap-3 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>

                                    {/* Avatar */}
                                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'user' ? 'bg-gray-200' : 'bg-primary-green/10'}`}>
                                        {msg.type === 'user' ? <User size={14} className="text-gray-600 md:w-4 md:h-4" /> : <Bot size={14} className="text-primary-green md:w-4 md:h-4" />}
                                    </div>

                                    {/* Bubble */}
                                    {msg.type === 'result' ? (
                                        <div className="w-full">
                                            {msg.data.recommended_crops?.map((crop, i) => (
                                                <div key={i} className="bg-white rounded-2xl shadow-soft p-4 md:p-5 border border-green-100 mb-4">
                                                    <h3 className="text-lg md:text-xl font-bold text-primary-green flex items-center gap-2 mb-2">
                                                        <Leaf size={18} className="md:w-5 md:h-5" /> {crop.name}
                                                    </h3>
                                                    <p className="text-gray-600 italic mb-4 text-xs md:text-base">"{crop.reason}"</p>
                                                    <div className="grid grid-cols-3 gap-2 text-sm bg-light-bg p-2 md:p-3 rounded-lg">
                                                        <div className="flex flex-col items-center text-center">
                                                            <Droplets size={14} className="text-blue-500 mb-1 md:w-4 md:h-4" />
                                                            <span className="text-[10px] md:text-xs text-gray-500">Water</span>
                                                            <span className="font-medium text-gray-700 text-xs md:text-sm">{crop.water_requirement}</span>
                                                        </div>
                                                        <div className="flex flex-col items-center text-center">
                                                            <DollarSign size={14} className="text-yellow-600 mb-1 md:w-4 md:h-4" />
                                                            <span className="text-[10px] md:text-xs text-gray-500">Profit</span>
                                                            <span className="font-medium text-gray-700 text-xs md:text-sm">{crop.expected_profit}</span>
                                                        </div>
                                                        <div className="flex flex-col items-center text-center">
                                                            <Clock size={14} className="text-purple-500 mb-1 md:w-4 md:h-4" />
                                                            <span className="text-[10px] md:text-xs text-gray-500">Duration</span>
                                                            <span className="font-medium text-gray-700 text-xs md:text-sm">{crop.growth_duration}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={() => window.location.reload()} className="w-full py-2 md:py-3 mt-2 bg-gray-100 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors text-sm md:text-base">
                                                Start Over
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`p-3 md:p-4 rounded-2xl shadow-sm text-xs md:text-base leading-relaxed ${msg.type === 'user'
                                            ? 'bg-green-100 text-green-900 rounded-br-none shadow-sm border border-green-200'
                                            : 'bg-white text-text-dark rounded-bl-none border border-gray-100 shadow-sm'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}
                                        >

                                        </div>)}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="flex items-end gap-3">
                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-green/10 flex items-center justify-center">
                                    <Bot size={14} className="text-primary-green md:w-4 md:h-4" />
                                </div>
                                <div className="bg-gray-100 px-3 py-2 md:px-4 md:py-3 rounded-2xl rounded-bl-none flex gap-1">
                                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Bar */}
            <div className="fixed bottom-20 md:bottom-0 w-full bg-white border-t border-gray-100 px-2 py-2 md:p-4 md:pb-6 z-[60] transition-all duration-300">

                {/* Suggestion Chips */}
                {!loading && !isTyping && step < questions.length && questions[step].options?.length > 0 && (
                    <div className="container mx-auto max-w-2xl px-2 mb-2 md:mb-3 flex gap-2 overflow-x-auto no-scrollbar py-1">
                        {questions[step].options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setInput(opt);
                                    // Hacky but effective: simpler than refactoring handleSend to accept arg
                                    setTimeout(() => document.getElementById('chat-submit-btn').click(), 0);
                                }}
                                className="whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 bg-green-50 text-green-700 rounded-full text-xs md:text-sm font-medium border border-green-200 hover:bg-green-100 transition-colors shadow-sm"
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
                            placeholder={isListening ? "Listening..." : "Type or select..."}
                            className={`w-full h-9 md:h-14 pl-3 md:pl-6 pr-8 md:pr-4 bg-gray-50 rounded-full text-sm md:text-lg text-black transition-all outline-none placeholder:text-gray-400 ${isListening ? 'border-2 border-red-400 ring-2 ring-red-200' : 'border-transparent focus:border-green-500/30 focus:bg-white focus:ring-4 focus:ring-green-500/10'}`}
                            disabled={loading || isTyping}
                            autoFocus
                        />
                        {speechSupported && (
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full md:hidden transition-all ${isListening ? 'text-red-500 animate-pulse bg-red-50' : 'text-gray-400 hover:text-green-600'}`}
                            >
                                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                            </button>
                        )}
                    </div>

                    {speechSupported && (
                        <button
                            type="button"
                            onClick={toggleListening}
                            className={`hidden md:flex h-12 w-12 rounded-full items-center justify-center transition-all shrink-0 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'}`}
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                    )}
                    <button
                        id="chat-submit-btn"
                        type="submit"
                        disabled={!input.trim() || loading || isTyping}
                        className="h-9 w-9 md:h-12 md:w-12 bg-black rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors shrink-0"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin md:w-5 md:h-5" /> : <Send size={16} className="md:w-5 md:h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CropRecommendation;
