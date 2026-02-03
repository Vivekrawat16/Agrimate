import React from 'react';

const BentoGrid = ({ children, className = "" }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)] ${className}`}>
            {children}
        </div>
    );
};

export const BentoItem = ({ children, className = "", colSpan = 1, rowSpan = 1 }) => {
    return (
        <div className={`
            ${colSpan === 2 ? 'md:col-span-2' : ''}
            ${colSpan === 3 ? 'md:col-span-3' : ''}
            ${rowSpan === 2 ? 'md:row-span-2' : ''}
            h-full
            ${className}
        `}>
            {children}
        </div>
    );
};

export default BentoGrid;
