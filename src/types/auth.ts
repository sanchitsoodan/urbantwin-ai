export type UserRole = 
  | 'Super Admin (System Owner)'
  | 'City Operations Director'
  | 'Traffic Systems Engineer'
  | 'Emergency Dispatch Chief'
  | 'Smart City Urban Planner'
  | 'Civic Data Analyst';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  cityAffiliation: string;
  avatarColor: string;
  createdAt: string;
  lastLogin: string;
  actionsCount?: number;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
}

export interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  cityAffiliation: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}
