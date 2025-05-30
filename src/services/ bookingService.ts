import axios from 'axios';
import { Booking } from '@/types/booking';
import { UUID } from 'node:crypto';
import { authService } from './authService';
import { productionService } from './productionService';

export interface BookingMakeDto {
    email: string;
    vehicleId: UUID;
    startDate: string;
    endDate: string;
}

class BookingService {
    private readonly baseUrl = productionService.getIsProduction()? 'https://flexiride-backend-api.onrender.com/api' : "http://localhost:8080/api";
    private readonly axiosInstance = axios.create({
        baseURL: this.baseUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    async getAllBookings(): Promise<Booking[]> {
        try {
            const response = await this.axiosInstance.get('/bookings');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch vehicles');
            }
            throw new Error('Failed to fetch vehicles');
        }
    }

    async getBookingsByEmail(email: string): Promise<Booking[]> {
        try {
            const response = await this.axiosInstance.get(`/bookings/email/${email}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
            }
            throw new Error('Failed to fetch bookings');
        }
    }

    async createBooking(bookingMakeDto: BookingMakeDto): Promise<Booking> {
        try {
            const response = await this.axiosInstance.post('/bookings/create', {
                ...bookingMakeDto
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to make a booking');
            }
            throw new Error('Failed to make a booking');
        }
    }

    async cancelBooking(id: UUID): Promise<Booking> {
        try {
            const response = await this.axiosInstance.post(`/bookings/cancel/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to cancel a booking');
            }
            throw new Error('Failed to cancel a booking');
        }
    }
}

export const bookingService = new BookingService();