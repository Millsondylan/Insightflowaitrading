interface UserSession {
    email: string;
    lastLogin?: string;
}

const SESSION_KEY = 'insight_flow_session';

export function saveSession(session: UserSession): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
        ...session,
        lastLogin: new Date().toISOString()
    }));
}

export function getSession(): UserSession | null {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    
    try {
        return JSON.parse(session) as UserSession;
    } catch {
        clearSession();
        return null;
    }
}

export function clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
    return getSession() !== null;
} 