import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CircularAService } from './circular-a.service.js';

type WrapperType<T> = T;

@Injectable()
export class CircularBService {
  constructor(
    @Inject(forwardRef(() => CircularAService))
    private readonly circularA: WrapperType<CircularAService>,
  ) {}

  getName() {
    return 'B';
  }

  getMessage() {
    return `${this.getName()} knows ${this.circularA.getName()}`;
  }
}
