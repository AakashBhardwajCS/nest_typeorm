export interface JwtPayload {
  userId: string;
}

declare module 'express' {
  interface Request {
    // set by AuthenticationGuard once the access token is verified
    userId?: string;
  }
}
