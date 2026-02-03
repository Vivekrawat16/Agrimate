import React from 'react';
import { Bot } from 'lucide-react';

const AgentHeader = () => {
    return (
        <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-green/10 mb-4">
                <Bot size={32} className="text-primary-green" />
            </div>
            <h1 className="text-3xl font-bold text-text-dark tracking-tight">AgriSense AI Agent</h1>
            <p className="text-text-muted mt-2 text-lg">Your intelligent farming assistant.</p>
        </div>
    );
};

export default AgentHeader;
