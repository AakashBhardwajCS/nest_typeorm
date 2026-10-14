import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { LoginResponseDto, TokensResponseDto, UserResponseDto } from './dto/auth-response.dto.js';
import { AuthenticationGuard } from './guards/authentication.guard.js';
import { ACCESS_TOKEN_AUTH } from './auth.constants.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Sign up
  @Post('signup')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed or email already in use' })
  signup(@Body() signupData: SignupDto) {
    return this.authService.signup(signupData);
  }

  // Login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in and receive an access + refresh token' })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  // Refresh tokens
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange a refresh token for a new token pair' })
  @ApiOkResponse({ type: TokensResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  // Protected route: needs "Authorization: Bearer <accessToken>"
  @Get('me')
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth(ACCESS_TOKEN_AUTH)
  @ApiOperation({ summary: 'Get the logged-in user' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing, invalid or expired access token' })
  me(@Req() request: Request) {
    // AuthenticationGuard has already set userId
    return this.authService.getProfile(request.userId!);
  }
}
