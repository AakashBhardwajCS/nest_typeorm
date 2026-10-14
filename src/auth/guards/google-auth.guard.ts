import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// On /auth/google it redirects to Google's consent screen.
// On /auth/google/callback it exchanges the code and runs GoogleStrategy.validate().
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  // Passport's own errors (bad/expired code, user clicked "Cancel") aren't
  // HttpExceptions and would become a 500, so turn them into a 401
  handleRequest<TUser>(err: unknown, user: TUser | false): TUser {
    if (err instanceof HttpException) {
      throw err;
    }
    if (err || !user) {
      throw new UnauthorizedException('Google login failed');
    }
    return user;
  }
}
