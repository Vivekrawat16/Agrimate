import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Leaf, BarChart3, ShieldCheck, CloudSun } from 'lucide-react';
// import { useAuth } from '../context/AuthContext'; // Might use later if we want to show "Go to Dashboard" if logged in

const Landing = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <header className="relative bg-green-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1625246333195-f8196812c850?q=80&w=2070&auto=format&fit=crop"
                    alt="Smart Farming"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />

                <div className="relative z-20 container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
                    <span className="bg-green-500/20 text-green-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-green-500/30 backdrop-blur-md">
                        🚀 The Future of Farming is Here
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl">
                        Empowering Farmers with <br className="hidden md:block" />
                        <span className="text-green-400">Artificial Intelligence</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl">
                        Agrimate provides real-time crop recommendations, disease detection, yield predictions, and expert AI chat support to maximize your harvest.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <Link
                            to="/signup"
                            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                        >
                            Get Started Free <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/login"
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all backdrop-blur-sm flex items-center justify-center"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Grow</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Advanced tools simplified for every farmer. Make data-driven decisions with confidence.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<Leaf className="text-green-600" size={32} />}
                            title="Crop Recommendation"
                            desc="Get AI-backed suggestions on the best crops to plant based on your soil and climate."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-blue-600" size={32} />}
                            title="Yield Prediction"
                            desc="Estimate your harvest quantity accurately before you even plant the seeds."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="text-red-600" size={32} />}
                            title="Disease Detection"
                            desc="Identify plant diseases early by simply uploading a photo of the affected leaf."
                        />
                        <FeatureCard
                            icon={<CloudSun className="text-yellow-600" size={32} />}
                            title="Weather Forecast"
                            desc="Real-time localized weather updates to help you plan your farming activities."
                        />
                    </div>
                </div>
            </section>

            {/* UI Showcase / About Section */}
            <section className="py-20">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Smart Farming in Your Pocket</h2>
                        <ul className="space-y-4">
                            <ListItem text="Instant answers from our expert AI Chatbot" />
                            <ListItem text="Support for multiple local languages" />
                            <ListItem text="Offline-capable mobile friendly interface" />
                            <ListItem text="Secure and private data handling" />
                        </ul>
                    </div>
                    <div className="flex-1 relative">
                        <div className="absolute inset-0 bg-green-200 rounded-full filter blur-3xl opacity-20"></div>
                        <img
                            src="https://images.unsplash.com/photo-1625246333195-f8196812c850?q=80&w=2070&auto=format&fit=crop"
                            alt="Mobile App"
                            className="relative rounded-2xl shadow-2xl border-4 border-white"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-green-900 text-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Modernize Your Farm?</h2>
                    <p className="text-green-200 mb-10 max-w-2xl mx-auto">Join thousands of farmers using Agrimate to increase yields and reduce risks.</p>
                    <Link
                        to="/signup"
                        className="bg-white text-green-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl inline-flex items-center gap-2"
                    >
                        Join Agrimate Now <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; 2026 Agrimate AI. Empowering Farmers with Technology.</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
);

const ListItem = ({ text }) => (
    <li className="flex items-center gap-3 text-lg text-gray-700">
        <CheckCircle2 className="text-green-500 shrink-0" size={24} />
        {text}
    </li>
);

export default Landing;
