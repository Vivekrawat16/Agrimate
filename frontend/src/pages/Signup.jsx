import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, googleLogin } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await register(name, email, password);
        setLoading(false);

        if (res.success) {
            navigate('/home');
        } else {
            setError(res.message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            const apiUrl = import.meta.env.MODE === 'development'
                ? 'http://localhost:5000/api/auth/google'
                : '/api/auth/google';
            const res = await axios.post(apiUrl, { token: credential });

            if (res.data.token) {
                googleLogin(res.data);
                navigate('/home');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Google Signup Failed');
        }
    };

    const handleGoogleError = () => {
        setError('Google Signup Failed');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md border border-green-100">
                <div className="text-center mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">{t('signup.title')}</h1>
                    <p className="text-gray-500">{t('signup.subtitle')}</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}

                <div className="mb-6 md:mb-8">
                    <div className="flex justify-center mb-6">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="outline"
                            size="large"
                            text="signup_with"
                            shape="rectangular"
                            width="100%"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">{t('signup.orContinue')}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">{t('signup.fullName')}</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                placeholder={t('signup.namePlaceholder')}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">{t('signup.email')}</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                placeholder={t('signup.emailPlaceholder')}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">{t('signup.password')}</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                placeholder={t('signup.passwordPlaceholder')}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 md:py-3 rounded-xl transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : t('signup.createAccount')}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <p className="mt-6 md:mt-8 text-center text-gray-600 text-sm md:text-base">
                    {t('signup.hasAccount')}{' '}
                    <Link to="/login" className="text-green-600 font-bold hover:underline">
                        {t('signup.signIn')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
