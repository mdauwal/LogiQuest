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
  }
}
