import React, { useState } from 'react';
import { Card } from './Card';
import { analyzeIntel } from '../services/geminiService';
import { IntelReport } from '../types';

const LoadingIndicator: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-cyan-300 text-lg animate-pulse">ANALYZING DATASTREAM...</p>
    </div>
);

const ReportDisplay: React.FC<{ report: IntelReport }> = ({ report }) => (
    <div>
        <h3 className="text-2xl font-bold text-cyan-300 mb-3 drop-shadow-[0_0_5px_rgba(0,255,255,0.7)]">{report.title}</h3>
        <p className="text-gray-300 mb-6">{report.summary}</p>
        <ul className="space-y-3">
            {report.key_points.map((point, index) => (
                <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-1 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-cyan-200">{point}</span>
                </li>
            ))}
        </ul>
    </div>
);

export const IntelAnalysisCard: React.FC = () => {
    const [query, setQuery] = useState('');
    const [report, setReport] = useState<IntelReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setReport(null);

        try {
            const result = await analyzeIntel(query);
            setReport(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setQuery('');
        setReport(null);
        setError(null);
        setIsLoading(false);
    }

    return (
        <Card className="md:col-span-2 lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-cyan-400">Intel Analysis</h2>
                {(report || error || isLoading) && (
                     <button onClick={handleReset} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors">New Analysis</button>
                )}
            </div>

            {isLoading ? (
                <LoadingIndicator />
            ) : error ? (
                <div className="text-center py-8">
                    <p className="text-red-400 font-bold mb-2">Analysis Failed</p>
                    <p className="text-red-300 text-sm font-mono bg-red-900/50 p-3 rounded-md">{error}</p>
                </div>
            ) : report ? (
                <ReportDisplay report={report} />
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter complex query for structured analysis... e.g., 'Summarize last quarter's network intrusion incidents and highlight key vulnerability vectors.'"
                        className="w-full p-2.5 mb-4 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                        rows={3}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 px-5 rounded-md cursor-pointer text-base font-bold transition-colors duration-300 shadow-lg shadow-cyan-600/30 hover:shadow-cyan-500/50"
                        disabled={isLoading || !query.trim()}
                    >
                        ANALYZE
                    </button>
                </form>
            )}
        </Card>
    );
};
