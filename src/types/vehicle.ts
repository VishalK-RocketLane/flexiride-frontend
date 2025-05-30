import { UUID } from "node:crypto";

export type VehicleType = 'scooter' | 'bike' | 'sedan' | 'hatchback' | 'suv' | 'mpv';

export interface Vehicle {
    id: UUID;
    brand: string;
    model: string;
    type: VehicleType;
    pricePerDay: number;
    imageUrl: string;
}

export interface VehicleFilters {
    priceRange: [number, number];
    startDate?: Date;
    endDate?: Date;
    types?: VehicleType[];
    brands?: string[];
    model?: string;
}

export interface VehicleUpdateDto {
    brand: string;
    model: string;
    type: VehicleType;
    pricePerDay: number;
    imageUrl: string;
}