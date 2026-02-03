import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", hoverEffect = true, ...props }) => {
    return (
        <motion.div
            {...props}
            className={`
                relative overflow-hidden
                bg-white/65 backdrop-blur-[14px] 
                border border-white/40 
                rounded-bio shadow-sm
                transition-all duration-300
                ${hoverEffect ? 'hover:shadow-lg hover:-translate-y-1' : ''}
                ${className}
            `}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Subtle Noise Texture Overlay for "Paper Fiber" feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
};

export default GlassCard;
