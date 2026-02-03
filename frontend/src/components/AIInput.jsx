import React from 'react';
import { Send } from 'lucide-react';

const AIInput = ({ placeholder = "Ask about weather...", onSearch }) => {
    const [text, setText] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() && onSearch) {
            onSearch(text);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full shadow-hover rounded-full hover:scale-[1.01] transition-transform duration-300">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
                className="w-full h-16 pl-6 pr-16 bg-white rounded-full shadow-soft border border-gray-100 text-lg text-text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-green/50 transition-all font-sans"
            />
            <button type="submit" className="absolute right-2 top-2 h-12 w-12 bg-primary-green rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors shadow-sm">
                <Send size={24} />
            </button>
        </form>
    );
};

export default AIInput;
