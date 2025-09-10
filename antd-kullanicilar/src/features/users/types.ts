export type User = {
    id: string;
    name: string;
    email: string;
    roleId: string;         // roles.id
    departmentId?: string;  // departments.id | undefined
};
