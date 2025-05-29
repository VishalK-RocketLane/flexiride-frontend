export type UserRole = "ADMIN" | "CUSTOMER";

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}