
import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import type { Role, User } from './user.js';
import { UserEntity } from './user.entity.js';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(
    email: string,
    options: {
      passwordHash?: string | null;
      emailVerified?: boolean;
    } = {},
  ): Promise<User> {

    const user = this.repository.create({
      email: normalizeEmail(email),
      passwordHash: options.passwordHash ?? null,
      emailVerified: options.emailVerified ?? false,
      roles: ['customer'],
    });

    try {
      const saved = await this.repository.save(user);
      return toUser(saved);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === '23505'
      ) {
        throw new ConflictException('Email already registered');
      }

      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { id },
    });

    return user ? toUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { email: normalizeEmail(email) },
    });

    return user ? toUser(user) : null;
  }

  async findCredentials(
    email: string,
  ): Promise<{
    user: User;
    passwordHash: string | null;
  } | null> {
    const user = await this.repository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', {
        email: normalizeEmail(email),
      })
      .getOne();

    if (!user) {
      return null;
    }

    return {
      user: toUser(user),
      passwordHash: user.passwordHash,
    };
  }

  async markEmailVerified(
  userId: string,
  email: string,
): Promise<boolean> {

  const result = await this.repository.update(
    { id: userId, email },
    { emailVerified: true },
  );

  return result.affected === 1;
}

  async updatePasswordHash(
    id: string,
    passwordHash: string,
  ): Promise<void> {
    await this.repository.update(id, { passwordHash });
  }
}

function normalizeEmail(email: string): string {
  return email.trim().normalize('NFC').toLowerCase();
}

function toUser(entity: UserEntity): User {
  return {
    id: entity.id,
    email: entity.email,
    emailVerified: entity.emailVerified,
    roles: [...entity.roles] as Role[],
  };
}
