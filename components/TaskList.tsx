import React from 'react';
import { Task } from '../types';

interface TaskListProps {
    tasks: Task[];
}

const TaskStatusIndicator: React.FC<{ status: Task['status'] }> = ({ status }) => {
    switch (status) {
        case 'Complete':
            return <span className="text-green-400 font-bold ml-2">✓</span>;
        case 'In Progress...':
            return <span className="text-yellow-400 animate-pulse ml-2">...</span>;
        case 'Failed':
            return <span className="text-red-500 font-bold ml-2">✗</span>;
        default:
            return null;
    }
};

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    return (
        <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-2">
            {!tasks.length && <p className="text-gray-500 text-center">No tasks in the log.</p>}
            {tasks.map((task) => (
                <div key={task.id} className="bg-black/30 p-3 rounded-lg border-l-4 border-cyan-500 flex flex-col text-gray-300">
                    <div className="flex justify-between items-start w-full gap-4">
                        <div className="flex-grow">
                            <span className="font-semibold">{task.text}</span>
                            <div className="text-xs text-gray-500 mt-1">
                                {new Date(task.timestamp).toLocaleString()}
                            </div>
                        </div>
                        <div className="flex items-center flex-shrink-0">
                            <span className="text-sm italic mr-2">{task.status}</span>
                            <TaskStatusIndicator status={task.status} />
                        </div>
                    </div>
                    {task.result && (
                        <div className={`mt-2 p-3 rounded-md text-sm ${task.status === 'Failed' ? 'bg-red-900/50 text-red-300' : 'bg-cyan-900/50 text-cyan-200'}`}>
                           <p className="font-mono whitespace-pre-wrap">{task.result}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};