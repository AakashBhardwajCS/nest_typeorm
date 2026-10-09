import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class PostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  content?: string;
}
