export type KPI = { activeUsers: number; departments: number; products: number; favorites: number; };
export type RecentUser = { id: number; name: string; email: string; department: string; role: string; };
export type PendingLeave = { id: number; name: string; type: string; days: number; status: string; };
export type TopProduct = { id: string; name: string; category: string; views: number; };
export type Announcement = { id: string; title: string; date: string; color?: string; };
