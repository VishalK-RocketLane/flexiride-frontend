export interface Booking {
    id: string;
    userId: string;
    vehicleId: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'AWAITING RETURN';
    createdAt: string;
}