import { LoginData, RegisterData, AuthResponse } from '../types/auth';

const API_URL = 'http://localhost:8080/api';

export const authService = {
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0] || 'Erreur de connexion');
        }

        const authData = await response.json();
        localStorage.setItem('token', authData.token);
        return authData;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0] || 'Erreur d\'inscription');
        }

        const authData = await response.json();
        localStorage.setItem('token', authData.token);
        return authData;
    },

    logout() {
        localStorage.removeItem('token');
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};