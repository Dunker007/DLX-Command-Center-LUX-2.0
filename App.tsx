import React, { useState, useCallback, useEffect } from 'react';
import { Task, Idea, IdeaStatus, KnowledgeEntry } from './types';
import { executeTask } from './services/geminiService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AiManagement from './pages/AiManagement';
import TaskManagement from './pages/TaskManagement';
import IdeaLab from './pages/IdeaLab';
import CryptoLab from './pages/CryptoLab';
import KnowledgeBase from './pages/KnowledgeBase';
import PlaceholderPage from './pages/PlaceholderPage';
import { useNotifications } from './hooks/useNotifications';

// A simple map for our client-side routing
const pages: { [key: string]: React.FC<any> } = {
    'Dashboard': Dashboard,
    'AI Management': AiManagement,
    'Task Management': TaskManagement,
    'Idea Lab': IdeaLab,
    'Crypto Lab': CryptoLab,
    'Knowledge Base': KnowledgeBase,
    'Reports': () => <PlaceholderPage title="Reports" />,
    'Settings': () => <PlaceholderPage title="Settings" />,
};

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        try {
            const savedTasks = localStorage.getItem('dlx-tasks');
            return savedTasks ? JSON.parse(savedTasks) : [
                { id: 1, text: 'System diagnostics initiated', status: 'Complete', result: 'All systems nominal. Quantum core temperature stable at 3.14K.', timestamp: new Date().toISOString() },
                { id: 2, text: 'Network analysis pending', status: 'In Progress...', timestamp: new Date().toISOString() },
            ];
        } catch (error) {
            console.error("Failed to parse tasks from localStorage", error);
            return [];
        }
    });

    const [ideas, setIdeas] = useState<Idea[]>(() => {
      try {
        const savedIdeas = localStorage.getItem('dlx-ideas');
        return savedIdeas ? JSON.parse(savedIdeas) : [
          { id: 1, title: 'Cognitive UI Weaving', description: 'Integrate user biometrics to dynamically adjust UI elements for reduced cognitive load.', status: IdeaStatus.DISCUSSION, timestamp: new Date().toISOString() },
          { id: 2, title: 'Predictive Task Queuing', description: 'Use Gemini to analyze task logs and predict/suggest the next logical operator action.', status: IdeaStatus.NEW, timestamp: new Date().toISOString() },
          { id: 3, title: 'Sentient Network Visualization', description: 'Create a "living" network topology map that pulses and changes color based on real-time data flow and threat levels.', status: IdeaStatus.APPROVED, timestamp: new Date().toISOString() },
        ];
      } catch (error) {
        console.error("Failed to parse ideas from localStorage", error);
        return [];
      }
    });

    const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>(() => {
        try {
            const savedEntries = localStorage.getItem('dlx-knowledge');
            return savedEntries ? JSON.parse(savedEntries) : [
                { id: 1, title: 'Quantum Core Failsafe', content: 'In case of a quantum core temperature spike above 5K, the primary coolant system must be flushed. See procedure document QC-75.', tags: ['core', 'failsafe', 'maintenance'], source: 'G-Drive:/procedures/QC-75.txt', timestamp: new Date().toISOString() },
            ];
        } catch (error) {
            console.error("Failed to parse knowledge entries from localStorage", error);
            return [];
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [activeView, setActiveView] = useState('Dashboard');
    const { addNotification } = useNotifications();

    // Persist tasks to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('dlx-tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error("Failed to save tasks to localStorage", error);
            addNotification('Failed to save task history.', 'error');
        }
    }, [tasks, addNotification]);

    // Persist ideas to localStorage whenever they change
    useEffect(() => {
      try {
        localStorage.setItem('dlx-ideas', JSON.stringify(ideas));
      } catch (error) {
        console.error("Failed to save ideas to localStorage", error);
        addNotification('Failed to save idea lab history.', 'error');
      }
    }, [ideas, addNotification]);

    // Persist knowledge entries to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('dlx-knowledge', JSON.stringify(knowledgeEntries));
        } catch (error) {
            console.error("Failed to save knowledge entries to localStorage", error);
            addNotification('Failed to save knowledge base.', 'error');
        }
    }, [knowledgeEntries, addNotification]);
    
    // Check for API Key on initial load
    useEffect(() => {
      if (!process.env.API_KEY) {
        addNotification('Gemini API Key is not configured. Task execution will fail.', 'error', 0); // Persistent notification
      }
    }, [addNotification]);


    const handleTaskSubmit = useCallback(async (taskText: string) => {
        if (!taskText.trim() || isLoading) return;

        setIsLoading(true);
        const newTask: Task = {
            id: Date.now(),
            text: taskText,
            status: 'In Progress...',
            timestamp: new Date().toISOString(),
        };
        setTasks(prevTasks => [newTask, ...prevTasks]);

        try {
            const result = await executeTask(taskText);
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === newTask.id ? { ...task, status: 'Complete', result } : task
                )
            );
            addNotification(`Task "${taskText.substring(0, 20)}..." complete.`, 'success');
        } catch (error) {
            console.error("Task execution failed:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === newTask.id ? { ...task, status: 'Failed', result: errorMessage } : task
                )
            );
            addNotification(`Task failed: ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, addNotification]);

    const handleIdeaSubmit = useCallback((title: string, description: string) => {
        if (!title.trim() || !description.trim()) return;

        const newIdea: Idea = {
            id: Date.now(),
            title,
            description,
            status: IdeaStatus.NEW,
            timestamp: new Date().toISOString(),
        };
        setIdeas(prevIdeas => [newIdea, ...prevIdeas]);
        addNotification(`New idea "${title.substring(0, 20)}..." added to the lab.`, 'success');
    }, [addNotification]);

    const handleUpdateIdeaStatus = useCallback((id: number, newStatus: IdeaStatus) => {
        setIdeas(prevIdeas =>
            prevIdeas.map(idea =>
                idea.id === id ? { ...idea, status: newStatus } : idea
            )
        );
        addNotification(`Idea status updated.`, 'info');
    }, [addNotification]);

    const handleDeleteIdea = useCallback((id: number) => {
        setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== id));
        addNotification('Idea has been deleted.', 'info');
    }, [addNotification]);
    
    const handleKnowledgeSubmit = useCallback((entryData: Omit<KnowledgeEntry, 'id' | 'timestamp'>) => {
        const newEntry: KnowledgeEntry = {
            id: Date.now(),
            ...entryData,
            timestamp: new Date().toISOString(),
        };
        setKnowledgeEntries(prev => [newEntry, ...prev]);
        addNotification(`Knowledge entry "${entryData.title.substring(0,20)}..." added.`, 'success');
    }, [addNotification]);

    const handleKnowledgeDelete = useCallback((id: number) => {
        if (window.confirm('Are you sure you want to delete this knowledge entry?')) {
            setKnowledgeEntries(prev => prev.filter(entry => entry.id !== id));
            addNotification('Knowledge entry deleted.', 'info');
        }
    }, [addNotification]);

    const ActivePageComponent = pages[activeView] || Dashboard;
    const pageProps = {
        'Dashboard': { tasks, handleTaskSubmit, isLoading },
        'Task Management': { tasks },
        'Idea Lab': { ideas, handleIdeaSubmit, handleUpdateIdeaStatus, handleDeleteIdea },
        'Knowledge Base': { entries: knowledgeEntries, onAddEntry: handleKnowledgeSubmit, onDeleteEntry: handleKnowledgeDelete },
    };

    return (
        <div className="min-h-screen bg-[#0a0a1a] text-[#f0f0f0]">
            <Header />
            <Sidebar activeLink={activeView} setActiveLink={setActiveView} />
            <main className="ml-60 pt-20 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                   <ActivePageComponent {...pageProps[activeView as keyof typeof pageProps]} />
                </div>
            </main>
        </div>
    );
};

export default App;