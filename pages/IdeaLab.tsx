import React from 'react';
import { IdeaBoard } from '../components/IdeaBoard';
import { AddIdeaForm } from '../components/AddIdeaForm';
import { Idea, IdeaStatus } from '../types';

interface IdeaLabProps {
    ideas: Idea[];
    handleIdeaSubmit: (title: string, description: string) => void;
    handleUpdateIdeaStatus: (id: number, newStatus: IdeaStatus) => void;
    handleDeleteIdea: (id: number) => void;
}

const IdeaLab: React.FC<IdeaLabProps> = ({ ideas, handleIdeaSubmit, handleUpdateIdeaStatus, handleDeleteIdea }) => {
    return (
        <>
            <header className="text-left mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">
                    Idea Lab
                </h1>
                <p className="text-gray-400 mt-2">Foster, discuss, and organize ideas before they become projects.</p>
            </header>

            <AddIdeaForm onSubmit={handleIdeaSubmit} />

            <div className="mt-8">
                <IdeaBoard 
                    ideas={ideas} 
                    onUpdateStatus={handleUpdateIdeaStatus}
                    onDelete={handleDeleteIdea}
                />
            </div>
        </>
    );
};

export default IdeaLab;
