import React, { useState, useCallback, useEffect } from 'react';
import { Task } from './types';
import { executeTask } from './services/geminiService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AiManagement from './pages/AiManagement';
import TaskManagement from './pages/TaskManagement';
import PlaceholderPage from './pages/PlaceholderPage';
import { useNotifications } from './hooks/useNotifications';

// A simple map for our client-side routing
const pages: { [key: string]: React.FC<any> } = {
    'Dashboard': Dashboard,
    'AI Management': AiManagement,
    'Task Management': TaskManagement,
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

    const ActivePageComponent = pages[activeView] || Dashboard;
    const pageProps = {
        'Dashboard': { tasks, handleTaskSubmit, isLoading },
        'Task Management': { tasks },
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