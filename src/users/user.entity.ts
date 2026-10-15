
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Role, User } from './user.js';

@Entity('users')
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({
    type: 'jsonb',
    default: () => `'["customer"]'::jsonb`,
  })
  roles: Role[];

  @Column({
    name: 'password_hash',
    type: 'varchar',
    nullable: true,
    select: false,
  })
  passwordHash: string | null;
}
