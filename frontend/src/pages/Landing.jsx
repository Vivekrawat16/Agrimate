import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Leaf, BarChart3, ShieldCheck, CloudSun, Smartphone } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

const Landing = () => {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen bg-white selection:bg-green-200">
            {/* Language Selector (Absolute Top Right) */}
            <div className="absolute top-4 right-4 md:top-6 md:right-8 z-50">
                <LanguageSelector theme="dark" />
            </div>

            {/* Hero Section */}
            <header className="relative bg-green-900 text-white overflow-hidden pt-2 pb-16 md:py-24 flex flex-col justify-center min-h-[70vh]">
                <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-900/80 to-transparent z-10"></div>
                <img
                    src="https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Lush green farm hero background"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                />

                <div className="relative z-20 container mx-auto px-6 py-4 md:py-20 flex flex-col items-center text-center mt-2 md:mt-0">
                    <div className="inline-flex items-center gap-2 bg-white/10 text-green-100 px-5 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20 backdrop-blur-md shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        {t('landing.badge')}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight max-w-4xl tracking-tight">
                        {t('landing.heroTitle')} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">
                            {t('landing.heroTitleHighlight')}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-green-50/90 mb-10 max-w-2xl font-light leading-relaxed">
                        {t('landing.heroSubtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            to="/signup"
                            className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            {t('landing.startFree')} <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/login"
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg transition-all backdrop-blur-md flex items-center justify-center w-full sm:w-auto"
                        >
                            {t('landing.logIn')}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-16 bg-gray-50/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">{t('landing.featuresTitle')}</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            {t('landing.featuresSubtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        <FeatureCard
                            icon={<Leaf className="text-emerald-600" size={32} />}
                            color="bg-emerald-50"
                            title={t('landing.features.cropTitle')}
                            desc={t('landing.features.cropDesc')}
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-blue-600" size={32} />}
                            color="bg-blue-50"
                            title={t('landing.features.yieldTitle')}
                            desc={t('landing.features.yieldDesc')}
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="text-rose-600" size={32} />}
                            color="bg-rose-50"
                            title={t('landing.features.diseaseTitle')}
                            desc={t('landing.features.diseaseDesc')}
                        />
                        <FeatureCard
                            icon={<CloudSun className="text-amber-600" size={32} />}
                            color="bg-amber-50"
                            title={t('landing.features.weatherTitle')}
                            desc={t('landing.features.weatherDesc')}
                        />
                    </div>
                </div>
            </section>

            {/* App Showcase Section */}
            <section className="py-16 overflow-hidden">
                <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 lg:pr-12">
                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                            <Smartphone className="text-green-600" size={24} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight max-w-sm">{t('landing.showcaseTitle')}</h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {t('landing.showcaseSubtitle')}
                        </p>
                        <ul className="space-y-4">
                            {(t('landing.showcasePoints') || []).map((point, i) => (
                                <ListItem key={i} text={point} />
                            ))}
                        </ul>
                    </div>
                    <div className="flex-1 relative w-full w-full max-w-md lg:max-w-none mx-auto mt-10 lg:mt-0">
                        <div className="absolute inset-0 bg-green-400 rounded-full filter blur-[80px] opacity-20 transform translate-x-10"></div>
                        <img
                            src="https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            alt="Farmer using a tablet in a sunny field"
                            className="relative rounded-[2rem] shadow-xl z-10 w-full object-cover h-[350px] lg:h-[450px]"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-b from-green-900 to-green-950 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] opacity-10 mix-blend-overlay"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('landing.ctaTitle')}</h2>
                    <p className="text-green-100/80 mb-10 text-lg max-w-2xl mx-auto font-light">
                        {t('landing.ctaSubtitle')}
                    </p>
                    <Link
                        to="/signup"
                        className="bg-white text-green-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-2xl inline-flex items-center justify-center gap-3 w-full sm:w-auto"
                    >
                        {t('landing.createAccount')} <ArrowRight size={24} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-950 text-gray-500 py-8 border-t border-gray-900">
                <div className="container mx-auto px-6 text-center text-sm font-medium">
                    <p>&copy; {new Date().getFullYear()} {t('landing.footer')}</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, color, title, desc }) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-100 transition-all duration-300 hover:-translate-y-2 group cursor-default">
        <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-gray-500 leading-relaxed font-medium">{desc}</p>
    </div>
);

const ListItem = ({ text }) => (
    <li className="flex items-center gap-4 text-lg text-gray-700 font-medium">
        <div className="bg-green-100 p-1 rounded-full shrink-0">
            <CheckCircle2 className="text-green-600" size={20} />
        </div>
        {text}
    </li>
);

export default Landing;
