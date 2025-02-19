import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importing the @ApiProperty decorator
import { Exclude } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({
    description: 'The username of the user, must be between 3 and 20 characters.',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    description: 'The email of the user, must be a valid email format.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user, must be at least 8 characters long.',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'The username of the user.',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The password of the user.',
  })
  @IsString()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'The access token generated after a successful login.',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User details, excluding the password.',
    type: Object,
    example: { id: 1, username: 'user1' },
  })
  @Exclude() // Exclude from the response
  user: {
    id: number;
    username: string;
  };

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}
