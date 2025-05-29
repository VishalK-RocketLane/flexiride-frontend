export type VehicleType = '2-Wheeler' | '4-Wheeler';

export interface Vehicle {
    id: string;
    name: string;
    brand: string;
    model: string;
    type: VehicleType;
    pricePerDay: number;
    advance: number;
    imageUrl: string;
}

export interface VehicleFilters {
    priceRange: [number, number];
    startDate?: Date;
    endDate?: Date;
    vehicleTypes?: VehicleType[];
    brands?: string[];
    model?: string;
}