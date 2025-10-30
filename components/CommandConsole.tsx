import React, { useState } from 'react';

type CommandMode = 'task' | 'analysis';

interface CommandConsoleProps {
    onTaskSubmit: (taskText: string) => void;
    onIntelSubmit: (query: string) => void;
    isLoading: boolean;
}

const ModeButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 w-1/2 ${
            active ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' : 'bg-gray-700/50 hover:bg-gray-600/70 text-cyan-300'
        }`}
    >
        {children}
    </button>
);

export const CommandConsole: React.FC<CommandConsoleProps> = ({ onTaskSubmit, onIntelSubmit, isLoading }) => {
    const [text, setText] = useState('');
    const [mode, setMode] = useState<CommandMode>('task');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        if (mode === 'task') {
            onTaskSubmit(text);
        } else {
            onIntelSubmit(text);
        }
        setText('');
    };

    const placeholderText = mode === 'task' 
        ? "Enter task description... e.g., 'Reboot quantum core'."
        : "Enter complex query for structured analysis... e.g., 'Summarize network intrusion incidents.'";

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex bg-black/30 p-1 rounded-lg mb-4 w-full md:w-1/2 lg:w-1/3 mx-auto">
                <ModeButton active={mode === 'task'} onClick={() => setMode('task')}>
                    Quick Task
                </ModeButton>
                <ModeButton active={mode === 'analysis'} onClick={() => setMode('analysis')}>
                    Intel Analysis
                </ModeButton>
            </div>
            <textarea
                id="commandInput"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholderText}
                className="w-full flex-grow p-3 mb-4 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-base"
                rows={5}
                disabled={isLoading}
            />
            <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-5 rounded-md cursor-pointer text-lg font-bold transition-colors duration-300 shadow-lg shadow-cyan-600/30 hover:shadow-cyan-500/50"
                disabled={isLoading || !text.trim()}
            >
                {isLoading ? 'PROCESSING...' : 'EXECUTE'}
            </button>
        </form>
    );
};
