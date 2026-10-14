import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

// shape of the nested owner object (see owner.schema.ts)
export class OwnerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreateCatDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  // @Type tells class-transformer to turn the plain object into an OwnerDto,
  // otherwise ValidateNested has nothing to validate
  @IsOptional()
  @ValidateNested()
  @Type(() => OwnerDto)
  owner?: OwnerDto;

  // id of another cat, it comes back as the full cat thanks to autopopulate
  @IsOptional()
  @IsMongoId()
  bestFriend?: string;
}

// same fields as CreateCatDto but everything is optional, so PATCH can send just what changed
export class UpdateCatDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  // @Type tells class-transformer to turn the plain object into an OwnerDto,
  // otherwise ValidateNested has nothing to validate
  @IsOptional()
  @ValidateNested()
  @Type(() => OwnerDto)
  owner?: OwnerDto;

  // id of another cat, it comes back as the full cat thanks to autopopulate
  @IsOptional()
  @IsMongoId()
  bestFriend?: string;
}

// body for POST /cats/bulk, every item is validated like a normal create
export class CreateCatsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateCatDto)
  cats: CreateCatDto[];
}
