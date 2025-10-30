import React from 'react';
import { Card } from './Card';
import { IntelReport } from '../types';

interface IntelReportDisplayProps {
    report: IntelReport;
    onDismiss: () => void;
}

export const IntelReportDisplay: React.FC<IntelReportDisplayProps> = ({ report, onDismiss }) => {
    return (
        <Card className="md:col-span-2 lg:col-span-3">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-cyan-400">Intel Report Received</h2>
                <button onClick={onDismiss} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors">New Command</button>
            </div>
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
        </Card>
    );
};
