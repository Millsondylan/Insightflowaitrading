import { saveSession, clearSession } from './sessionStore';

interface User {
    email: string;
    password: string;
    createdAt: string;
}

// In-memory user store (replace with Supabase later)
let users: User[] = [
    {
        email: 'demo@example.com',
        password: 'password123',
        createdAt: new Date().toISOString()
    }
];

export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthError';
    }
}

function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
    return password.length >= 8;
}

export async function signIn(email: string, password: string): Promise<void> {
    if (!validateEmail(email)) {
        throw new AuthError('Invalid email format');
    }

    const user = users.find(u => u.email === email);
    if (!user || user.password !== password) {
        throw new AuthError('Invalid email or password');
    }

    saveSession({ email });
}

export async function signUp(email: string, password: string): Promise<void> {
    if (!validateEmail(email)) {
        throw new AuthError('Invalid email format');
    }

    if (!validatePassword(password)) {
        throw new AuthError('Password must be at least 8 characters long');
    }

    if (users.some(u => u.email === email)) {
        throw new AuthError('Email already exists');
    }

    const newUser: User = {
        email,
        password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveSession({ email });
}

export async function signOut(): Promise<void> {
    clearSession();
}

// For development/testing only
export function _clearUsers(): void {
    users = [];
} 