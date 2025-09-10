import React, { createContext, useContext, useMemo, useState } from "react";
import type { Permission, Role } from "./types";

type RolesState = {
    roles: Role[];
    currentRoleId: string;
    setCurrentRoleId: (id: string) => void;
    can: (perm: Permission) => boolean;
    addRole: (r: Omit<Role, "id">) => void;
};

const defaultRoles: Role[] = [
    {
        id: "admin",
        name: "Yönetici",
        permissions: [
            "users.read", "users.write",
            "roles.read", "roles.write",
            "departments.read", "departments.write",
            "documents.read", "documents.write",
            "leaves.read", "leaves.write",
        ],
    },
    {
        id: "hr",
        name: "İK Uzmanı",
        permissions: [
            "users.read",
            "departments.read", "departments.write",
            "leaves.read", "leaves.write",
            "documents.read"
        ],
    },
    {
        id: "marketing",
        name: "Reklam / Pazarlama",
        permissions: [
            "users.read", "departments.read",
            "documents.read", "documents.write"
        ],
    },
    {
        id: "product",
        name: "Ürün Yönetimi",
        permissions: [
            "users.read", "departments.read",
            "documents.read", "documents.write"
        ],
    },
    {
        id: "procurement",
        name: "Satın Alma",
        permissions: [
            "users.read", "departments.read",
            "documents.read"
        ],
    },
];

const Ctx = createContext<RolesState | undefined>(undefined);

export function RolesProvider({ children }: { children: React.ReactNode }) {
    const [roles, setRoles] = useState<Role[]>(defaultRoles);
    const [currentRoleId, setCurrentRoleId] = useState<string>("admin");

    const value = useMemo<RolesState>(() => {
        const current = roles.find(r => r.id === currentRoleId) ?? roles[0];
        const can = (perm: Permission) => current.permissions.includes(perm);
        const addRole = (r: Omit<Role, "id">) => setRoles(prev => [...prev, { ...r, id: crypto.randomUUID() }]);
        return { roles, currentRoleId, setCurrentRoleId, can, addRole };
    }, [roles, currentRoleId]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRoles() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useRoles must be used within RolesProvider");
    return ctx;
}
