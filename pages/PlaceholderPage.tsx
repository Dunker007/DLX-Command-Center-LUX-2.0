import React from 'react';
import { Card } from '../components/Card';

interface PlaceholderPageProps {
    title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
    return (
        <>
            <header className="text-left mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">
                    {title}
                </h1>
                <p className="text-gray-400 mt-2">This module is under construction.</p>
            </header>
            <Card>
                <div className="text-center text-gray-400 py-16">
                    <p>Interface for "{title}" is pending integration.</p>
                    <p>Awaiting further operational directives.</p>
                </div>
            </Card>
        </>
    );
};

export default PlaceholderPage;