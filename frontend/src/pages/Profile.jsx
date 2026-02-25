import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, ArrowLeft } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-8 flex justify-center items-start pt-24 md:pt-32">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white/50 rounded-full transition-colors text-green-800"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-green-900">{t('profile.title')}</h1>
                </div>

                {/* Profile Card */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex flex-col md:flex-row items-center gap-8">

                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-green-500/30">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            {user.provider === 'google' && (
                                <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-6">
                                <Mail size={16} />
                                <span>{user.email}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/50 p-4 rounded-2xl border border-white">
                                    <p className="text-sm text-gray-500 mb-1">{t('profile.accountType')}</p>
                                    <p className="font-semibold text-gray-800 capitalize">
                                        {user.provider === 'google' ? 'Google' : t('profile.local')}
                                    </p>
                                </div>
                                <div className="bg-white/50 p-4 rounded-2xl border border-white">
                                    <p className="text-sm text-gray-500 mb-1">{t('profile.status')}</p>
                                    <div className="flex items-center justify-center md:justify-start gap-1.5">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <p className="font-semibold text-gray-800">{t('profile.active')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center md:justify-end">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition-all shadow-sm"
                        >
                            <LogOut size={18} />
                            {t('profile.signOut')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
