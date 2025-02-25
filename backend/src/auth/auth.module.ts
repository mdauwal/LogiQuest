import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
<<<<<<< HEAD
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
=======
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => UsersModule), // ✅ Import UsersModule
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY', // Replace with env variable in production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
>>>>>>> 9057e5ce5ed762a6ac1bdaad28e52e3a28237949
})
export class AuthModule {}
