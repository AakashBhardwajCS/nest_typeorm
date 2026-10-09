import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

// A new instance is created for every request.
@Injectable({ scope: Scope.REQUEST })
export class RequestUserService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getRole() {
    return this.request.user?.role ?? 'guest';
  }
}
