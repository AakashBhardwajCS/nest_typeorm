export interface RequestUser {
  id: string;
  role: string;
}

declare module 'express' {
  interface Request {
    user?: RequestUser;
  }
}
