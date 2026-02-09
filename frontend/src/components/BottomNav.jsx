import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Sprout, TrendingUp, Bug, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    const navLinks = [
        { path: '/', labelKey: 'nav.dashboard', icon: Home },
        { path: '/crop', labelKey: 'nav.crop', icon: Sprout },
        { path: '/yield', labelKey: 'nav.yield', icon: TrendingUp },
        { path: '/disease', labelKey: 'nav.disease', icon: Bug },
        { path: '/chat', labelKey: 'nav.chat', icon: MessageSquare },
    ];

    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
            <div className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl px-2 py-3 flex justify-between items-center">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;

                    return (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className={`flex flex-col items-center justify-center w-full gap-1 transition-all duration-300 relative ${isActive ? 'text-primary-green scale-105' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-green-100/50 shadow-inner' : ''}`}>
                                <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>

                            {/* Active Indicator Dot - Animated */}
                            {isActive && (
                                <span className="absolute -bottom-1 w-1 h-1 bg-primary-green rounded-full shadow-sm" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
