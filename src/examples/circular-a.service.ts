import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CircularBService } from './circular-b.service.js';

// Keeps the real type for TypeScript but stops the decorator metadata from
// touching CircularBService before the file has finished loading.
type WrapperType<T> = T;

@Injectable()
export class CircularAService {
  constructor(
    @Inject(forwardRef(() => CircularBService))
    private readonly circularB: WrapperType<CircularBService>,
  ) {}

  getName() {
    return 'A';
  }

  getMessage() {
    return `${this.getName()} knows ${this.circularB.getName()}`;
  }
}
