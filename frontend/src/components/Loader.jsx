import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Loader = ({ message = "Analyzing Farm Data..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <Loader2 size={48} className="text-green-600" />
            </motion.div>
            <p className="text-gray-600 font-medium animate-pulse">{message}</p>
        </div>
    );
};

export default Loader;
