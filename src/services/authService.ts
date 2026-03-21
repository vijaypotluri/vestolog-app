import axios from 'axios';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  message?: string;
  error?: string;
}


export const authService = {
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return {
        token: response.data.token,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      return {
        token: response.data.token,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },

  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  removeToken(): void {
    localStorage.removeItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
