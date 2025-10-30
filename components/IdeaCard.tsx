import React, { useState } from 'react';
import { Idea, IdeaStatus } from '../types';

interface IdeaCardProps {
    idea: Idea;
    onUpdateStatus: (id: number, newStatus: IdeaStatus) => void;
    onDelete: (id: number) => void;
}

const statusOptions = Object.values(IdeaStatus);

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onUpdateStatus, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleStatusChange = (newStatus: IdeaStatus) => {
        onUpdateStatus(idea.id, newStatus);
        setIsMenuOpen(false);
    }
    
    const handleDelete = () => {
        if(window.confirm(`Are you sure you want to delete the idea: "${idea.title}"?`)) {
            onDelete(idea.id);
        }
        setIsMenuOpen(false);
    }

    return (
        <div className="bg-cyan-900/40 border border-cyan-500/30 p-4 rounded-lg shadow-lg shadow-cyan-500/10 relative transition-all duration-300 ease-in-out hover:shadow-cyan-400/20 hover:border-cyan-400/50">
            <h4 className="font-bold text-cyan-200 mb-2">{idea.title}</h4>
            <p className="text-sm text-gray-300 mb-3 whitespace-pre-wrap">{idea.description}</p>
            <div className="text-xs text-gray-500">
                {new Date(idea.timestamp).toLocaleString()}
            </div>
            
            <div className="absolute top-2 right-2">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} onBlur={() => setTimeout(() => setIsMenuOpen(false), 150)} className="text-cyan-400 hover:text-white transition-colors p-1 rounded-full hover:bg-cyan-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-cyan-700 rounded-md shadow-xl z-10">
                        <div className="py-1">
                            <span className="block px-4 py-2 text-xs text-gray-400">Move to</span>
                            {statusOptions.filter(s => s !== idea.status).map(status => (
                                <a
                                    key={status}
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleStatusChange(status); }}
                                    className="block px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-800/50"
                                >
                                    {status}
                                </a>
                            ))}
                             <div className="border-t border-cyan-700/50 my-1"></div>
                             <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); handleDelete(); }}
                                className="block px-4 py-2 text-sm text-red-400 hover:bg-red-800/50"
                            >
                                Delete Idea
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
