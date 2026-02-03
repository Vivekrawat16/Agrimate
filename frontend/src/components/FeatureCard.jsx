import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ title, icon: Icon, onClick, subtitle }) => {
    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-card-white rounded-[16px] shadow-soft p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[150px] border border-transparent hover:border-primary-green/10 transition-colors"
            onClick={onClick}
        >
            <div className="bg-primary-green/10 p-4 rounded-full mb-4">
                <Icon size={32} className="text-primary-green" strokeWidth={1.5} />
            </div>
            <h3 className="text-text-dark font-sans font-semibold text-lg">{title}</h3>
            {subtitle && <p className="text-text-muted text-sm mt-1">{subtitle}</p>}
        </motion.div>
    );
};

export default FeatureCard;
