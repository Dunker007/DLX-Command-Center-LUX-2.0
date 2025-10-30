import React, { useState } from 'react';
import { Card } from './Card';

interface AddIdeaFormProps {
    onSubmit: (title: string, description: string) => void;
}

export const AddIdeaForm: React.FC<AddIdeaFormProps> = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;
        onSubmit(title, description);
        setTitle('');
        setDescription('');
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Submit New Idea</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="ideaTitle" className="block text-cyan-300 mb-2">Idea Title</label>
                    <input
                        id="ideaTitle"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Predictive Task Queuing"
                        className="w-full p-2.5 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    />
                </div>
                <div className="mb-4">
                     <label htmlFor="ideaDescription" className="block text-cyan-300 mb-2">Description</label>
                    <textarea
                        id="ideaDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the core concept and potential impact..."
                        className="w-full p-2.5 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                        rows={4}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 px-5 rounded-md cursor-pointer text-base font-bold transition-colors duration-300 shadow-lg shadow-cyan-600/30 hover:shadow-cyan-500/50"
                    disabled={!title.trim() || !description.trim()}
                >
                    Add to Lab
                </button>
            </form>
        </Card>
    );
};
