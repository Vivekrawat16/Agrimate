import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudRain, TrendingUp, Sprout, Bug, Bot, Mic, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import AIInput from '../components/AIInput';
import VoiceButton from '../components/VoiceButton';
import BentoGrid, { BentoItem } from '../components/BentoGrid';
import GlassCard from '../components/GlassCard';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-[#F2F4F3] selection:bg-green-100 selection:text-primary-green relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-green-50/80 to-transparent pointer-events-none" />

            <Navbar />

            <div className="container mx-auto px-4 pt-28 pb-32 max-w-6xl relative z-10">

                {/* 1. Hero / AI Command Center */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center justify-center space-x-2 bg-white/60 backdrop-blur-sm border border-green-100 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-green-800 shadow-sm animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span>{t('home.heroTitle')}</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-text-dark tracking-tight mb-6 leading-tight">
                        {t('home.heroSubtitle')}
                    </h1>

                    <div className="relative z-20 mb-8">
                        <AIInput
                            placeholder={t('home.inputPlaceholder')}
                            onSearch={(query) => navigate('/chat', { state: { query } })}
                        />
                    </div>
                </div>

                {/* 2. Feature Dashboard (Bento Grid) */}
                <BentoGrid>
                    {/* Main Feature: Yield Prediction (Large) */}
                    <BentoItem colSpan={2} rowSpan={2}>
                        <GlassCard className="h-full flex flex-col justify-between p-8 group cursor-pointer" onClick={() => navigate('/yield')}>
                            <div>
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <TrendingUp size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('home.cards.yield.title')}</h3>
                                <p className="text-gray-500 leading-relaxed">{t('home.cards.yield.subtitle')}</p>
                            </div>
                            <div className="mt-8 flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                                <span>Start Analysis</span> <ArrowRight size={18} />
                            </div>
                            {/* Decorative Graph Line */}
                            <div className="absolute bottom-0 right-0 w-1/2 h-24 bg-gradient-to-t from-blue-50/50 to-transparent pointer-events-none" />
                        </GlassCard>
                    </BentoItem>

                    {/* Secondary: Crop Recommendation (Tall) */}
                    <BentoItem rowSpan={2}>
                        <GlassCard className="h-full p-8 bg-gradient-to-br from-green-600 to-green-700 text-white cursor-pointer group" onClick={() => navigate('/crop')}>
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-12 transition-transform duration-500">
                                <Sprout size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{t('home.cards.crop.title')}</h3>
                            <p className="text-green-100 opacity-90 text-sm mb-8">{t('home.cards.crop.subtitle')}</p>

                            <div className="absolute bottom-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-md group-hover:bg-white group-hover:text-green-600 transition-colors">
                                <ArrowRight size={20} />
                            </div>
                        </GlassCard>
                    </BentoItem>

                    {/* Standard: Disease Doctor */}
                    <BentoItem>
                        <GlassCard className="h-full p-6 cursor-pointer group hover:bg-red-50/50 transition-colors border-l-4 border-l-red-500" onClick={() => navigate('/disease')}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                                    <Bug size={20} />
                                </div>
                                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">AI Doctor</span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-lg">{t('home.cards.disease.title')}</h4>
                            <p className="text-sm text-gray-500 mt-1">{t('home.cards.disease.subtitle')}</p>
                        </GlassCard>
                    </BentoItem>

                    {/* Standard: Weather */}
                    <BentoItem>
                        <GlassCard className="h-full p-6 cursor-pointer group hover:bg-sky-50/50 transition-colors" onClick={() => navigate('/weather')}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600">
                                    <CloudRain size={20} />
                                </div>
                                <span className="text-sky-600 font-bold text-xl">24°C</span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-lg">{t('home.cards.weather.title')}</h4>
                            <p className="text-sm text-gray-500 mt-1">{t('home.cards.weather.subtitle')}</p>
                        </GlassCard>
                    </BentoItem>

                </BentoGrid>
            </div>

            <VoiceButton />
        </div>
    );
};

export default Home;
