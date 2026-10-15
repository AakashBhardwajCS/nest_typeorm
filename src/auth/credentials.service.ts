
import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import type { User } from '../users/user';
import { UsersRepository } from '../users/users.repository.js';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async register(
    email: string,
    password: string,
  ): Promise<User> {
    const existingUser =
      await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash =
      await this.passwordHasher.hash(password);

    return this.usersRepository.create(email, {
      passwordHash,
      emailVerified: false,
    });
  }

  async verify(
    email: string,
    password: string,
  ): Promise<User | null> {
    const found =
      await this.usersRepository.findCredentials(email);

    const valid = await this.passwordHasher.verify(
      password,
      found?.passwordHash,
    );

    if (!valid || !found?.passwordHash) {
      return null;
    }

    if (this.passwordHasher.needsRehash(found.passwordHash)) {
      const newHash = await this.passwordHasher.hash(password);

      await this.usersRepository.updatePasswordHash(
        found.user.id,
        newHash,
      );
    }

    return found.user;
  }
}
