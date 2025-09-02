import React from 'react';

export type Announcement = { id: string; title: string; date: string; color?: string; desc?: string };

const initial: Announcement[] = [
    { id: 'a1', title: 'Eylül bordro kapanışı Cuma 17:00', date: '01.09.2025', color: 'blue' },
    { id: 'a2', title: 'Ofis bakım çalışması – Cumartesi', date: '03.09.2025', color: 'purple' },
    { id: 'a3', title: 'KVKK eğitimleri yayımlandı', date: '05.09.2025', color: 'green' },
];

type AnnCtx = {
    announcements: Announcement[];
    addAnnouncement: (a: Omit<Announcement, 'id'>) => Announcement;
};

const Ctx = React.createContext<AnnCtx | null>(null);

export function AnnouncementsProvider({ children }: { children: React.ReactNode }) {
    const [announcements, setAnnouncements] = React.useState<Announcement[]>(initial);

    const addAnnouncement = (a: Omit<Announcement, 'id'>) => {
        const id = `a${Date.now()}`;
        const na: Announcement = { id, ...a };
        setAnnouncements(prev => [na, ...prev]);
        return na;
    };

    return <Ctx.Provider value={{ announcements, addAnnouncement }}>{children}</Ctx.Provider>;
}

export function useAnnouncements() {
    const v = React.useContext(Ctx);
    if (!v) throw new Error('useAnnouncements must be used within AnnouncementsProvider');
    return v;
}
