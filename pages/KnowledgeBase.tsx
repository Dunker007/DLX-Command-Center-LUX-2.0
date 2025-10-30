import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { KnowledgeEntry } from '../types';

interface KnowledgeBaseProps {
    entries: KnowledgeEntry[];
    onAddEntry: (entry: Omit<KnowledgeEntry, 'id' | 'timestamp'>) => void;
    onDeleteEntry: (id: number) => void;
}

// Sub-component for adding/editing an entry
const EntryForm: React.FC<{
    onSubmit: (entry: Omit<KnowledgeEntry, 'id' | 'timestamp'>) => void;
    onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [source, setSource] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        onSubmit({
            title,
            content,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            source
        });
    };

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">New Knowledge Entry</h2>
                <div className="space-y-4">
                    <input
                        type="text" value={title} onChange={e => setTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full p-2.5 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        required
                    />
                    <textarea
                        value={content} onChange={e => setContent(e.target.value)}
                        placeholder="Content (Markdown supported)" rows={8}
                        className="w-full p-2.5 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        required
                    />
                    <input
                        type="text" value={tags} onChange={e => setTags(e.target.value)}
                        placeholder="Tags (comma-separated)"
                        className="w-full p-2.5 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                    <input
                        type="text" value={source} onChange={e => setSource(e.target.value)}
                        placeholder="Source URL or reference (e.g., G-Drive:/docs/file.txt)"
                        className="w-full p-2.5 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                </div>
                <div className="flex gap-4 mt-6">
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2.5 rounded-md font-bold transition-colors">Save Entry</button>
                    <button type="button" onClick={onCancel} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-md font-bold transition-colors">Cancel</button>
                </div>
            </form>
        </Card>
    );
};


// Sub-component for displaying a single entry
const EntryCard: React.FC<{ entry: KnowledgeEntry; onDelete: (id: number) => void }> = ({ entry, onDelete }) => (
    <Card className="flex flex-col h-full">
        <div className="flex-grow">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">{entry.title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-4 whitespace-pre-wrap">{entry.content}</p>
            {entry.source && <p className="text-xs text-cyan-500 font-mono break-all mb-4">Source: {entry.source}</p>}
        </div>
        <div>
            <div className="flex flex-wrap gap-2 mb-4">
                {entry.tags.map(tag => (
                    <span key={tag} className="bg-cyan-800/70 text-cyan-200 text-xs px-2 py-1 rounded-full">{tag}</span>
                ))}
            </div>
             <button onClick={() => onDelete(entry.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Delete</button>
        </div>
    </Card>
);


const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ entries, onAddEntry, onDeleteEntry }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEntries = useMemo(() => {
        return entries.filter(entry => {
            const lowerSearch = searchTerm.toLowerCase();
            return (
                entry.title.toLowerCase().includes(lowerSearch) ||
                entry.content.toLowerCase().includes(lowerSearch) ||
                entry.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
            );
        }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [entries, searchTerm]);

    const handleAddSubmit = (entryData: Omit<KnowledgeEntry, 'id' | 'timestamp'>) => {
        onAddEntry(entryData);
        setIsAdding(false);
    };

    return (
        <>
            <header className="text-left mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">
                    Knowledge Base
                </h1>
                <p className="text-gray-400 mt-2">Central repository for operational intelligence.</p>
            </header>
            
            {isAdding ? (
                <EntryForm onSubmit={handleAddSubmit} onCancel={() => setIsAdding(false)} />
            ) : (
                <>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search knowledge base..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full md:flex-grow p-2.5 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                        />
                        <button onClick={() => setIsAdding(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white py-2.5 px-6 rounded-md font-bold transition-colors whitespace-nowrap">
                            Add New Entry
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEntries.length > 0 ? (
                            filteredEntries.map(entry => (
                                <EntryCard key={entry.id} entry={entry} onDelete={onDeleteEntry} />
                            ))
                        ) : (
                            <div className="md:col-span-2 lg:col-span-3 text-center py-16 text-gray-500">
                                No entries found.
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default KnowledgeBase;