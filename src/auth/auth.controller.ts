import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from './guards/google-auth.guard.js';
import { GoogleUser } from './google-user.decorator.js';
import type { User } from './entities/user.entity.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  
  // Login: open this URL in the browser (not via "Try it out"), the guard redirects to Google
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Start Google login (open in a browser, redirects to Google)' })
  @ApiFoundResponse({ description: 'Redirect to the Google consent screen' })
  googleLogin() {
    // never runs, the guard redirects before the handler
  }

  // Google redirects back here; the guard exchanges the code and loads the user
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google redirects here after the user signs in' })
  @ApiOkResponse({ description: 'The signed-in user' })
  googleCallback(@GoogleUser() user: User) {
    return user;
  }
}
