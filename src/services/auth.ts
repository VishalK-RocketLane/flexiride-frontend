import { User, UserRole } from '@/types/user';

class AuthService {
  private currentUser: User | null = null;
  private readonly baseUrl = 'http://localhost:8080/auth';
  
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const user = await response.json();
      this.currentUser = user;
      return user;
    } catch (error) {
      throw new Error('Login failed');
    }
  }
  
  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const user = await response.json();
      this.currentUser = user;
      return user;
    } catch (error) {
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