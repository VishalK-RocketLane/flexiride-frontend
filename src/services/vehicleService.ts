"use client";

import axios from 'axios';
import { Vehicle, VehicleUpdateDto } from '@/types/vehicle';
import { UUID } from 'node:crypto';
import { productionService } from './productionService';
import { authService } from './authService';

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
  private readonly baseUrl = productionService.getIsProduction() ? 'https://flexiride-backend-api.onrender.com/api' : 'http://localhost:8080/api';
  private readonly axiosInstance;

  constructor() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const user = authService.getCurrentUser();

    if (user) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: headers
    });
  }

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

  async getVehicleById(id: string): Promise<Vehicle> {
    try {
      const response = await this.axiosInstance.get(`/vehicles/${id}`);
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

  async createVehicle(vehicleUpdateDto: VehicleUpdateDto): Promise<Vehicle> {
    try {
      const response = await this.axiosInstance.post('/vehicles/create', vehicleUpdateDto);
      return response.data;
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create vehicle');
      }
      throw new Error('Failed to create vehicle');
    }
  }

  async updateVehicle(id: UUID, vehicleUpdateDto: VehicleUpdateDto): Promise<Vehicle> {
    try {
      const response = await this.axiosInstance.post(`/vehicles/edit/${id}`, vehicleUpdateDto);
      return response.data;
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create vehicle');
      }
      throw new Error('Failed to create vehicle');
    }
  }

  async deleteVehicle(id: UUID): Promise<Vehicle> {
    try {
      const response = await this.axiosInstance.delete(`/vehicles/delete/${id}`);
      return response.data;
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create vehicle');
      }
      throw new Error('Failed to create vehicle');
    }
  }
}

export const vehicleService = new VehicleService();