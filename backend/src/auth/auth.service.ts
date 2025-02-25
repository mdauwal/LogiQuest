<<<<<<< HEAD
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async register(dto: RegisterDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({ ...dto, password: hashedPassword });
    await this.userRepository.save(user);
    return { message: 'Registration successful. Please verify your email.' };
  }

  async login(dto: LoginDto): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username: dto.username } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.generateTokens(user);
    await this.userRepository.update(user.id, { refreshToken: tokens.refreshToken });
    return tokens;
  }

  async generateTokens(user: User) {
    const payload = { id: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken, user: { id: user.id, username: user.username } };
  }

  async refreshToken(oldToken: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ refreshToken: oldToken });

    if (!user) throw new UnauthorizedException('Invalid refresh token');
    return this.generateTokens(user);
=======
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token-dto.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private refreshTokens: Record<string, string> = {}; // Temporary storage (Use DB in production)

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService, // Ensure this service is properly injected
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterDto> {
    return {
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = { id: 1, username: loginDto.username }; // Replace with actual user lookup

    const accessToken = this.jwtService.sign(
      { sub: user.id },
      { secret: 'ACCESS_SECRET', expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: 'REFRESH_SECRET', expiresIn: '7d' },
    );

    this.refreshTokens[user.id] = refreshToken; // Store in DB in production

    return {
      accessToken,
      user,
      refreshToken, // Return refresh token to user
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      const decoded = jwt.verify(refreshToken, 'REFRESH_SECRET') as {
        sub: string;
      };
      const userId = decoded.sub;

      if (this.refreshTokens[userId] !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.login({ username: `user`, password: `password` }); // Replace with actual user lookup
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
>>>>>>> 9057e5ce5ed762a6ac1bdaad28e52e3a28237949
  }
}
