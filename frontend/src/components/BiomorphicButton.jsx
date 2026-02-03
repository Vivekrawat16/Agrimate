import React from 'react';
import { motion } from 'framer-motion';

const BiomorphicButton = ({ children, onClick, variant = 'primary', className = "", icon: Icon }) => {
    const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-bio font-display font-bold tracking-wide transition-all duration-300 transform active:scale-95";

    // Solar Green Glow vs Secondary Soil Tone
    const variants = {
        primary: "bg-gradient-to-r from-leaf-green to-emerald-600 text-white shadow-[0_4px_14px_0_rgba(76,175,80,0.39)] hover:shadow-[0_6px_20px_rgba(76,175,80,0.23)] hover:brightness-110 border border-transparent",
        secondary: "bg-white/50 text-deep-forest border border-deep-forest/10 hover:bg-white/80 hover:border-deep-forest/30 shadow-sm",
        outline: "bg-transparent border-2 border-leaf-green text-leaf-green hover:bg-leaf-green/10"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {Icon && <Icon size={20} className={variant === 'primary' ? 'text-green-50' : 'text-current'} />}
            {children}
        </motion.button>
    );
};

export default BiomorphicButton;
