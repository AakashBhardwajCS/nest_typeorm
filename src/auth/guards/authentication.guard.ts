import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import type { JwtPayload } from '../auth.types.js';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      // throws if the signature is wrong or the token has expired
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.userId = payload.userId;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
    return true;
  }

  // "Authorization: Bearer <token>" -> "<token>"
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
