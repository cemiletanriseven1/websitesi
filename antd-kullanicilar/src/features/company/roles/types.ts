export type Permission =
    | 'users.read' | 'users.write'
    | 'roles.read' | 'roles.write'
    | 'departments.read' | 'departments.write'
    | 'documents.read' | 'documents.write'   // NEW
    | 'leaves.read' | 'leaves.write';        // NEW

export type Role = {
    id: string;
    name: string;
    permissions: Permission[];
};

/** Tüm izinleri tek yerden yönetelim */
export const ALL_PERMISSIONS: Permission[] = [
    'users.read', 'users.write',
    'roles.read', 'roles.write',
    'departments.read', 'departments.write',
    'documents.read', 'documents.write',   // NEW
    'leaves.read', 'leaves.write',         // NEW
];
