import React, { createContext, useState, useContext } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // 'en', 'hi', 'mr'

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (let k of keys) {
            value = value?.[k];
        }

        return value || key; // Fallback to key if missing
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
