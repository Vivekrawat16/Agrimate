import React from 'react';
import { Mic } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceButton = () => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary-green rounded-full shadow-lg flex items-center justify-center text-white z-50 hover:shadow-xl hover:bg-green-700 transition-all cursor-pointer"
        >
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20 hover:opacity-0 delay-1000"></div>
            <Mic size={32} />
        </motion.button>
    );
};

export default VoiceButton;
