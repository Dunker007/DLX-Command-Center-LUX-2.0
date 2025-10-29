
import React from 'react';
import { Card } from './Card';

const SystemCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <a href="#" className="bg-cyan-900/40 border border-transparent hover:border-cyan-500/50 p-4 rounded-lg text-center text-cyan-400 hover:bg-cyan-900/60 hover:text-white transition-all duration-300 flex items-center justify-center h-full">
        <span className="text-sm">{children}</span>
    </a>
);

export const SystemMatrix: React.FC = () => {
    const systems = [
        'Cognitive Weaving',
        'Procedural Synthesis',
        'Hyper-Personalization Matrix',
        'Sentinel UI',
        'Dynamic Ambiance',
        'Predictive Interface Layer',
    ];

    return (
        <div className="md:col-span-2 lg:col-span-3">
             <Card>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-left">System Matrix</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {systems.map(system => <SystemCard key={system}>{system}</SystemCard>)}
                </div>
            </Card>
        </div>
    );
};
