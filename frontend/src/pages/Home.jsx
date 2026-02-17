import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Sprout, Bug, ArrowRight, MapPin, Droplets, Wind, Sun, Loader2, RefreshCw, CloudRain, Thermometer, Calendar, Leaf } from 'lucide-react';
import Navbar from '../components/Navbar';
import AIInput from '../components/AIInput';
import GlassCard from '../components/GlassCard';
import { useLanguage } from '../context/LanguageContext';
import { getWeatherForecast } from '../services/api';

const Home = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    // Weather state
    const [weather, setWeather] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState('');

    // Fetch weather on mount
    useEffect(() => {
        fetchWeatherByLocation();
    }, []);

    const fetchWeatherByLocation = () => {
        setWeatherLoading(true);
        setWeatherError('');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const { data } = await getWeatherForecast(`${latitude},${longitude}`, 5);
                        setWeather(data);
                    } catch (err) {
                        setWeatherError('Could not load weather');
                    } finally {
                        setWeatherLoading(false);
                    }
                },
                async () => {
                    try {
                        const { data } = await getWeatherForecast('New Delhi', 5);
                        setWeather(data);
                    } catch (err) {
                        setWeatherError('Could not load weather');
                    } finally {
                        setWeatherLoading(false);
                    }
                }
            );
        } else {
            getWeatherForecast('New Delhi', 5)
                .then(({ data }) => setWeather(data))
                .catch(() => setWeatherError('Could not load weather'))
                .finally(() => setWeatherLoading(false));
        }
    };

    const getWeatherIcon = (code) => {
        if (code === 1000) return '☀️';
        if (code >= 1003 && code <= 1009) return '⛅';
        if (code >= 1030 && code <= 1135) return '🌫️';
        if (code >= 1150 && code <= 1201) return '🌧️';
        if (code >= 1204 && code <= 1237) return '🌨️';
        if (code >= 1240 && code <= 1282) return '⛈️';
        return '🌤️';
    };

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-sky-50/30">
            <Navbar />

            <div className="container mx-auto px-4 pt-20 pb-12 max-w-7xl">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">🌾 {t('home.dashboard')}</h1>
                        <p className="text-gray-500 flex items-center gap-2 mt-1">
                            <Calendar size={14} />
                            {t('common.today')}, {dateStr}
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-2">
                        {weather && (
                            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
                                <MapPin size={14} className="text-gray-400" />
                                <span className="text-sm text-gray-700">{weather.location?.name}, {weather.location?.region}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Weather Section - Prominent at Top */}
                <div className="mb-8">
                    {weatherLoading ? (
                        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-8 flex items-center justify-center">
                            <Loader2 className="animate-spin text-white" size={40} />
                        </div>
                    ) : weatherError ? (
                        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-8 text-center text-white">
                            <CloudRain size={40} className="mx-auto mb-2 opacity-50" />
                            <p>{t('weather.fetchError')}</p>
                            <button onClick={fetchWeatherByLocation} className="mt-3 bg-white/20 px-4 py-2 rounded-full text-sm hover:bg-white/30 transition">
                                {t('common.retry')}
                            </button>
                        </div>
                    ) : weather && (
                        <div className="relative overflow-hidden rounded-3xl shadow-xl text-white bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />

                            <div className="relative z-10 p-5 md:p-8">
                                {/* Top Row - Current Weather */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-4 md:mb-6">
                                    <div className="flex items-center gap-4 md:gap-6">
                                        <div className="text-5xl md:text-8xl">
                                            {getWeatherIcon(weather.current?.condition?.code)}
                                        </div>
                                        <div>
                                            <div className="text-4xl md:text-7xl font-light">
                                                {Math.round(weather.current?.temp_c)}°
                                                <span className="text-lg md:text-2xl text-white/60 ml-1">C</span>
                                            </div>
                                            <div className="text-white/90 text-sm md:text-lg mt-0.5 md:mt-1 font-medium">
                                                {t(`weather.conditions.${weather.current?.condition?.code}`) || weather.current?.condition?.text}
                                            </div>
                                            <div className="text-white/70 text-xs md:text-sm">
                                                {t('weather.feelsLike')} {Math.round(weather.current?.feelslike_c)}°
                                            </div>
                                        </div>
                                    </div>

                                    {/* Weather Stats - Compact Grid on Mobile */}
                                    <div className="grid grid-cols-4 gap-2 md:gap-4 mt-2 md:mt-0">
                                        {[
                                            { icon: Droplets, val: `${weather.current?.humidity}%`, label: t('weather.humidity'), color: 'text-blue-200' },
                                            { icon: Wind, val: Math.round(weather.current?.wind_kph), label: t('weather.wind'), color: 'text-blue-200' },
                                            { icon: Sun, val: weather.current?.uv, label: t('weather.uv'), color: 'text-yellow-300' },
                                            { icon: CloudRain, val: weather.current?.precip_mm, label: t('weather.rain'), color: 'text-blue-200' }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-2 md:p-4 text-center flex flex-col items-center justify-center">
                                                <stat.icon size={16} className={`mb-1 ${stat.color} md:w-5 md:h-5`} />
                                                <div className="text-sm md:text-2xl font-semibold leading-tight">{stat.val}</div>
                                                <div className="text-[10px] md:text-xs text-white/60">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 5-Day Forecast Row - Scrollable */}
                                <div className="border-t border-white/20 pt-3 md:pt-4">
                                    <div className="flex justify-between items-center overflow-x-auto gap-3 pb-1 no-scrollbar">
                                        {weather.forecast?.forecastday?.map((day, i) => {
                                            const date = new Date(day.date);
                                            const dayName = i === 0 ? t('common.today') : i === 1 ? t('common.tomorrow') : date.toLocaleDateString('en-US', { weekday: 'short' });
                                            return (
                                                <div key={i} className="flex-1 min-w-[60px] md:min-w-[80px] text-center bg-white/10 rounded-lg md:rounded-xl py-2 md:py-3 px-1 md:px-2 shrink-0">
                                                    <div className="text-[10px] md:text-xs text-white/70 mb-1 uppercase tracking-wider">{dayName}</div>
                                                    <div className="text-xl md:text-2xl my-1">{getWeatherIcon(day.day.condition.code)}</div>
                                                    <div className="text-sm font-semibold">{Math.round(day.day.maxtemp_c)}°</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Refresh Button */}
                                <button
                                    onClick={fetchWeatherByLocation}
                                    className="absolute top-3 right-3 md:top-4 md:right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                                >
                                    <RefreshCw size={16} className="md:w-[18px] md:h-[18px]" />
                                </button>

                                {/* View Full Forecast Link */}
                                <button
                                    onClick={() => navigate('/weather')}
                                    className="absolute bottom-3 right-3 md:bottom-4 md:right-4 px-3 py-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-xs font-medium flex items-center gap-1"
                                >
                                    {t('weather.fullForecast')} <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Assistant Input */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <Leaf className="text-green-600" size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">{t('chat.title')}</h3>
                                <p className="text-xs text-gray-500">{t('chat.subtitle')}</p>
                            </div>
                        </div>
                        <AIInput
                            placeholder={t('home.inputPlaceholder')}
                            onSearch={(query) => navigate('/chat', { state: { query } })}
                        />
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('weather.farmingInsights')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Crop Recommendation */}
                        <GlassCard
                            className="p-6 cursor-pointer group hover:shadow-lg transition-all bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                            onClick={() => navigate('/crop')}
                        >
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Sprout size={24} />
                                </div>
                                <ArrowRight size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-xl font-bold mt-4">{t('home.cards.crop.title')}</h3>
                            <p className="text-green-100 text-sm mt-1">{t('home.cards.crop.subtitle')}</p>
                        </GlassCard>

                        {/* Yield Prediction */}
                        <GlassCard
                            className="p-6 cursor-pointer group hover:shadow-lg transition-all bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                            onClick={() => navigate('/yield')}
                        >
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <TrendingUp size={24} />
                                </div>
                                <ArrowRight size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-xl font-bold mt-4">{t('home.cards.yield.title')}</h3>
                            <p className="text-blue-100 text-sm mt-1">{t('home.cards.yield.subtitle')}</p>
                        </GlassCard>

                        {/* Disease Prediction */}
                        <GlassCard
                            className="p-6 cursor-pointer group hover:shadow-lg transition-all bg-gradient-to-br from-red-500 to-rose-600 text-white"
                            onClick={() => navigate('/disease')}
                        >
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Bug size={24} />
                                </div>
                                <ArrowRight size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-xl font-bold mt-4">{t('home.cards.disease.title')}</h3>
                            <p className="text-red-100 text-sm mt-1">{t('home.cards.disease.subtitle')}</p>
                        </GlassCard>

                    </div>
                </div>

                {/* Farming Tips from Weather */}
                {weather?.insights && weather.insights.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">🌾 {t('weather.farmingInsights')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {weather.insights.map((insight, i) => (
                                <div
                                    key={i}
                                    className={`p-4 rounded-xl border ${insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                                        insight.type === 'success' ? 'bg-green-50 border-green-200' :
                                            'bg-blue-50 border-blue-200'
                                        }`}
                                >
                                    <p className="text-sm text-gray-700">{insight.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div >
    );
};

export default Home;
