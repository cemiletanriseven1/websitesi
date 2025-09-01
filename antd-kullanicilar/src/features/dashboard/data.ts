// Mock veri – API bağlayınca burayı service ile değiştirirsin

export const kpis = {
    activeUsers: 124,
    departments: 12,
    products: 342,
    favorites: 58,
};

export const recentUsers = [
    { id: 1, name: 'Aylin K.', email: 'aylin@acme.com', department: 'İK', role: 'Editor' },
    { id: 2, name: 'Mert T.', email: 'mert@acme.com', department: 'Satış', role: 'Viewer' },
    { id: 3, name: 'Selin D.', email: 'selin@acme.com', department: 'Teknik', role: 'Admin' },
];

export const pendingLeaves = [
    { id: 11, name: 'Baran Ç.', type: 'Yıllık', days: 3, status: 'Onay bekliyor' },
    { id: 12, name: 'Duygu A.', type: 'Raporlu', days: 2, status: 'Onay bekliyor' },
];

export const topProducts = [
    { id: 'p1', name: 'Dizüstü Bilgisayar', category: 'Elektronik', views: 1260 },
    { id: 'p2', name: 'Kablosuz Kulaklık', category: 'Elektronik', views: 980 },
    { id: 'p3', name: 'Gaming Mouse', category: 'Elektronik', views: 755 },
];

export const announcements = [
    { id: 'a1', title: 'Eylül bordro kapanışı Cuma 17:00', date: '01.09.2025', color: 'blue' },
    { id: 'a2', title: 'Ofis bakım çalışması – Cumartesi', date: '03.09.2025', color: 'purple' },
    { id: 'a3', title: 'KVKK eğitimleri yayımlandı', date: '05.09.2025', color: 'green' },
];
