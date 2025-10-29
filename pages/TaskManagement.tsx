import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { TaskList } from '../components/TaskList';
import { Task } from '../types';

interface TaskManagementProps {
    tasks: Task[];
}

type FilterStatus = 'All' | Task['status'];

const TaskManagement: React.FC<TaskManagementProps> = ({ tasks }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterStatus>('All');

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase()) || task.result?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filter === 'All' || task.status === filter;
            return matchesSearch && matchesFilter;
        });
    }, [tasks, searchTerm, filter]);

    const filterOptions: FilterStatus[] = ['All', 'Complete', 'In Progress...', 'Failed'];

    return (
        <>
            <header className="text-left mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">
                    Task Management
                </h1>
                <p className="text-gray-400 mt-2">Review and audit all operational tasks.</p>
            </header>
            
            <Card>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/2 p-2.5 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                        {filterOptions.map(option => (
                            <button
                                key={option}
                                onClick={() => setFilter(option)}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${filter === option ? 'bg-cyan-600 text-white' : 'bg-cyan-900/70 hover:bg-cyan-800/90 text-cyan-300'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <TaskList tasks={filteredTasks} />
            </Card>
        </>
    );
};

export default TaskManagement;