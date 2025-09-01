import React, { createContext, useContext } from 'react';

type FavCtx = {
    favs: Set<string>;
    has: (id: string) => boolean;
    toggle: (id: string) => void;
    add: (id: string) => void;
    remove: (id: string) => void;
};

const Ctx = createContext<FavCtx | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favs, setFavs] = React.useState<Set<string>>(() => {
        try {
            const raw = localStorage.getItem('favs');
            return new Set(raw ? JSON.parse(raw) : []);
        } catch {
            return new Set();
        }
    });

    React.useEffect(() => {
        // TS2802 çözümü: [...favs] yerine Array.from(favs)
        localStorage.setItem('favs', JSON.stringify(Array.from(favs)));
    }, [favs]);

    const has = (id: string) => favs.has(id);

    const toggle = (id: string) =>
        setFavs(prev => {
            const s = new Set(prev);
            s.has(id) ? s.delete(id) : s.add(id);
            return s;
        });

    const add = (id: string) =>
        setFavs(prev => {
            const s = new Set(prev);
            s.add(id);
            return s;
        });

    const remove = (id: string) =>
        setFavs(prev => {
            const s = new Set(prev);
            s.delete(id);
            return s;
        });

    return <Ctx.Provider value={{ favs, has, toggle, add, remove }}>{children}</Ctx.Provider>;
}

export function useFavorites() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
    return ctx;
}
