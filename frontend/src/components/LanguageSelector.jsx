import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = ({ theme = 'light' }) => {
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'en', label: 'English', native: 'English' },
        { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
        { code: 'mr', label: 'Marathi', native: 'मराठी' }
    ];

    const currentLanguage = languages.find(l => l.code === language) || languages[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isDarkTheme = theme === 'dark';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 border ${isOpen
                    ? (isDarkTheme ? 'bg-white/20 border-white/30 text-white' : 'bg-green-50 border-green-200 text-green-800')
                    : (isDarkTheme ? 'bg-white/10 border-white/10 text-white/90 hover:bg-white/20 hover:text-white' : 'bg-transparent border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-200')
                    }`}
            >
                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${isDarkTheme ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                    <Globe size={14} />
                </div>
                <span className="text-sm font-medium">
                    {currentLanguage.native}
                </span>
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isDarkTheme ? 'text-white/70' : 'text-gray-400'}`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                        Select Language
                    </div>
                    {languages.map((lang) => {
                        const isSelected = language === lang.code;
                        return (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${isSelected
                                    ? 'bg-green-50/50 text-green-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex flex-col items-start px-2">
                                    <span>{lang.native}</span>
                                    <span className={`text-xs ${isSelected ? 'text-green-600/70' : 'text-gray-400'}`}>{lang.label}</span>
                                </div>
                                {isSelected && <Check size={16} className="text-green-600" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
