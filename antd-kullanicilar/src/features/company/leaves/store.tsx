import React, { createContext, useContext, useMemo, useState } from "react";

export type LeaveStatus = "Bekliyor" | "Onaylandı" | "Reddedildi";
export type LeaveType = "Yıllık" | "Hastalık" | "Ücretsiz" | "İdari";

export type Leave = {
    id: string;
    name: string;
    department: string;
    type: LeaveType;
    days: number;
    start: string; // DD.MM.YYYY
    status: LeaveStatus;
};

type LeavesState = {
    leaves: Leave[];
    add: (l: Omit<Leave, "id">) => void;
    update: (id: string, patch: Partial<Leave>) => void;
    remove: (id: string) => void;
};

const seed: Leave[] = [
    { id: "lv1", name: "Ayşe Yılmaz", department: "Yazılım", type: "Yıllık", days: 5, start: "02.09.2025", status: "Bekliyor" },
    { id: "lv2", name: "Mehmet Demir", department: "İK", type: "Hastalık", days: 2, start: "04.09.2025", status: "Onaylandı" },
    { id: "lv3", name: "Elif Kara", department: "Satış", type: "Ücretsiz", days: 1, start: "10.09.2025", status: "Bekliyor" },
];

const Ctx = createContext<LeavesState | undefined>(undefined);

export function LeavesProvider({ children }: { children: React.ReactNode }) {
    const [leaves, setLeaves] = useState<Leave[]>(seed);

    const value = useMemo<LeavesState>(() => ({
        leaves,
        add: (l) => setLeaves(prev => [...prev, { ...l, id: crypto.randomUUID() }]),
        update: (id, patch) => setLeaves(prev => prev.map(x => x.id === id ? { ...x, ...patch } : x)),
        remove: (id) => setLeaves(prev => prev.filter(x => x.id !== id)),
    }), [leaves]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLeaves() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useLeaves must be used within LeavesProvider");
    return ctx;
}
