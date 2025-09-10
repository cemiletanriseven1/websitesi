import React, { createContext, useContext, useMemo, useState } from "react";

export type DocumentItem = {
    id: string;
    title: string;
    category: string;
    owner: string;
    date: string; // DD.MM.YYYY
};

type DocsState = {
    documents: DocumentItem[];
    add: (d: Omit<DocumentItem, "id">) => void;
    remove: (id: string) => void;
};

const seed: DocumentItem[] = [
    { id: "d1", title: "Personel Yönetmeliği", category: "İK", owner: "İK", date: "01.09.2025" },
    { id: "d2", title: "Gizlilik Politikası", category: "Hukuk", owner: "Yönetim", date: "03.09.2025" },
    { id: "d3", title: "KVKK Rehberi", category: "Hukuk", owner: "İK", date: "05.09.2025" },
];

const Ctx = createContext<DocsState | undefined>(undefined);

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
    const [documents, setDocuments] = useState<DocumentItem[]>(seed);

    const value = useMemo<DocsState>(() => ({
        documents,
        add: (d) => setDocuments(prev => [{ ...d, id: crypto.randomUUID() }, ...prev]),
        remove: (id) => setDocuments(prev => prev.filter(x => x.id !== id)),
    }), [documents]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDocuments() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useDocuments must be used within DocumentsProvider");
    return ctx;
}
