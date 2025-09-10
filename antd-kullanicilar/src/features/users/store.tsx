// src/features/users/store.tsx
import React, { createContext, useContext, useMemo, useState } from "react";

export type User = {
    id: string;
    name: string;
    email: string;
    roleId: string;
    departmentId?: string;
};

type UsersState = {
    users: User[];
    add: (u: Omit<User, "id">) => void;
    update: (id: string, patch: Partial<User>) => void;
    remove: (id: string) => void;
};

const Ctx = createContext<UsersState | undefined>(undefined);

// ...
const seed: User[] = [
    { id: "u1", name: "Ayşe Yılmaz", email: "ayse.yilmaz@example.com", roleId: "admin", departmentId: "dep-engineering" },
    { id: "u2", name: "Mehmet Demir", email: "mehmet.demir@example.com", roleId: "hr", departmentId: "dep-hr" },
    { id: "u3", name: "Elif Kara", email: "elif.kara@example.com", roleId: "marketing", departmentId: "dep-marketing" },   // ✅
    { id: "u4", name: "Can Acar", email: "can.acar@example.com", roleId: "product", departmentId: "dep-product" },         // ✅
];
// ...


export function UsersProvider({ children }: { children: React.ReactNode }) {
    const [users, setUsers] = useState<User[]>(seed);

    const value = useMemo<UsersState>(() => ({
        users,
        add: (u) => setUsers(prev => [...prev, { ...u, id: crypto.randomUUID() }]),
        update: (id, patch) => setUsers(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it)),
        remove: (id) => setUsers(prev => prev.filter(it => it.id !== id)),
    }), [users]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUsers() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useUsers must be used within UsersProvider");
    return ctx;
}
