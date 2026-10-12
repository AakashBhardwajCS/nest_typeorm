import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ResetPasswordMailDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;
}
