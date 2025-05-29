import { UUID } from "crypto";

export interface Booking {
    id: UUID;
    userId: string;
    vehicleId: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'AWAITING RETURN';
    createdAt: string;
}