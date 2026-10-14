import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { User } from './schemas/user.schema.js';
import { RefreshToken } from './schemas/refresh-token.schema.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { REFRESH_TOKEN_TTL_DAYS } from './auth.constants.js';
import type { JwtPayload } from './auth.types.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async signup(signupData: SignupDto) {
    const { name, email, password } = signupData;

    // check if the email is in use
    const emailInUse = await this.UserModel.findOne({ email });
    if (emailInUse) {
      throw new BadRequestException('Email is already in use');
    }

    // never store the plain password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.UserModel.create({ name, email, password: hashedPassword });
    return { id: user.id as string, name: user.name, email: user.email };
  }

  async login(credentials: LoginDto) {
    const { email, password } = credentials;

    // same message for both cases so we don't reveal which emails exist
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const tokens = await this.generateUserTokens(user.id as string);
    return { ...tokens, userId: user.id as string };
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.RefreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });
    if (!token) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // rotates the refresh token too, so the old one stops working
    return this.generateUserTokens(token.userId.toString());
  }

  async getProfile(userId: string) {
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { id: user.id as string, name: user.name, email: user.email };
  }

  private async generateUserTokens(userId: string) {
    
    const payload: JwtPayload = { userId };
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = randomUUID();

    await this.storeRefreshToken(refreshToken, userId);
    return { accessToken, refreshToken };
  }

  // one refresh token per user: replace the existing one, or create it on first login
  private async storeRefreshToken(token: string, userId: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + REFRESH_TOKEN_TTL_DAYS);

    // explicit ObjectId: upsert copies the filter into the new document as-is
    await this.RefreshTokenModel.updateOne(
      { userId: new Types.ObjectId(userId) },
      { $set: { token, expiryDate } },
      { upsert: true },
    );
  }
}
