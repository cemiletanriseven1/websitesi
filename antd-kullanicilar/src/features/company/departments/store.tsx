import React, { createContext, useContext, useMemo, useState } from "react";
import type { Department } from "./types";

type DeptState = {
    departments: Department[];
    add: (d: Omit<Department, "id">) => void;
    remove: (id: string) => void;
    rename: (id: string, name?: string, manager?: string) => void;
};

const seed: Department[] = [
    { id: "dep-engineering", name: "Yazılım", manager: "Ayşe Yılmaz" },
    { id: "dep-hr", name: "İK", manager: "Mehmet Demir" },
    { id: "dep-marketing", name: "Reklam / Pazarlama", manager: "Elif Kara" },
    { id: "dep-product", name: "Ürün Yönetimi", manager: "Can Acar" },
    { id: "dep-procurement", name: "Satın Alma", manager: "Selim Çetin" },
    /* Müşteri Başarı kaldırıldı */
];

const DeptCtx = createContext<DeptState | undefined>(undefined);

export function DepartmentsProvider({ children }: { children: React.ReactNode }) {
    const [departments, setDepartments] = useState<Department[]>(seed);

    const value = useMemo<DeptState>(() => ({
        departments,
        add: (d) => setDepartments(prev => [...prev, { ...d, id: crypto.randomUUID() }]),
        remove: (id) => setDepartments(prev => prev.filter(x => x.id !== id)),
        rename: (id, name, manager) =>
            setDepartments(prev =>
                prev.map(x =>
                    x.id === id
                        ? { ...x, ...(name !== undefined ? { name } : null), ...(manager !== undefined ? { manager } : null) }
                        : x
                )
            ),
    }), [departments]);

    return <DeptCtx.Provider value={value}>{children}</DeptCtx.Provider>;
}

export function useDepartments() {
    const ctx = useContext(DeptCtx);
    if (!ctx) throw new Error("useDepartments must be used within DepartmentsProvider");
    return ctx;
}
