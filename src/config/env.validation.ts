import { plainToInstance } from 'class-transformer';
import {
  IsBooleanString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

// Shape of the environment variables the app relies on.
// Validated once at startup; the app refuses to boot if anything is wrong.
export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number = 3000;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsOptional()
  @IsBooleanString()
  DB_SYNC?: string;

  @IsOptional()
  @IsBooleanString()
  EXAMPLES_ENABLED?: string;

  @IsString()
  EMAIL_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  EMAIL_PORT: number;

  @IsString()
  EMAIL_USERNAME: string;

  @IsString()
  EMAIL_PASSWORD: string;

  @IsString()
  EMAIL_FROM: string;
}

// Passed to ConfigModule.forRoot({ validate }).
// Whatever this returns is what ConfigService serves (numbers stay numbers).
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
