import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'Aakash', minLength: 3 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'aakash@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123', minLength: 6, description: 'Must contain at least one number' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  password: string;
}
