export type Role = 'customer' | 'staff' | 'admin';

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  roles: Role[];
}

