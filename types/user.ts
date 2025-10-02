
export enum FranchiseUserRole {
    OWNER = 'Owner',
    SALESPERSON = 'Salesperson',
}

export interface FranchiseUser {
    id: number;
    franchiseId: number;
    name: string;
    email: string;
    role: FranchiseUserRole;
}

/**
 * Defines the roles for system-level users (franchisor side).
 */
export enum UserRole {
    ADMIN = 'Admin',
    MANAGER = 'Gerente',
}

/**
 * Represents a user with access to the franchisor dashboard.
 */
export interface SystemUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}

export interface AuthenticatedUser {
  id: string; // from supabase auth
  email: string;
  role: 'FRANCHISOR' | 'FRANCHISEE';
  franchiseId?: number; // only for FRANCHISEE
  name: string;
}