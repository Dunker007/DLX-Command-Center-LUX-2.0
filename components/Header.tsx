
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 w-full bg-black/70 backdrop-blur-sm text-cyan-400 text-center p-3 z-50 border-b border-cyan-500/30">
            <h1 className="text-xl md:text-2xl font-bold tracking-wider drop-shadow-[0_0_5px_rgba(0,255,255,0.7)]">
                DLX Command Center // LUX 2.0
            </h1>
        </header>
    );
};
