import axios from "axios";
import { User, UserRole } from "@/types/user";
import { productionService } from "./productionService";

class AuthService {
  private currentUser: User | null = null;
  private readonly baseUrl = productionService.getIsProduction()? 'https://flexiride-backend-api.onrender.com/auth' : "http://localhost:8080/auth";
  private readonly axiosInstance = axios.create({
    baseURL: this.baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  async login(email: string, password: string): Promise<User> {
    try {
      localStorage.removeItem("user");
      const response = await this.axiosInstance.post("/login", {
        email,
        password,
      });
      this.currentUser = response.data;

      localStorage.setItem("user", JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Invalid credentials");
      }
      throw new Error("Login failed");
    }
  }

  async register(name: string, email: string, password: string): Promise<User> {
    try {
      localStorage.removeItem("user");
      const response = await this.axiosInstance.post("/register", {
        name,
        email,
        password,
      });
      this.currentUser = response.data;
      localStorage.setItem("user", JSON.stringify(this.currentUser));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Registration failed");
      }
      throw new Error("Registration failed");
    }
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem("user");
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const user = localStorage.getItem("user");
      if (user) {
        this.currentUser = JSON.parse(user);
      }
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    if (!this.currentUser) {
      const user = localStorage.getItem("user");
      if (user) {
        this.currentUser = JSON.parse(user);
      }
    }
    return this.currentUser !== null;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }
}

export const authService = new AuthService();
