'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Task, taskService } from '../services/taskService';
import { authService } from '../services/authService';

// Composant réutilisable pour le formulaire de tâche
function TaskForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEdit = false
}: {
  formData: { titre: string; description: string };
  setFormData: (data: { titre: string; description: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  isEdit?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="bg-white/90 rounded-2xl shadow-2xl p-8 border border-gray-300 space-y-6">
      <div>
        <label className="block text-lg font-bold text-gray-900 mb-2">Titre</label>
        <input
          type="text"
          value={formData.titre}
          onChange={e => setFormData({ ...formData, titre: e.target.value })}
          className="w-full rounded-lg border-2 border-gray-900 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-lg bg-white placeholder-gray-400"
          required
          placeholder="Titre de la tâche"
        />
      </div>
      <div>
        <label className="block text-lg font-bold text-gray-900 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-lg border-2 border-gray-900 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-lg bg-white placeholder-gray-400"
          rows={3}
          required
          placeholder="Décris ta tâche ici..."
        />
      </div>
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-xl text-white bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 transition-all font-semibold shadow"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all text-lg tracking-widest"
        >
          {isEdit ? 'Enregistrer' : 'Créer'}
        </button>
      </div>
    </form>
  );
}

export default function Dashboard() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newTask, setNewTask] = useState({ titre: '', description: '' });

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
                <div className="max-w-2xl mx-auto">
                    <TaskForm
                        formData={newTask}
                        setFormData={setNewTask}
                        onSubmit={handleCreateTask}
                        onCancel={() => setNewTask({ titre: '', description: '' })}
                        isEdit={false}
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map(task => (
                    <div key={task.id} className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">{task.titre}</h3>
                            <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="px-3 py-1 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow hover:from-red-600 hover:to-pink-600 transition-all text-lg"
                                title="Supprimer la tâche"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">{task.description}</p>
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => handleToggleComplete(task)}
                                className={`px-4 py-2 rounded-xl font-bold shadow transition-all text-sm tracking-widest ${task.complete 
                                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600' 
                                    : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 hover:from-yellow-500 hover:to-yellow-700'}`}
                            >
                                {task.complete ? 'Terminée ✓' : 'En cours'}
                            </button>
                            <button
                                onClick={() => router.push(`/taches/${task.id}`)}
                                className="text-blue-500 hover:text-blue-700 text-sm underline underline-offset-2 font-semibold"
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
