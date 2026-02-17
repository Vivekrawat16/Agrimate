import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, MessageSquare, Mic, ChevronDown, Sprout, TrendingUp, Bug, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिन्दी' },
        { code: 'mr', label: 'मराठी' }
    ];

    const navLinks = [
        { path: '/home', labelKey: 'nav.dashboard', icon: Home },
        { path: '/crop', labelKey: 'nav.crop', icon: Sprout },
        { path: '/yield', labelKey: 'nav.yield', icon: TrendingUp },
        { path: '/disease', labelKey: 'nav.disease', icon: Bug },
        { path: '/chat', labelKey: 'nav.chat', icon: MessageSquare },
    ];

    const currentLabel = languages.find(l => l.code === language)?.label || 'English';

    return (
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm h-16 z-50 flex items-center justify-between px-4 md:px-6">
            {/* Left: Branding */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                <div className="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center text-white font-bold">A</div>
                <span className="text-text-dark font-sans font-bold text-lg tracking-tight hidden sm:block">{t('nav.brand')}</span>
            </div>

            {/* Mobile Center: Greeting/Brand */}
            <div className="md:hidden absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
                <span className="text-sm font-semibold text-gray-700">Agrimate</span>
                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-md">AI</span>
            </div>

            {/* Center: Navigation Tabs */}
            <div className="hidden md:flex items-center gap-1 bg-gray-100/80 rounded-full p-1">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
                                ? 'bg-white text-primary-green shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                }`}
                        >
                            <Icon size={16} />
                            <span>{t(link.labelKey)}</span>
                        </button>
                    );
                })}
            </div>

            {/* Right: Utilities */}
            <div className="flex items-center gap-2">
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-1 text-text-dark hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-gray-200"
                    >
                        <Globe size={18} className="text-primary-green" />
                        <span className="text-sm font-medium hidden sm:block">{currentLabel}</span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>

                    {isOpen && (
                        <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-hover border border-gray-100 py-2 overflow-hidden">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-green-50 hover:text-primary-green transition-colors ${language === lang.code ? 'bg-green-50 text-primary-green font-bold' : 'text-gray-600'}`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {t('nav.connected')}
                </div>

                {/* Mobile Menu Removed (moved to BottomNav) */}
            </div>
        </nav>
    );
};

export default Navbar;

