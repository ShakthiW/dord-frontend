export type UserRole = "user" | "merchant";

export interface SignupPayload {
  Email: string;
  Password: string;
  FirstName: string;
  LastName: string;
  Phone: string;
  Role: UserRole;
}

export interface User {
  TenantID: string;
  Email: string;
  FirstName: string;
  LastName: string;
  Phone: string;
  Role: UserRole;
  IsActive: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: User;
  error?: string;
}
