export interface User {
    id: number;
    email: string;
    username: string;
    bio?: string;
}

export type LoginData = {
    username: string;
    password: string;
};

export interface RegisterData extends LoginData {
    username: string;
    bio?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}