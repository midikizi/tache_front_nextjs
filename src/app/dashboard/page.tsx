'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Task, taskService } from '../services/taskService';
import { authService } from '../services/authService';

export default function Dashboard() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newTask, setNewTask] = useState({ titre: '', description: '' });
    const [showNewTaskForm, setShowNewTaskForm] = useState(false);

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push('/');
            return;
        }
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await taskService.getAllTasks();
            setTasks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur de chargement des tâches');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const task = await taskService.createTask(newTask);
            setTasks([...tasks, task]);
            setNewTask({ titre: '', description: '' });
            setShowNewTaskForm(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la création de la tâche');
        }
    };

    const handleToggleComplete = async (task: Task) => {
        try {
            const updatedTask = await taskService.updateTask(task.id.toString(), {
                complete: !task.complete
            });
            setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la tâche');
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            await taskService.deleteTask(taskId.toString());
            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la tâche');
        }
    };

    const handleLogout = () => {
        authService.logout();
        router.push('/');
    };

    if (loading) return <div className="p-4">Chargement...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                    Déconnexion
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <div className="mb-6">
                {!showNewTaskForm ? (
                    <button
                        onClick={() => setShowNewTaskForm(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Nouvelle tâche
                    </button>
                ) : (
                    <form onSubmit={handleCreateTask} className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Titre</label>
                                <input
                                    type="text"
                                    value={newTask.titre}
                                    onChange={(e) => setNewTask({ ...newTask, titre: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowNewTaskForm(false)}
                                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Créer
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map(task => (
                    <div key={task.id} className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">{task.titre}</h3>
                            <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">{task.description}</p>
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => handleToggleComplete(task)}
                                className={`px-3 py-1 rounded-full text-sm ${task.complete 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'}`}
                            >
                                {task.complete ? 'Terminée ✓' : 'En cours'}
                            </button>
                            <button
                                onClick={() => router.push(`/taches/${task.id}`)}
                                className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                                Voir détails →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
