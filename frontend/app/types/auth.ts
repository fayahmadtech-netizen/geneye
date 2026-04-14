export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  organization_id: string;
  role_id: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}
