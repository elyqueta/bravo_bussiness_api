export type AccountType = 'admin';

export type UserStatus = 'active' | 'inactive';

export type UserRole = 'admin';

export interface UserRow {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPasswordHash extends User {
  passwordHash: string;
}

export interface CreateUserData {
  fullName: string;
  email: string;
  passwordHash: string;
  phone: string;
  role?: UserRole;
}
