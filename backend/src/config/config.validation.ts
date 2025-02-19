import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';


class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_HOST: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_USER: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  API_BASE_URL: string;
}

// Validate environment variables at startup
export function validateConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig);
  if (errors.length > 0) {
    throw new Error(`Configuration validation error: ${errors}`);
  }
  return validatedConfig;
}
