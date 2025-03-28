import { IsOptional, IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Muhammad Auwal',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'muhammad@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'A short biography of the user',
    example: 'Software engineer passionate about open source.',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'URL to the profile picture',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
