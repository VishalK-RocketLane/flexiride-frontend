import axios from 'axios';
import { User, UserRole } from '@/types/user';

class AuthService {
  private currentUser: User | null = null;
  private readonly baseUrl = 'http://localhost:8080/auth';
  private readonly axiosInstance = axios.create({
    baseURL: this.baseUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await this.axiosInstance.post('/login', { email, password });
      this.currentUser = response.data;
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Invalid credentials');
      }
      throw new Error('Login failed');
    }
  }
  
  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const response = await this.axiosInstance.post('/register', { name, email, password });
      this.currentUser = response.data;
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw new Error('Registration failed');
    }
  }
  
  logout(): void {
    this.currentUser = null;
  }
  
  getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
  
  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }
}

export const authService = new AuthService();