import { authService } from './authService';

export interface Task {
    id: number;
    titre: string;
    description: string;
    complete: boolean;
}

const API_URL = 'http://localhost:8080/api';

const getHeaders = () => {
    const token = authService.getToken();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const taskService = {
    async getAllTasks(): Promise<Task[]> {
        const response = await fetch(`${API_URL}/tache/get`, {
            headers: getHeaders(),
            cache: 'no-store'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0] || 'Erreur de chargement des tâches');
        }

        return response.json();
    },

    async getTask(id: string): Promise<Task> {
        const response = await fetch(`${API_URL}/tache/${id}`, {
            headers: getHeaders(),
            cache: 'no-store'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0] || 'Erreur de chargement de la tâche');
        }

        return response.json();
    },

    async createTask(data: { titre: string; description: string }): Promise<Task> {
        const response = await fetch(`${API_URL}/tache/create`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
            cache: 'no-store'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0] || 'Erreur de création de la tâche');
        }

        return response.json();
    },  

    async updateTask(id: string, data: Partial<Task>): Promise<Task> {
        const response = await fetch(`${API_URL}/tache/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
            cache: 'no-store'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0] || 'Erreur de mise à jour de la tâche');
        }

        return response.json();
    },

    async deleteTask(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/tache/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
            cache: 'no-store'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0] || 'Erreur de suppression de la tâche');
        }
    }
    
};