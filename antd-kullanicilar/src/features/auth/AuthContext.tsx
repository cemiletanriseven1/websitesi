import React, { createContext, useContext, useMemo, useState } from 'react';
import type { AppUser, AuthView } from './types';

type Ctx = {
    user: AppUser | null;
    view: AuthView;
    openLogin: () => void;
    openRegister: () => void;
    closeAuth: () => void;
    login: (email: string) => void;
    register: (name: string, email: string) => void;
    logout: () => void;
};

const AuthCtx = createContext<Ctx | null>(null);

function displayNameFromEmail(email: string) {
    const local = email.split('@')[0] || 'Kullanıcı';
    return local.replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [view, setView] = useState<AuthView>('none');

    const value = useMemo<Ctx>(() => ({
        user,
        view,
        openLogin: () => setView('login'),
        openRegister: () => setView('register'),
        closeAuth: () => setView('none'),
        login: (email: string) => {
            setUser({ name: displayNameFromEmail(email), email });
            setView('none');
        },
        register: (name: string, email: string) => {
            setUser({ name, email });
            setView('none');
        },
        logout: () => setUser(null),
    }), [user, view]);

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
