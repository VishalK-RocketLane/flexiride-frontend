export type UserRole = "ADMIN" | "USER";

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}