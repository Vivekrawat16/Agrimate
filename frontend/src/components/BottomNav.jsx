import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Sprout, TrendingUp, Bug, MessageSquare, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    const navLinks = [
        { path: '/home', labelKey: 'nav.dashboard', icon: Home },
        { path: '/crop', labelKey: 'nav.crop', icon: Sprout },
        { path: '/yield', labelKey: 'nav.yield', icon: TrendingUp },
        { path: '/disease', labelKey: 'nav.disease', icon: Bug },
        { path: '/chat', labelKey: 'nav.chat', icon: MessageSquare },
        { path: '/profile', labelKey: 'nav.profile', icon: User },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
            <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 pb-safe pt-2 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
                <div className="flex justify-around items-end h-16 w-full">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;

                        return (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300 group`}
                            >
                                <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive
                                    ? 'bg-green-50 text-primary-green transform -translate-y-1'
                                    : 'text-gray-400 group-hover:text-gray-600'
                                    }`}>
                                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={`text-[10px] font-medium transition-all duration-300 ${isActive
                                    ? 'text-primary-green opacity-100'
                                    : 'text-gray-400'
                                    }`}>
                                    {t(link.labelKey)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BottomNav;
