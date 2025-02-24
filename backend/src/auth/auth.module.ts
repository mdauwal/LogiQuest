import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
    secret: process.env.JWT_SECRET || 'your_secret_key',  // Use a strong secret key
    signOptions: { expiresIn: '1h' },  // Set expiration time
  }), ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
