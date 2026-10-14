import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

export interface GoogleUserDetails {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  // Find the user for this Google account, or create one on first login.
  // Name and picture are refreshed every login in case they changed on Google.
  async validateGoogleUser(details: GoogleUserDetails): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: [{ googleId: details.googleId }, { email: details.email }],
    });

    if (user) {
      return this.usersRepository.save(this.usersRepository.merge(user, details));
    }
    return this.usersRepository.save(this.usersRepository.create(details));
  }
}
