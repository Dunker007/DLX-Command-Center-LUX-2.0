import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { TaskInput } from '../components/TaskInput';
import { TaskList } from '../components/TaskList';
import { SystemMatrix } from '../components/SystemMatrix';
import { AIStatus, Task } from '../types';

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

const Dashboard: React.FC<DashboardProps> = ({ tasks, handleTaskSubmit, isLoading }) => {
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

                <Card className="md:col-span-2 lg:col-span-1">
                    <h2 className="text-2xl font-bold text-cyan-400 mb-4">Submit Task</h2>
                    <TaskInput onSubmit={handleTaskSubmit} isLoading={isLoading} />
                </Card>

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