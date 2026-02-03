import React, { useState } from 'react';
import { Globe, Wifi, MessageSquare, Mic, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिन्दी' },
        { code: 'mr', label: 'मराठी' }
    ];

    const currentLabel = languages.find(l => l.code === language)?.label || 'English';

    return (
        <nav className="fixed top-0 w-full bg-white shadow-sm h-16 z-50 flex items-center justify-between px-4 md:px-6">
            {/* Left: Branding */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center text-white font-bold">A</div>
                <span className="text-text-dark font-sans font-bold text-lg tracking-tight">{t('nav.brand')}</span>
            </div>

            {/* Right: Utilities */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="hidden md:flex items-center gap-1 text-text-dark hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-gray-200"
                    >
                        <Globe size={18} className="text-primary-green" />
                        <span className="text-sm font-medium">{currentLabel}</span>
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

                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {t('nav.connected')}
                </div>

                <button className="p-2 text-text-muted hover:text-primary-green hover:bg-green-50 rounded-full transition-colors relative">
                    <MessageSquare size={20} />
                </button>

                <button className="p-2 text-text-muted hover:text-primary-green hover:bg-green-50 rounded-full transition-colors md:hidden">
                    <Mic size={20} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
