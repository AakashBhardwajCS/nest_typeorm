import { ApiProperty } from '@nestjs/swagger';

// Response shapes, only used to document the endpoints in Swagger

export class TokensResponseDto {
  @ApiProperty({ description: 'Short-lived JWT, send it as "Authorization: Bearer <token>"' })
  accessToken: string;

  @ApiProperty({ description: 'Long-lived token used to get a new access token' })
  refreshToken: string;
}

export class LoginResponseDto extends TokensResponseDto {
  @ApiProperty()
  userId: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
