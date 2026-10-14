import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordMailDto {
  // Marking property for swagger documentation
  @ApiProperty({
    name: "Email",
    description: "The email address of the user requesting a password reset",
    required: true
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;
}
