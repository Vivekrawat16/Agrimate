import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Thermometer, Droplets, Wind, Sun, CloudRain, AlertTriangle, Loader2, Search, RefreshCw, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { getWeatherForecast } from '../services/api';

const Weather = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [detecting, setDetecting] = useState(false);

    // Auto-detect location on mount
    useEffect(() => {
        detectLocation();
    }, []);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return;
        }

        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const coords = `${latitude},${longitude}`;
                setLocation(coords);
                await fetchWeather(coords);
                setDetecting(false);
            },
            (err) => {
                setDetecting(false);
                setError(t('weather.locationDenied'));
            }
        );
    };

    const fetchWeather = async (loc) => {
        if (!loc.trim()) return;

        setLoading(true);
        setError('');

        try {
            const { data } = await getWeatherForecast(loc, 7);
            setWeatherData(data);
        } catch (err) {
            console.error(err);
            setError(t('weather.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchWeather(location);
    };

    const getWeatherIcon = (code, isDay) => {
        // Simplified weather icon mapping
        if (code === 1000) return isDay ? '☀️' : '🌙';
        if (code >= 1003 && code <= 1009) return '⛅';
        if (code >= 1030 && code <= 1135) return '🌫️';
        if (code >= 1150 && code <= 1201) return '🌧️';
        if (code >= 1204 && code <= 1237) return '🌨️';
        if (code >= 1240 && code <= 1282) return '⛈️';
        return '🌤️';
    };

    const getInsightIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="text-yellow-600" size={18} />;
            case 'success': return <Leaf className="text-green-600" size={18} />;
            default: return <Sun className="text-blue-600" size={18} />;
        }
    };

    const getInsightBg = (type) => {
        switch (type) {
            case 'warning': return 'bg-yellow-50 border-yellow-200';
            case 'success': return 'bg-green-50 border-green-200';
            default: return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50">
            <Navbar />

            <div className="container mx-auto px-4 pt-20 pb-8 max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => navigate('/home')} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                        <ArrowLeft size={22} className="text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">{t('weather.title')}</h1>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder={t('weather.searchPlaceholder')}
                                className="w-full h-14 pl-12 pr-4 bg-white rounded-2xl shadow-lg border-0 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-800 placeholder:text-gray-400"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={detectLocation}
                            disabled={detecting}
                            className="h-14 w-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-sky-600 hover:bg-sky-50 transition-colors disabled:opacity-50"
                        >
                            {detecting ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !location.trim()}
                            className="h-14 px-6 bg-sky-600 text-white rounded-2xl shadow-lg font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                            <span className="hidden sm:inline">{t('common.update')}</span>
                        </button>
                    </div>
                </form>

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2"
                    >
                        <AlertTriangle size={18} />
                        {error}
                    </motion.div>
                )}

                {/* Loading State */}
                {loading && !weatherData && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={48} className="animate-spin text-sky-600 mb-4" />
                        <p className="text-gray-500">{t('common.loading')}</p>
                    </div>
                )}

                {/* Weather Data */}
                <AnimatePresence>
                    {weatherData && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {/* Current Weather Card */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/50">
                                <div className="flex items-center gap-2 text-gray-500 mb-4">
                                    <MapPin size={16} />
                                    <span>{weatherData.location.name}, {weatherData.location.region}, {weatherData.location.country}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-6xl font-bold text-gray-800">
                                            {Math.round(weatherData.current.temp_c)}°
                                        </div>
                                        {t('weather.conditions.' + weatherData.current.condition.code) || weatherData.current.condition.text}
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1">
                                        {t('weather.feelsLike')} {Math.round(weatherData.current.feelslike_c)}°
                                    </div>
                                </div>
                                <div className="text-8xl">
                                    {getWeatherIcon(weatherData.current.condition.code, weatherData.current.is_day)}
                                </div>
                            </div>

                            {/* Weather Stats */}
                            <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-100">
                                <div className="text-center">
                                    <Droplets className="mx-auto text-blue-500 mb-1" size={22} />
                                    <div className="text-lg font-semibold text-gray-800">{weatherData.current.humidity}%</div>
                                    <div className="text-xs text-gray-500">{t('weather.humidity')}</div>
                                </div>
                                <div className="text-center">
                                    <Wind className="mx-auto text-gray-500 mb-1" size={22} />
                                    <div className="text-lg font-semibold text-gray-800">{Math.round(weatherData.current.wind_kph)} km/h</div>
                                    <div className="text-xs text-gray-500">{t('weather.wind')}</div>
                                </div>
                                <div className="text-center">
                                    <Sun className="mx-auto text-yellow-500 mb-1" size={22} />
                                    <div className="text-lg font-semibold text-gray-800">{weatherData.current.uv}</div>
                                    <div className="text-xs text-gray-500">{t('weather.uv')}</div>
                                </div>
                                <div className="text-center">
                                    <CloudRain className="mx-auto text-sky-500 mb-1" size={22} />
                                    <div className="text-lg font-semibold text-gray-800">{weatherData.current.precip_mm} mm</div>
                                    <div className="text-xs text-gray-500">{t('weather.precipitation')}</div>
                                </div>
                            </div>
                            {/* Farming Insights */}
                            {weatherData.insights && weatherData.insights.length > 0 && (
                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/50">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                                        <Leaf className="text-green-600" size={20} />
                                        {t('weather.farmingInsights')}
                                    </h3>
                                    <div className="space-y-3">
                                        {weatherData.insights.map((insight, i) => (
                                            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${getInsightBg(insight.type)}`}>
                                                {getInsightIcon(insight.type)}
                                                <span className="text-sm text-gray-700">{insight.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 7-Day Forecast */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/50">
                                <h3 className="font-bold text-gray-800 mb-4">7-Day Forecast</h3>
                                <div className="space-y-3">
                                    {weatherData.forecast?.forecastday?.map((day, i) => {
                                        const date = new Date(day.date);
                                        const dayName = i === 0 ? t('common.today') : i === 1 ? t('common.tomorrow') : date.toLocaleDateString('en-US', { weekday: 'short' });

                                        return (
                                            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                                <div className="w-20 text-gray-600 font-medium">{dayName}</div>
                                                <div className="text-3xl">{getWeatherIcon(day.day.condition.code, true)}</div>
                                                <div className="flex-1 text-center text-sm text-gray-500 hidden sm:block">
                                                    {t('weather.conditions.' + day.day.condition.code) || day.day.condition.text}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Droplets size={14} className="text-blue-400" />
                                                    <span className="text-sm text-gray-500 w-10">{day.day.daily_chance_of_rain}%</span>
                                                </div>
                                                <div className="w-24 text-right">
                                                    <span className="font-semibold text-gray-800">{Math.round(day.day.maxtemp_c)}°</span>
                                                    <span className="text-gray-400 ml-2">{Math.round(day.day.mintemp_c)}°</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Weather Alerts */}
                            {weatherData.alerts?.alert?.length > 0 && (
                                <div className="bg-red-50 rounded-3xl shadow-xl p-6 border border-red-200">
                                    <h3 className="font-bold text-red-800 flex items-center gap-2 mb-4">
                                        <AlertTriangle className="text-red-600" size={20} />
                                        {t('weather.alerts')}
                                    </h3>
                                    <div className="space-y-3">
                                        {weatherData.alerts.alert.map((alert, i) => (
                                            <div key={i} className="bg-white p-4 rounded-xl border border-red-100">
                                                <div className="font-medium text-red-700">{alert.headline}</div>
                                                <div className="text-sm text-gray-600 mt-2">{alert.desc?.slice(0, 200)}...</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
};

export default Weather;
