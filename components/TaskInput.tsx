
import React, { useState } from 'react';

interface TaskInputProps {
    onSubmit: (taskText: string) => void;
    isLoading: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onSubmit, isLoading }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(text);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <textarea
                id="taskInput"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter task description..."
                className="w-full flex-grow p-2.5 mb-4 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                rows={4}
                disabled={isLoading}
            />
            <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 px-5 rounded-md cursor-pointer text-base font-bold transition-colors duration-300 shadow-lg shadow-cyan-600/30 hover:shadow-cyan-500/50"
                disabled={isLoading}
            >
                {isLoading ? 'EXECUTING...' : 'EXECUTE'}
            </button>
        </form>
    );
};
