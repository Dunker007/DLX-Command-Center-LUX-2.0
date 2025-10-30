import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { CommandConsole } from '../components/CommandConsole';
import { TaskList } from '../components/TaskList';
import { SystemMatrix } from '../components/SystemMatrix';
import { IntelReportDisplay } from '../components/IntelReportDisplay';
import { analyzeIntel } from '../services/geminiService';
import { AIStatus, Task, IntelReport } from '../types';
import { useNotifications } from '../hooks/useNotifications';

interface DashboardProps {
    tasks: Task[];
    handleTaskSubmit: (taskText: string) => void;
    isLoading: boolean;
}

const AIVitalsCard: React.FC<{ name: string; status: AIStatus }> = ({ name, status }) => {
    const [cpu, setCpu] = useState(0);
    const [mem, setMem] = useState(0);

    useEffect(() => {
        const updateVitals = () => {
            setCpu(Math.floor(Math.random() * (status === AIStatus.ACTIVE ? 60 : 20)) + (status === AIStatus.ACTIVE ? 20 : 5));
            setMem(Math.floor(Math.random() * (status === AIStatus.ACTIVE ? 50 : 25)) + (status === AIStatus.ACTIVE ? 30 : 10));
        };
        updateVitals();
        const interval = setInterval(updateVitals, 3000);
        return () => clearInterval(interval);
    }, [status]);

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-cyan-400">{name}</h2>
                <StatusBadge status={status} />
            </div>
            <div className="text-left space-y-2 text-cyan-200">
                <p>CPU: <span className="font-mono">{cpu}%</span></p>
                <p>Memory: <span className="font-mono">{mem}%</span></p>
            </div>
        </Card>
    );
};

const LoadingIndicator: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-cyan-300 text-lg animate-pulse">ANALYZING DATASTREAM...</p>
    </div>
);

const ErrorDisplay: React.FC<{ error: string; onDismiss: () => void; }> = ({ error, onDismiss }) => (
    <div className="text-center py-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-red-400">Analysis Failed</h2>
            <button onClick={onDismiss} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors">New Command</button>
        </div>
        <p className="text-red-300 text-sm font-mono bg-red-900/50 p-3 rounded-md">{error}</p>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ tasks, handleTaskSubmit, isLoading }) => {
    const [intelReport, setIntelReport] = useState<IntelReport | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const { addNotification } = useNotifications();

    const handleIntelAnalysis = async (query: string) => {
        if (!query.trim() || isAnalyzing) return;
        
        setIsAnalyzing(true);
        setAnalysisError(null);
        setIntelReport(null);

        try {
            const result = await analyzeIntel(query);
            setIntelReport(result);
            addNotification('Intel analysis complete.', 'success');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setAnalysisError(errorMessage);
            addNotification(`Intel analysis failed: ${errorMessage}`, 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const resetAnalysis = () => {
        setIntelReport(null);
        setAnalysisError(null);
    };

    return (
        <>
            <header className="text-left mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">
                    Dashboard
                </h1>
                <p className="text-gray-400 mt-2">Cognitive Operational Co-Pilot Interface</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AIVitalsCard name="GEMINI 2.5" status={AIStatus.ACTIVE} />
                <AIVitalsCard name="LUX 2.0" status={AIStatus.READY} />
                {/* Placeholder for a 3rd vitals card to balance layout */}
                <div></div>

                <div className="md:col-span-2 lg:col-span-3">
                    {isAnalyzing ? (
                        <Card><LoadingIndicator /></Card>
                    ) : analysisError ? (
                        <Card><ErrorDisplay error={analysisError} onDismiss={resetAnalysis} /></Card>
                    ) : intelReport ? (
                        <IntelReportDisplay report={intelReport} onDismiss={resetAnalysis} />
                    ) : (
                        <Card>
                             <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">Command Console</h2>
                            <CommandConsole
                                onTaskSubmit={handleTaskSubmit}
                                onIntelSubmit={handleIntelAnalysis}
                                isLoading={isLoading || isAnalyzing}
                            />
                        </Card>
                    )}
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                    <Card>
                        <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-left">Recent Tasks Log</h2>
                        <TaskList tasks={tasks.slice(0, 5)} /> 
                    </Card>
                </div>
                
                <SystemMatrix />
            </div>
        </>
    );
};

export default Dashboard;
