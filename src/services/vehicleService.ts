import axios from 'axios';
import { Vehicle, VehicleType } from '@/types/vehicle';

export interface VehicleFilterParams {
  brands?: string[];
  models?: string[];
  types?: string[];
  startPrice?: number;
  endPrice?: number;
  startDate?: Date;
  endDate?: Date;
}

class VehicleService {
  private readonly baseUrl = 'http://localhost:8080/api';
  private readonly axiosInstance = axios.create({
    baseURL: this.baseUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  async getAllVehicles(): Promise<Vehicle[]> {
    try {
      const response = await this.axiosInstance.get('/vehicles');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch vehicles');
      }
      throw new Error('Failed to fetch vehicles');
    }
  }

  async filterVehicles(filters: VehicleFilterParams): Promise<Vehicle[]> {
    try {
      const response = await this.axiosInstance.post('/vehicles/filter', {
        brands: filters.brands || [],
        models: filters.models || [],
        types: filters.types || [],
        startPrice: filters.startPrice,
        endPrice: filters.endPrice,
        startDate: filters.startDate?.toISOString().split('T')[0] || undefined,
        endDate: filters.endDate?.toISOString().split('T')[0] || undefined
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to filter vehicles');
      }
      throw new Error('Failed to filter vehicles');
    }
  }
}

export const vehicleService = new VehicleService();