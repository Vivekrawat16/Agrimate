import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, MessageSquare, Mic, ChevronDown, Sprout, TrendingUp, Bug, Home, User, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
    const { language, setLanguage, t } = useLanguage();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navLinks = [
        { path: '/home', labelKey: 'nav.dashboard', icon: Home },
        { path: '/crop', labelKey: 'nav.crop', icon: Sprout },
        { path: '/yield', labelKey: 'nav.yield', icon: TrendingUp },
        { path: '/disease', labelKey: 'nav.disease', icon: Bug },
        { path: '/chat', labelKey: 'nav.chat', icon: MessageSquare },
    ];

    return (
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm h-16 z-50 flex items-center justify-between px-4 md:px-6">
            {/* Left: Branding */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                <img src="/images/agrimate_logo.png" alt="Agrimate Logo" className="h-16 md:h-20 object-contain" />
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
                <LanguageSelector theme="light" />

                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {t('nav.connected')}
                </div>

                {/* Profile Avatar (Desktop) */}
                {user && (
                    <div className="relative hidden sm:block">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 text-white font-bold hover:shadow-md transition-shadow"
                        >
                            {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                        </button>

                        {isProfileOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden">
                                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        navigate('/profile');
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-primary-green transition-colors flex items-center gap-2"
                                >
                                    <User size={16} />
                                    {t('nav.profile')}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        logout();
                                        navigate('/');
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                >
                                    <LogOut size={16} />
                                    {t('nav.signOut')}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Mobile Menu Removed (moved to BottomNav) */}
            </div>
        </nav>
    );
};

export default Navbar;

